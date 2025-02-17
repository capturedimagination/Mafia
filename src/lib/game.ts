export type Role = "Mafia" | "Detective" | "Civilian";

export interface GameSettings {
  totalPlayers: number;
  mafiaCount: number;
  gameCode?: string;
}
