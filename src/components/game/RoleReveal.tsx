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

const roleStyles = {
  Mafia: {
    bg: "bg-gradient-to-br from-red-900 to-red-950",
    border: "border-red-700",
    icon: "🔪",
    title: "text-red-500",
    accent: "bg-red-800/50",
  },
  Detective: {
    bg: "bg-gradient-to-br from-blue-900 to-blue-950",
    border: "border-blue-700",
    icon: "🔍",
    title: "text-blue-500",
    accent: "bg-blue-800/50",
  },
  Civilian: {
    bg: "bg-gradient-to-br from-neutral-800 to-neutral-900",
    border: "border-neutral-700",
    icon: "👤",
    title: "text-neutral-400",
    accent: "bg-neutral-800/50",
  },
};

const rolePowers = {
  Mafia: "Each night, vote with other Mafia members to eliminate one player.",
  Detective: "Each night, investigate one player to learn if they are Mafia.",
  Civilian: "Vote during the day to eliminate suspected Mafia members.",
};

const RoleReveal = ({
  role = "Civilian",
  isRevealed = true,
  onRevealComplete = () => {},
}: RoleRevealProps) => {
  return (
    <div className="flex items-center justify-center min-h-[600px] w-full bg-black/95 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        onAnimationComplete={onRevealComplete}
      >
        <Card
          className={cn(
            "w-[400px] h-[600px] relative",
            roleStyles[role].bg,
            "rounded-xl shadow-xl border-2",
            roleStyles[role].border,
          )}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <div className="text-8xl mb-4">{roleStyles[role].icon}</div>

            <div
              className={cn(
                "px-6 py-3 rounded-full font-bold text-3xl mb-8",
                roleStyles[role].accent,
              )}
            >
              <span className={roleStyles[role].title}>{role}</span>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white/90 mb-2">
                  Your Power
                </h3>
                <p className="text-lg text-white/80">{rolePowers[role]}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white/90 mb-2">
                  Your Goal
                </h3>
                <p className="text-lg text-white/80">
                  {role === "Mafia" &&
                    "Eliminate all Civilians and Detectives without getting caught."}
                  {role === "Detective" &&
                    "Help the town identify and eliminate all Mafia members."}
                  {role === "Civilian" &&
                    "Work with the town to eliminate all Mafia members."}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default RoleReveal;
