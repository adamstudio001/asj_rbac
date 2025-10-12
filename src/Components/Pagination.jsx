import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import clsx from "clsx";

const Pagination = ({ currentPage, totalPages, onPageChange, className }) => {
  const maxVisible = 6;
  const pages = [];

  let startPage, endPage;

  if (totalPages <= maxVisible) {
    startPage = 1;
    endPage = totalPages;
  } else {
    const half = Math.floor(maxVisible / 2);
    if (currentPage <= half) {
      startPage = 1;
      endPage = maxVisible;
    } else if (currentPage + half >= totalPages) {
      endPage = totalPages;
      startPage = totalPages - maxVisible + 1;
    } else {
      startPage = currentPage - half;
      endPage = currentPage + half - 1;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const buttonBase = clsx(
    "h-8 min-w-[2rem] flex items-center justify-center",
    "text-sm font-medium border border-gray-300",
    "hover:bg-gray-100 hover:text-[#1B2E48] hover:border-[#1B2E48] transition"
  );

  return (
    <div className={clsx("flex items-center justify-center", className)}>
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={clsx(
          buttonBase,
          "rounded-l-md",
          currentPage === 1 && "opacity-40 cursor-not-allowed"
        )}
      >
        <ChevronsLeft size={16} />
      </button>

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={clsx(
          buttonBase,
          currentPage === 1 && "opacity-40 cursor-not-allowed"
        )}
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={clsx(
            buttonBase,
            page === currentPage
              ? "bg-[#1B2E48] text-white border-[#1B2E48]"
              : "text-gray-700 bg-white"
          )}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={clsx(
          buttonBase,
          currentPage === totalPages && "opacity-40 cursor-not-allowed"
        )}
      >
        <ChevronRight size={16} />
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={clsx(
          buttonBase,
          "rounded-r-md",
          currentPage === totalPages && "opacity-40 cursor-not-allowed"
        )}
      >
        <ChevronsRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
