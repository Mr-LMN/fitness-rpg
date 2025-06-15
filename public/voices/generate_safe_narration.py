from google.cloud import texttospeech

# Set up the client (uses your JSON key from environment variable)
client = texttospeech.TextToSpeechClient()

# The narration line you want spoken
narration_text = "You spot a glint of metal under the locker. It's a screwdriver."

# Build the input request
synthesis_input = texttospeech.SynthesisInput(text=narration_text)

# Choose voice and audio config
voice = texttospeech.VoiceSelectionParams(
    language_code="en-GB",
    name="en-GB-News-G",
    ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
)

audio_config = texttospeech.AudioConfig(
    audio_encoding=texttospeech.AudioEncoding.MP3
)

# Make the request to generate speech
response = client.synthesize_speech(
    input=synthesis_input,
    voice=voice,
    audio_config=audio_config
)

# Save to file
with open("safe_narration.mp3", "wb") as out:
    out.write(response.audio_content)

print("✅ Narration generated and saved as safe_narration.mp3")
