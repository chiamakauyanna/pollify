import { useState } from "react";

const ConfirmButton = ({
  text,
  onConfirm,
  className,
  disabled,
}: {
  text: string;
  onConfirm: () => void;
  className?: string;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={className}
        disabled={disabled}
      >
        {text}
      </button>

      {/* Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <p className="text-lg font-semibold mb-4">
              Are you sure you want to proceed?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  onConfirm();
                  setIsOpen(false);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </>
  );
};

export default ConfirmButton;
