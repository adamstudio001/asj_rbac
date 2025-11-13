// File: FileManagerContext.jsx
import React, { createContext, useContext, useState } from "react";

const FileManagerContext = createContext(null);

export const FileManagerProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState("grid");
    const [viewModeFolders, setViewModeFolders] = useState("grid");
    const [viewModeFiles, setViewModeFiles] = useState("grid");

    const [activeFilter, setActiveFilter] = useState({search: "", group: null});
    
    // const dummyFiles = [
    //     { 
    //         id: 1,
    //         name: "Laporan Absensi Karyawan", 
    //         isFolder: true, 
    //         folderKeys: "SF01", 
    //         lastModified: "2025-01-01 10:00:00",
    //         fileSize: 20202000000,
    //         lists: [
    //         { id: 2, name: "Surat Cuti.docx", isFolder: false, lastModified: "2025-01-01 10:00:00", fileSize: 10240 },
    //         { id: 3, name: "Presentation.pptx", isFolder: false, lastModified: "2025-01-01 10:00:00", fileSize: 20480 },
    //         { id: 4, name: "Payroll.xlsx", isFolder: false, lastModified: "2025-01-01 10:00:00", fileSize: 30480 },
    //         { id: 5, name: "trunk.png", isFolder: false, lastModified: "2025-01-01 10:00:00", fileSize: 50480 },
    //         { id: 6, name: "Plan.xlsx", isFolder: false, lastModified: "2025-01-01 10:00:00", fileSize: 60480 },
    //         { id: 7, name: "Samsul.pdf", isFolder: false, lastModified: "2025-01-01 10:00:00", fileSize: 70480 },
    //         { 
    //             id: 8,
    //             name: "Laporan",
    //             isFolder: true,
    //             folderKeys: "AK011",
    //             lastModified: "2025-01-01 10:00:00",
    //             fileSize: 0,
    //             lists: [
    //             { id: 9, name: "Surat Izin Cuti.docx", isFolder: false, lastModified: "2025-01-01 10:00:00", fileSize: 10240 },
    //             ]
    //         }
    //         ] 
    //     },
    //     { id: 10, name: "Surat Izin Cuti.docx", isFolder: false, lastModified: "2025-01-01 10:00:00", fileSize: 10000 },
    //     { id: 11, name: "Monthly Report Presentation.pptx", isFolder: false, lastModified: "2025-01-01 10:00:00", fileSize: 20000 },
    //     { id: 12, name: "Payroll-2026.xlsx", isFolder: false, lastModified: "2025-01-01 10:00:00", fileSize: 30000 },
    //     { id: 13, name: "tree-trunk.png", isFolder: false, lastModified: "2025-01-01 10:00:00", fileSize: 40000 },
    //     { id: 14, name: "Home_Renovation_Plan.xlsx", isFolder: false, lastModified: "2025-01-01 10:00:00", fileSize: 50000 },
    //     { id: 15, name: "Surat Resign Samsul.pdf", isFolder: false, lastModified: "2025-01-01 10:00:00", fileSize: 60000 },
    //     { id: 16, name: "music.mp3", isFolder: false, lastModified: "2025-01-01 10:00:00", fileSize: 70000 },
    //     { id: 17, name: "Vacation_Photos_Italy.zip", isFolder: false, lastModified: "2025-01-01 10:00:00", fileSize: 80000 },
    //     { 
    //         id: 18,
    //         name: "Laporan Absensi Karyawan 2025", 
    //         isFolder: true, 
    //         folderKeys: "SF02", 
    //         lastModified: "2025-01-01 10:00:00",
    //         fileSize: 0,
    //         lists: []
    //     },
    // ];

    function findFolderRecursive(items, key) {
        for (const item of items) {
            if (item.type_identifier=="Folder" && encodeURIComponent(item.folderKeys) === encodeURIComponent(key)) {
                return item;
            }
            if (item.type_identifier=="Folder" && Array.isArray(item.lists)) {
                const found = findFolderRecursive(item.lists, key);
                if (found) return found;
            }
        }
        return null;
    }

    function getFileDirectory(lists, folderKeys = null) { //filemanager
        if (!folderKeys) {
            return lists;
        }

        const folder = findFolderRecursive(lists, folderKeys);
        if (folder && Array.isArray(folder.lists)) {
            return folder.lists;
        }

        return [];
    }

    function findParentFolderKey(lists, targetKey, parentKey = null, items = null) { //utility
        if(!items){
            items = lists;
        }

        for (const item of items) {
            if (item.type_identifier=="Folder") {
                if (item.folderKeys === targetKey) {
                    return parentKey;
                }

                if (Array.isArray(item.lists)) {
                    const found = findParentFolderKey(lists, targetKey, item.folderKeys, item.lists);
                    if (found) return found;
                }
            }
        }
        return null;
    }

    function getDirectory(lists, folderKeys = null) { //utility
        if (!folderKeys) {
            return null;
        }

        const folder = findFolderRecursive(lists, folderKeys);
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
