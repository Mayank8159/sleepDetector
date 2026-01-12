"use client";
import { useEffect, useRef, useState } from "react";
import WebcamFeed from "./components/WebcamFeed";
import ThreeFace from "./components/ThreeFace";
import { initDrowsinessDetector } from "./components/DrowsinessDetector";

export default function Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [landmarks, setLandmarks] = useState<any>(null);
  const [ear, setEar] = useState<number | null>(null);
  const [headNod, setHeadNod] = useState<boolean>(false);
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
            setEar(result.ear);
            setHeadNod(result.headNod);
            setDrowsy(result.drowsy);
          }
        }
        animationId = requestAnimationFrame(loop);
      };
      loop();
    }

    init();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="p-4 flex flex-col items-center gap-6 w-full max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-center">
        Driver Drowsiness Detection
      </h1>

      {/* Webcam feed */}
      <div className="w-full flex justify-center">
        <WebcamFeed videoRef={videoRef as React.RefObject<HTMLVideoElement>} />
      </div>

      {/* 3D Face visualization */}
      <div className="w-full">
        <ThreeFace landmarks={landmarks} />
      </div>

      {/* Detected data panel */}
      <div className="w-full bg-gray-900 text-white rounded-lg p-4 flex flex-col md:flex-row justify-around items-center gap-4">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-400">Eye Aspect Ratio (EAR)</span>
          <span className="text-lg font-semibold">
            {ear !== null ? ear.toFixed(3) : "--"}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-400">Head Nod</span>
          <span className="text-lg font-semibold">
            {headNod ? "Yes" : "No"}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-400">Drowsiness</span>
          <span
            className={`text-lg font-bold ${
              drowsy ? "text-red-500" : "text-green-400"
            }`}
          >
            {drowsy ? "Detected!" : "Normal"}
          </span>
        </div>
      </div>
    </div>
  );
}