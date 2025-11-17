interface ToastProps {
  message: string;
  type?: "success" | "error";
}

const Toast = ({ message, type = "success" }: ToastProps) => {
  return (
    <div
      className={`fixed bottom-6 right-6 px-4 py-2 rounded shadow text-white font-bold transition
        ${type === "success" ? "bg-purple-500" : "bg-red-500"}`}
    >
      {message}
    </div>
  );
};

export default Toast;
