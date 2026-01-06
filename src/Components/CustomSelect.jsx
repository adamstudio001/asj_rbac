import React, { useState, useRef, useEffect } from "react";
import { createPopper } from "@popperjs/core";
import { TiArrowSortedDown } from "react-icons/ti";
import { cn } from "@/lib/utils";
import { isEmpty } from "@/Common/Utils";
import { useAuth } from "@/Providers/AuthProvider";
import axios from "axios";

const CustomSelect = React.memo(function CustomSelect({
  label,
  records = null,
  sourceUrl="",
  value,
  placeholder = "",
  onChange,
  disabled = false,
  error
}) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const popperInstance = useRef(null);

  const [loading, setLoading] = useState(false);
  const [sources, setSource] = useState(records ?? []);

  async function featchSource(){
    if(records==null && isEmpty(sourceUrl) || records!=null && !isEmpty(sourceUrl)){
      throw new Error("invalid argument");
    }

    setLoading(true);
    try {
      const res = await axios.get(sourceUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      const body = res.data;
      console.log(body)

      if (body.data) {
        setSource(body.data);
      }
    } catch (err) {
      console.error(err);
      setSource([]);
    } finally {
      setLoading(false);
    }
  }

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
    if(records==null && !isEmpty(sourceUrl)){
      featchSource();
    }
    
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
          "w-full flex justify-between items-center rounded-md border-[1.2px] px-3 py-4 text-sm text-left border-black bg-white text-[#1B2E48] disabled:cursor-not-allowed disabled:text-black disabled:border-gray-400"
        )}
      >
        <span>{value?.label || placeholder}</span>
        {loading?  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>:<TiArrowSortedDown className="w-4 h-4 text-black" />}
      </button>

      {(open && !loading) && (
        <div
          ref={dropdownRef}
          className="bg-white border border-[1.2px] border-black rounded-md shadow-lg z-10"
          // style={{ minWidth: buttonRef.current?.offsetWidth }}
        >
          <ul className="max-h-56 overflow-auto py-1">
            {sources.map((record) => {
              const isSelected = value?.identifier === record.identifier;
              return (
                <li
                  key={record.identifier}
                  onClick={() => {
                    onChange(record);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 mx-1 px-2 py-2 rounded cursor-pointer hover:bg-[#f4f4f4] text-sm"
                >
                  <div className="flex items-center space-x-2">
                    {isSelected ? (
                      <div className="relative w-5 h-5">
                        <div className="absolute inset-0 rounded-full border-2 border-black bg-white"></div>
                        <div className="absolute inset-[4px] rounded-full bg-black"></div>
                      </div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-black rounded-full"></div>
                    )}
                    <span>{record.label}</span>
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
});

export default CustomSelect;