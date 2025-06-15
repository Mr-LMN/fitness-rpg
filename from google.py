from google.cloud import texttospeech

client = texttospeech.TextToSpeechClient()

input_text = texttospeech.SynthesisInput(text="The rusty safe emits a sharp click. You’ve unlocked something... but you're not alone.")

voice = texttospeech.VoiceSelectionParams(
    language_code="en-GB",  # British English
    name="en-GB-Wavenet-B",  # Choose voice
    ssml_gender=texttospeech.SsmlVoiceGender.MALE
)

audio_config = texttospeech.AudioConfig(
    audio_encoding=texttospeech.AudioEncoding.MP3
)

response = client.synthesize_speech(
    input=input_text, voice=voice, audio_config=audio_config
)

with open("safe_narration.mp3", "wb") as out:
    out.write(response.audio
