const questDeck = [
  // ── TITAN RESISTANCE CHAIN ─────────────────────────────────
  // Core progression. Each tier weakens TITAN's hold on the school.
  {
    id: "quest_workout_1",
    title: "System Probe",
    type: "fitness",
    description:
      "Log your first workout. TITAN is watching — show it you're not giving up.",
    event: "workoutLogged",
    goal: 1,
    reward: {
      xp: 15,
      badge: "workoutStarter",
      badgeLabel: "First Signal",
    },
    autoUnlock: true,
    tier: 1,
  },
  {
    id: "quest_workout_3",
    title: "Signal Boost",
    type: "fitness",
    description:
      "Log 3 workouts. TITAN's sensors are recalibrating — keep the pressure up.",
    event: "workoutLogged",
    goal: 3,
    reward: {
      xp: 35,
      badge: "workoutTrio",
      badgeLabel: "Signal Boost",
    },
    prerequisites: ["quest_workout_1"],
    tier: 2,
  },
  {
    id: "quest_workout_5",
    title: "Firewall Breach",
    type: "fitness",
    description:
      "Log 5 workouts. Your consistency is cracking TITAN's defences.",
    event: "workoutLogged",
    goal: 5,
    reward: {
      xp: 60,
      badge: "workoutQuint",
      badgeLabel: "Firewall Breaker",
    },
    prerequisites: ["quest_workout_3"],
    tier: 3,
  },
  {
    id: "quest_workout_10",
    title: "Iron Protocol",
    type: "fitness",
    description:
      "Log 10 workouts. TITAN classifies you as a high-priority threat.",
    event: "workoutLogged",
    goal: 10,
    reward: {
      xp: 100,
      badge: "ironResolve",
      badgeLabel: "Iron Protocol",
    },
    prerequisites: ["quest_workout_5"],
    tier: 4,
  },
  {
    id: "quest_workout_15",
    title: "Unstoppable Force",
    type: "fitness",
    description:
      "Log 15 workouts. TITAN's threat assessment: MAXIMUM.",
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
    title: "Legend of Pencoedtre",
    type: "fitness",
    description:
      "Log 25 workouts. No other subject in TITAN's records has achieved this.",
    event: "workoutLogged",
    goal: 25,
    reward: {
      xp: 250,
      badge: "hallOfFame",
      badgeLabel: "Legend of Pencoedtre",
    },
    prerequisites: ["quest_workout_15"],
    tier: 6,
  },

  // ── OVERRIDE CODE MISSIONS ─────────────────────────────────
  {
    id: "quest_spark_warmup",
    title: "Combat Ready",
    type: "fitness",
    description:
      "Complete a warm-up in Mr. Watkins' Room. TITAN requires physical readiness.",
    event: "warmupComplete",
    criteria: { room: "Mr. Watkins' Room" },
    goal: 1,
    reward: {
      xp: 25,
      badge: "warmupChampion",
      badgeLabel: "Combat Ready",
    },
    autoUnlock: true,
  },
  {
    id: "quest_strength_log",
    title: "Power Surge",
    type: "fitness",
    description:
      "Log a strength workout. TITAN's physical assessment requires raw power.",
    event: "workoutLogged",
    criteria: { focus: "strength" },
    goal: 1,
    reward: {
      xp: 30,
      badge: "strengthCaptain",
      badgeLabel: "Power Surge",
    },
    prerequisites: ["quest_spark_warmup"],
  },

  // ── CIPHER MISSIONS ────────────────────────────────────────
  {
    id: "quest_languages_trial",
    title: "Cipher Cracker",
    type: "knowledge",
    description:
      "Answer 5+ language questions correctly in Mrs. Roche's room to crack TITAN's encryption.",
    event: "quizComplete",
    criteria: { room: "Mrs. Roche's Room", minCorrect: 5 },
    goal: 1,
    reward: {
      xp: 40,
      badge: "ks3Polyglot",
      badgeLabel: "Cipher Cracker",
    },
    prerequisites: ["quest_spark_warmup"],
  },

  // ── FINAL MISSION ──────────────────────────────────────────
  {
    id: "quest_arena_finale",
    title: "TITAN Shutdown",
    type: "fitness",
    description:
      "Complete Operation Slamstorm in the Fitness Suite to shut TITAN down.",
    event: "bossDefeated",
    criteria: { room: "Fitness Suite" },
    goal: 1,
    reward: {
      xp: 60,
      badge: "arenaChampion",
      badgeLabel: "TITAN Slayer",
    },
    prerequisites: ["quest_languages_trial"],
  },
];

export const questById = questDeck.reduce((acc, quest) => {
  acc[quest.id] = quest;
  return acc;
}, {});

export default questDeck;
