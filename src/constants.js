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
