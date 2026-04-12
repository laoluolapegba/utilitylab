-- Idempotency guard for Stripe webhook events.
-- Prevents duplicate processing when Stripe retries the same event.

CREATE TABLE IF NOT EXISTS processed_webhooks (
    event_id     TEXT        PRIMARY KEY,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prune rows older than 30 days.
-- Enable pg_cron extension in Supabase Dashboard → Database → Extensions first.
-- SELECT cron.schedule(
--     'prune-processed-webhooks',
--     '0 2 * * *',
--     $$DELETE FROM processed_webhooks WHERE processed_at < now() - interval '30 days'$$
-- );
