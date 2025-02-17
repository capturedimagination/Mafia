import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase Config:", {
  url: supabaseUrl,
  key: supabaseAnonKey ? "[HIDDEN]" : "Not Set",
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Supabase credentials missing. Make sure to connect your Supabase project in the left panel.",
  );
}

export const supabase = createClient<Database>(supabaseUrl!, supabaseAnonKey!);

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
