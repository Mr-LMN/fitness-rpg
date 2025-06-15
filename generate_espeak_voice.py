import sys
import subprocess
from pathlib import Path


def main():
    if len(sys.argv) < 3:
        print("Usage: python generate_espeak_voice.py 'text to speak' output.wav")
        sys.exit(1)

    text = sys.argv[1]
    out_path = Path(sys.argv[2])
    out_path.parent.mkdir(parents=True, exist_ok=True)

    try:
        subprocess.run(['espeak', text, '-w', str(out_path)], check=True)
        print(f"Saved voice over to {out_path}")
    except FileNotFoundError:
        print('espeak is required. Install it with:\n  apt-get install espeak')
        sys.exit(1)


if __name__ == '__main__':
    main()
