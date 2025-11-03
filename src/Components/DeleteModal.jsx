import { AlertCircle } from "lucide-react";
import { X } from "lucide-react";

export default function DeleteModal({ titleMessage, message, isOpen, onClose, onConfirm, isLoading = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-4xl w-[360px] p-6 shadow-lg">
        <div className="flex justify-between mb-6">
          <div className="bg-[#F43F5E] text-white p-3 rounded-full">
            <AlertCircle size={28} />
          </div>

          <button
            onClick={onClose}
            className="top-4 right-4 w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-left font-inter font-bold text-[20px] text-[#1E293B] mb-2">
            {titleMessage}
          </h2>

          <p className="text-leftfont-inter font-normal text-[16px] text-[#475569] mb-10">
            {message}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-2 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full py-2 bg-[#1E2B50] text-white rounded-full font-medium hover:opacity-90 transition"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}