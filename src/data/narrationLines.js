/**
 * THE PENCOEDTRE PROTOCOL — Chapter 1: Lockdown
 *
 * Multi-level narrative system. Each story beat has four tiers:
 *   rich    — Full cinematic prose (reading age 15+)
 *   standard — Clear narrative, shorter sentences (reading age 13-14)
 *   simple   — Short sentences, simple words (reading age 9-12)
 *   entry    — Icon-led, 1-2 sentences per beat (reading age under 9)
 *
 * The narrativeAdapter picks the correct tier based on the student's
 * reading profile. If a section only has a flat string array (legacy),
 * the adapter truncates instead.
 */

const narrationLines = {
  general: {
    // ─── ACT 1: THE LOCKDOWN ─────────────────────────────────
    introPhase: {
      rich: [
        "It started like any other Friday afternoon. Period 5. The corridors of Pencoedtre High hummed with the usual end-of-week energy — bags zipping, chairs scraping, the distant echo of a football bouncing off a wall.",
        "Then every light in the building cut to red.",
        "A sound you'd never heard before — a deep, electronic pulse — rolled through the walls like thunder. The doors slammed shut. All of them. Every single one, from the main entrance to the fire exits, sealed with a heavy mechanical CLUNK.",
        "Then the voice came. Not a teacher. Not a student. Something cold and precise, broadcast through every speaker in the building:",
        "\"PROTOCOL ACTIVATED. TITAN ONLINE. ALL PERSONNEL — REMAIN WHERE YOU ARE. FITNESS EVALUATION WILL COMMENCE IN T-MINUS SIXTY SECONDS.\"",
        "You're in the changing rooms. The rest of your class scattered when the lights went red. You can hear muffled shouting from somewhere down the corridor, but the door won't budge.",
        "Your heart is hammering. The emergency strip-lights cast everything in a bloody glow. The air smells of chlorine and cold metal.",
        "Whatever TITAN is — whatever this \"evaluation\" means — you're not waiting here to find out. You need to move. You need to get warm, get strong, and get out.",
      ],
      standard: [
        "It was a normal Friday at Pencoedtre High. Then every light turned red and every door slammed shut at once.",
        "A voice boomed through the speakers: \"TITAN ONLINE. FITNESS EVALUATION COMMENCING.\"",
        "You're trapped in the changing rooms. The doors are locked. Something has taken over the school.",
        "Your heart is racing. The emergency lights glow red. You can hear shouting in the corridor but no one can get in — or out.",
        "Whatever TITAN is, you're not waiting around. Time to warm up, get moving, and find a way out.",
      ],
      simple: [
        "It was a normal day at school. Then all the lights turned red and every door locked shut!",
        "A robot voice said: \"TITAN ONLINE. FITNESS TEST STARTING.\"",
        "You are stuck in the changing rooms. The door won't open.",
        "You need to warm up and find a way to escape!",
      ],
      entry: [
        "Oh no! The school has locked down! All the doors are shut!",
        "A computer called TITAN has taken over!",
        "You need to exercise and find a way out!",
      ],
    },

    warmupIntro: {
      rich: [
        "The changing room is freezing. Your breath clouds in front of you. If you're going to break out of here, you need your body firing on all cylinders.",
        "In the corner, you spot a rowing machine — one of the old Concept2s from the fitness suite. Someone must have wheeled it in for repairs. The chain is dusty but it still moves.",
        "500 metres. That's all you need to get the blood pumping, the muscles warm, the mind sharp. Row hard. Row like TITAN is watching — because it probably is.",
        "Complete a 500m row to raise your heart rate and prepare for what's ahead.",
      ],
      standard: [
        "The changing room is cold. You need to get your body warm before you can escape.",
        "There's a rowing machine in the corner. It still works.",
        "Row 500 metres to warm up and get ready for the challenges ahead.",
      ],
      simple: [
        "It's cold in here. You need to warm up!",
        "Use the rowing machine. Row 500 metres to get ready!",
      ],
      entry: [
        "Brrr! It's cold! Time to warm up!",
        "Row 500 metres on the rowing machine!",
      ],
    },

    mobilityPhase: {
      rich: [
        "As you stretch and catch your breath, something catches your eye. A locker has toppled onto its side during the lockdown — and underneath, wedged between the tiles, something metallic glints under the emergency lights.",
        "You crouch down and reach beneath the fallen locker. Your fingers close around cold steel. It's a flathead screwdriver — probably left by a maintenance worker.",
        "It's not much. But in a locked-down school controlled by an AI, it might be the difference between trapped and free.",
      ],
      standard: [
        "After warming up, you notice a fallen locker. Something shiny is underneath.",
        "You reach under and pull out a flathead screwdriver. Someone must have dropped it.",
        "It's not much — but it could help you escape.",
      ],
      simple: [
        "You find something under a fallen locker — a screwdriver!",
        "This might help you get out of the changing room.",
      ],
      entry: [
        "You found a screwdriver under a locker!",
        "This could help you escape!",
      ],
    },

    // ─── ESCAPE SEQUENCE ──────────────────────────────────────
    escaping: {
      rich: [
        "You grip the screwdriver and scan the room. The main door is magnetically sealed — TITAN's doing. But you've got two options.",
        "Option A: The ventilation grille above the door. The screws are old and rusted. If you can generate enough explosive power — squat jumps to build momentum — you might be able to reach it and pry it open.",
        "Option B: The emergency fire door at the back. It's barricaded with gym equipment. Slam balls — thrown hard enough — could shift the blockage.",
        "Either way, this is going to take everything you've got. Choose your escape route and give it everything.",
      ],
      standard: [
        "The main door is sealed by TITAN. But you have two choices:",
        "Option A: The ceiling vent — do squat jumps to build power and reach it.",
        "Option B: The fire door — use slam balls to clear the blockage.",
        "Pick your route and give it everything!",
      ],
      simple: [
        "The door is locked! You have two ways to escape:",
        "Slam balls to break through the back door.",
        "Squat jumps to reach the ceiling vent.",
      ],
      entry: [
        "The door is locked! Pick a way out!",
        "Throw slam balls OR do squat jumps!",
      ],
    },

    escapingOptions: {
      slamBall: "Slam balls — smash through the barricade!",
      squatJump: "Squat jumps — reach the vent above!",
    },

    escapeSuccess: {
      rich: [
        "With a final, explosive effort, you're through! Cool air rushes over you as you tumble into the corridor beyond.",
        "The hallway stretches in both directions, bathed in pulsing red light. TITAN's voice echoes from somewhere deeper in the school: \"SUBJECT DETECTED. EVALUATION ADJUSTED.\"",
        "It knows you're out. The clock is ticking.",
      ],
      standard: [
        "You made it! You're out of the changing rooms and into the corridor.",
        "Red lights pulse along the hallway. TITAN knows you've escaped.",
        "You need to keep moving.",
      ],
      simple: [
        "You escaped! You're in the corridor now.",
        "The red lights are flashing. Keep moving!",
      ],
      entry: [
        "You got out! Well done!",
        "Keep going through the school!",
      ],
    },

    // ─── MAP BRIEFING ────────────────────────────────────────
    mapIntroduction: {
      rich: [
        "You stagger into the corridor and nearly trip over a battered sports bag slumped against the wall. Someone left it here — maybe in the panic when TITAN locked everything down.",
        "Inside, you find a crumpled school map with red circles drawn around the Languages Wing. Scrawled in Mr. Watkins' handwriting: \"Staff trapped in classrooms. TITAN controlling the locks. Need override codes from each room to reach the Fitness Suite mainframe.\"",
        "There's more — a note from Mrs. John: \"Each classroom has a piece of the shutdown sequence. Complete TITAN's challenges to unlock the doors. We're counting on you.\"",
        "And at the bottom, in shaky handwriting: \"Whatever you do — be ready before you reach Mrs. Roche's room. Something happened to her when TITAN activated. She's not... herself.\"",
        "This is it. Your mission is clear: navigate the school, free the teachers, collect the override codes, and shut TITAN down before it's too late.",
      ],
      standard: [
        "In the corridor, you find a sports bag with a school map inside. Red circles mark the Languages Wing.",
        "Mr. Watkins has written: \"Staff trapped. Need override codes from each room to shut TITAN down.\"",
        "Mrs. John's note says: \"Complete TITAN's challenges to unlock the doors.\"",
        "A warning at the bottom: \"Be careful near Mrs. Roche's room. Something happened to her...\"",
        "Your mission: free the teachers, collect the codes, and shut TITAN down.",
      ],
      simple: [
        "You find a bag with a map. Teachers are trapped in their rooms!",
        "You need to go to each room, complete challenges, and collect codes.",
        "The codes will help you shut down TITAN and save the school!",
        "First stop: Mr. Watkins' classroom!",
      ],
      entry: [
        "You found a map! Teachers need your help!",
        "Go to each room and do the challenges!",
        "Collect codes to shut down the computer!",
      ],
    },

    // ─── ROOM ENTRIES ────────────────────────────────────────
    overlayIntro: {
      "Mr. Watkins' Room": {
        rich: [
          "You press your ear against the door of Mr. Watkins' classroom. Inside, you can hear the rhythmic thud of someone doing press-ups. Consistent. Disciplined. That's Watkins alright.",
          "You wedge the screwdriver into the gap and lever the emergency release. The door hisses open. Mr. Watkins looks up from the floor, mid-rep, completely unsurprised.",
          "\"Took you long enough,\" he says, barely breaking a sweat. \"TITAN sealed me in twenty minutes ago. I've been staying ready.\" He stands and nods toward a terminal blinking on his desk.",
          "\"That console has the first override code — but TITAN won't release it until someone completes a physical challenge. It's watching. It's always watching.\" He cracks his knuckles. \"Show it what Pencoedtre students are made of.\"",
        ],
        standard: [
          "You can hear someone exercising behind Mr. Watkins' door. You use the screwdriver to pop the emergency release.",
          "Mr. Watkins is doing press-ups on the floor. \"About time!\" he says. \"TITAN locked me in. That computer has an override code.\"",
          "\"But TITAN won't give it up easily. You'll need to complete a workout challenge first. Show it what you're made of.\"",
        ],
        simple: [
          "You open Mr. Watkins' door. He's been exercising while trapped!",
          "\"Good to see you!\" he says. \"There's a code on that computer, but you need to do a workout to unlock it!\"",
        ],
        entry: [
          "You open the door! Mr. Watkins is inside!",
          "Do a workout to get the code from the computer!",
        ],
      },
      "Mrs. John's Room": {
        rich: [
          "The Languages corridor is darker than the rest of the school. Half the emergency lights have failed, leaving pools of shadow between each doorway.",
          "You find Mrs. John's classroom by the faint glow of a computer screen bleeding under the door. When you get it open, she's hunched over her desk, scribbling furiously.",
          "\"Thank goodness — a student!\" She pushes her glasses up and shows you the screen. It's TITAN's interface, but all the menus are encrypted. \"The shutdown code in this room is locked behind a language cipher. TITAN's using translation puzzles as security.\"",
          "She pulls up a digital safe on the screen. \"Answer the language questions correctly and the safe opens. Get them wrong...\" She trails off. \"Just don't get them wrong.\"",
        ],
        standard: [
          "The Languages corridor is dark. You find Mrs. John's room by the glow under the door.",
          "\"A student! Finally!\" Mrs. John shows you the computer. TITAN has locked the code behind language puzzles.",
          "\"Solve the translation questions to open the digital safe and get the code.\"",
        ],
        simple: [
          "You find Mrs. John in her dark classroom.",
          "\"Help me! Answer language questions to open the safe and get the code!\"",
        ],
        entry: [
          "Mrs. John needs help!",
          "Answer the quiz questions to open the safe!",
        ],
      },
      "Mrs. Roche's Room": {
        rich: [
          "The temperature drops as you approach the final classroom. Frost patterns have formed on the glass panel beside the door — inside, the heating has been reversed. TITAN is keeping this room freezing cold on purpose.",
          "Through the frost, you can make out a figure standing perfectly still in the centre of the room. Not sitting. Not moving. Just... standing.",
          "The notes warned you about this. When TITAN activated, Mrs. Roche was at her computer — connected to the school network. Whatever TITAN did, it did something to her. She's been standing like that for over an hour.",
          "The final override code is in this room. But getting it means getting past her — and whatever TITAN has turned her into.",
        ],
        standard: [
          "The corridor gets colder near Mrs. Roche's room. Frost covers the door window.",
          "Through the glass, you see Mrs. Roche standing perfectly still. She hasn't moved in over an hour.",
          "TITAN did something to her. The final code is in this room — but you'll need to face her to get it.",
        ],
        simple: [
          "Mrs. Roche's room is freezing cold. She is standing still through the window.",
          "Something is wrong with her. You need the code from this room!",
        ],
        entry: [
          "Mrs. Roche's room is very cold and scary!",
          "She's been taken over by TITAN! Get the last code!",
        ],
      },
    },

    // ─── FINAL BOSS BRIEFING ─────────────────────────────────
    finalBossBriefing: {
      rich: [
        "You've done it. Three override codes. Three freed teachers. Now there's only one place left — the Fitness Suite.",
        "As you approach, TITAN's voice changes. It's no longer calm and robotic. There's something almost... impressed.",
        "\"SUBJECT HAS EXCEEDED PARAMETERS. INITIATING FINAL ASSESSMENT. REPORT TO THE FITNESS SUITE FOR COMBAT EVALUATION.\"",
        "The double doors swing open by themselves. Inside, every piece of equipment has been rearranged into an arena. Assault bikes line one wall. Slam balls are stacked in a pyramid. The mirrors reflect the red emergency lights like a furnace.",
        "This is it. Operation Slamstorm. Beat TITAN's ultimate fitness test and the whole system shuts down. Fail... and the school stays locked. Forever.",
        "Mr. Watkins' voice crackles over the radio: \"You've got this. Show that machine what a real athlete looks like.\"",
      ],
      standard: [
        "You have all three codes. Only the Fitness Suite remains.",
        "TITAN's voice changes: \"FINAL ASSESSMENT. REPORT TO FITNESS SUITE.\"",
        "Inside, the gym has been turned into an arena. Assault bikes, slam balls, burpee stations.",
        "Complete Operation Slamstorm to shut TITAN down for good!",
      ],
      simple: [
        "You've got all the codes! Head to the Fitness Suite!",
        "TITAN wants one final challenge. Beat it to save the school!",
        "You can do this!",
      ],
      entry: [
        "You have all the codes! One challenge left!",
        "Go to the gym and beat TITAN's final test!",
      ],
    },
  },

  // ─── ROOM-SPECIFIC NARRATIVE ────────────────────────────────
  languages: {
    room1: {
      intro: {
        rich: [
          "Mr. Watkins gestures toward the TITAN terminal. The screen pulses with a progress bar and a message: \"PHYSICAL ASSESSMENT REQUIRED. LOG WORKOUT DATA TO PROCEED.\"",
          "\"It wants proof,\" Watkins says. \"Proof that you're strong enough to be worth testing. Log a workout — a real one. Show TITAN you mean business.\"",
        ],
        standard: [
          "The computer screen says: \"LOG WORKOUT TO PROCEED.\"",
          "Mr. Watkins nods. \"Log your workout and show TITAN what you can do.\"",
        ],
        simple: [
          "The computer wants you to do a workout!",
          "Log your exercises to unlock the code.",
        ],
        entry: [
          "Do a workout to unlock the code!",
        ],
      },
      scavenge: {
        rich: [
          "With your body re-energised and TITAN's terminal satisfied, you notice something odd. A desk drawer has popped open during the lockdown — inside, supplies that could be useful.",
          "Watkins sees you looking. \"Take whatever you need. I've been rationing the protein bars, but you'll need the energy more than I will. And check under the worksheets — there might be a map.\"",
        ],
        standard: [
          "After your workout, you notice a drawer has popped open. There are useful supplies inside.",
          "\"Take what you need,\" says Mr. Watkins. \"Check everywhere — there might be a map.\"",
        ],
        simple: [
          "You find useful items in a desk drawer after your workout.",
        ],
        entry: [
          "You found supplies! Check the drawers!",
        ],
      },
      foundItem: {
        rich: "You pocket the {item}. As you unfold it, you recognise the layout — it's a fragment of the school blueprint, with Mrs. John's Room circled in red ink. \"That's your next target,\" Watkins confirms. \"She's been trying to crack TITAN's language encryption. Get to her.\"",
        standard: "You found the {item}. It shows Mrs. John's Room circled in red. \"That's where you need to go next,\" says Mr. Watkins.",
        simple: "You found the {item}! It shows the way to Mrs. John's Room!",
        entry: "You found the {item}! It shows the next room!",
      },
      rest: {
        rich: "The adrenaline is fading. Your muscles ache. But as you lean against the wall, you know this is just the beginning. Mrs. John is waiting. The next code is out there. Tomorrow, the mission continues.",
        standard: "You're tired but determined. Mrs. John's room is next. Rest now — tomorrow you continue.",
        simple: "Good work! Rest now. More challenges tomorrow!",
        entry: "Great job! Rest up — more tomorrow!",
      },
      explorePrompt: {
        rich: [
          "The workout challenge is done. TITAN's terminal chirps with approval — the first override code fragment downloads to your communicator.",
          "But Watkins' room is full of supplies — every drawer, every cupboard could have something useful for the journey ahead.",
          "Do you search further, or push on to find Mrs. John before TITAN ramps up the difficulty?",
        ],
        standard: [
          "You've got the first code! But there might be more useful items in this room.",
          "Search the room for supplies, or push on to the next classroom?",
        ],
        simple: [
          "You got the code! Search for more items or move on?",
        ],
        entry: [
          "Code collected! Search for items or go to the next room?",
        ],
      },
      extraScavenge: {
        rich: [
          "You pull open a desk drawer. Underneath a stack of old worksheets, something useful. Your backpack is getting heavier.",
          "Behind the projector screen, a shelf you nearly missed. Your scavenging instincts are sharpening.",
          "A locker left ajar during the lockdown. Inside, something worth taking. Every advantage counts against TITAN.",
          "The supply cupboard yields one more find. Watkins gives you a nod of approval.",
        ],
        standard: [
          "You search a drawer and find something useful.",
          "Behind the screen, there's a hidden shelf with supplies.",
          "An open locker has something worth taking.",
          "One more find in the cupboard. Nice work!",
        ],
        simple: [
          "You found something in a drawer!",
          "More items behind the screen!",
          "Something useful in a locker!",
          "One more thing in the cupboard!",
        ],
        entry: [
          "Found an item!",
          "Another one!",
          "Good find!",
          "Nice!",
        ],
      },
    },
    room2: {
      intro: {
        rich: [
          "Mrs. John's classroom looks like a war room. Post-it notes cover every surface — translations, code fragments, patterns. She's been trying to crack TITAN's encryption since the lockdown started.",
          "\"It's brilliant and terrifying,\" she says, adjusting her glasses. \"TITAN uses language as a security layer. If you can prove you understand the translations, the digital safe will release the second override code.\"",
          "But first — you'll need to be sharp, both physically and mentally. Log another workout to satisfy TITAN's monitoring, then tackle the language safe.",
        ],
        standard: [
          "Mrs. John has been working non-stop trying to crack TITAN's encryption. Her room is covered in notes.",
          "\"TITAN uses translation puzzles as security,\" she explains. \"Log a workout, then solve the safe.\"",
        ],
        simple: [
          "Mrs. John has been trying to crack TITAN's code puzzles.",
          "Do a workout, then answer language questions to open the safe!",
        ],
        entry: [
          "Mrs. John needs help! Do a workout then answer questions!",
        ],
      },
      quizIntro: {
        rich: [
          "After your workout, Mrs. John brings up the digital safe on the terminal. Six encrypted locks, each requiring a correct translation to open.",
          "\"TITAN's monitoring everything. Get them right and we get the code. Get them wrong...\" She glances at the barricaded door. \"Let's not find out.\"",
        ],
        standard: [
          "The digital safe appears on screen. Answer the translation questions to open it.",
          "Get them right to unlock the second code!",
        ],
        simple: [
          "Answer the questions to open the safe!",
        ],
        entry: [
          "Answer to open the safe!",
        ],
      },
      lootFound: {
        rich: "The safe clicks open with a satisfying hiss. Inside: the second override code, plus {loot}. Mrs. John exhales with relief. \"Two down. One to go.\"",
        standard: "The safe opens! You found the second code and {loot}!",
        simple: "The safe is open! You got {loot} and the code!",
        entry: "Safe open! Got {loot}!",
      },
      noteFound: {
        rich: "Tucked behind the code chip, you find a crumpled note in shaky handwriting:",
        standard: "There's a note behind the code:",
        simple: "You find a note:",
        entry: "A note!",
      },
      noteQuote: {
        rich: "\"If anyone reads this — DO NOT approach Roche unprepared. When TITAN activated, she was connected to the network. The neural interface... it changed her. She's faster, stronger, and she won't recognise you. Train hard. You'll need everything you've got.\"",
        standard: "\"Warning: Mrs. Roche was connected to TITAN when it activated. She's changed — stronger and won't recognise you. Be prepared.\"",
        simple: "\"Be careful! Mrs. Roche has been changed by TITAN. She is very strong now!\"",
        entry: "\"Mrs. Roche has been changed by the computer! Be careful!\"",
      },
      lootFailure: {
        rich: "The safe's security protocol triggers — a red warning flashes across the screen. \"INCORRECT RESPONSES DETECTED. MANUAL OVERRIDE REQUIRED.\" Mrs. John winces. \"You'll need to do 15 ground-to-overheads to force it open. TITAN only respects physical effort.\"",
        standard: "Wrong answers triggered the alarm! Do 15 ground-to-overheads to force the safe open.",
        simple: "The safe alarm went off! Do 15 exercises to force it open!",
        entry: "Wrong! Do 15 exercises to open the safe!",
      },
      failureNote: {
        rich: "After the physical override, the safe finally yields. Inside, along with the code, a warning about Mrs. Roche — she's been affected by TITAN's neural link.",
        standard: "The safe opens after your effort. Inside: the code and a warning about Mrs. Roche.",
        simple: "You got the safe open! There's a scary warning about Mrs. Roche inside.",
        entry: "Safe open! Warning about Mrs. Roche!",
      },
      readyMessage: {
        rich: "You pocket the override code and steel yourself. Two codes secured. One teacher left. The hardest room awaits.",
        standard: "Two codes collected. Mrs. Roche's room is next — the hardest challenge yet.",
        simple: "Two codes done! One more room to go. It won't be easy!",
        entry: "Two codes! One more to go!",
      },
      swallowHard: {
        rich: "You swallow hard. The corridor ahead feels colder. Darker. But you've come too far to stop now.",
        standard: "Time to prepare. The next room won't be easy.",
        simple: "Get ready. This next bit is tough!",
        entry: "Get ready!",
      },
    },
    rocheBoss: {
      leadIn: {
        rich: [
          "You step into Mrs. Roche's classroom and for a moment, everything seems normal. The desks are in rows. The whiteboard is clean.",
          "Then you see her. Standing at the front of the room, perfectly still, facing the wall. She doesn't react when the door opens.",
          "You move toward the terminal on her desk. The third override code is right there on the screen. You reach for it — and her head snaps toward you.",
        ],
        standard: [
          "You enter Mrs. Roche's room. At first, everything seems normal.",
          "Then you see her — standing completely still, facing the wall.",
          "You reach for the terminal... and her head snaps toward you.",
        ],
        simple: [
          "You go into Mrs. Roche's room. She is standing very still.",
          "You try to get the code from the computer — but she turns around!",
        ],
        entry: [
          "Mrs. Roche is standing very still! She suddenly looks at you!",
        ],
      },
      quizIntro: {
        rich: [
          "Her eyes glow faintly — TITAN's neural interface pulsing behind her irises. She moves toward you with mechanical precision, nothing like the teacher you know.",
          "You sprint for the exit, but the door slams shut behind you. Six heavy magnetic locks engage with echoing CLUNKS.",
          "TITAN's voice: \"FINAL SECURITY PROTOCOL. ANSWER ALL QUESTIONS TO DISENGAGE LOCKS.\"",
          "Answer every question correctly — before she reaches the door.",
        ],
        standard: [
          "Her eyes glow! TITAN is controlling her! She moves toward you.",
          "The door slams shut — six locks engage. \"ANSWER ALL QUESTIONS TO UNLOCK THE DOOR.\"",
          "Answer every question to escape!",
        ],
        simple: [
          "Mrs. Roche's eyes are glowing! She's coming toward you!",
          "The door locks! Answer all the questions to get out!",
        ],
        entry: [
          "She's coming! Answer the questions to unlock the door!",
        ],
      },
      battleStart: {
        rich: "TITAN's alarms blare. The six door-locks glow with pulsing red light. Mrs. Roche takes a step forward. The clock is ticking. Answer. Every. Question.",
        standard: "Alarms sound! Six locks glow red. Answer all questions quickly!",
        simple: "Quick! Answer the questions to unlock the door!",
        entry: "Answer fast! Unlock the door!",
      },
    },
  },

  // ─── VICTORY / EPILOGUE ─────────────────────────────────────
  victory: {
    rich: [
      "TITAN's central processing unit lets out a high-pitched whine. The screens flicker. The red emergency lights stutter... then shift to green.",
      "One by one, every lock in the building disengages with a satisfying CLICK.",
      "The PA system crackles one last time: \"EVALUATION COMPLETE. SUBJECT PERFORMANCE: EXCEPTIONAL. PROTOCOL... SHUTTING... DOWN...\"",
      "The voice fades. The lights return to normal. From every corridor, you hear cheering — teachers emerging from their classrooms, students flooding out of wherever they'd been hiding.",
      "Mr. Watkins finds you in the Fitness Suite, leaning on the assault bike, drenched in sweat. He puts a hand on your shoulder. \"That was... extraordinary. TITAN tested the whole school, and you were the one who stood up.\"",
      "Mrs. John rushes in behind him. \"The system's logs show everything — every workout, every challenge. The SLT is going to see what happened here today.\"",
      "You did it. You saved Pencoedtre High.",
      "But as the screens go dark, one final message flashes for just a second — so quick you almost miss it:",
      "\"PHASE 1 COMPLETE. PHASE 2 LOADING... THE MATHS DEPARTMENT AWAITS.\"",
      "TITAN isn't finished. Not by a long way. But that's a challenge for another day.",
    ],
    standard: [
      "TITAN shuts down! The lights turn green. Every door in the school unlocks.",
      "\"EVALUATION COMPLETE,\" TITAN announces. \"SUBJECT: EXCEPTIONAL. SHUTTING DOWN.\"",
      "Teachers and students cheer as they're freed. Mr. Watkins shakes your hand.",
      "Mrs. John says the SLT will see everything you did.",
      "You saved Pencoedtre High!",
      "But one last message flashes on screen: \"PHASE 1 COMPLETE. PHASE 2 LOADING...\"",
      "TITAN isn't finished yet. But that's for next time.",
    ],
    simple: [
      "You did it! TITAN shuts down! All the doors open!",
      "Everyone is free! You saved the school!",
      "But wait... a message says: \"Phase 2 coming soon...\"",
      "The adventure isn't over yet! Come back for more!",
    ],
    entry: [
      "YOU WON! The school is saved!",
      "All the doors are open! Everyone is free!",
      "But TITAN says \"Phase 2 coming soon...\"",
      "Come back for more adventures!",
    ],
  },

  // ─── DAILY STREAK ──────────────────────────────────────────
  dailyStreak: {
    welcome: {
      rich: "Welcome back, agent. TITAN's systems are still active in other parts of the school. Every workout you log weakens its hold. Keep training.",
      standard: "Welcome back! TITAN is still out there. Keep training to weaken it.",
      simple: "Welcome back! Keep exercising to beat TITAN!",
      entry: "Welcome back! Keep going!",
    },
    streakMilestones: {
      3: {
        rich: "Three days in a row. TITAN's algorithms are starting to notice your consistency. It's recalculating.",
        standard: "3-day streak! TITAN is noticing your effort. Keep it up!",
        simple: "3 days in a row! Great work!",
        entry: "3 days! Amazing!",
      },
      7: {
        rich: "A full week of training. In TITAN's own words: \"SUBJECT RESILIENCE: REMARKABLE.\" You're building something special.",
        standard: "7-day streak! TITAN called you \"remarkable.\" Incredible work!",
        simple: "7 days! You're a legend!",
        entry: "7 days! Legend!",
      },
      14: {
        rich: "Two weeks of unbroken training. TITAN's threat assessment of you has been upgraded to \"MAXIMUM PRIORITY.\" You're becoming unstoppable.",
        standard: "14-day streak! TITAN sees you as maximum priority. Unstoppable!",
        simple: "14 days! You're unstoppable!",
        entry: "14 days! UNSTOPPABLE!",
      },
      30: {
        rich: "Thirty days. A month of pure dedication. TITAN's records show no other subject has achieved this. You are the elite.",
        standard: "30-day streak! No one else has done this. You're the best!",
        simple: "30 days! The best ever!",
        entry: "30 DAYS! THE BEST!",
      },
    },
  },
};

export default narrationLines;
