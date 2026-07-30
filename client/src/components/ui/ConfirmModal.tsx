import { useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDestructive = true,
}: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />
      
      {/* Modal Card */}
      <div className="relative group select-none w-[320px] flex flex-col p-4 items-center justify-center bg-gray-800 border border-gray-700 shadow-2xl rounded-2xl animate-in fade-in zoom-in duration-200">
        <div className="w-full">
          <div className="text-center p-3 flex-auto justify-center">
            {isDestructive ? (
              <svg fill="currentColor" viewBox="0 0 20 20" className="group-hover:animate-bounce w-12 h-12 flex items-center text-gray-600 fill-red-500 mx-auto" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" fillRule="evenodd" />
              </svg>
            ) : (
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="group-hover:animate-bounce w-12 h-12 flex items-center text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            
            <h2 className="text-xl font-bold py-4 text-gray-200">{title}</h2>
            <p className="font-medium text-sm text-gray-400 px-2">
              {message}
            </p>
          </div>
          <div className="p-2 mt-4 text-center flex justify-center gap-4 w-full">
            <button 
              onClick={onCancel}
              className="flex-1 bg-gray-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 border-gray-600 hover:border-gray-500 text-gray-300 rounded-full hover:shadow-lg hover:bg-gray-600 transition ease-in duration-300"
            >
              {cancelText}
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onCancel();
              }}
              className={`flex-1 px-5 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 rounded-full transition ease-in duration-300 ${
                isDestructive 
                  ? "bg-red-500 hover:bg-transparent border-red-500 text-white hover:text-red-500" 
                  : "bg-blue-600 hover:bg-transparent border-blue-600 text-white hover:text-blue-500"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
