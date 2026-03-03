"use client";
import { useEffect, useRef } from "react";

export default function Alert({ active }: { active: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/alert.mp3');
    }

    if (active) {
      audioRef.current.play().catch(error => console.error("Audio playback failed:", error));
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Cleanup function to stop audio if the component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-600 px-6 py-3 rounded-xl shadow-xl animate-pulse z-50 text-white">
      <p className="text-lg font-bold tracking-wide text-center">
        ⚠ DROWSINESS ALERT
      </p>
      <p className="text-xs text-center opacity-90">
        Please take a break
      </p>
    </div>
  );
}