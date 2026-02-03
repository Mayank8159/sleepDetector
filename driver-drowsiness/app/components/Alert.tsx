"use client";

import { useEffect, useRef } from "react";

export default function Alert({ active }: { active: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const alertPlayedRef = useRef(false);

  useEffect(() => {
    if (active && !alertPlayedRef.current) {
      // Play audio alert when drowsiness is detected
      if (audioRef.current) {
        audioRef.current.currentTime = 0; // Reset to start
        audioRef.current.play().catch((err) => {
          console.log("Audio playback failed:", err);
        });
        alertPlayedRef.current = true;
      }
    } else if (!active) {
      // Stop audio when alert is no longer active
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      alertPlayedRef.current = false;
    }
  }, [active]);

  if (!active) return null;

  return (
    <>
      {/* Audio element for alert sound */}
      <audio
        ref={audioRef}
        src="/sounds/alert.mp3"
        loop={false}
        preload="auto"
      />

      {/* Visual Alert UI */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-600 px-6 py-3 rounded-xl shadow-xl animate-pulse z-50">
        <p className="text-lg font-bold tracking-wide text-center">
          ⚠️ DROWSINESS ALERT
        </p>
        <p className="text-xs text-center opacity-90">
          Please take a break
        </p>
      </div>
    </>
  );
}
