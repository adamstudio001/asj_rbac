// File: FileManagerContext.jsx
import React, { createContext, useContext, useState } from "react";

const FileManagerContext = createContext(null);

export const FileManagerProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState("grid");
    const [viewModeFolders, setViewModeFolders] = useState("grid");
    const [viewModeFiles, setViewModeFiles] = useState("grid");

    const [activeFilter, setActiveFilter] = useState({search: "", group: null});
    
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
