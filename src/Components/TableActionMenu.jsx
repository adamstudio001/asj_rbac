import { IoMdMore } from "react-icons/io";
import { TableActionMenuBase } from "./TableActionMenuBase";

export function TableActionMenu({ children }) {
  return (
    <TableActionMenuBase
      placement="right-start"
      trigger={({ open }) => (
        <div
          className={`group w-6 h-6 rounded-md border transition flex items-center justify-center
            ${
              open
                ? "bg-[#1e2938] text-white"
                : "bg-white text-gray-700 hover:bg-[#1e2938] hover:text-white"
            }
          `}
        >
          <IoMdMore className="text-lg" />
        </div>
      )}
    >
      {children}
    </TableActionMenuBase>
  );
}
