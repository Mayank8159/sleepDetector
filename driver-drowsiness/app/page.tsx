"use client";
import { useEffect, useRef, useState } from "react";
import WebcamFeed from "./components/WebcamFeed";
import ThreeFace from "./components/ThreeFace";
import { initDrowsinessDetector } from "./components/DrowsinessDetector";

export default function Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [landmarks, setLandmarks] = useState<any>(null);
  const [drowsy, setDrowsy] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    let runDetector: (() => Promise<any>) | null = null;
    let animationId: number;

    async function init() {
      runDetector = await initDrowsinessDetector(videoRef.current!);

      const loop = async () => {
        if (runDetector) {
          const result = await runDetector();
          if (result) {
            setLandmarks(result.landmarks);
            setDrowsy(result.drowsy);
          }
        }
        animationId = requestAnimationFrame(loop);
      };
      loop();
    }

    init();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Driver Drowsiness Detection</h1>
      <WebcamFeed videoRef={videoRef as React.RefObject<HTMLVideoElement>} />
      <ThreeFace landmarks={landmarks} />
      {drowsy && <p className="text-red-600 font-bold">Drowsiness Detected!</p>}
    </div>
  );
}
