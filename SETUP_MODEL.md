# Mediapipe Face Landmarker Model Setup

The Driver Drowsiness Detector requires the Mediapipe Face Landmarker model file (`face_landmarker.task`) to function. This file must be placed in the `public/models/` directory.

## Quick Setup

Run the automatic setup script:
```bash
python setup_model.py
```

If the automatic download doesn't work, follow one of the manual methods below.

---

## Manual Setup Methods

### Method 1: Download from Official Mediapipe (Recommended)

1. **Visit the official Mediapipe Face Landmarker page:**
   - https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker

2. **Download the model file:**
   - Look for the "Download the model" section
   - Download the `face_landmarker.task` file (Web version, ~80MB)

3. **Place the file:**
   - Save the file to: `public/models/face_landmarker.task`
   - The directory structure should be:
     ```
     sleepDetector/
     ├── public/
     │   └── models/
     │       └── face_landmarker.task    ← Place file here
     └── driver-drowsiness/
     ```

### Method 2: Clone from Original Project

The original project repository may have setup instructions:
```bash
git clone https://github.com/mayankk2/driver-drowsiness.git
```

Check if they provide the model file or download instructions.

### Method 3: Using Google MediaPipe Services

Visit Google's MediaPipe Studio to access models:
https://mediapipe-studio-prod.web.app/

You can download models directly from the web interface.

### Method 4: Using Python Package

If you have the Python Mediapipe package installed, you can access the model programmatically:

```bash
pip install mediapipe
```

Then download/export the model using Python.

---

## Verification

After placing the model file, verify it's in the correct location:

```bash
ls -la public/models/
# Should show face_landmarker.task with size ~80MB (83,835,087 bytes)
```

Or on Windows:
```powershell
Get-Item public/models/face_landmarker.task
```

---

## Troubleshooting

### If the app still doesn't work after placing the file:

1. **Check file size:** The model should be approximately 80-84 MB
   - If it's much smaller, it may be corrupted or incomplete

2. **Verify path:** Make sure the file is at exactly:
   - `public/models/face_landmarker.task`
   - Not in a subdirectory or with a different name

3. **Check permissions:** Ensure the file is readable by the web application

4. **Browser console:** Check browser developer tools (F12) for specific error messages

5. **Restart the app:**
   ```bash
   npm run dev
   ```

---

## Additional Resources

- **Mediapipe Documentation:** https://developers.google.com/mediapipe
- **Face Landmarker Guide:** https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker
- **Original Project:** https://github.com/mayankk2/driver-drowsiness
- **Live Demo:** https://sleep-detector-two.vercel.app/

---

## Technical Details

The Face Landmarker model is used to:
- Detect 478 facial landmarks in real-time
- Calculate Eye Aspect Ratio (EAR) for drowsiness detection
- Detect head nod patterns
- Process video from the user's webcam

The model is loaded in: `driver-drowsiness/app/components/DrowsinessDetector.ts`
