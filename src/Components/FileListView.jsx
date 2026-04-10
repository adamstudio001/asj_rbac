import { getFileIcon } from "@src/Common/Utils";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/Tooltip";
import { BASEURL } from "@/Common/Constant";
import { useState } from "react";

function FileListView({ lists, folderKeys, mode, isLoading = false }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  if (mode == "Folders") {
    lists = lists.filter((f) => f.type_identifier.toLowerCase() == "folder");
  } else if (mode == "Files") {
    lists = lists.filter((f) => f.type_identifier.toLowerCase() != "folder");
  }

  const handleNavigate = (file) => {
    if (file.type_identifier.toLowerCase() === "folder") {
      navigate(
        `/dashboard/${encodeURIComponent(
          folderKeys != file.parent_id ? file.parent_id : file.id,
        )}`,
      );
    } else {
      window.open(
        `${BASEURL}/download/${file.name}`,
        "_blank",
        "noopener,noreferrer",
      );
    }
  };

  return (
    <div className="bg-transparent divide-y divide-[#e0e0e0] rounded shadow">
      {isLoading
        ? Array(12)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="skeleton h-16 flex items-center px-4 py-3 mb-2"
              />
            ))
        : (lists ?? []).map((file, index) => {
            const isSelected = selected?.id === file.id;

            return (
              <button
                key={index}
                onClick={() => setSelected(file)} // ✅ select
                onDoubleClick={() => handleNavigate(file)} // ✅ action
                className={`
                w-full flex items-center px-4 py-3 transition text-left
                hover:bg-gray-50
                ${
                  isSelected
                    ? "border-1 border-blue-500 bg-blue-50"
                    : "border border-transparent"
                }
              `}
              >
                <div className="text-2xl w-10">
                  {getFileIcon(
                    file.name,
                    file.type_identifier.toLowerCase() === "folder",
                    24,
                  )}
                </div>

                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="flex-1 ml-4 text-[#1A1A1A] text-[13px] leading-[18px] font-medium line-clamp-1">
                        {file.name}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      align="start"
                      sideOffset={6}
                      className="px-2 py-1 text-xs"
                    >
                      {file.name}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </button>
            );
          })}
    </div>
  );
}

export default FileListView;
