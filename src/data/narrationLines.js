const narrationLines = {
  general: {
    introPhase: [
      "Your eyes snap open to darkness. Metal presses against your back, the stale tang of sweat and bleach filling your lungs. The locker you were shoved into has become a coffin.",
      "Somewhere beyond the metal door, the evacuation klaxon drones a low, dying wail. No footsteps. No teachers. Just the drip of a leaking pipe and your ragged breathing.",
      "You slam your shoulder into the door. Once. Twice. On the third hit the lock gives. You spill out onto the locker room tiles, freezing air scalding your skin.",
      "Rows of benches lie toppled. Steam clouds the air. Every muscle in your body screams for warmth and movement before the chill swallows you whole.",
      "Time to wake the body, sharpen the mind, and find a way out of this tomb.",
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
      "You stagger out of the locker room and nearly trip over a battered sports bag slumped against the wall. Someone left in a hurry.",
      "Inside the bag is a torn pamphlet map. Red ink circles the Languages Wing and scrawled notes warn: \"Stick together. Roche lost it. Bring gear.\"",
      "Tucked in the front pocket is a set of tabletop quest cards—objectives, rewards, and cryptic hints. Whoever owned this bag was planning a campaign.",
      "This is your lifeline now. Sling it over your shoulder, track every item you scavenge, and let the tabletop plan guide you out.",
      "First marker: Mr. Watkins' classroom. The door is cracked open, as if inviting your crew inside.",
    ],
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
  },
  languages: {
    room1: {
      intro: [
        "You cautiously enter the abandoned classroom. The stale air and dust hint that no one has been here for a while.",
        "It's the perfect moment to focus and log your workout.",
      ],
      scavenge: ["With your body re-energized, you notice something odd under a pile of worksheets. You kneel to investigate..."],
      foundItem: 'You pocket the {item}. It shows another room labeled "Mrs. John\'s Room" – previously unknown. A breakthrough!',
      rest: "Feeling the fatigue set in, you choose to rest in a safe corner. Tomorrow, you'll explore the newly revealed room.",
    },
    room2: {
      intro: ["You arrive in Mrs. John's classroom. It's eerily quiet, but there's space to complete your next workout."],
      quizIntro: ["While catching your breath, you notice a flicker under the teacher's desk. It's a dusty digital safe with a keypad!"],
      lootFound: 'You found {loot} inside the safe. Nicely done!',
      noteFound: 'Inside the safe, you also find a scribbled note:',
      noteQuote: '"If anyone finds this, Roche has barricaded herself in the far room. I heard growling… Stay away unless you\'re ready."',
      lootFailure: "You couldn't crack the safe. You'll need to complete 15 ground-to-overheads to brute force it open.",
      failureNote: 'After forcing it open, you find a crumpled note: "Roche… far room… something’s wrong… don’t go alone."',
      readyMessage: 'You pocket the bar and steel yourself. It might be time to face what’s in there.',
      swallowHard: 'You swallow hard. Time to prepare.',
    },
    rocheBoss: {
      leadIn: ["Everything seems normal. You take a breath and prepare to log your workout."],
      quizIntro: [
        "A shadowy figure rises from behind the desk and shambles toward you.",
        "You sprint for the exit, but the door slams shut—six heavy locks click into place.",
        "Answer every question to release the locks!",
      ],
      battleStart: "⚠️ An alarm blares. The door slams shut. Six glowing locks appear. You're trapped.",
    },
  },
};

export default narrationLines;
