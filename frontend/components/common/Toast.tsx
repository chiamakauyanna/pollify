import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "error" | "success" | "info" | "warning";
  duration?: number;
  onClose?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  duration = 5000,
  onClose,
  actionLabel,
  onAction,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor =
    type === "error"
      ? "bg-red-500"
      : type === "success"
      ? "bg-green-500"
      : type === "warning"
      ? "bg-yellow-500"
      : "bg-blue-500";

  return (
    <div
      className={`${bgColor} px-4 py-3 rounded-lg text-white shadow-md flex justify-between items-center space-x-4 fixed top-5 right-5 z-50 min-w-[250px]`}
      role="alert"
    >
      <span className="truncate">{message}</span>
      <div className="flex gap-2">
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200"
          >
            {actionLabel}
          </button>
        )}
        <button
          onClick={onClose}
          className="bg-white text-black px-2 py-1 rounded hover:bg-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;
