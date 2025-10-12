import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Navbar from "@src/Components/Navbar";
import Pagination from "@src/Components/Pagination";
import { useSearch } from "@src/Providers/SearchProvider";
import { IoIosArrowDown } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import { useFileManager } from "@src/Providers/FileManagerProvider";
import { formatDate, formatFileSize, formatFileType, getFileIcon } from "../Common/Utils";

const FileManagementPage = () => {
  const { search, setSearch } = useSearch();
  const [page, setPage] = useState(1);
  const totalPages = 6;

  const [selected, setSelected] = useState([]);
  const files = [
    { id: 1, name: "Laporan Absensi Karyawan", isFolder: true, lastModified: "2025-01-01 10:00:00", fileSize: 20202000000 },
    { id: 2, name: "Reimbursment.xlsx", isFolder: false, lastModified: "2025-01-01 10:00:00", fileSize: 10240},
    { id: 3, name: "surat izin cuti.docx", isFolder: false, lastModified: "2025-01-01 10:00:00", fileSize: 30000 },
    { id: 4, name: "dokumen operasional.zip", isFolder: false, lastModified: "2025-01-01 10:00:00", fileSize: 645000 },
  ];

  const { 
      isModalOpen, 
      setIsModalOpen,
    } = useFileManager();

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === files.length) {
      setSelected([]);
    } else {
      setSelected(files.map((u) => u.id));
    }
  };

  useEffect(()=>{
      setSearch("");
  },[]);

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar
        renderActionModal={() => (
          <div className="flex items-center gap-8">
              <button onClick={()=>setIsModalOpen(!isModalOpen)} className="flex items-center gap-3 bg-[#1B2E48] text-white font-inter font-medium text-[14px] px-4 py-2 rounded-md hover:bg-[#1b2e48d9] transition">
              <LuUpload size={18}/> 
              Upload file
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                  C
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-800">HR/GA</span>
                  <IoIosArrowDown className="w-4 text-[#a5a5a5]"/>
                </div>
              </div>
          </div>
        )}
      />
      <main className="flex-1 items-center py-6 px-[2.5cqi] overflow-auto">
          <div className="w-full mb-8 pb-4 sm:w-auto flex items-center gap-3">
            <div className="relative">
                <input
                    type="text"
                    onChange={(e)=>setSearch(e.target.value)}
                    placeholder="Search by name"
                    className="pl-4 pr-10 py-2 rounded-md bg-[#F4F3F3] placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#497fff]"
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            {typeof renderActionModal === "function" && renderActionModal()}
          </div>
          <div className="w-full overflow-x-scroll rounded-lg">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F3F3F3]">
                <tr className="border border-gray-200">
                  {/* <th className="px-4 py-3 w-10">
                    <input
                    type="checkbox"
                    onClick={toggleSelectAll}
                    className="appearance-none w-4 h-4 border border-gray-300 rounded-sm bg-white 
                      checked:before:pt-[2px] checked:bg-white checked:border-gray-300 
                      checked:before:content-['✔'] checked:before:text-[8px] 
                      checked:before:flex checked:before:items-center checked:before:justify-center 
                      cursor-pointer"
                  />
                  </th> */}
                  <th className="px-4 py-3 font-inter font-medium text-[14px] text-[#5B5B5B]">File Name</th>
                  <th className="px-4 py-3 font-inter font-medium text-[14px] text-[#5B5B5B]">File Type</th>
                  <th className="px-4 py-3 font-inter font-medium text-[14px] text-[#5B5B5B]">Last Modified</th>
                  <th className="px-4 py-3 font-inter font-medium text-[14px] text-[#5B5B5B]">File Size</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <tr
                    key={file.id}
                    className="hover:bg-gray-50 transition border-b border-gray-200"
                  >
                    <td className="px-4 py-3 text-gray-800 flex gap-2 items-center">
                      {getFileIcon(file.name, file.isFolder, 24)}
                      {file.name}
                    </td>
                    <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">{formatFileType(file.name)}</td>
                    <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">{formatDate(file.lastModified)}</td>
                    <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">{formatFileSize(file.fileSize)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="w-full">
            <Pagination className="mt-8" currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <p className="text-gray-700">
          Ini contoh konten modal seperti di Bootstrap, tapi dengan React + Tailwind.
        </p>
      </Modal>
    </>
  );
};

