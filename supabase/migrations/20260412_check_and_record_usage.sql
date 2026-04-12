-- Atomic usage check-and-record function.
-- Uses pg_advisory_xact_lock to serialize concurrent requests from the same
-- identity, eliminating the race window in the two-query check+insert pattern.
--
-- Returns: (allowed boolean, used_count integer)

CREATE OR REPLACE FUNCTION check_and_record_usage(
    p_user_id  uuid,
    p_anon_id  text,
    p_tool     text,
    p_limit    integer   -- pass 2147483647 for Infinity (pro plan)
)
RETURNS TABLE(allowed boolean, used_count integer)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_lock_key  bigint;
    v_identity  text;
    v_today     text;
    v_day_start timestamptz;
    v_day_end   timestamptz;
    v_used      integer;
BEGIN
    -- Derive a stable lock key from the caller's identity
    v_identity := COALESCE(p_user_id::text, p_anon_id, 'unknown');
    v_lock_key := hashtext(v_identity);

    -- Acquire a transaction-scoped advisory lock so concurrent calls for the
    -- same identity are serialized (lock is released at txn end automatically)
    PERFORM pg_advisory_xact_lock(v_lock_key);

    -- Build today's UTC window
    v_today     := to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD');
    v_day_start := (v_today || 'T00:00:00.000Z')::timestamptz;
    v_day_end   := (v_today || 'T23:59:59.999Z')::timestamptz;

    -- Count today's events for this identity
    IF p_user_id IS NOT NULL THEN
        SELECT COUNT(*) INTO v_used
        FROM usage_events
        WHERE user_id   = p_user_id
          AND created_at >= v_day_start
          AND created_at <= v_day_end;
    ELSE
        SELECT COUNT(*) INTO v_used
        FROM usage_events
        WHERE anon_id   = p_anon_id
          AND created_at >= v_day_start
          AND created_at <= v_day_end;
    END IF;

    IF v_used >= p_limit THEN
        RETURN QUERY SELECT false, v_used;
        RETURN;
    END IF;

    -- Record the new event atomically
    INSERT INTO usage_events (user_id, anon_id, tool_name)
    VALUES (p_user_id, p_anon_id, p_tool);

    RETURN QUERY SELECT true, v_used + 1;
END;
$$;
