import React from "react";
import { Progress } from "@/components/ui/progress";

interface GameTimerProps {
  durationMinutes: number;
  onTimeEnd?: () => void;
}

const GameTimer = ({
  durationMinutes = 15,
  onTimeEnd = () => {},
}: GameTimerProps) => {
  const [timeLeft, setTimeLeft] = React.useState(durationMinutes * 60);
  const totalTime = durationMinutes * 60;

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [durationMinutes, onTimeEnd]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / totalTime) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-white/80">
        <span>Time Remaining</span>
        <span>
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default GameTimer;
