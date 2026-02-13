"""
Generate an alert.mp3 file for the drowsiness detector.
Creates a simple warning siren sound.
"""

import numpy as np
from pathlib import Path
import wave
import os

def create_alert_sound(filename: str, duration: float = 1.0, sample_rate: int = 44100):
    """
    Create a simple alert/siren sound and save as WAV (which browsers understand better).
    Then convert to MP3 if possible.
    """
    
    # Create directory if it doesn't exist
    Path(filename).parent.mkdir(parents=True, exist_ok=True)
    
    # Generate a siren-like sound using frequency modulation
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    
    # Frequency sweep from 800hz to 1200hz (ascending siren)
    freq_start = 800
    freq_end = 1200
    freq = np.linspace(freq_start, freq_end, len(t))
    
    # Generate the waveform
    phase = 2 * np.pi * np.cumsum(freq) / sample_rate
    waveform = 0.3 * np.sin(phase)  # Amplitude scaled to 0.3 to avoid clipping
    
    # Add a slight pulse/volume modulation for more alert-like sound
    pulse = 0.5 + 0.5 * np.sin(2 * np.pi * 4 * t)  # 4 Hz pulse
    waveform = waveform * pulse
    
    # Convert to 16-bit PCM
    waveform_int = np.int16(waveform * 32767)
    
    # Save as WAV first (more universal browser support)
    wav_filename = filename.replace('.mp3', '.wav')
    with wave.open(wav_filename, 'w') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(waveform_int.tobytes())
    
    print(f"✓ Created {wav_filename} ({os.path.getsize(wav_filename)/1024:.1f} KB)")
    
    # Try to convert to MP3 using pydub if available
    try:
        from pydub import AudioSegment
        audio = AudioSegment.from_wav(wav_filename)
        audio.export(filename, format="mp3", bitrate="192k")
        print(f"✓ Created {filename} ({os.path.getsize(filename)/1024:.1f} KB)")
        # Keep both formats
        return True
    except ImportError:
        print(f"⚠ pydub not available, keeping WAV format instead of MP3")
        return False
    except Exception as e:
        print(f"⚠ Could not convert to MP3: {e}")
        print(f"  Keeping WAV format: {wav_filename}")
        return False

if __name__ == "__main__":
    output_file = "public/sounds/alert.mp3"
    create_alert_sound(output_file, duration=1.0)
    
    # Verify file was created
    base_path = "public/sounds"
    if os.path.exists(base_path):
        print(f"\nFiles in {base_path}:")
        for file in os.listdir(base_path):
            file_path = os.path.join(base_path, file)
            size = os.path.getsize(file_path)
            print(f"  - {file} ({size/1024:.1f} KB)")
