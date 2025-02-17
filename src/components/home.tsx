import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import CreateGameModal from "./game/CreateGameModal";
import JoinGameModal from "./game/JoinGameModal";
import GameLobby from "./game/GameLobby";
import RoleReveal from "./game/RoleReveal";
import { type Role } from "@/lib/game";

const Home = () => {
  const [username, setUsername] = React.useState("");
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showJoinModal, setShowJoinModal] = React.useState(false);
  const [currentGame, setCurrentGame] = React.useState(null);
  const [gameStartCountdown, setGameStartCountdown] = React.useState(5);
  const [playerRole, setPlayerRole] = React.useState<Role>("Civilian");
  const [gameStarted, setGameStarted] = React.useState(false);
  const [isHost, setIsHost] = React.useState(false);

  return (
    <div className="min-h-screen w-full bg-gray-950 flex items-center justify-center p-4">
      {!username ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 bg-gray-900 rounded-xl shadow-xl space-y-6"
        >
          <h1 className="text-3xl font-bold text-white text-center">
            Welcome to Mafia
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const trimmedUsername = username.trim();
              if (trimmedUsername) {
                setUsername(trimmedUsername);
              }
            }}
            className="space-y-4"
          >
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={!username.trim()}
            >
              Continue
            </Button>
          </form>
        </motion.div>
      ) : currentGame ? (
        gameStarted ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center gap-4">
            <RoleReveal role={playerRole} isRevealed={true} />
            {isHost && (
              <Button
                className="absolute bottom-8 bg-red-600 hover:bg-red-700"
                onClick={() => {
                  setGameStarted(false);
                  setCurrentGame(null);
                }}
              >
                End Game
              </Button>
            )}
          </div>
        ) : (
          <GameLobby
            gameCode={currentGame.gameCode}
            minPlayers={currentGame.totalPlayers}
            players={Array.from(
              { length: currentGame.totalPlayers },
              (_, i) => ({
                id: String(i + 1),
                name: i === 0 ? "You (Host)" : `Player ${i + 1}`,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i === 0 ? "host" : `player${i + 1}`}`,
                isHost: i === 0,
                isReady: true,
              }),
            )}
            isGameStarting={gameStartCountdown > 0 && gameStartCountdown < 6}
            countdownSeconds={gameStartCountdown}
            onStartGame={() => {
              // Randomly assign a role for testing
              const roles: Role[] = ["Mafia", "Detective", "Civilian"];
              setPlayerRole(roles[Math.floor(Math.random() * roles.length)]);

              // Start countdown
              let count = 5;
              const interval = setInterval(() => {
                setGameStartCountdown(count);
                count--;
                if (count < 0) {
                  clearInterval(interval);
                  setGameStarted(true);
                }
              }, 1000);
            }}
          />
        )
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-5xl md:text-6xl font-bold text-white"
            >
              Mafia Game
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl text-gray-400"
            >
              Create or join a game to start playing
            </motion.p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button
                size="lg"
                className="w-48 h-16 text-lg bg-purple-600 hover:bg-purple-700 transition-colors"
                onClick={() => setShowCreateModal(true)}
              >
                Create Game
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="w-48 h-16 text-lg border-purple-600 text-purple-600 hover:bg-purple-600/10 transition-colors"
                onClick={() => setShowJoinModal(true)}
              >
                Join Game
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}

      <CreateGameModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateGame={({ totalPlayers, mafiaCount, gameCode }) => {
          setCurrentGame({
            gameCode:
              gameCode ||
              Math.random().toString(36).substring(2, 8).toUpperCase(),
            totalPlayers,
            mafiaCount,
          });
          setIsHost(true);
          setShowCreateModal(false);
        }}
      />

      <JoinGameModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoin={(gameId) => {
          // For now, just join the first game in the list
          setCurrentGame({
            gameCode: gameId,
            totalPlayers: 6,
            mafiaCount: 2,
          });
          setShowJoinModal(false);
        }}
      />
    </div>
  );
};

export default Home;
