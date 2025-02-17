import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials not found, using mock client");
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        from: (table: string) => ({
          insert: async (data: any) => {
            console.log("Mock insert:", data);
            return { error: null };
          },
          select: (columns: string) => ({
            eq: (column: string, value: any) => {
              return Promise.resolve({
                data: [],
                error: null,
              });
            },
            then: (
              callback: (result: { data: any[]; error: null }) => void,
            ) => {
              callback({ data: [], error: null });
            },
          }),
        }),
        channel: (channel: string) => ({
          on: (
            event: string,
            config: any,
            callback: (payload: any) => void,
          ) => ({
            subscribe: () => ({
              unsubscribe: () => {},
            }),
          }),
        }),
      };

export type GameSession = {
  id: string;
  created_at: string;
  host_name: string;
  total_players: number;
  mafia_count: number;
  game_duration: number;
  game_code: string;
  status: "waiting" | "in_progress" | "ended";
  current_players: number;
};
