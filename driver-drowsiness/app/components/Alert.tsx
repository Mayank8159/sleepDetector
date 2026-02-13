"use client";
import { useEffect, useRef } from "react";

export default function Alert({ active }: { active: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastPlayedRef = useRef<number>(0);

  useEffect(() => {
    if (active && audioRef.current) {
      const now = Date.now();
      // Throttle audio playback to avoid playing multiple times in quick succession
      if (now - lastPlayedRef.current > 500) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((err) => {
          // Silently handle audio playback errors (user may not have granted permission)
          console.debug("Audio playback failed:", err.message);
        });
        lastPlayedRef.current = now;
      }
    }
  }, [active]);

  if (!active) return null;

  return (
    <>
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/alert.mp3" type="audio/mpeg" />
        <source src="/sounds/alert.wav" type="audio/wav" />
      </audio>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-600 px-6 py-3 rounded-xl shadow-xl animate-pulse z-50">
        <p className="text-lg font-bold tracking-wide text-center">
          ⚠ DROWSINESS ALERT
        </p>
        <p className="text-xs text-center opacity-90">
          Please take a break
        </p>
      </div>
    </>
  );
}