function Modal({ isOpen, onClose }) {
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);
  const uploadRefs = useRef({}); // simpan timeout & interval per file

  // Handle browse click
  const handleBrowse = () => inputRef.current.click();

  // Handle file selection
  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      id: uuidv4(),
      file: file,
      progress: 0,
      uploaded: false,
      uploading: false,
    }));
    setFiles(prev => [...prev, ...newFiles]);

    // ✅ Reset supaya file yang sama bisa dipilih ulang
    e.target.value = "";
  };

  // Handle drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).map(file => ({
      id: uuidv4(),
      file: file,
      progress: 0,
      uploaded: false,
      uploading: false,
    }));
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleDragOver = (e) => e.preventDefault();

  // Remove file (cancel upload)
  const handleRemove = (fileToRemove) => {
    const ref = uploadRefs.current[fileToRemove.id];
    if (ref) {
      if (ref.intervalId) clearInterval(ref.intervalId);
      if (ref.timeoutId) clearTimeout(ref.timeoutId);
      delete uploadRefs.current[fileToRemove.id];
    }
    setFiles(prev => prev.filter(f => f.id !== fileToRemove.id));
  };

  // Simulate upload with delay 3 detik per file (relatif)
  const handleUploadFiles = () => {
    const notUploaded = files.filter(f => !f.uploaded && !f.uploading);

    notUploaded.forEach((f, relIndex) => {
      const fileId = f.id;

      // Tandai file sedang upload
      setFiles(prev =>
        prev.map(fileObj =>
          fileObj.id === fileId ? { ...fileObj, uploading: true } : fileObj
        )
      );

      const timeoutId = setTimeout(() => {
        let progress = 0;
        const intervalId = setInterval(() => {
          progress += 10;

          setFiles(prev =>
            prev.map(fileObj =>
              fileObj.id === fileId
                ? { ...fileObj, progress: Math.min(progress, 100) }
                : fileObj
            )
          );

          if (progress >= 100) {
            clearInterval(intervalId);
            delete uploadRefs.current[fileId];
            setFiles(prev =>
              prev.map(fileObj =>
                fileObj.id === fileId
                  ? { ...fileObj, uploaded: true, uploading: false, progress: 100 }
                  : fileObj
              )
            );
          }
        }, 200);

        uploadRefs.current[fileId] = {
          ...(uploadRefs.current[fileId] || {}),
          intervalId
        };
      }, relIndex * 3000);

      uploadRefs.current[fileId] = {
        ...(uploadRefs.current[fileId] || {}),
        timeoutId
      };
    });
  };

  // Close modal on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setFiles([]);
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const uploadingCount = files.filter(f => !f.uploaded).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setFiles([]);
            onClose();
          }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 z-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="text-2xl font-semibold text-center p-4">
              <h2>Upload</h2>
            </div>

            {/* Body */}
            <div className="max-w-lg mx-auto p-6 space-y-4">
              {/* Drag & Drop Area */}
              <div
                className={`${files.length === 0 ? `h-[400px]` : ``} bg-[#f8f8ff] rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 transition`}
                onClick={handleBrowse}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="text-4xl text-blue-500 mb-2">☁️</div>
                <p className="font-medium">
                  Drag &amp; drop files or{" "}
                  <span className="text-[#483ea8] underline">Browse</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supported formats: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
                </p>
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {files.length > 0 && (
                <div className="w-full h-[300px] overflow-y-auto">
                  {/* Uploading Files */}
                  {uploadingCount > 0 && (
                    <div>
                      <p className="font-medium mb-2">
                        Uploading - {files.filter(f => f.uploaded).length}/{files.length} files
                      </p>
                      {files
                        .filter(f => !f.uploaded)
                        .map((f) => (
                          <div key={f.id} className="mb-2">
                            <div className="relative border border-gray-400 rounded p-2 mb-2 text-sm">
                              <span className="truncate">{f.file.name}</span>
                              <button
                                onClick={() => handleRemove(f)}
                                className="absolute right-2 p-[2px] bg-gray-300 hover:bg-black rounded-full text-white"
                              >
                                <X size={16} />
                              </button>

                              <div className="absolute ml-[-8px] w-[100%] h-1 bg-gray-200 rounded mt-1">
                                <div
                                  className="h-1 bg-blue-500 rounded transition-all duration-200"
                                  style={{ width: `${f.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Uploaded Files */}
                  {files.filter(f => f.uploaded).length > 0 && (
                    <div>
                      <p className="font-medium mb-2">Uploaded</p>
                      {files
                        .filter(f => f.uploaded)
                        .map((f) => (
                          <div
                            key={f.id}
                            className="flex justify-between items-center border border-green-400 rounded p-2 mb-2 text-sm"
                          >
                            <span className="truncate">{f.file.name}</span>
                            <button
                              onClick={() => handleRemove(f)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Upload Button */}
              <button
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                disabled={files.length === 0}
                onClick={handleUploadFiles}
              >
                UPLOAD FILES
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FileManagementPage;
