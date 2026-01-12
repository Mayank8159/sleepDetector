"use client";
import { useEffect } from "react";

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>;
}

export default function WebcamFeed({ videoRef }: Props) {
  useEffect(() => {
    async function initCamera() {
      if (!videoRef.current) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      } catch (err) {
        console.error("Cannot access webcam:", err);
      }
    }

    initCamera();
  }, [videoRef]);

  return (
    <video
      ref={videoRef}
      className="w-full max-w-md mx-auto rounded-lg border"
      autoPlay
      muted
      playsInline
    />
  );
}
