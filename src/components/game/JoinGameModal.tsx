import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { supabase, type GameSession } from "@/lib/supabase";

interface Game extends Omit<GameSession, "created_at"> {
  id: string;
  hostName: string;
  playerCount: number;
  totalPlayers: number;
  status: "waiting" | "full" | "in-progress";
}

interface JoinGameModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onJoin?: (gameId: string) => void;
  availableGames?: Game[];
}

const JoinGameModal = ({
  isOpen = true,
  onClose = () => {},
  onJoin = () => {},
  availableGames = [],
}: JoinGameModalProps) => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    // Initial fetch of games
    const fetchGames = async () => {
      try {
        const { data, error } = await supabase
          .from("game_sessions")
          .select("*")
          .eq("status", "waiting");

        if (error) {
          console.error("Error fetching games:", error);
          return;
        }

        if (!data) return;

        setGames(
          data.map((game) => ({
            id: game.id,
            hostName: game.host_name,
            playerCount: game.current_players,
            totalPlayers: game.total_players,
            status: game.status as "waiting" | "full" | "in-progress",
            mafiaCount: game.mafia_count,
            gameDuration: game.game_duration,
            gameCode: game.game_code,
          })),
        );
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel("game_sessions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "game_sessions" },
        (payload) => {
          console.log("Real-time update:", payload);
          fetchGames(); // Refetch games when there's any change
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Available Games
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Select a game to join from the list below.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {games.map((game) => (
              <Card
                key={game.id}
                className={`p-4 bg-gray-800 border-gray-700 ${game.status === "waiting" ? "hover:border-purple-500 cursor-pointer" : "opacity-50"}`}
                onClick={() => game.status === "waiting" && onJoin(game.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">
                        {game.hostName}'s Game
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>
                        {game.playerCount} / {game.totalPlayers} players
                      </span>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm ${getStatusStyles(game.status)}`}
                  >
                    {game.status === "waiting"
                      ? "Join"
                      : game.status === "full"
                        ? "Full"
                        : "In Progress"}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const getStatusStyles = (status: Game["status"]) => {
  switch (status) {
    case "waiting":
      return "bg-purple-600/20 text-purple-400";
    case "full":
      return "bg-yellow-600/20 text-yellow-400";
    case "in-progress":
      return "bg-blue-600/20 text-blue-400";
  }
};

export default JoinGameModal;
