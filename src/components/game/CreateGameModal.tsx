import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { TablesInsert } from "@/types/supabase";

interface CreateGameModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreateGame?: (settings: {
    totalPlayers: number;
    mafiaCount: number;
    gameCode?: string;
    gameDuration: number;
  }) => void;
}

const CreateGameModal = ({
  open = true,
  onOpenChange = () => {},
  onCreateGame = () => {},
}: CreateGameModalProps) => {
  const [totalPlayers, setTotalPlayers] = React.useState(6);
  const [mafiaCount, setMafiaCount] = React.useState(2);
  const [gameDuration, setGameDuration] = React.useState(15);
  const [error, setError] = React.useState<string | null>(null);
  const [creating, setCreating] = React.useState(false);

  // Update mafia count if it exceeds total players / 3
  React.useEffect(() => {
    const maxMafia = Math.floor(totalPlayers / 3);
    if (mafiaCount > maxMafia) {
      setMafiaCount(maxMafia);
    }
  }, [totalPlayers]);

  const handleCreateGame = async (isTest = false) => {
    setCreating(true);
    setError(null);

    const gameCode =
      (isTest ? "TEST" : "GAME") +
      Math.random().toString(36).substring(2, 4).toUpperCase();

    console.log("Creating game with code:", gameCode);

    try {
      const gameData: TablesInsert<"game_sessions"> = {
        host_name: "Player",
        total_players: totalPlayers,
        mafia_count: mafiaCount,
        game_duration: gameDuration,
        game_code: gameCode,
        status: "waiting",
        current_players: 1,
      };

      console.log("Inserting game data:", gameData);

      const { data, error } = await supabase
        .from("game_sessions")
        .insert(gameData)
        .select()
        .single();

      console.log("Insert result:", { data, error });

      if (error) {
        console.error("Error creating game:", error);
        setError(error.message);
        return;
      }

      if (!data) {
        throw new Error("No data returned after insert");
      }

      onCreateGame({
        totalPlayers: data.total_players,
        mafiaCount: data.mafia_count,
        gameDuration: data.game_duration,
        gameCode: data.game_code,
      });
    } catch (error) {
      console.error("Error creating game:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create game",
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create New Game
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Set up your Mafia game session and invite players to join.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-red-950 text-red-400 mb-4">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="total-players">Total Players</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="total-players"
                  min={4}
                  max={12}
                  step={1}
                  value={[totalPlayers]}
                  onValueChange={(value) => setTotalPlayers(value[0])}
                  className="w-full"
                />
                <div className="bg-gray-800 px-3 py-1 rounded-md min-w-[48px] text-center">
                  {totalPlayers}
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {totalPlayers} players total
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mafia-count">Number of Mafia Players</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="mafia-count"
                  min={1}
                  max={Math.floor(totalPlayers / 3)}
                  step={1}
                  value={[mafiaCount]}
                  onValueChange={(value) => setMafiaCount(value[0])}
                  className="w-full"
                />
                <div className="bg-gray-800 px-3 py-1 rounded-md min-w-[48px] text-center">
                  {mafiaCount}
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {mafiaCount} {mafiaCount === 1 ? "Mafia" : "Mafia"} vs{" "}
                {totalPlayers - mafiaCount}{" "}
                {totalPlayers - mafiaCount === 1 ? "Civilian" : "Civilians"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="game-duration">Game Duration (minutes)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="game-duration"
                  min={1}
                  max={60}
                  step={1}
                  value={[gameDuration]}
                  onValueChange={(value) => setGameDuration(value[0])}
                  className="w-full"
                />
                <div className="bg-gray-800 px-3 py-1 rounded-md min-w-[64px] text-center">
                  {gameDuration}m
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Game will last {gameDuration} minute
                {gameDuration !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => handleCreateGame(true)}
            className="w-full sm:w-auto bg-gray-800 text-white hover:bg-gray-700 border-gray-600"
            disabled={creating}
          >
            {creating ? "Creating..." : "Create Test Game"}
          </Button>
          <div className="flex justify-end gap-2 w-full">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-gray-700 text-white hover:bg-gray-600 border-gray-600"
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleCreateGame(false)}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={creating}
            >
              {creating ? "Creating..." : "Create Game"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameModal;
