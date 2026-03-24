// Centralised constants — import from here instead of using magic strings.

export const ROOMS = {
  MR_WATKINS: "Mr. Watkins' Room",
  MRS_JOHN: "Mrs. John's Room",
  MRS_ROCHE: "Mrs. Roche's Room",
  FITNESS_SUITE: "Fitness Suite",
};

export const STAGES = {
  NARRATION: "narration",
  WARMUP_PROMPT: "warmupPrompt",
  WARMUP_SELECT: "warmupSelect",
  WARMUP: "warmup",
  WORKOUT: "workout",
  SAFE_INTRO: "safeIntro",
  SAFE_QUIZ: "safeQuiz",
  QUIZ_INTRO: "quizIntro",
  QUIZ: "quiz",
  FITNESS_PREP: "fitnessPrep",
  SAFE_PENALTY: "safePenalty",
  BOSS: "boss",
  LOOT: "loot",
  SCAVENGE: "scavenge",
  EXPLORE_PROMPT: "explorePrompt",
  COMPLETE: "complete",
};

export const BADGES = {
  WORKOUT_STARTER: "workoutStarter",
  WORKOUT_TRIO: "workoutTrio",
  WORKOUT_QUINT: "workoutQuint",
  WARMUP_CHAMPION: "warmupChampion",
  STRENGTH_CAPTAIN: "strengthCaptain",
  KS3_POLYGLOT: "ks3Polyglot",
  ARENA_CHAMPION: "arenaChampion",
  BOSS_VANQUISHER: "bossVanquisher",
  SPEED_RUNNER: "speedRunner",
  TOP_TEN: "topTen",
};

// Thresholds for speed badges in FinalBossPhase (seconds)
export const SPEED_THRESHOLDS = {
  SPEED_RUNNER: 120,
  TOP_TEN: 100,
};

// RPG Class System
export const CLASSES = {
  berserker: {
    id: "berserker",
    name: "Berserker",
    icon: "⚔️",
    color: "var(--class-berserker)",
    rgb: "255,68,68",
    desc: "Raw power. Maximum strength.",
    ability: "+20% XP from strength exercises",
    xpBonus: { strength: 0.2 },
  },
  phantom: {
    id: "phantom",
    name: "Phantom",
    icon: "💨",
    color: "var(--class-phantom)",
    rgb: "0,204,255",
    desc: "Speed and agility above all.",
    ability: "+20% XP from cardio exercises",
    xpBonus: { cardio: 0.2 },
  },
  guardian: {
    id: "guardian",
    name: "Guardian",
    icon: "🛡️",
    color: "var(--class-guardian)",
    rgb: "0,255,136",
    desc: "Endurance. Resilience. Protection.",
    ability: "+10% all XP, faster injury recovery",
    xpBonus: { all: 0.1 },
    recoveryBonus: true,
  },
};

// Badge display metadata
export const BADGE_META = {
  workoutStarter: { name: "First Signal", icon: "📡", desc: "Logged your first workout" },
  workoutTrio: { name: "Signal Boost", icon: "📶", desc: "Logged 3 workouts" },
  workoutQuint: { name: "Firewall Breaker", icon: "🔓", desc: "Logged 5 workouts" },
  warmupChampion: { name: "Warmup Champion", icon: "🔥", desc: "Completed a full warmup" },
  strengthCaptain: { name: "Strength Captain", icon: "💪", desc: "Logged a strength workout" },
  ks3Polyglot: { name: "KS3 Polyglot", icon: "🌍", desc: "Mastered the language quiz" },
  arenaChampion: { name: "Arena Champion", icon: "🏆", desc: "Defeated a room boss" },
  bossVanquisher: { name: "Boss Vanquisher", icon: "💀", desc: "Shut down TITAN" },
  speedRunner: { name: "Speed Runner", icon: "⚡", desc: "Beat TITAN in under 2 minutes" },
  topTen: { name: "Top Ten", icon: "🥇", desc: "Beat TITAN in under 100 seconds" },
  comboMaster: { name: "Combo Master", icon: "🔥", desc: "Reached a 5x combo streak" },
  ironWill: { name: "Iron Will", icon: "🦾", desc: "Logged 10 workouts" },
  legendOfPencoedtre: { name: "Legend", icon: "👑", desc: "Logged 25 workouts" },
  dailyWarrior: { name: "Daily Warrior", icon: "📅", desc: "7-day login streak" },
  mapExplorer: { name: "Map Explorer", icon: "🗺️", desc: "Cleared all rooms" },
};
