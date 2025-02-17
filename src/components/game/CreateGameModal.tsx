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
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Copy } from "lucide-react";

interface CreateGameModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreateGame?: (settings: {
    totalPlayers: number;
    mafiaCount: number;
    gameCode?: string;
  }) => void;
}

const CreateGameModal = ({
  open = true,
  onOpenChange = () => {},
  onCreateGame = () => {},
}: CreateGameModalProps) => {
  const [totalPlayers, setTotalPlayers] = React.useState(6);
  const [mafiaCount, setMafiaCount] = React.useState(2);

  // Update mafia count if it exceeds total players / 3
  React.useEffect(() => {
    const maxMafia = Math.floor(totalPlayers / 3);
    if (mafiaCount > maxMafia) {
      setMafiaCount(maxMafia);
    }
  }, [totalPlayers]);

  const handleCreateGame = () => {
    onCreateGame({ totalPlayers, mafiaCount, gameCode });
  };

  const copyGameCode = async () => {
    try {
      await navigator.clipboard.writeText(gameCode);
    } catch (err) {
      console.error("Failed to copy game code", err);
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
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => {
              // Create test game with 6 players and 2 mafia
              onCreateGame({
                totalPlayers: 6,
                mafiaCount: 2,
                gameCode:
                  "TEST" +
                  Math.random().toString(36).substring(2, 4).toUpperCase(),
              });
            }}
            className="w-full sm:w-auto bg-gray-800 text-white hover:bg-gray-700 border-gray-600"
          >
            Create Test Game
          </Button>
          <div className="flex justify-end gap-2 w-full">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-gray-700 text-white hover:bg-gray-600 border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateGame}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Create Game
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameModal;
