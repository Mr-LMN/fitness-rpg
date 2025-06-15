import sys
from pathlib import Path

try:
    from tortoise.api import TextToSpeech
    from tortoise.utils.audio import load_voices
    import torchaudio
except ImportError:
    print("The tortoise-tts package is required. Install it with:\n  pip install tortoise-tts")
    sys.exit(1)


def main():
    if len(sys.argv) < 3:
        print("Usage: python generate_tortoise_voice.py 'text to speak' output.wav [voice] [preset]")
        sys.exit(1)

    text = sys.argv[1]
    out_path = Path(sys.argv[2])
    voice = sys.argv[3] if len(sys.argv) > 3 else 'random'
    preset = sys.argv[4] if len(sys.argv) > 4 else 'high_quality'
    out_path.parent.mkdir(parents=True, exist_ok=True)

    tts = TextToSpeech()
    voice_samples, conditioning_latents = load_voices([voice])
    print("Generating audio... this may take a while")
    audio = tts.tts_with_preset(text, voice_samples=voice_samples, conditioning_latents=conditioning_latents, preset=preset)
    if isinstance(audio, list):
        audio = audio[0]
    torchaudio.save(str(out_path), audio.squeeze(0).cpu(), 24000)
    print(f"Saved voice over to {out_path}")


if __name__ == '__main__':
    main()
