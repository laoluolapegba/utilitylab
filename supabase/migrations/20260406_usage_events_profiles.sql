-- Migration: usage_events + profiles
-- Run in Supabase SQL editor or via `supabase db push`

-- ── profiles ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
    user_id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    plan                 text        NOT NULL DEFAULT 'free',  -- 'free' | 'starter'
    stripe_customer_id   text,
    stripe_subscription_id text,
    created_at           timestamptz NOT NULL DEFAULT now(),
    updated_at           timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = user_id);

-- ── usage_events ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usage_events (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
    anon_id     text,
    tool_name   text        NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own usage"
    ON usage_events FOR SELECT
    USING (auth.uid() = user_id);

-- Indexes for the per-day count queries
CREATE INDEX IF NOT EXISTS idx_usage_events_user_tool_day
    ON usage_events (user_id, tool_name, created_at);

CREATE INDEX IF NOT EXISTS idx_usage_events_anon_tool_day
    ON usage_events (anon_id, tool_name, created_at);
