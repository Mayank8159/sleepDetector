import { useState, useCallback } from 'react';

interface UseAudioErrorReturn {
  audioError: boolean;
  setAudioError: (error: boolean) => void;
  triggerAudioError: () => void;
}

export function useAudioError(): UseAudioErrorReturn {
  const [audioError, setAudioError] = useState(false);

  const triggerAudioError = useCallback(() => {
    setAudioError(true);
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      setAudioError(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return {
    audioError,
    setAudioError,
    triggerAudioError,
  };
}
