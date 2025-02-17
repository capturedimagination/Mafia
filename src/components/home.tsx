import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import CreateGameModal from "./game/CreateGameModal";
import JoinGameModal from "./game/JoinGameModal";
import GameLobby from "./game/GameLobby";
import RoleReveal from "./game/RoleReveal";
import GameTimer from "./game/GameTimer";
import GameResults from "./game/GameResults";
import { type Role } from "@/lib/game";

const Home = () => {
  const [inputUsername, setInputUsername] = React.useState("");
  const [confirmedUsername, setConfirmedUsername] = React.useState("");
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showJoinModal, setShowJoinModal] = React.useState(false);
  const [currentGame, setCurrentGame] = React.useState(null);
  const [gameStartCountdown, setGameStartCountdown] = React.useState(5);
  const [playerRole, setPlayerRole] = React.useState<Role>("Civilian");
  const [gameStarted, setGameStarted] = React.useState(false);
  const [gameEnded, setGameEnded] = React.useState(false);
  const [isHost, setIsHost] = React.useState(false);

  return (
    <div className="min-h-screen w-full bg-gray-950 flex items-center justify-center p-4">
      {!confirmedUsername ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 bg-gray-900 rounded-xl shadow-xl space-y-6"
        >
          <h1 className="text-3xl font-bold text-white text-center">
            Welcome to Mafia
          </h1>
          <div className="space-y-4">
            <input
              type="text"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const trimmedUsername = inputUsername.trim();
                  if (trimmedUsername) {
                    setConfirmedUsername(trimmedUsername);
                  }
                }
              }}
              placeholder="Enter your username"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Button
              onClick={(e) => {
                e.preventDefault();
                const trimmedUsername = inputUsername.trim();
                if (trimmedUsername) {
                  setConfirmedUsername(trimmedUsername);
                }
              }}
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={!inputUsername.trim()}
            >
              Continue
            </Button>
          </div>
        </motion.div>
      ) : currentGame ? (
        gameStarted ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center gap-4">
            {gameEnded ? (
              <GameResults
                players={[
                  {
                    name: `${confirmedUsername} (Host)`,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${confirmedUsername}`,
                    role: playerRole,
                  },
                  ...Array.from(
                    { length: currentGame.totalPlayers - 1 },
                    (_, i) => ({
                      name: `Player ${i + 2}`,
                      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=player${i + 2}`,
                      role:
                        Math.random() <
                        currentGame.mafiaCount / currentGame.totalPlayers
                          ? "Mafia"
                          : "Civilian",
                    }),
                  ),
                ]}
                isHost={isHost}
                onNewRound={() => {
                  setGameEnded(false);
                  setGameStarted(false);
                }}
                onEndGame={() => {
                  setGameStarted(false);
                  setCurrentGame(null);
                }}
              />
            ) : (
              <div className="w-full max-w-[800px] flex flex-col gap-6">
                <GameTimer
                  durationMinutes={currentGame.gameDuration || 15}
                  onTimeEnd={() => setGameEnded(true)}
                />
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setGameStarted(false);
                      setCurrentGame(null);
                    }}
                    className="absolute top-4 left-4 z-10 bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
                  >
                    ← Leave Game
                  </Button>
                  <RoleReveal role={playerRole} isRevealed={true} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <GameLobby
            minPlayers={currentGame.totalPlayers}
            hostName={confirmedUsername}
            onLeave={() => setCurrentGame(null)}
            players={
              currentGame.isTestGame
                ? Array.from({ length: currentGame.totalPlayers }, (_, i) => ({
                    id: String(i + 1),
                    name:
                      i === 0
                        ? `${confirmedUsername} (Host)`
                        : `Player ${i + 1}`,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i === 0 ? confirmedUsername : `player${i + 1}`}`,
                    isHost: i === 0,
                    isReady: true,
                  }))
                : [
                    {
                      id: "1",
                      name: `${confirmedUsername} (Host)`,
                      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${confirmedUsername}`,
                      isHost: true,
                      isReady: true,
                    },
                  ]
            }
            isGameStarting={gameStartCountdown > 0 && gameStartCountdown < 6}
            countdownSeconds={gameStartCountdown}
            onStartGame={() => {
              // Assign role based on game settings
              const totalPlayers = currentGame.totalPlayers;
              const mafiaCount = currentGame.mafiaCount;

              // Calculate probabilities
              const mafiaProb = mafiaCount / totalPlayers;
              const detectiveProb = 1 / totalPlayers; // Usually 1 detective per game

              const rand = Math.random();
              if (rand < mafiaProb) {
                setPlayerRole("Mafia");
              } else if (rand < mafiaProb + detectiveProb) {
                setPlayerRole("Detective");
              } else {
                setPlayerRole("Civilian");
              }

              // Start countdown
              let count = 5;
              const interval = setInterval(() => {
                if (count >= 0) {
                  setGameStartCountdown(count);
                  count--;
                } else {
                  clearInterval(interval);
                  // Add a small delay before showing the role
                  setTimeout(() => {
                    setGameStarted(true);
                  }, 500);
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
        onCreateGame={({
          totalPlayers,
          mafiaCount,
          gameCode,
          gameDuration,
        }) => {
          setCurrentGame({
            totalPlayers,
            mafiaCount,
            gameCode,
            gameDuration,
            isTestGame: gameCode?.startsWith("TEST"),
          });
          setIsHost(true);
          setShowCreateModal(false);
        }}
      />

      <JoinGameModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoin={(gameId) => {
          setCurrentGame({
            totalPlayers: 6,
            mafiaCount: 2,
            gameDuration: 1,
          });
          setShowJoinModal(false);
        }}
      />
    </div>
  );
};

export default Home;
