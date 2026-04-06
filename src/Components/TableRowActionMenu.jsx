import React, { useState, useRef, useEffect } from "react";
import { createPopper } from "@popperjs/core";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useMenu } from "@/Providers/MenuContext";

const flattenChildren = (children) => {
  return React.Children.toArray(children).flatMap((child) => {
    if (child?.type === React.Fragment) {
      return React.Children.toArray(child.props.children);
    }
    return child;
  });
};

export function TableRowActionMenu({
  isFolder = true,
  refId,
  children,
  rowCells,
  path = "filemanager",
}) {
  const { data } = useMenu();

  const [showMenu, setShowMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const menuRef = useRef(null);
  const popperInstance = useRef(null);
  const pressTimer = useRef(null);

  const navigate = useNavigate();

  // ✅ Create & destroy popper
  useEffect(() => {
    if (showMenu && anchorEl && menuRef.current) {
      popperInstance.current = createPopper(anchorEl, menuRef.current, {
        placement: "right-start",
        modifiers: [{ name: "offset", options: { offset: [8, 0] } }],
      });
    }

    return () => {
      popperInstance.current?.destroy();
      popperInstance.current = null;
    };
  }, [showMenu, anchorEl]);

  // ✅ Close kalau clipboard berubah
  useEffect(() => {
    setShowMenu(false);
  }, [data]);

  // ✅ Click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!menuRef.current) return;

      if (
        !menuRef.current.contains(e.target) &&
        !(anchorEl && anchorEl.contains(e.target))
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [anchorEl]);

  // ✅ Klik kiri → buka folder
  const handleCellClick = (e) => {
    e.stopPropagation();

    if (isFolder) {
      navigate(`/${path}/${encodeURIComponent(refId)}`);
    }
  };

  // ✅ Klik kanan → buka menu
  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setAnchorEl(e.currentTarget);
    setShowMenu(true);
  };

  // ✅ Long press (mobile)
  const handleTouchStart = (e) => {
    pressTimer.current = setTimeout(() => {
      setAnchorEl(e.currentTarget);
      setShowMenu(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    clearTimeout(pressTimer.current);
  };

  const closeMenu = () => setShowMenu(false);

  return (
    <>
      <tr className="hover:bg-gray-50 transition border-b border-gray-200">
        {React.Children.map(rowCells.props.children, (cell, i) => (
          <td
            key={i}
            onClick={handleCellClick}
            onContextMenu={handleContextMenu}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={`${cell.props.className} cursor-default select-none`}
          >
            {cell.props.children}
          </td>
        ))}
      </tr>

      {showMenu &&
        createPortal(
          <div
            ref={menuRef}
            className="w-[max-content] z-[9999] bg-white border border-gray-200 rounded-lg shadow-md px-1 py-2 w-40"
            style={{ position: "absolute" }}
            onClick={(e) => e.stopPropagation()}
          >
            {flattenChildren(children).map((child, idx) => {
              if (!React.isValidElement(child)) return null;

              return React.cloneElement(child, {
                key: idx,
                onClick: (e) => {
                  e.stopPropagation();
                  child.props.onClick?.(e);
                  closeMenu(); // ✅ auto close
                },
              });
            })}
          </div>,
          document.body
        )}
    </>
  );
}