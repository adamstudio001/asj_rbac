import React, { useState, useRef, useEffect } from "react";
import { createPopper } from "@popperjs/core";

export function TableActionMenuBase({
  children,
  placement = "right-start",
  offset = [0, 5],
  trigger,
  menuClassName = "",
}) {
  const [showMenu, setShowMenu] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (showMenu && buttonRef.current && menuRef.current) {
      const popper = createPopper(buttonRef.current, menuRef.current, {
        placement,
        modifiers: [
          {
            name: "offset",
            options: { offset },
          },
        ],
      });

      return () => popper.destroy();
    }
  }, [showMenu, placement, offset]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-flex">
      <button
        ref={buttonRef}
        onClick={() => setShowMenu((v) => !v)}
        type="button"
      >
        {trigger({ open: showMenu })}
      </button>

      {showMenu && (
        <div
          ref={menuRef}
          className={`z-50 bg-white border border-gray-200 rounded-lg shadow-md py-2 w-40 w-[max-content] ${menuClassName}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
