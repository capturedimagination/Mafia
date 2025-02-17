import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Role = "Mafia" | "Detective" | "Civilian";

interface RoleRevealProps {
  role?: Role;
  isRevealed?: boolean;
  onRevealComplete?: () => void;
}

const roleColors = {
  Mafia: "bg-red-900",
  Detective: "bg-blue-900",
  Civilian: "bg-neutral-800",
};

const roleIcons = {
  Mafia: "🔪",
  Detective: "🔍",
  Civilian: "👤",
};

const RoleReveal = ({
  role = "Civilian",
  isRevealed = true,
  onRevealComplete = () => {},
}: RoleRevealProps) => {
  return (
    <div className="flex items-center justify-center min-h-[600px] w-full bg-black/95 p-4">
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        onAnimationComplete={onRevealComplete}
        style={{ perspective: 1000 }}
      >
        <Card
          className={cn(
            "w-[400px] h-[600px] relative transform-gpu transition-all duration-500",
            roleColors[role],
            "rounded-xl shadow-xl",
          )}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 transform rotateY-180">
            <div className="text-8xl mb-6">{roleIcons[role]}</div>
            <h2 className="text-6xl font-bold text-white mb-4">
              You are {role}
            </h2>
            <p className="text-2xl text-white/90 mb-4">Your Mission:</p>
            <p className="text-xl text-white/80">
              {role === "Mafia" &&
                "Eliminate the innocent without getting caught. Work with other Mafia members to deceive the town."}
              {role === "Detective" &&
                "Find the Mafia before it's too late. You can investigate one player each night."}
              {role === "Civilian" &&
                "Work with others to identify the Mafia. Use your vote wisely in town meetings."}
            </p>
          </div>

          {/* Card Back */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-gray-900 rounded-xl">
            <div className="text-4xl">🎭</div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default RoleReveal;
