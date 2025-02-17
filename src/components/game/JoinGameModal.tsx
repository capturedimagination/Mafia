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

interface Game {
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
  availableGames = [
    {
      id: "1",
      hostName: "Player 1",
      playerCount: 3,
      totalPlayers: 6,
      status: "waiting",
    },
    {
      id: "2",
      hostName: "Player 2",
      playerCount: 6,
      totalPlayers: 6,
      status: "full",
    },
    {
      id: "3",
      hostName: "Player 3",
      playerCount: 4,
      totalPlayers: 8,
      status: "waiting",
    },
  ],
}: JoinGameModalProps) => {
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
            {availableGames.map((game) => (
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
