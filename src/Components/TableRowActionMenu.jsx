import React, { useState, useRef, useEffect } from "react";
import { createPopper } from "@popperjs/core";
import { createPortal } from "react-dom";

export function TableRowActionMenu({ children, rowCells }) {
  const [showMenu, setShowMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuRef = useRef(null);

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
    setAnchorEl(e.currentTarget);
    setShowMenu((prev) => !prev);
  };

  const closeMenu = () => setShowMenu(false);

  return (
    <>
      <tr className="hover:bg-gray-50 transition border-b border-gray-200">
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
            className="z-[9999] bg-white border border-gray-200 rounded-lg shadow-md py-2 w-40"
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
