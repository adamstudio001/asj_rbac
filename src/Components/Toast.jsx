import { X, Info } from "lucide-react";
import { useEffect } from "react";

export default function Toast({ type = "success", message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose?.(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: "bg-[#C7D2FE]/20 border border-[#5046e6] text-gray-800",
    error: "bg-[#FFCECE] border border-[#eb5758] text-gray-800",
  };

  const iconColor = {
    success: "text-[#5046e6]",
    error: "text-[#eb5758]",
  };

  return (
    <div
      className={`flex items-center justify-between w-[300px] rounded-xl px-4 py-3 shadow-md ${styles[type]}`}
    >
      <div className="flex items-center gap-2">
        <Info size={18} className={iconColor[type]} />
        <span className="font-inter text-[14px]">{message}</span>
      </div>
      <button onClick={onClose}>
        <X size={16} className="text-gray-500 hover:text-gray-700" />
      </button>
    </div>
  );
}
