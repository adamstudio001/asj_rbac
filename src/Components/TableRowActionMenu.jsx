import React, { useState, useRef, useEffect } from "react";
import { createPopper } from "@popperjs/core";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

export function TableRowActionMenu({ refId, children, rowCells }) {
  const [showMenu, setShowMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuRef = useRef(null);
  const lastClickTime = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (showMenu && anchorEl && menuRef.current) {
      createPopper(anchorEl, menuRef.current, {
        placement: "right-start",
        modifiers: [{ name: "offset", options: { offset: [8, 0] } }],
      });
    }
  }, [showMenu, anchorEl]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !(anchorEl && anchorEl.contains(e.target))
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [anchorEl]);

  const handleCellClick = (e) => {
    e.stopPropagation();

    const now = Date.now();
    const diff = now - lastClickTime.current;
    lastClickTime.current = now;

    // kalau klik cepat dua kali (misalnya < 250 ms), jangan munculkan menu
    if (diff < 250) return;

    // kalau bukan double click → tampilkan popup
    setAnchorEl(e.currentTarget);
    setShowMenu((prev) => !prev);
  };

  const handleCellDoubleClick = (e) => {
    e.stopPropagation();
    closeMenu();
    navigate(`/filemanager/${encodeURIComponent(refId)}`);
    // alert("Double click terdeteksi pada baris!");
  };

  const closeMenu = () => setShowMenu(false);

  return (
    <>
      <tr
        className="hover:bg-gray-50 transition border-b border-gray-200"
        onDoubleClick={handleCellDoubleClick}
      >
        {React.Children.map(rowCells.props.children, (cell, i) => (
          <td
            key={i}
            onClick={handleCellClick}
            className={`${cell.props.className} cursor-pointer`}
          >
            {cell.props.children}
          </td>
        ))}
      </tr>

      {showMenu &&
        createPortal(
          <div
            ref={menuRef}
            className="z-[9999] bg-white border border-gray-200 rounded-lg shadow-md px-1 py-2 w-40"
            style={{ position: "absolute" }}
          >
            {React.Children.map(children, (child) => {
              const isCustomComponent = typeof child.type === "function";

              const extraProps = {
                onClick: (e) => {
                  if (child.props.onClick) child.props.onClick(e);
                  setShowMenu(false);
                },
              };

              if (isCustomComponent) {
                extraProps.closeMenu = closeMenu;
              }

              return React.cloneElement(child, extraProps);
            })}
          </div>,
          document.body
        )}
    </>
  );
}
