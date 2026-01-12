import { NormalizedLandmark } from "@mediapipe/tasks-vision";

function computeEAR(landmarks: NormalizedLandmark[], eye: "left" | "right" = "left"): number {
  // Mediapipe Face Landmarker landmark indices for eyes:
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

  // Euclidean distance helper
  const dist = (a: NormalizedLandmark, b: NormalizedLandmark) =>
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

  const ear =
    (dist(p2, p6) + dist(p3, p5)) /
    (2.0 * dist(p1, p4));

  return ear;
}