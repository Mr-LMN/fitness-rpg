import sys
from pathlib import Path

try:
    from bark import SAMPLE_RATE, generate_audio, preload_models
    from scipy.io.wavfile import write as write_wav
except ImportError:
    print("The bark package is required. Install it with:\n  pip install git+https://github.com/suno-ai/bark.git")
    sys.exit(1)


def main():
    if len(sys.argv) < 3:
        print("Usage: python generate_voice.py 'text to speak' output.wav")
        sys.exit(1)

    text = sys.argv[1]
    out_path = Path(sys.argv[2])
    out_path.parent.mkdir(parents=True, exist_ok=True)

    print("Loading models (this may take a while)...")
    preload_models()

    print("Generating audio...")
    audio = generate_audio(text)
    write_wav(out_path, SAMPLE_RATE, audio)
    print(f"Saved voice over to {out_path}")


if __name__ == "__main__":
    main()
