// File: FileManagerContext.jsx
import React, { createContext, useContext, useState } from "react";

const FileManagerContext = createContext(null);

export const FileManagerProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState("grid");
    const [viewModeFolders, setViewModeFolders] = useState("grid");
    const [viewModeFiles, setViewModeFiles] = useState("grid");

    const [activeFilter, setActiveFilter] = useState({search: "", group: null});
    
    const dummyFiles = [
      { 
        name: "Laporan Absensi Karyawan", 
        isFolder: true, 
        folderKeys: "SF01", 
        lists: [
          { name: "Surat Cuti.docx" },
          { name: "Presentation.pptx" },
          { name: "Payroll.xlsx" },
          { name: "trunk.png" },
          { name: "Plan.xlsx" },
          { name: "Samsul.pdf" },
          { name: "Laporan", isFolder: true, folderKeys: "AK011", lists: [
            { name: "Surat Izin Cuti.docx" },
          ] }
        ] 
      },
      { name: "Surat Izin Cuti.docx" },
      { name: "Monthly Report Presentation.pptx" },
      { name: "Payroll-2026.xlsx" },
      { name: "tree-trunk.png" },
      { name: "Home_Renovation_Plan.xlsx" },
      { name: "Surat Resign Samsul.pdf" },
      { name: "music.mp3" },
      { name: "Vacation_Photos_Italy.zip" },
      { name: "Laporan Absensi Karyawan", isFolder: true, folderKeys: "SF02" },
    ];
  
    function findFolderRecursive(items, key) {
        for (const item of items) {
            if (item.isFolder && item.folderKeys === key) {
                return item;
            }
            if (item.isFolder && Array.isArray(item.lists)) {
                const found = findFolderRecursive(item.lists, key);
                if (found) return found;
            }
        }
        return null;
    }

    function getFileDirectory(folderKeys = null) {
        if (!folderKeys) {
            return dummyFiles;
        }

        const folder = findFolderRecursive(dummyFiles, folderKeys);
        if (folder && Array.isArray(folder.lists)) {
            return folder.lists;
        }

        return [];
    }

    function findParentFolderKey(targetKey, parentKey = null, items = null) {
        if(!items){
            items = dummyFiles;
        }

        for (const item of items) {
            if (item.isFolder) {
                if (item.folderKeys === targetKey) {
                    return parentKey;
                }

                if (Array.isArray(item.lists)) {
                    const found = findParentFolderKey(targetKey, item.folderKeys, item.lists);
                    if (found) return found;
                }
            }
        }
        return null;
    }

    function getDirectory(folderKeys = null) {
        if (!folderKeys) {
            return null;
        }

        const folder = findFolderRecursive(dummyFiles, folderKeys);
        return folder?.name || null;
    }

    return (
        <FileManagerContext.Provider
        value={{
            isModalOpen, 
            setIsModalOpen,
            viewMode, 
            setViewMode,
            viewModeFolders, 
            setViewModeFolders,
            viewModeFiles, 
            setViewModeFiles,
            activeFilter, 
            setActiveFilter,
            getFileDirectory,
            getDirectory,
            findParentFolderKey
        }}
        >
        {children}
        </FileManagerContext.Provider>
    );
};

export const useFileManager = () => useContext(FileManagerContext);
