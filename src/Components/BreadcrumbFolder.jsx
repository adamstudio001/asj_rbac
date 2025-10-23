import React from "react";
import { Folder, ChevronRight } from "lucide-react";
import { useFileManager } from "@/Providers/FileManagerProvider";

export default function BreadcrumbFolder({ currentKey, onNavigate }) {
  const { getDirectory, findParentFolderKey } = useFileManager();

  const buildPath = (key) => {
    const path = [];
    let currentKey = key;
    while (currentKey) {
      const folderName = getDirectory(currentKey);
      if (!folderName) break;
      path.unshift({ key: currentKey, name: folderName });
      currentKey = findParentFolderKey(currentKey);
    }
    return path;
  };

  const path = buildPath(currentKey);

  return (
    <div className="flex items-center space-x-2 text-[14px] font-inter">
      <button
        onClick={() => onNavigate?.(null)}
        className="flex items-center space-x-1 text-gray-500 hover:text-black transition"
      >
        <Folder className="w-4 h-4 fill-gray-500" strokeWidth={1.5} />
        <span className="font-medium">File Management</span>
      </button>

      {path.map((folder, idx) => (
        <div key={folder.key} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button
            onClick={() => onNavigate?.(folder.key)}
            className={`flex items-center space-x-1 ${
              idx === path.length - 1
                ? "text-black cursor-default"
                : "text-gray-500 hover:text-black transition"
            }`}
          >
            <Folder
              className={`w-4 h-4 ${
                idx === path.length - 1 ? "fill-black" : "fill-gray-500"
              }`}
              strokeWidth={1.5}
            />
            <span
              className={`${
                idx === path.length - 1 ? "font-semibold" : "font-medium"
              }`}
            >
              {folder.name}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}
