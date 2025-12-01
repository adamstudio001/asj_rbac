import React from "react";
import { Folder, ChevronRight } from "lucide-react";

export default function BreadcrumbFolder({ lists, onNavigate }) {
  const folders = lists?.map((item) => ({
    key: item.id,
    name: item.name,
  })) || [];

  return (
    <div className="flex items-center space-x-2 text-[14px] font-inter">
      {/* ROOT */}
      <button
        onClick={() => onNavigate?.(null)}
        className="flex items-center space-x-1 text-gray-500 hover:text-black transition"
      >
        <Folder className="w-4 h-4 fill-gray-500" />
        <span className="font-medium">File Management</span>
      </button>

      {/* FOLDERS */}
      {folders.map((folder, idx) => (
        <div key={folder.key} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />

          <button
            onClick={() => onNavigate?.(folder.key)}
            className="flex items-center space-x-1 text-gray-500 hover:text-black transition"
          >
            <Folder className="w-4 h-4 fill-gray-500" />
            <span className="font-medium">{folder.name}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
