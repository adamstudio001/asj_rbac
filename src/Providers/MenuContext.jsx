import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const MenuContext = createContext();
export const useMenu = () => useContext(MenuContext);

export const MenuProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const menuRef = useRef(null);
  const listenerRef = useRef(null);

  const showMenu = (x, y, onPaste = null) => {
    if(data){
        setMenuVisible(true);
        setMenuPosition({ x, y });
        listenerRef.current = typeof onPaste === "function" ? onPaste : null;
    }
  };

  // Hanya sembunyikan menu, tapi tetap pertahankan data
  const hideMenu = () => {
    setMenuVisible(false);
  };

  const handleMouseDown = (e) => {
    if (!menuRef.current) return;

    // jika klik di dalam menu, jangan set dragging
    if (menuRef.current.contains(e.target)) return;

    // klik di luar menu → sembunyikan menu
    setMenuVisible(false);

    setDragging(true);
    setDragOffset({
      x: e.clientX - menuPosition.x,
      y: e.clientY - menuPosition.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setMenuPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, dragOffset]);

  return (
    <MenuContext.Provider value={{ showMenu, hideMenu, data, setData }}>
      {children}

      {/* Context Menu */}
      {(menuVisible && data) && (
        <div
          ref={menuRef}
          onMouseDown={(e) => e.stopPropagation()} // supaya klik di menu tidak memicu hideMenu
          className="bg-white shadow-lg rounded-md py-1 w-36 z-50 absolute cursor-move"
          style={{ top: menuPosition.y, left: menuPosition.x }}
        >
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              if (typeof listenerRef.current === "function") {
                listenerRef.current(data);
              }
              hideMenu(); // sembunyikan menu tapi data tetap
            }}
          >
            Paste
          </button>

          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={()=>{
                hideMenu();
                setData(null);
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </MenuContext.Provider>
  );
};
