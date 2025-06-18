# Fitness RPG

Fitness RPG is a browser-based role-playing game built with React. Players progress through workout themed rooms and a short narrative. Completing each workout phase unlocks the next part of the story until the final boss fight.

## Project Goal

The goal of this project is to combine a simple RPG style narrative with fitness activities. Players track exercises, face mini quizzes and earn rewards as they progress through different phases.

## Setup

1. Install [Node.js](https://nodejs.org/) (version 16 or higher is recommended).
2. Run `npm install` from the project root to install dependencies.
3. Start the development server with `npm run dev`.
4. Open the provided local address (usually `http://localhost:5173`) in your browser to play.

To create a production build, run `npm run build` and serve the resulting `dist` directory with your preferred static server.

### Deploying to Firebase Hosting

1. Install the [Firebase CLI](https://firebase.google.com/docs/cli) globally and log in:

   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. Initialize Firebase in the project directory:

   ```bash
   firebase init
   ```

   When prompted for the hosting setup, **set `dist` as the public directory** and enable single-page app rewriting.

3. Build the project and deploy:

   ```bash
   npm run build
   firebase deploy
   ```

### Voice Over Generation (optional)

This project can play voice over audio generated with [Bark](https://github.com/suno-ai/bark). To enable this:

1. Install Bark and its dependencies:

   ```bash
   pip install git+https://github.com/suno-ai/bark.git
   ```

2. Use the provided `generate_voice.py` script to create `.wav` files from text:

   ```bash
   python generate_voice.py "Your text here" public/voices/intro-phase.wav
   ```

3. Place the generated files in `public/voices` and the game will play them during key scenes.

### Alternative lightweight TTS with eSpeak

If you prefer a smaller solution without downloading the large Bark models, you
can generate voices using [eSpeak](https://espeak.sourceforge.net/).

1. Install eSpeak:

   ```bash
   sudo apt-get install espeak
   ```

2. Run the provided `generate_espeak_voice.py` script:

   ```bash
   python generate_espeak_voice.py "Your text here" public/voices/your-file.wav
   ```

The generated `.wav` file can be placed in `public/voices` just like Bark audio files.

### High quality TTS with Tortoise

If you have a GPU available you can generate more natural voices using [Tortoise TTS](https://github.com/neonbjb/tortoise-tts).

1. Install Tortoise:

   ```bash
   pip install tortoise-tts
   ```

2. Run the provided `generate_tortoise_voice.py` script:

   ```bash
   python generate_tortoise_voice.py "Your text here" public/voices/your-file.wav [voice-name] [preset]
   ```

   `voice-name` selects one of the bundled voices (defaults to `random`).
   The optional `preset` argument controls quality (`fast`, `standard`, `high_quality`).

## Accessibility

The character creation screen includes an **Enhanced Reading Mode** toggle for
users with dyslexia or vision impairments. When enabled, the entire game uses
a higher contrast background and larger fonts to improve readability, including
all narration and workout cards.

The same screen now also offers a **Text to Speech** toggle. When enabled,
game narration and instructions are automatically read aloud using Google's
Text-to-Speech API. Set the `VITE_GOOGLE_TTS_KEY` environment variable with
your API key when running the app. If no key is provided or the request fails,
the app will fall back to the browser's built-in `speechSynthesis` if
available. The voice defaults to a male British accent at a slower rate,
providing a clear, serious delivery for players who struggle with reading or
who are visually impaired.

## Character Creation

When creating your hero you must choose a workout focus of **cardio** or **strength**. Selecting cardio adjusts the logger to track duration and distance, while strength tracks sets, reps and weight. The default cardio exercise suggestions are the machines available in the gym and are defined in [`src/data/cardioExercises.js`](src/data/cardioExercises.js). Strength exercises are organised under the categories **Core**, **Legs**, **Chest**, **Back**, **Arms** and **Functional**.

