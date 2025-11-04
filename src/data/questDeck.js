const questDeck = [
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
      badgeLabel: "Warm-Up Vanguard cosmetic badge",
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
      badgeLabel: "Squad Captain sash",
    },
    prerequisites: ["quest_spark_warmup"],
  },
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
      badgeLabel: "KS3 Polyglot Pin (cosmetic)",
    },
    prerequisites: ["quest_spark_warmup"],
  },
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
