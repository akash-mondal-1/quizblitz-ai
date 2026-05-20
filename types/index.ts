// ============================================================
// QuizBlitz AI — Type Definitions
// ============================================================

// --- Auth & User ---

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;
  isGuest: boolean;
  createdAt: number;
}

export interface UserStats {
  totalGames: number;
  totalCorrect: number;
  totalQuestions: number;
  totalScore: number;
  highestScore: number;
  winCount: number;
  currentStreak: number;
  bestStreak: number;
  averageTime: number;
  badges: BadgeId[];
}

export const DEFAULT_USER_STATS: UserStats = {
  totalGames: 0,
  totalCorrect: 0,
  totalQuestions: 0,
  totalScore: 0,
  highestScore: 0,
  winCount: 0,
  currentStreak: 0,
  bestStreak: 0,
  averageTime: 0,
  badges: [],
};

// --- Badges / Achievements ---

export type BadgeId =
  | 'speed_demon'
  | 'brain_master'
  | 'perfect_streak'
  | 'quiz_champion'
  | 'first_win'
  | 'ten_games'
  | 'fifty_correct';

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string; // lucide icon name
  condition: (stats: UserStats) => boolean;
}

export const BADGES: Badge[] = [
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Answer 5 questions in under 3 seconds each',
    icon: 'Zap',
    condition: (s) => s.averageTime < 3 && s.totalQuestions >= 5,
  },
  {
    id: 'brain_master',
    name: 'Brain Master',
    description: 'Score over 90% accuracy across 20+ questions',
    icon: 'Brain',
    condition: (s) =>
      s.totalQuestions >= 20 && s.totalCorrect / s.totalQuestions > 0.9,
  },
  {
    id: 'perfect_streak',
    name: 'Perfect Streak',
    description: 'Get 10 correct answers in a row',
    icon: 'Flame',
    condition: (s) => s.bestStreak >= 10,
  },
  {
    id: 'quiz_champion',
    name: 'Quiz Champion',
    description: 'Win 5 multiplayer games',
    icon: 'Trophy',
    condition: (s) => s.winCount >= 5,
  },
  {
    id: 'first_win',
    name: 'First Victory',
    description: 'Win your first game',
    icon: 'Award',
    condition: (s) => s.winCount >= 1,
  },
  {
    id: 'ten_games',
    name: 'Dedicated Player',
    description: 'Play 10 games',
    icon: 'Gamepad2',
    condition: (s) => s.totalGames >= 10,
  },
  {
    id: 'fifty_correct',
    name: 'Knowledge Seeker',
    description: 'Answer 50 questions correctly',
    icon: 'GraduationCap',
    condition: (s) => s.totalCorrect >= 50,
  },
];

// --- Quiz & Questions ---

export type Difficulty = 'easy' | 'medium' | 'hard';

export type QuizCategory =
  | 'coding'
  | 'science'
  | 'movies'
  | 'general'
  | 'technology'
  | 'history'
  | 'sports'
  | 'custom';

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  category: QuizCategory;
  difficulty: Difficulty;
}

export interface QuizConfig {
  topic: string;
  category: QuizCategory;
  difficulty: Difficulty;
  questionCount: number;
  timePerQuestion: number; // seconds
}

// --- Room & Game ---

export type GameState = 'lobby' | 'starting' | 'playing' | 'question_result' | 'finished';

export interface Player {
  uid: string;
  displayName: string;
  photoURL: string | null;
  isHost: boolean;
  score: number;
  currentStreak: number;
  answeredCurrent: boolean;
  lastAnswerCorrect: boolean | null;
  lastAnswerTime: number | null;
  connected: boolean;
  warnings: number;
}

export interface RoomData {
  id: string;
  code: string;
  hostUid: string;
  config: QuizConfig;
  gameState: GameState;
  currentQuestionIndex: number;
  timerEnd: number | null; // timestamp when timer expires
  timerDuration: number; // seconds per question
  players: Record<string, Player>;
  questions: QuizQuestion[];
  answers: Record<string, Record<string, PlayerAnswer>>; // questionId -> uid -> answer
  createdAt: number;
}

export interface PlayerAnswer {
  optionIndex: number;
  timestamp: number;
  isCorrect: boolean;
  score: number;
  timeElapsed: number; // seconds taken to answer
}

// --- Leaderboard ---

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoURL: string | null;
  score: number;
  correctCount: number;
  streak: number;
  rank: number;
  previousRank: number | null;
  fastestAnswer: number | null; // seconds
}

// --- API Request/Response ---

export interface GenerateQuizRequest {
  topic: string;
  category: QuizCategory;
  difficulty: Difficulty;
  questionCount: number;
}

export interface GenerateQuizResponse {
  questions: QuizQuestion[];
  success: boolean;
  error?: string;
  isDemo?: boolean;
}

export interface ExplainAnswerRequest {
  question: string;
  correctAnswer: string;
  userAnswer: string;
}

export interface ExplainAnswerResponse {
  explanation: string;
  success: boolean;
  error?: string;
}

// --- Emoji Reactions ---

export type ReactionType = '🔥' | '😂' | '😱' | '🎉' | '💀' | '🧠';

export interface EmojiReaction {
  id: string;
  uid: string;
  type: ReactionType;
  timestamp: number;
}

// --- Anti-Cheat ---

export interface AntiCheatEvent {
  type: 'tab_switch' | 'inactivity' | 'fullscreen_exit';
  timestamp: number;
}
