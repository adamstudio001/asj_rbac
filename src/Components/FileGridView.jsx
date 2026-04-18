import { getFileIcon } from "@src/Common/Utils";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/Tooltip";
import { BASEURL } from "@/Common/Constant";
import { useState } from "react";
import EllipsisTooltip from "./EllipsisTooltip";

function FileGridView({ lists, folderKeys, mode, isLoading = false }) {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  if (mode == "Folders") {
    lists = lists.filter((f) => f.type_identifier.toLowerCase() == "folder");
  } else if (mode == "Files") {
    lists = lists.filter((f) => f.type_identifier.toLowerCase() != "folder");
  }

  const handleNavigate = (file) => {
    console.log(file)
    if (file.type_identifier.toLowerCase() === "folder") {
      navigate(`/filemanager/${file.parent_id}`);
      // navigate(
      //   `/dashboard/${encodeURIComponent(
      //     folderKeys != file.parent_id ? file.parent_id : file.id
      //   )}`
      // );
    } else {
      navigate(`/filemanager/${file.parent_id}`);
      // window.open(
      //   `${BASEURL}/download/${file.name}`,
      //   "_blank",
      //   "noopener,noreferrer"
      // );
    }
  };

  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
    >
      {isLoading ? (
        Array(12)
          .fill(null)
          .map((_, i) => (
            <div
              key={i}
              className="skeleton h-16 bg-[#7979790D] p-4 rounded shadow-md"
            />
          ))
      ) : (
        (lists ?? []).map((file, index) => {
          const isSelected = selected?.id === file.id;

          return (
            <button
              key={index}
              onClick={() => setSelected(file)} // ✅ klik 1x = select
              onDoubleClick={() => handleNavigate(file)} // ✅ double click = action
              className={`
                flex flex-col items-center text-center gap-2
                p-4 rounded shadow-md transition cursor-pointer
                bg-[#7979790D] hover:shadow-md
                ${
                  isSelected
                    ? "border-1 border-blue-500 bg-blue-50"
                    : "border border-transparent"
                }
              `}
            >
              <div className="text-4xl">
                {getFileIcon(
                  file.name,
                  file.type_identifier.toLowerCase() === "folder"
                )}
              </div>

              <div className="w-full">
                <EllipsisTooltip className={"w-full"}>
                  {file.name}
                </EllipsisTooltip>
                {/* <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-[#1A1A1A] text-[13px] leading-[18px] font-medium line-clamp-1">
                        {file.name}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="px-2 py-1 text-xs">
                      {file.name}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider> */}
              </div>
            </button>
          );
        })
      )}

      {(lists ?? []).length > 0 &&
        lists.length < 4 &&
        Array.from({ length: 4 - lists.length }).map((_, i) => (
          <div key={uuidv4()}>&nbsp;</div>
        ))}
    </div>
  );
}

export default FileGridView;