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
    const ear = computeEAR(landmarks);
    const headNod = detectHeadNod(landmarks);
    const drowsy = ear < 0.25 || headNod;

    return { landmarks, ear, headNod, drowsy };
  }

  return runDetector;
}

function computeEAR(landmarks: NormalizedLandmark[]) {
  return 0.3; // placeholder
}

function detectHeadNod(landmarks: NormalizedLandmark[]) {
  return false; // placeholder
}