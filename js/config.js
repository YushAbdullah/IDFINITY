// From Supabase: Project Settings → API (Project URL and publishable/anon key).
// The anon key is meant to be public; row level security (supabase/schema.sql) protects the data.
window.ECARD_CONFIG = {
  appName: "IDFINITY",
  supabaseUrl: "https://vdfdsxtthxtkcovgtgww.supabase.co",
  supabaseAnonKey: "sb_publishable_RU1-Sc1x3knmyuEuPiWZhQ_AIrtQdkg",
  // Turn on after enabling Google under Authentication → Providers in Supabase.
  googleSignIn: false
};
