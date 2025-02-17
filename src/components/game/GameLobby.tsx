import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, Crown } from "lucide-react";
import RoleReveal from "./RoleReveal";

interface Player {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isReady: boolean;
}

interface GameLobbyProps {
  gameCode?: string;
  players?: Player[];
  minPlayers?: number;
  countdownSeconds?: number;
  isGameStarting?: boolean;
  onStartGame?: () => void;
  onLeave?: () => void;
  hostName?: string;
}

const GameLobby = ({
  gameCode = "ABC123",
  players = [
    {
      id: "1",
      name: "Host Player",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=host",
      isHost: true,
      isReady: true,
    },
    {
      id: "2",
      name: "Player 2",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player2",
      isHost: false,
      isReady: true,
    },
    {
      id: "3",
      name: "Player 3",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player3",
      isHost: false,
      isReady: false,
    },
  ],
  minPlayers = 4,
  countdownSeconds = 5,
  isGameStarting = false,
  onStartGame = () => {},
  onLeave = () => {},
  hostName = "Unknown",
}: GameLobbyProps) => {
  const isEnoughPlayers = players.length >= minPlayers;
  const allPlayersReady = players.every((player) => player.isReady);

  return (
    <div className="min-h-[600px] w-full max-w-[800px] mx-auto bg-gray-900 p-8 rounded-xl shadow-xl relative">
      <Button
        variant="outline"
        size="sm"
        onClick={onLeave}
        className="absolute top-4 left-4 bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
      >
        ← Leave Game
      </Button>
      <div className="flex flex-col items-center space-y-6 mt-8">
        <h2 className="text-2xl font-bold text-white">{hostName}'s Game</h2>
        {/* Players List */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Players ({players.length}/{minPlayers}+)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.map((player) => (
              <Card
                key={player.id}
                className="p-4 bg-gray-800 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={player.avatar} alt={player.name} />
                    <AvatarFallback>{player.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-medium">{player.name}</p>
                    {player.isHost && (
                      <div className="flex items-center text-yellow-500 text-sm">
                        <Crown className="w-4 h-4 mr-1" />
                        Host
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm ${player.isReady ? "bg-green-500/20 text-green-400" : "bg-gray-700 text-gray-400"}`}
                >
                  {player.isReady ? "Ready" : "Waiting..."}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Countdown Timer */}
        {isGameStarting && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl font-bold text-white"
          >
            {countdownSeconds}
          </motion.div>
        )}

        {/* Start Game Button */}
        <Button
          className="w-full max-w-md py-6 text-lg bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 border-2 border-yellow-400/20 shadow-lg shadow-yellow-900/20 disabled:from-gray-700 disabled:to-gray-600 disabled:border-gray-600/20 disabled:shadow-none transition-all duration-200"
          disabled={!isEnoughPlayers || !allPlayersReady}
          onClick={onStartGame}
        >
          {!isEnoughPlayers
            ? `Waiting for ${minPlayers - players.length} more players...`
            : !allPlayersReady
              ? "Waiting for all players to be ready..."
              : "Start Game"}
        </Button>
      </div>
    </div>
  );
};

export default GameLobby;
