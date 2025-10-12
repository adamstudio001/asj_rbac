import { AlertCircle } from "lucide-react";
import { X } from "lucide-react";

export default function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-4xl w-[360px] p-6 shadow-lg">
        <div className="flex justify-between mb-6">
          <div className="bg-red-100 text-red-600 p-3 rounded-full">
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
            Delete
          </h2>

          <p className="text-leftfont-inter font-normal text-[16px] text-[#475569] mb-5">
            Are you sure want to delete this user?
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full py-2 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full py-2 bg-[#1E2B50] text-white rounded-full font-medium hover:opacity-90 transition"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}