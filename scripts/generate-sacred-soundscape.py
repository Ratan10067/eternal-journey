#!/usr/bin/env python3
"""Create an original, loop-safe instrumental ambience for THE ETERNAL JOURNEY.

The composition is deliberately synthesized from oscillators: a warm drone,
breath-like flute phrases, and sparse bell partials. It contains no samples or
downloaded material. Frequencies and phrase lengths are chosen to meet again at
the loop boundary without a discontinuity.
"""

from pathlib import Path
import wave

import numpy as np


SAMPLE_RATE = 22_050
PHRASE_SECONDS = 12
PHRASE_COUNT = 7
DURATION_SECONDS = PHRASE_SECONDS * PHRASE_COUNT
OUTPUT = Path(__file__).resolve().parents[1] / 'public' / 'audio' / 'eternal-journey-instrumental.wav'


def note_envelope(age: np.ndarray, duration: float, attack: float = 0.22) -> np.ndarray:
    """A rounded attack/release leaves every phrase silent at its boundaries."""
    release = min(0.7, duration * 0.38)
    attack_curve = np.sin(np.pi * np.clip(age / attack, 0, 1) / 2) ** 2
    release_curve = np.sin(np.pi * np.clip((duration - age) / release, 0, 1) / 2) ** 2
    return attack_curve * release_curve


def flute_voice(age: np.ndarray, frequency: float) -> np.ndarray:
    """A mellow harmonic blend; intentionally soft rather than a literal flute sample."""
    phase = 2 * np.pi * frequency * age
    breath = 0.018 * np.sin(2 * np.pi * 0.32 * age)
    return (
        0.78 * np.sin(phase + breath)
        + 0.16 * np.sin(2 * phase + 0.25)
        + 0.06 * np.sin(3 * phase - 0.4)
    )


def main() -> None:
    frame_count = SAMPLE_RATE * DURATION_SECONDS
    time = np.arange(frame_count, dtype=np.float64) / SAMPLE_RATE

    # 144 Hz Sa, its fifth, and octaves. Each completes an integer number of
    # cycles over 84 seconds, so the drone meets itself cleanly at the loop edge.
    gentle_swell = 0.93 + 0.07 * np.sin(2 * np.pi * time / PHRASE_SECONDS)
    drone = gentle_swell * (
        0.115 * np.sin(2 * np.pi * 144 * time)
        + 0.048 * np.sin(2 * np.pi * 216 * time + 0.18)
        + 0.034 * np.sin(2 * np.pi * 288 * time - 0.12)
        + 0.012 * np.sin(2 * np.pi * 432 * time + 0.4)
    )

    melody = np.zeros_like(time)
    # A short, unhurried pentatonic phrase. It repeats exactly every 12 seconds.
    # Frequencies are whole-Hz harmonic relatives of the drone for loop safety.
    phrase_notes = [
        (0.85, 2.15, 288.0, 0.055),
        (3.25, 1.65, 324.0, 0.046),
        (5.20, 2.30, 360.0, 0.052),
        (8.20, 1.45, 324.0, 0.042),
        (10.00, 1.25, 288.0, 0.038),
    ]
    for phrase in range(PHRASE_COUNT):
        phrase_start = phrase * PHRASE_SECONDS
        for offset, duration, frequency, gain in phrase_notes:
            start = phrase_start + offset
            active = (time >= start) & (time < start + duration)
            age = time[active] - start
            melody[active] += gain * note_envelope(age, duration) * flute_voice(age, frequency)

    bells = np.zeros_like(time)
    for phrase in range(PHRASE_COUNT):
        start = phrase * PHRASE_SECONDS + 0.12
        active = (time >= start) & (time < start + 4.6)
        age = time[active] - start
        decay = np.exp(-age * 1.35) * (1 - np.exp(-age * 15))
        bell = (
            np.sin(2 * np.pi * 1152 * age)
            + 0.48 * np.sin(2 * np.pi * 1728 * age + 0.3)
            + 0.19 * np.sin(2 * np.pi * 2304 * age + 0.7)
        )
        bells[active] += 0.017 * decay * bell

    # A very slow stereo drift gives width without creating a moving, distracting effect.
    left = drone * 1.01 + melody * (0.98 + 0.02 * np.sin(2 * np.pi * time / 24)) + bells * 0.96
    right = drone * 0.99 + melody * (1.02 - 0.02 * np.sin(2 * np.pi * time / 24)) + bells * 1.04
    stereo = np.column_stack((left, right))
    stereo = np.tanh(stereo * 1.35) * 0.76
    pcm = (stereo * np.iinfo(np.int16).max).astype('<i2')

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(OUTPUT), 'wb') as output:
        output.setnchannels(2)
        output.setsampwidth(2)
        output.setframerate(SAMPLE_RATE)
        output.writeframes(pcm.tobytes())

    print(f'Wrote {OUTPUT} ({DURATION_SECONDS}s, {SAMPLE_RATE} Hz stereo WAV)')


if __name__ == '__main__':
    main()
