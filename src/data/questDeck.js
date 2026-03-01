const questDeck = [
  // ── WORKOUT GRIND CHAIN ──────────────────────────────────────
  // The core progression loop. Each tier unlocks after the previous,
  // giving students a clear target and visible momentum.
  {
    id: "quest_workout_1",
    title: "First Footing",
    type: "fitness",
    description:
      "Log your first workout anywhere on campus to steady your crew's nerves.",
    event: "workoutLogged",
    goal: 1,
    reward: {
      xp: 15,
      badge: "workoutStarter",
      badgeLabel: "Workout Starter",
    },
    autoUnlock: true,
    tier: 1,
  },
  {
    id: "quest_workout_3",
    title: "Training Trio",
    type: "fitness",
    description:
      "Log three workouts during the campaign to prove your momentum.",
    event: "workoutLogged",
    goal: 3,
    reward: {
      xp: 35,
      badge: "workoutTrio",
      badgeLabel: "Training Trio",
    },
    prerequisites: ["quest_workout_1"],
    tier: 2,
  },
  {
    id: "quest_workout_5",
    title: "Campaign Conditioned",
    type: "fitness",
    description:
      "Log five workouts across the map to finish the conditioning milestone.",
    event: "workoutLogged",
    goal: 5,
    reward: {
      xp: 60,
      badge: "workoutQuint",
      badgeLabel: "Campaign Conditioning",
    },
    prerequisites: ["quest_workout_3"],
    tier: 3,
  },
  {
    id: "quest_workout_10",
    title: "Iron Resolve",
    type: "fitness",
    description:
      "Log ten workouts. The grind separates rookies from warriors.",
    event: "workoutLogged",
    goal: 10,
    reward: {
      xp: 100,
      badge: "ironResolve",
      badgeLabel: "Iron Resolve",
    },
    prerequisites: ["quest_workout_5"],
    tier: 4,
  },
  {
    id: "quest_workout_15",
    title: "Unstoppable Force",
    type: "fitness",
    description:
      "Log fifteen workouts. Your dedication is becoming legendary.",
    event: "workoutLogged",
    goal: 15,
    reward: {
      xp: 150,
      badge: "unstoppable",
      badgeLabel: "Unstoppable Force",
    },
    prerequisites: ["quest_workout_10"],
    tier: 5,
  },
  {
    id: "quest_workout_25",
    title: "Hall of Fame",
    type: "fitness",
    description:
      "Log twenty-five workouts. Only the elite reach this milestone.",
    event: "workoutLogged",
    goal: 25,
    reward: {
      xp: 250,
      badge: "hallOfFame",
      badgeLabel: "Hall of Fame",
    },
    prerequisites: ["quest_workout_15"],
    tier: 6,
  },

  // ── ROOM CHALLENGES ──────────────────────────────────────────
  {
    id: "quest_spark_warmup",
    title: "Spark Gauntlet",
    type: "fitness",
    description:
      "Complete a warm-up with your crew in Mr. Watkins' Room to forge the party.",
    event: "warmupComplete",
    criteria: { room: "Mr. Watkins' Room" },
    goal: 1,
    reward: {
      xp: 25,
      badge: "warmupChampion",
      badgeLabel: "Warm-Up Vanguard",
    },
    autoUnlock: true,
  },
  {
    id: "quest_strength_log",
    title: "Captain of Strength",
    type: "fitness",
    description:
      "Log a strength-focused workout anywhere on campus to inspire your team.",
    event: "workoutLogged",
    criteria: { focus: "strength" },
    goal: 1,
    reward: {
      xp: 30,
      badge: "strengthCaptain",
      badgeLabel: "Squad Captain",
    },
    prerequisites: ["quest_spark_warmup"],
  },

  // ── KNOWLEDGE ────────────────────────────────────────────────
  {
    id: "quest_languages_trial",
    title: "KS3 Linguist Trial",
    type: "knowledge",
    description:
      "Answer at least five KS3 language questions correctly in Mrs. Roche's room to earn a Polyglot Pin.",
    event: "quizComplete",
    criteria: { room: "Mrs. Roche's Room", minCorrect: 5 },
    goal: 1,
    reward: {
      xp: 40,
      badge: "ks3Polyglot",
      badgeLabel: "KS3 Polyglot",
    },
    prerequisites: ["quest_spark_warmup"],
  },

  // ── BOSS ENCOUNTERS ──────────────────────────────────────────
  {
    id: "quest_arena_finale",
    title: "Arena Finale",
    type: "fitness",
    description:
      "Defeat the Fitness Suite boss with your crew to claim the Championship Pennant.",
    event: "bossDefeated",
    criteria: { room: "Fitness Suite" },
    goal: 1,
    reward: {
      xp: 60,
      badge: "arenaChampion",
      badgeLabel: "Championship Pennant",
    },
    prerequisites: ["quest_languages_trial"],
  },
];

export const questById = questDeck.reduce((acc, quest) => {
  acc[quest.id] = quest;
  return acc;
}, {});

export default questDeck;
