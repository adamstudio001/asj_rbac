import React, { useState, useRef, useEffect } from "react";
import { createPopper } from "@popperjs/core";
import { TiArrowSortedDown } from "react-icons/ti";
import { cn } from "@/lib/utils";

export default function CustomSelect({
  label,
  records,
  value,
  placeholder = "",
  onChange,
  disabled = false,
  error
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const popperInstance = useRef(null);

  useEffect(() => {
    if (open && buttonRef.current && dropdownRef.current) {
      popperInstance.current = createPopper(buttonRef.current, dropdownRef.current, {
        placement: "bottom-start", // selalu di bawah
        modifiers: [
          {
            name: "offset",
            options: { offset: [0, 4] },
          },
          {
            name: "flip",
            enabled: false, // nonaktifkan flip agar tidak pindah ke atas
          },
          {
            name: "preventOverflow",
            options: { padding: 8 },
          },
        ],
      });
    }

    return () => {
      if (popperInstance.current) {
        popperInstance.current.destroy();
        popperInstance.current = null;
      }
    };
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex-1 min-w-[250px]">
      <label className="block text-sm font-medium text-[#1B2E48] mb-1">
        {label}
      </label>

      <button
        type="button"
        ref={buttonRef}
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={cn(
          "w-full flex justify-between items-center rounded-md border-[1.2px] px-3 py-4 text-sm text-left border-black bg-white text-[#1B2E48] disabled:cursor-not-allowed disabled:text-gray-500 disabled:bg-gray-100 disabled:border-gray-400"
        )}
      >
        <span>{value || placeholder}</span>
        <TiArrowSortedDown className="w-4 h-4 text-black" />
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="bg-white border border-[1.2px] border-black rounded-md shadow-lg z-10"
          // style={{ minWidth: buttonRef.current?.offsetWidth }}
        >
          <ul className="max-h-56 overflow-auto py-1">
            {records.map((record) => {
              const isSelected = value === record;
              return (
                <li
                  key={record}
                  onClick={() => {
                    onChange(record);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[#f4f4f4] text-sm"
                >
                  <div className="flex items-center space-x-2">
                    {isSelected ? (
                      <div className="relative w-6 h-6">
                        <div className="absolute inset-0 rounded-full border-2 border-black bg-white"></div>
                        <div className="absolute inset-[4px] rounded-full bg-black"></div>
                      </div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-black rounded-full"></div>
                    )}
                    <span>{record}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
