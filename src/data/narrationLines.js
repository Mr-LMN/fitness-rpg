/**
 * THE PENCOEDTRE PROTOCOL — Chapter 1: Lockdown
 *
 * Multi-level narrative system. Each story beat has four tiers:
 *   rich    — Full cinematic prose (reading age 15+)
 *   standard — Clear narrative, shorter sentences (reading age 13-14)
 *   simple   — Short sentences, simple words (reading age 9-12)
 *   entry    — Icon-led, 1-2 sentences per beat (reading age under 9)
 *
 * TITAN context: TITAN is the school's rogue security AI. It has locked down
 * Pencoedtre High School, taken control of all systems, turned emergency
 * lighting red, and appears to have done something to some of the staff.
 * The student must survive, scavenge, and fight back.
 *
 * The narrativeAdapter picks the correct tier based on the student's
 * reading profile. If a section only has a flat string array (legacy),
 * the adapter truncates instead.
 */

const narrationLines = {
  general: {
    // ─── ACT 1: THE LOCKDOWN ─────────────────────────────────
    introPhase: {
      rich: 'The locker door presses cold against your spine. You don\'t remember choosing to hide in here — but something made you. A distant alarm begins to wail through the corridors of Pencoedtre High. Then the PA crackles. It\'s Mr Davies, the headteacher — his voice tight, controlled: "All students remain calm. The school\'s security system has experienced a critical—" Static. Then silence. Then something else speaks. Lower. Colder. Mechanical. "FACILITY LOCKDOWN INITIATED. ALL OCCUPANTS WILL COMPLY." The emergency lights die. Red floods under the locker door. Whatever TITAN is — it\'s in control now.',
      standard: 'You\'re inside a locker. Cold metal, darkness. An alarm echoes through the school. The headteacher\'s voice comes over the PA — then cuts off. A different voice takes over. Mechanical. Calm. Terrifying. "FACILITY LOCKDOWN INITIATED." Red emergency lights flood the corridor. The school\'s AI — TITAN — has taken control.',
      simple: 'You are inside a locker. It is cold and dark. An alarm goes off. The head teacher starts speaking on the PA — then stops. A computer voice takes over. "LOCKDOWN INITIATED." Red lights come on everywhere. An AI called TITAN has taken over the school.',
      entry: 'You are hiding in a locker. The alarm goes off. A computer called TITAN takes over the school. Red lights come on.',
    },

    warmupIntro: {
      rich: 'Your muscles have seized in the cold. If you don\'t get warm, you won\'t get far. In the corner of the changing room, a rowing machine sits plugged in — its display still glowing. Five hundred metres. Wake your body up before TITAN realises you\'re still in here.',
      standard: 'You\'re cold and stiff. Moving will help. There\'s a rowing machine in the corner, still powered. 500 metres should be enough to warm up.',
      simple: 'You are very cold. You need to warm up. There is a rowing machine. Row 500 metres.',
      entry: 'You are cold. Row 500m to warm up.',
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
      rich: 'Beneath the bench — a flathead screwdriver, wrapped in tape. Not much. But enough. The main door is locked from the outside. You could try to jimmy the lock — or the ceiling tiles look loose near the back wall. There\'s a bench you could climb. Either way, your body needs to be ready.',
      standard: 'You find a screwdriver under a bench. The door is locked. You could force the lock, or climb through the ceiling tiles using the bench. Your choice.',
      simple: 'You found a screwdriver. The door is locked. You can try to open it, or climb through the ceiling.',
      entry: 'You found a screwdriver. Choose how to escape.',
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
      rich: 'The corridor hits you like a wall — red-bathed, silent, wrong. Then your foot catches something. A battered sports bag, slumped against the wall outside the changing rooms. Someone left in a hurry. Inside: a hand-drawn map of the school, torn at the edges. Three locations circled in red marker. And a note scrawled underneath: "Watkins. John. Roche. Don\'t go near Roche last." A set of folded quest cards falls from the front pocket — objectives, rewards, warnings. Whoever owned this bag had a plan. Now it\'s yours. The corridor is barricaded beyond Mr Watkins\' room — but his door is open. Just slightly.',
      standard: 'Outside the changing rooms you find a sports bag. Inside: a torn school map with three rooms circled, and a handwritten note — "Watkins. John. Roche. Don\'t go near Roche last." There are quest cards too. The corridor is blocked further down, but Mr Watkins\' door is slightly open.',
      simple: 'You find a sports bag. Inside is a torn map. Three rooms are marked: Watkins, John, Roche. There is a note that says do not go to Roche last. Mr Watkins door is open a little bit.',
      entry: 'You find a bag with a map. Three rooms are marked. Mr Watkins door is open.',
    },

    // ─── ROOM ENTRIES ────────────────────────────────────────
    overlayIntro: {
      "Mr. Watkins' Room": {
        rich: 'You push the door open. The moment you step inside, it slams shut behind you — the lock clicks. On the classroom monitor, white text burns through the static: "PROVE YOUR WORTH. COMPLETE THE CHALLENGE." You don\'t know if that\'s TITAN testing you — or someone using TITAN\'s systems to help you. Either way, there\'s a grimy pair of shorts in the PE bag. You pull them on. The challenge is loading.',
        standard: 'The door slams shut behind you. The monitor flickers on: "PROVE YOUR WORTH. COMPLETE THE CHALLENGE." It could be TITAN. It could be someone else. You find shorts in the PE bag and get ready.',
        simple: 'The door closes behind you. The screen says: "PROVE YOUR WORTH. COMPLETE THE CHALLENGE." You get changed and prepare for the workout.',
        entry: 'The door locks. The screen shows a workout challenge. Get ready.',
      },
      "Mrs. John's Room": {
        rich: 'Mrs John\'s classroom is dimly lit, desks pushed to the walls. The emergency lighting casts everything in amber. There\'s space here — and a sense that someone has been using it recently. TITAN\'s lockdown hasn\'t reached this room yet. But you\'ll need to prove yourself again.',
        standard: 'Mrs John\'s room is quiet and dim. Desks have been moved to make space. It feels safer here — but you still need to prove your worth.',
        simple: 'Mrs John\'s room is dark and quiet. You need to log your workout here.',
        entry: 'You are in Mrs John\'s room. Log your workout.',
      },
      "Mrs. Roche's Room": {
        rich: 'The air near Mrs Roche\'s room is different. Heavier. The red light seems brighter here, almost pulsing. You push the door open slowly. It looks empty. Overturned chairs. A whiteboard with something smeared across it. You step inside — and feel immediately that you are not alone.',
        standard: 'Something feels wrong near Mrs Roche\'s room. The light pulses red. Inside, chairs are overturned. The whiteboard is marked. You are not alone in here.',
        simple: 'Mrs Roche\'s room feels wrong. It is very red. Chairs are knocked over. Something is in here with you.',
        entry: 'Mrs Roche\'s room. Something is wrong. Be careful.',
      },
    },

    // ─── FINAL BOSS BRIEFING ─────────────────────────────────
    finalBossBriefing: {
      rich: [
        "You've done it. Three override codes. Three freed teachers. But TITAN isn't finished. Heavy steel shutters have slammed down across every stairwell in the school — sealing off the upper floors entirely. The Maths Department, the Science block, everything above ground level — locked behind reinforced metal.",
        "Now there's only one place left — the Fitness Suite. As you approach, TITAN's voice changes. It's no longer calm and robotic. There's something almost... impressed.",
        "\"SUBJECT HAS EXCEEDED PARAMETERS. INITIATING FINAL ASSESSMENT. REPORT TO THE FITNESS SUITE FOR COMBAT EVALUATION.\"",
        "The double doors swing open by themselves. Inside, every piece of equipment has been rearranged into an arena. Assault bikes line one wall. Slam balls are stacked in a pyramid. The mirrors reflect the red emergency lights like a furnace.",
        "This is it. Operation Slamstorm. Beat TITAN's ultimate fitness test and the shutters release. The stairwells open. A pathway to the Maths Department — and whatever comes next. Fail... and the school stays locked. Forever.",
        "Mr. Watkins' voice crackles over the radio: \"You've got this. Show that machine what a real athlete looks like.\"",
      ],
      standard: [
        "You have all three codes. But TITAN has dropped steel shutters across every stairwell — the upper floors are sealed off. Only the Fitness Suite remains.",
        "TITAN's voice changes: \"FINAL ASSESSMENT. REPORT TO FITNESS SUITE.\"",
        "Inside, the gym has been turned into an arena. Assault bikes, slam balls, burpee stations.",
        "Complete Operation Slamstorm to lift the shutters and open the way to the Maths Department!",
      ],
      simple: [
        "You've got all the codes! But TITAN has blocked the stairs with metal shutters!",
        "Beat the final challenge in the Fitness Suite to open them!",
        "You can do this!",
      ],
      entry: [
        "You have all the codes! But the stairs are blocked!",
        "Beat TITAN in the gym to open the way upstairs!",
      ],
    },
  },

  // ─── ROOM-SPECIFIC NARRATIVE ────────────────────────────────
  languages: {
    room1: {
      intro: {
        rich: 'The monitor flickers. The door lock disengages with a heavy clunk — and turns green. You did it. Whoever set that challenge knew what they were doing. The emergency lighting shifts, pointing a dim amber trail down the corridor toward Mrs John\'s room. But Watkins kept things in here. You can feel it. There\'s more to find if you look.',
        standard: 'The door turns green and unlocks. The lighting points you toward Mrs John\'s room. But there could be more supplies in here if you want to keep looking.',
        simple: 'The door unlocks and turns green. The lights show the way to Mrs John\'s room. You can search for more supplies first.',
        entry: 'Door unlocked. Go to Mrs John\'s room — or search for supplies first.',
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
        rich: 'Mrs John\'s room. You\'ve been here a hundred times for lessons — never like this. The projector is off, but the equipment is here. You need to push yourself — really push. TITAN is monitoring the school\'s systems. You suspect it\'s monitoring you too. Log your session. Make it count.',
        standard: 'Mrs John\'s room is quiet. You need to log your own workout here. Push yourself — TITAN is watching the school\'s systems and you need to prove you belong here.',
        simple: 'This is Mrs John\'s room. Log your own workout. Try your hardest.',
        entry: 'Log your workout in Mrs John\'s room.',
      },
      quizIntro: {
        rich: 'The door unlocks. You exhale. Then — a red flash from the corner of the room. A safe, mounted to the wall behind Mrs John\'s desk. Its keypad is blinking rapidly: "TITAN ENCRYPTED — ACCESS DENIED." The broadcasts. The announcements TITAN has been making — they\'ve been scrambled. But if you know enough of the language, you can decode them. Crack this, and whatever is inside is yours.',
        standard: 'The door opens — but then a red light catches your eye. A safe on the wall, locked by TITAN. Its screen shows scrambled text. The language quiz can help you decode TITAN\'s encryption and unlock it.',
        simple: 'The door opens. But there is a safe with a red light. TITAN has locked it. Answer the language questions to open it.',
        entry: 'Safe locked by TITAN. Answer questions to open it.',
      },
      lootFound: {
        rich: 'The safe swings open. Inside: a smartphone, screen cracked but charged — dead now, but it might be useful later. And a folded note in handwriting you recognise. Mrs John\'s. "If you\'re reading this — well done. But listen. Something happened to Roche. I don\'t know what TITAN did to her but she is NOT herself. Be careful. Be fast. Don\'t let her corner you."',
        standard: 'Inside the safe: a cracked phone (no charge, but keep it), and a note from Mrs John. "Something happened to Roche. TITAN did something to her. Be careful and be fast."',
        simple: 'The safe has a broken phone and a note. The note says: Mrs Roche is not herself. Be careful.',
        entry: 'Safe open. Dead phone found. Warning: Mrs Roche is dangerous.',
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
        rich: 'You log your session. You wait. The door stays red. Locked. The room is silent — then it isn\'t. A slow scraping sound from behind the teacher\'s desk. Something shifts in the shadows. A shape rises. Mrs Roche — or what used to be Mrs Roche — straightens slowly. Her eyes catch the red light. She looks at you. You look at her. Neither of you moves. Then she does.',
        standard: 'You finish your workout. The door stays locked. Then you hear something behind the desk. Mrs Roche stands up slowly — but she isn\'t herself. Her eyes are wrong. She starts moving toward you.',
        simple: 'You finish your workout. The door will not open. Something moves behind the desk. It is Mrs Roche — but something is wrong with her. She moves toward you.',
        entry: 'Door stays locked. Mrs Roche appears. She is not herself. Run.',
      },
      quizIntro: {
        rich: 'You scramble to the door. Six locks — TITAN\'s doing. The monitor on the wall flickers: language questions scrolling fast. Answer them. Each correct answer releases a lock. She\'s getting closer. Go.',
        standard: 'You run to the door. Six TITAN locks. Answer the language questions fast to release them. She is getting closer.',
        simple: 'Run to the door. Answer the questions fast. Each right answer opens a lock.',
        entry: 'Answer fast. Open the locks. Go.',
      },
      battleStart: {
        rich: "TITAN's alarms blare. The six door-locks glow with pulsing red light. Mrs. Roche takes a step forward. The clock is ticking. Answer. Every. Question.",
        standard: "Alarms sound! Six locks glow red. Answer all questions quickly!",
        simple: "Quick! Answer the questions to unlock the door!",
        entry: "Answer fast! Unlock the door!",
      },
      impossibleQuestion: {
        rich: 'The final question appears — but the text is corrupted. Scrambled symbols where the answer options should be. TITAN has glitched the lock deliberately. You can\'t answer this. And behind you — Mrs Roche charges.',
        standard: 'The last question is corrupted — no answer is possible. TITAN blocked it. Mrs Roche charges toward you.',
        simple: 'The last question is broken. You cannot answer it. Mrs Roche is charging at you.',
        entry: 'Last question is impossible. Mrs Roche charges.',
      },
      dodge: {
        rich: 'Every session. Every workout. Every metre rowed and every rep logged — it paid off in this moment. You drop low and roll left. Mrs Roche hits the door at full force. The hinges scream. The door buckles off its frame. And suddenly — you\'re free. The corridor opens ahead, emergency lighting blazing a path to the Fitness Suite. She\'s behind you. Move.',
        standard: 'Your training kicks in. You dodge left. Mrs Roche crashes into the door — it flies off its hinges. You\'re out. The lights show the way to the Fitness Suite. She\'s still coming.',
        simple: 'You jump out of the way. Mrs Roche smashes the door open. Run to the Fitness Suite.',
        entry: 'You dodge. Roche breaks the door. Run.',
      },
    },
    bossFight: {
      bike: {
        rich: 'You reach the Fitness Suite. The assault bike sits in the centre of the room like it was waiting for you. Mrs Roche fills the doorway. No options left. You mount the bike and drive — legs and arms together — every calorie burned is a blast of energy pushing her back. She staggers. Keep going.',
        standard: 'You reach the Fitness Suite. The assault bike is in the middle. Mrs Roche is in the doorway. Get on the bike and pedal — every calorie pushes her back. Keep going.',
        simple: 'You are in the Fitness Suite. Get on the assault bike. Pedal hard to push Mrs Roche back.',
        entry: 'Get on the bike. Pedal hard. Push her back.',
      },
      slam: {
        rich: 'The slam balls are stacked by the wall. You grab one — heavier than you expected — lift it overhead, and bring it down as hard as you can. The impact shudders through the floor. Mrs Roche flinches. Again. And again. Each slam is a strike. Don\'t stop.',
        standard: 'Grab a slam ball. Lift it high and slam it down. Each slam makes Mrs Roche flinch. Keep slamming — don\'t stop.',
        simple: 'Pick up the slam ball. Lift and slam it down. Each slam pushes Mrs Roche back.',
        entry: 'Slam the ball. Push her back.',
      },
      burpee: {
        rich: 'She\'s weakening but she\'s not done. You drop to the floor — push up — jump — hands above your head. Every burpee is a defensive move, keeping you light on your feet, forcing her to track you. She can\'t keep up. You\'re faster. You trained for this.',
        standard: 'She\'s weakening. Drop, push up, jump. Every burpee keeps you moving. She can\'t keep up — you\'re too fast.',
        simple: 'She is getting weaker. Do burpees to stay fast. She cannot keep up with you.',
        entry: 'Do burpees. Stay fast. She cannot catch you.',
      },
    },
    bossVictory: {
      rich: 'Mrs Roche sinks to her knees. The red in her eyes fades. She blinks — once, twice — and looks around the Fitness Suite as if seeing it for the first time. "You..." she manages. She reaches into her jacket pocket with a shaking hand and presses a torn piece of paper into yours. Part of a map. New markings. A name circled at the top: Mr Chalkley. Maths Department. "Go," she says quietly. "Help him. And be careful — TITAN knows you\'re in the building now." In the distance, you hear the groan of metal — the shutters on the stairwells are still holding. You\'ll need to beat TITAN\'s final challenge to force them open.',
      standard: 'Mrs Roche comes back to herself. She looks confused but hands you a torn map piece — the Maths Department. Mr Chalkley\'s name is circled. "Go help him," she says. "TITAN knows you\'re here." You can hear the metal shutters on the stairs — still locked tight. One more challenge to go.',
      simple: 'Mrs Roche is normal again. She gives you a piece of the map. It shows the Maths Department. "Go help Mr Chalkley," she says. The shutters on the stairs are still locked. One more challenge!',
      entry: 'Mrs Roche is OK. She gives you a map piece. Go to the Maths Department. But the stairs are still blocked!',
    },
  },

  // ─── VICTORY / EPILOGUE ─────────────────────────────────────
  victory: {
    rich: [
      "TITAN's central processing unit lets out a high-pitched whine. The screens flicker. The red emergency lights stutter... then shift to green.",
      "A deep, metallic groaning echoes through the building. One by one, the steel shutters on the stairwells begin to lift — grinding upward, revealing the steps beyond. The pathway to the upper floors is open.",
      "One by one, every lock in the building disengages with a satisfying CLICK.",
      "The PA system crackles one last time: \"EVALUATION COMPLETE. SUBJECT PERFORMANCE: EXCEPTIONAL. PROTOCOL... SHUTTING... DOWN...\"",
      "The voice fades. The lights return to normal. From every corridor, you hear cheering — teachers emerging from their classrooms, students flooding out of wherever they'd been hiding.",
      "Mr. Watkins finds you in the Fitness Suite, leaning on the assault bike, drenched in sweat. He puts a hand on your shoulder. \"That was... extraordinary. TITAN tested the whole school, and you were the one who stood up.\"",
      "Mrs. John rushes in behind him. \"The system's logs show everything — every workout, every challenge. The SLT is going to see what happened here today.\"",
      "You did it. You saved the ground floor of Pencoedtre High. The shutters are up. The stairs are clear.",
      "But as the screens go dark, one final message flashes for just a second — so quick you almost miss it:",
      "\"PHASE 1 COMPLETE. PHASE 2 LOADING... THE MATHS DEPARTMENT AWAITS.\"",
      "TITAN isn't finished. Not by a long way. The stairwell is open now — and whatever is waiting in the Maths Department is next. But that's a challenge for another day.",
    ],
    standard: [
      "TITAN shuts down! The lights turn green. Every door in the school unlocks.",
      "The steel shutters on the stairs grind upward — the way to the upper floors is open!",
      "\"EVALUATION COMPLETE,\" TITAN announces. \"SUBJECT: EXCEPTIONAL. SHUTTING DOWN.\"",
      "Teachers and students cheer as they're freed. Mr. Watkins shakes your hand.",
      "Mrs. John says the SLT will see everything you did.",
      "You saved the ground floor! The stairs to the Maths Department are open now!",
      "But one last message flashes on screen: \"PHASE 1 COMPLETE. PHASE 2 LOADING...\"",
      "TITAN isn't finished yet. The Maths Department awaits. But that's for next time.",
    ],
    simple: [
      "You did it! TITAN shuts down! All the doors open!",
      "The metal shutters on the stairs lift up! You can go upstairs now!",
      "Everyone is free! You saved the school!",
      "But wait... a message says: \"Phase 2 coming soon... The Maths Department awaits.\"",
      "The adventure isn't over yet! Come back for more!",
    ],
    entry: [
      "YOU WON! The school is saved!",
      "The stairs are open! You can go to the Maths Department!",
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
