import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase Config:", {
  url: supabaseUrl ? "[SET]" : "Not Set",
  key: supabaseAnonKey ? "[SET]" : "Not Set",
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Supabase credentials missing. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.",
  );
}

export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder",
);

// Test the connection
supabase
  .from("game_sessions")
  .select("*")
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error("❌ Supabase connection test failed:", error.message);
    } else {
      console.log("✅ Supabase connection test successful");
    }
  });

export type GameSession = Database["public"]["Tables"]["game_sessions"]["Row"];
