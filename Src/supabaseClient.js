import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────
// PASTE YOUR OWN SUPABASE VALUES HERE — see README.md for setup.
// Both values come from your Supabase project: Settings → API.
// The anon key is safe to ship in client code (it's public by design);
// your actual admin password lives only in Supabase, never here.
// ─────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
