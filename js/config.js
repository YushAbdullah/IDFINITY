// From Supabase: Project Settings → API (Project URL and publishable/anon key).
// The anon key is meant to be public; row level security (supabase/schema.sql) protects the data.
window.ECARD_CONFIG = {
  appName: "IDFINITY",
  supabaseUrl: "https://vdfdsxtthxtkcovgtgww.supabase.co",
  supabaseAnonKey: "sb_publishable_RU1-Sc1x3knmyuEuPiWZhQ_AIrtQdkg",
  // Needs Google turned on under Authentication → Sign In / Providers in Supabase (see README).
  googleSignIn: true
};
