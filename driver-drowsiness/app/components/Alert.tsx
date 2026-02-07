"use client";

import { useAudioError } from './useAudioError';
import AudioErrorNotification from './AudioErrorNotification';

export default function Alert({ active }: { active: boolean }) {
  const { audioError, setAudioError } = useAudioError();

  if (!active) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-600 px-6 py-3 rounded-xl shadow-xl animate-pulse z-50">
        <p className="text-lg font-bold tracking-wide text-center">
          ⚠ DROWSINESS ALERT
        </p>
        <p className="text-xs text-center opacity-90">
          Please take a break
        </p>
      </div>
      <AudioErrorNotification
        isVisible={audioError}
        onDismiss={() => setAudioError(false)}
      />
    </>
  );
}
