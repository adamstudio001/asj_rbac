import React, { useState, useEffect, useRef } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import Info from "@assets/info.svg";
import { formatDatetime, formatFileSize, getLabelByIdentifier } from "@/Common/Utils";

const FileInfoPopper = ({ file, changeFile, eventInfoModal, closeMenu, paths = [], types = [] }) => {
  const [open, setOpen] = useState(false);
  const [hasMouse, setHasMouse] = useState(false);
  const closeTimer = useRef(null);

  // Deteksi apakah perangkat punya pointer presisi (mouse)
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setHasMouse(mq.matches);

    const handleChange = (e) => setHasMouse(e.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const handleClick = () => {
    changeFile(file);
    eventInfoModal(true);
    if (closeMenu) closeMenu();
    setOpen(false);
  };

  // Jika tidak ada mouse → langsung buka modal
  if (!hasMouse) {
    return (
      <button
        className="flex gap-2 items-center w-full px-3 py-2 text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
        onClick={handleClick}
      >
        <img src={Info} alt="Info" /> Get Info
      </button>
    );
  }

  // Jika ada mouse → gunakan popover dengan hover + delay
  const handleMouseEnter = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex gap-2 items-center w-full px-3 py-2 text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          <img src={Info} alt="Info" /> Get Info
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="right"
        align="start"
        sideOffset={10}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="
          relative min-w-[320px] max-w-xl w-full p-4 bg-white border rounded-md shadow-lg z-50
          before:content-[''] before:absolute before:-left-[10px] before:top-0 before:h-full before:w-[10px]
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-white px-2 py-2 mb-2">
          <h3 className="text-lg font-semibold">{file?.name || ""}</h3>
        </div>

        <div className="text-sm overflow-y-auto scroll-custom max-h-80 space-y-4">
          {/* General Section */}
          <div>
            <h4 className="font-semibold text-[14px] mb-1">General:</h4>
            <table className="w-full text-[14px] table-fixed">
              <tbody>
                <tr>
                  <td className="text-gray-500 text-right pr-3 w-24">Kind:</td>
                  <td className="font-medium">{getLabelByIdentifier(file?.type_identifier, types)}</td>
                </tr>
                <tr>
                  <td className="text-gray-500 text-right pr-3">Size:</td>
                  <td className="font-medium">{formatFileSize(file?.size)}</td>
                </tr>
                <tr>
                  <td className="text-gray-500 text-right pr-3">Where:</td>
                  <td className="font-medium leading-snug break-words">
                    {[
                      ...(paths?.map((item) => item.name) || []),
                      file?.name || "",
                    ].filter(Boolean).join(" > ")}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-500 text-right pr-3">Created:</td>
                  <td className="font-medium">{formatDatetime(file?.created_datetime || "")}</td>
                </tr>
                <tr>
                  <td className="text-gray-500 text-right pr-3">Modified:</td>
                  <td className="font-medium">{formatDatetime(file?.updated_datetime || "")}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* More Info Section */}
          <div>
            <h4 className="font-semibold text-[14px] mb-1">More Info:</h4>
            <table className="w-full text-[14px] table-fixed">
              <tbody>
                <tr>
                  <td className="text-gray-500 text-right pr-3 w-24">Kind:</td>
                  <td className="font-medium">{getLabelByIdentifier(file?.type_identifier, types)}</td>
                </tr>
                <tr>
                  <td className="text-gray-500 text-right pr-3">Where From:</td>
                  <td className="font-medium leading-snug break-words">
                    {[
                      ...(paths?.map((item) => item.name) || []),
                      file?.name || "",
                    ].filter(Boolean).join(" > ")}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-500 text-right pr-3">Classification:</td>
                  <td className="font-medium leading-snug break-words">
                    {file?.visibility_identifier
                      ? file.visibility_identifier
                          .toLowerCase()
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())
                      : ""}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-500 text-right pr-3">Created By:</td>
                  <td className="font-medium">
                    {file?.createdByUser
                      ? `${file.createdByUser.full_name} (${file.createdByUser.employment?.[0]?.role?.name ?? "-"})`
                      : ""}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-500 text-right pr-3">Last Modified:</td>
                  <td className="font-medium">
                    {file?.updatedByUser
                      ? `${file.updatedByUser.full_name} (${file.updatedByUser.employment?.[0]?.role?.name ?? "-"})`
                      : ""}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FileInfoPopper;
