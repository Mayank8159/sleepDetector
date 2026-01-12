import { FaceLandmarker, FilesetResolver, NormalizedLandmark } from "@mediapipe/tasks-vision";

export async function initDrowsinessDetector(video: HTMLVideoElement) {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
  );

  const detector = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: "/models/face_landmarker.task" },
    runningMode: "VIDEO",
    numFaces: 1,
  });

  async function runDetector() {
    if (!video || video.readyState < 2) return null;

    const nowMs = performance.now();
    const results = await detector.detectForVideo(video, nowMs);

    if (!results || !results.faceLandmarks?.length) return null;

    const landmarks = results.faceLandmarks[0];

    // Compute EAR for both eyes
    const leftEAR = computeEAR(landmarks, "left");
    const rightEAR = computeEAR(landmarks, "right");
    const ear = (leftEAR + rightEAR) / 2.0;

    const headNod = detectHeadNod(landmarks);
    const drowsy = ear < 0.25 || headNod;

    return { landmarks, ear, headNod, drowsy };
  }

  return runDetector;
}

// --- Eye Aspect Ratio (EAR) ---
function computeEAR(landmarks: NormalizedLandmark[], eye: "left" | "right" = "left"): number {
  // Mediapipe Face Landmarker indices for eyes:
  // Left eye: [33, 160, 158, 133, 153, 144]
  // Right eye: [362, 385, 387, 263, 373, 380]
  const indices = eye === "left"
    ? [33, 160, 158, 133, 153, 144]
    : [362, 385, 387, 263, 373, 380];

  const p1 = landmarks[indices[0]];
  const p2 = landmarks[indices[1]];
  const p3 = landmarks[indices[2]];
  const p4 = landmarks[indices[3]];
  const p5 = landmarks[indices[4]];
  const p6 = landmarks[indices[5]];

  const dist = (a: NormalizedLandmark, b: NormalizedLandmark) =>
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

  const ear =
    (dist(p2, p6) + dist(p3, p5)) /
    (2.0 * dist(p1, p4));

  return ear;
}

// --- Simple Head Nod Detection ---
let lastNoseY: number | null = null;
let nodCount = 0;

function detectHeadNod(landmarks: NormalizedLandmark[]): boolean {
  // Nose tip index in Mediapipe Face Landmarker
  const nose = landmarks[1]; // index 1 = nose tip

  if (lastNoseY === null) {
    lastNoseY = nose.y;
    return false;
  }

  const deltaY = nose.y - lastNoseY;
  lastNoseY = nose.y;

  // If nose moves down significantly, count as nod
  if (deltaY > 0.02) {
    nodCount++;
  }

  // If multiple nods detected in short time, flag drowsiness
  if (nodCount > 3) {
    nodCount = 0; // reset
    return true;
  }

  return false;
}