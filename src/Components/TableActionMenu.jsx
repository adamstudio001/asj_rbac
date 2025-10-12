import React, { useState, useRef, useEffect } from "react";
import { createPopper } from "@popperjs/core";
import { IoMdMore } from "react-icons/io";

export function TableActionMenu({children}){
  const [showMenu, setShowMenu] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (showMenu && buttonRef.current && menuRef.current) {
      createPopper(buttonRef.current, menuRef.current, {
        placement: "right-start",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 5],
            },
          },
        ],
      });
    }
  }, [showMenu]);

  // Tutup menu jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center space-x-3 relative">
        <button
            ref={buttonRef}
            onClick={() => setShowMenu(!showMenu)}
            className={`group w-6 h-6 rounded-md border transition ${showMenu? "bg-[#1e2938] text-white" : "bg-white text-gray-700 hover:bg-[#1e2938] hover:text-white" }`}>
            <IoMdMore className={`w-[-webkit-fill-available] text-lg transition ${showMenu ? "text-white" : "group-hover:text-white"}`} />
        </button>

      {/* <span className="font-medium text-gray-800">{name}</span> */}

      {showMenu && (
        <div
          ref={menuRef}
          className="z-50 bg-white border border-gray-200 rounded-lg shadow-md py-2 w-40"
        >
          {children}
        </div>
      )}
    </div>
  );
};