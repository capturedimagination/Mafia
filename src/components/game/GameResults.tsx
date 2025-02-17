import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface PlayerResult {
  name: string;
  avatar: string;
  role: "Mafia" | "Detective" | "Civilian";
}

interface GameResultsProps {
  players: PlayerResult[];
  onNewRound?: () => void;
  onEndGame?: () => void;
  isHost?: boolean;
}

const roleStyles = {
  Mafia: { bg: "bg-red-500/20", text: "text-red-400" },
  Detective: { bg: "bg-blue-500/20", text: "text-blue-400" },
  Civilian: { bg: "bg-neutral-500/20", text: "text-neutral-400" },
};

const GameResults = ({
  players = [],
  onNewRound = () => {},
  onEndGame = () => {},
  isHost = false,
}: GameResultsProps) => {
  return (
    <div className="w-full max-w-[800px] mx-auto bg-gray-900 p-8 rounded-xl shadow-xl space-y-6">
      <h2 className="text-2xl font-bold text-white text-center mb-6">
        Game Results
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {players.map((player, index) => (
          <Card
            key={index}
            className="p-4 bg-gray-800 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={player.avatar} alt={player.name} />
                <AvatarFallback>{player.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-white">{player.name}</span>
            </div>
            <div
              className={cn(
                "px-3 py-1 rounded-full",
                roleStyles[player.role].bg,
                roleStyles[player.role].text,
              )}
            >
              {player.role}
            </div>
          </Card>
        ))}
      </div>

      {isHost && (
        <div className="flex justify-center gap-4">
          <Button
            onClick={onNewRound}
            className="bg-purple-600 hover:bg-purple-700"
          >
            New Round
          </Button>
          <Button
            variant="outline"
            onClick={onEndGame}
            className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
          >
            End Game
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameResults;
