"use client";

interface AudioErrorNotificationProps {
  isVisible: boolean;
  onDismiss: () => void;
}

export default function AudioErrorNotification({
  isVisible,
  onDismiss,
}: AudioErrorNotificationProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-yellow-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md">
      <span className="text-xl">⚠️</span>
      <div className="flex-1">
        <p className="font-semibold">Audio Alert Failed</p>
        <p className="text-sm opacity-90">Check browser permissions or audio file availability</p>
      </div>
      <button
        onClick={onDismiss}
        className="ml-2 text-white hover:opacity-80 transition-opacity"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}
