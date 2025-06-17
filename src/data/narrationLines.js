const narrationLines = {
  introPhase: [
    "You were stuffed into a locker by bullies. You shouted for help, but no one came. Then… the evacuation alarm rang. Panic erupted outside. You screamed…and passed out from the lack of air.",
    "\u23F1\uFE0F 24 hours later…",
    "You awake—cold, cramped, and alone. The building is silent. Lights flicker. You scream again… nothing.",
    "💥 Using the last of your strength, you kick the locker door until it swings open. You collapse out onto the changing room floor, freezing cold.",
    "You must get warm fast or risk freezing in the dark...",
  ],
  warmupIntro: [
    "Your muscles ache. You shuffle across the room, rubbing your arms. You spot a dusty rowing machine still plugged in.",
    "\uD83C\uDFC3 To raise your heart rate, complete a 500m row.",
  ],
  escaping: [
    "You finally grab the object—it’s a flathead screwdriver. Not much… but it could help.",
    "You check the door: locked. But maybe you can loosen it. Or… there's a bench nearby. Could you climb and escape through the ceiling tiles?",
    "\uD83E\uDDE0 Choose your escape route:",
    "\uD83D\uDCAA Use the screwdriver to jimmy the lock—{slamBallGoal} slam balls",
    "\u26A1\uFE0F Leap onto the bench and push up into the tiles—{squatJumpGoal} squat jumps",
  ],
  mapIntroduction: [
    "You step into the dim hallway, breathing heavy after escaping the locker room. Just as you start to gather your bearings, something crunches under your foot.",
    "A torn, dusty school bag lies abandoned near the lockers. Its straps are frayed, but it feels sturdy enough to carry what you need.",
    "Inside, you find a battered pamphlet-style school map, marked with strange scribbles: \"DO NOT ENTER - Roche?\" Some rooms are circled. Others crossed out.",
    "Alongside it, an old sticky note: \"If you're reading this... stick to the Languages Wing.\"",
    "You sling the bag over your shoulder. From now on, you can collect supplies and keep track of your path.",
    "Mr. Watkins' room looks slightly ajar. It might be worth investigating first.",
  ],
  room1: {
    intro: "You cautiously enter the abandoned classroom. The stale air and dust hint that no one has been here for a while. It's the perfect moment to focus and log your workout.",
    scavengeIntro: "With your body re-energized, you notice something odd under a pile of worksheets. You kneel to investigate...",
    foundItem: 'You pocket the {item}. It shows another room labeled "Mrs. John\'s Room" – previously unknown. A breakthrough!',
    rest: "Feeling the fatigue set in, you choose to rest in a safe corner. Tomorrow, you'll explore the newly revealed room.",
  },
  room2: {
    intro: "You arrive in Mrs. John's classroom. It's eerily quiet, but there's space to complete your next workout.",
    safeDiscovery: "While catching your breath, you notice a flicker under the teacher's desk. It's a dusty digital safe with a keypad!",
    lootFound: 'You found {loot} inside the safe. Nicely done!',
    noteFound: 'Inside the safe, you also find a scribbled note:',
    noteQuote: '"If anyone finds this, Roche has barricaded herself in the far room. I heard growling… Stay away unless you\'re ready."',
    lootFailure: "You couldn't crack the safe. You'll need to complete 15 ground-to-overheads to brute force it open.",
    failureNote: 'After forcing it open, you find a crumpled note: "Roche… far room… something’s wrong… don’t go alone."',
    readyMessage: 'You pocket the bar and steel yourself. It might be time to face what’s in there.',
    swallowHard: 'You swallow hard. Time to prepare.',
  },
  overlayIntro: {
    "Mr. Watkins' Room": [
      "You push open the door to Mr. Watkins' classroom. It's eerily quiet.",
      "Dust floats in the light. Papers are scattered across the desks.",
      "You step inside, unsure if you're alone…",
    ],
    "Mrs. John's Room": [
      "You head further into the Languages corridor. Mrs. John's classroom is barely lit.",
      "Desks are overturned and chairs are jammed against the back of the door. You squeeze through.",
      "There's a faint buzzing—maybe the lights? Or something else. You need to scavenge supplies quickly and quietly.",
    ],
    "Mrs. Roche's Room": [
      "The air feels heavier as you reach Mrs. Roche's classroom.",
      "Something doesn't feel right. You hear movement inside.",
      "You grip your bag tighter. This could be trouble.",
    ],
  },
};

export default narrationLines;
