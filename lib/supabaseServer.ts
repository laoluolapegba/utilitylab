// lib/supabaseServer.ts
// Server-only Supabase client using the service role key.
// Never import this in client components — it bypasses RLS.

import "@/lib/config"; // validates required env vars at cold start
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
);
