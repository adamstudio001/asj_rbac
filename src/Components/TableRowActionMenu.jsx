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
  item,
  selectedItem,
  setSelectedItem,
  onRename,
  isLoadingRename = false, // 🔥 NEW
  disabledRename = false // 🔥 NEW
}) {
  const { data } = useMenu();
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [showMenu, setShowMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  /* ================= REFS ================= */
  const clickTimeout = useRef(null);
  const lastClickedId = useRef(null);
  const menuRef = useRef(null);
  const popperInstance = useRef(null);
  const pressTimer = useRef(null);

  /* ================= POPPER ================= */
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

  /* ================= CLOSE ON MENU CHANGE ================= */
  useEffect(() => {
    setShowMenu(false);
  }, [data]);

  /* ================= OUTSIDE CLICK ================= */
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [anchorEl]);

  /* ================= OPEN ================= */
  const handleCellClick = (e) => {
    e.stopPropagation();
    if (editingId === refId) return;

    if (isFolder) {
      navigate(`/${path}/${encodeURIComponent(refId)}`);
    }
  };

  /* ================= SELECT + DOUBLE CLICK RENAME ================= */
  const handleSelect = (e) => {
    e.stopPropagation();

    if (disabledRename) return; // 🔥 ADD THIS

    setSelectedItem(item);

    if (lastClickedId.current !== refId) {
      lastClickedId.current = refId;
      return;
    }

    clearTimeout(clickTimeout.current);

    clickTimeout.current = setTimeout(() => {
      if (selectedItem?.id === refId) {
        setEditingId(refId);
        setEditName(item.name);
      }
    }, 200);
  };

  /* ================= RENAME COMMIT (LOCAL → PARENT) ================= */
  const handleRenameCommit = () => {
    const newName = editName.trim();

    if (!newName || newName === item.name) {
      setEditingId(null);
      return;
    }

    onRename?.({
      ...item,
      name: newName,
    });

    setEditingId(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRenameCommit();
    }

    if (e.key === "Escape") {
      setEditingId(null);
      setEditName(item.name);
    }
  };

  /* ================= CONTEXT MENU ================= */
  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setAnchorEl(e.currentTarget);
    setShowMenu(true);
  };

  /* ================= MOBILE LONG PRESS ================= */
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

  /* ================= RENDER ================= */
  return (
    <>
      <tr
        className={`hover:bg-gray-50 border-b transition ${
          isLoadingRename ? "animate-pulse bg-gray-100" : ""
        } ${
          selectedItem?.id === refId
            ? "bg-blue-50 border-blue-500"
            : "border-gray-200"
        }`}
      >
        {React.Children.map(rowCells.props.children, (cell, i) => {
          const isNameColumn = i === 0;

          return (
            <td
              key={i}
              onClick={handleSelect}
              onDoubleClick={handleCellClick}
              onContextMenu={handleContextMenu}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className={`${cell.props.className} cursor-default select-none`}
            >
              {/* ================= INLINE RENAME ================= */}
              {isNameColumn && editingId === refId ? (
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={handleRenameCommit}
                  onKeyDown={handleKeyDown}
                  className="border px-2 py-1 rounded w-full"
                />
              ) : isLoadingRename ? (
                /* ================= SKELETON ================= */
                <div className="h-4 w-32 bg-gray-300 rounded animate-pulse" />
              ) : (
                cell.props.children
              )}
            </td>
          );
        })}
      </tr>

      {/* ================= CONTEXT MENU ================= */}
      {(showMenu && children) &&
        createPortal(
          <div
            ref={menuRef}
            className="z-[9999] bg-white border rounded-lg shadow-md px-1 py-2 w-[max-content]"
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
                  closeMenu();
                },
              });
            })}
          </div>,
          document.body
        )}
    </>
  );
}