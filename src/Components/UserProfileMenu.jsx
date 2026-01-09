import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IoIosArrowDown } from "react-icons/io";
import view_user from "@/assets/view_profile.svg";
import logout from "@/assets/logout.svg";

export default function UserProfileMenu({
  user,
  isWrapped = false,
  reftext,
  onLogout = () => {},
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const popperRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();

    setPosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.right + window.scrollX - 192, // 192 = w-48
    });
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        popperRef.current &&
        !popperRef.current.contains(e.target) &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => setOpen(v => !v)}
        className={`max-w-[24rem]:w-full flex items-center gap-2`}
      >
        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-semibold">
          {user?.full_name?.[0]?.toUpperCase() ?? "?"}
        </div>

        <div className="flex items-center gap-1">
          <span ref={reftext} className="
            max-w-[200px]
            overflow-hidden
            text-ellipsis
            [display:-webkit-box]
            [-webkit-line-clamp:2]
            [-webkit-box-orient:vertical]
            leading-tight">
            {user?.full_name ?? "-"}
          </span>
          <IoIosArrowDown className="w-4 text-[#a5a5a5]" />
        </div>
      </div>

      {open &&
        createPortal(
          <div
            ref={popperRef}
            style={{
              top: position.top,
              left: position.left,
            }}
            className="
              fixed
              w-48
              rounded-xl
              bg-white
              shadow-lg
              border border-gray-100
              z-[9999]
              overflow-hidden
              animate-in fade-in zoom-in-95 p-2
            "
          >
            <button
              className="flex items-center gap-2 w-full px-4 py-3 font-medium text-[#424242] text-sm hover:bg-[#F4F4F4] rounded"
              onClick={() => {
                setOpen(false);
              }}
            >
              <img src={view_user} alt="view profile" />
              View Profile
            </button>

            <button
              className="flex items-center gap-2 w-full px-4 py-3 font-medium text-[#424242] text-sm hover:bg-[#F4F4F4] rounded"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
            >
              <img src={logout} alt="logout" />
              Logout
            </button>
          </div>,
          document.body
        )}
    </>
  );
}
