import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SetupOptionsProps {
  onCreateGame?: () => void;
  onJoinGame?: () => void;
}

const SetupOptions = ({
  onCreateGame = () => {},
  onJoinGame = () => {},
}: SetupOptionsProps) => {
  return (
    <Card className="p-6 bg-gray-900 text-white space-y-4">
      <h2 className="text-2xl font-bold">Game Setup</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={onCreateGame}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Create Game
        </Button>
        <Button
          variant="outline"
          onClick={onJoinGame}
          className="border-purple-600 text-purple-600 hover:bg-purple-600/10"
        >
          Join Game
        </Button>
      </div>
    </Card>
  );
};

export default SetupOptions;
