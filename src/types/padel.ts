export type PlayerPosition = 'REVES' | 'DERECHA' | 'AMBOS';

export interface Player {
  id: string;
  name: string;
  preferredPosition: PlayerPosition;
}

export type MatchWinner = 'PAIR1' | 'PAIR2' | 'DRAW' | null;

export interface MatchSet {
  pair1: number;
  pair2: number;
}

export interface Match {
  id: string;
  round: number; // 1 a 12
  matchNumber: number; // 1 a 4
  player1Name: string; // Pareja 1 - Revés
  player2Name: string; // Pareja 1 - Derecha
  player3Name: string; // Pareja 2 - Revés
  player4Name: string; // Pareja 2 - Derecha
  
  // Sets
  set1Pair1?: number | null;
  set1Pair2?: number | null;
  set2Pair1?: number | null;
  set2Pair2?: number | null;
  set3Pair1?: number | null;
  set3Pair2?: number | null;

  // Total directo de juegos (si juegan partido a juegos corridos)
  gamesPair1?: number | null;
  gamesPair2?: number | null;

  winner: MatchWinner;
  isPlayed: boolean;
  playedAt?: string | null;
  court?: string | null;
  notes?: string | null;
}

export interface PlayerStats {
  id: string;
  name: string;
  position: PlayerPosition;
  played: number; // PJ
  won: number;    // PG
  drawn: number;  // PE
  lost: number;   // PP
  points: number; // PTS: 3xPG + 1xPE + 0xPP
  setsWon: number;   // SF
  setsLost: number;  // SC
  setsDiff: number;  // DS
  gamesWon: number;  // JF
  gamesLost: number; // JC
  gamesDiff: number; // DIF
  form: ('W' | 'D' | 'L')[]; // Últimos partidos
}

export interface LeagueSettings {
  pointsForWin: number;
  pointsForDraw: number;
  pointsForLoss: number;
  leagueName: string;
}
