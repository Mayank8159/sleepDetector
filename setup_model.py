#!/usr/bin/env python3
"""
Download Mediapipe Face Landmarker Model for Driver Drowsiness Detector

The face_landmarker.task file must be obtained from the official Mediapipe sources.
This script attempts to download it from public mirrors.
"""

import urllib.request
import os
import sys
import json
from pathlib import Path

MODEL_DIR = Path("public/models")
MODEL_FILE = MODEL_DIR / "face_landmarker.task"
EXPECTED_SIZE_MIN = 50_000_000  # Minimum expected size (~80MB)

def download_file(url: str, destination: Path, description: str) -> bool:
    """Download a file and verify it."""
    try:
        print(f"  Downloading from {description}...")
        print(f"  URL: {url[:70]}...")
        
        req = urllib.request.Request(url)
        req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
        
        with urllib.request.urlopen(req) as response:
            content = response.read()
            
        # Verify it's not HTML
        if b'<!DOCTYPE' in content[:100] or b'<html' in content[:100]:
            print(f"  ✗ Received HTML instead of binary file")
            return False
            
        # Save the file
        destination.parent.mkdir(parents=True, exist_ok=True)
        with open(destination, 'wb') as f:
            f.write(content)
        
        size_mb = len(content) / (1024 * 1024)
        print(f"  ✓ Downloaded {size_mb:.2f} MB")
        
        if len(content) >= EXPECTED_SIZE_MIN:
            print(f"  ✓ File size looks correct!")
            return True
        else:
            print(f"  ⚠ File size is smaller than expected (~{len(content)/1024/1024:.1f}MB vs ~80MB)")
            return False
            
    except Exception as e:
        print(f"  ✗ Failed: {str(e)[:60]}")
        return False

def main():
    print("=" * 70)
    print("Mediapipe Face Landmarker Model Download")
    print("=" * 70)
    print()
    
    # Check if file already exists
    if MODEL_FILE.exists():
        size = MODEL_FILE.stat().st_size
        if size >= EXPECTED_SIZE_MIN:
            print(f"✓ Model file already exists: {size/1024/1024:.2f} MB")
            return 0
        else:
            print(f"⚠ Found existing file but it's too small ({size/1024/1024:.2f} MB)")
            print(f"  Attempting to download the correct file...\n")
    
    # Try multiple sources
    sources = [
        ("https://mediapipe.blob.core.windows.net/models/face_landmarker/face_landmarker.task", 
         "Azure Mediapipe Storage"),
        ("https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker.task",
         "Google Cloud Storage"),
    ]
    
    print("Attempting to download from available sources:\n")
    
    for url, description in sources:
        if download_file(url, MODEL_FILE, description):
            print("\n" + "=" * 70)
            print("SUCCESS! Model is ready.")
            print("=" * 70)
            print(f"Location: {MODEL_FILE.absolute()}")
            return 0
        print()
    
    # If automatic download failed, provide manual instructions
    print("=" * 70)
    print("⚠ Could not automatically download the model")
    print("=" * 70)
    print()
    print("OPTION 1: Manual Download from Official Source")
    print("-" * 70)
    print("1. Visit Mediapipe Face Landmarker documentation:")
    print("   https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker")
    print()
    print("2. Follow the 'Download the model' section")
    print()
    print("3. Look for 'face_landmarker.task' file")
    print()
    print("4. Save it to: public/models/face_landmarker.task")
    print()
    
    print("OPTION 2: Clone from Original Project")
    print("-" * 70)
    print("The original project may have the model file:")
    print("https://github.com/mayankk2/driver-drowsiness")
    print()
    print("OPTION 3: Using Python Mediapipe Package")
    print("-" * 70)
    print("The model can be programmatically obtained via:")
    print("  pip install mediapipe")
    print()
    print("Then in Python:")
    print("  import mediapipe.tasks.python as mp")
    print("  from mediapipe import solutions")
    print()
    
    print("=" * 70)
    return 1

if __name__ == "__main__":
    sys.exit(main())
