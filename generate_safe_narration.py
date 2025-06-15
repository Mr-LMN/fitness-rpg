from tortoise.api import TextToSpeech
from tortoise.utils.audio import load_voice, load_voices
import torchaudio

# Setup model
tts = TextToSpeech()

# Use a high quality preset
preset = "high_quality"

# Select a built-in voice
voice = "daniel"

# Line of narration to speak
text = "The rusty digital safe emits a sharp click. You've unlocked something... but you're not alone."

# Generate speech
samples = load_voice(voice)
voices = load_voices()
audio = tts.tts(text, voice_samples=samples, conditioning_latents=voices[voice], preset=preset)

# Write the result to disk
output = "narration_safe_unlocked.wav"
torchaudio.save(output, audio.squeeze(0).cpu(), 24000)
print(f"\u2705 Narration complete: {output}")
