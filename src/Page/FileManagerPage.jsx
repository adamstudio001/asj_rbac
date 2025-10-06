import React, { useEffect, useRef, useState } from "react";
import { HiHome } from "react-icons/hi";
import { LuUpload } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import Sidebar from "@src/Components/Sidebar";
import FileGridView from "@src/Components/FileGridView";
import FileListView from "@src/Components/FileListView";
import { IoGridOutline } from "react-icons/io5";
import { FaListUl } from "react-icons/fa6";

const FileManagerPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [activeFilter, setActiveFilter] = useState({search: "", group: null});
  
  const dummyFiles = [
    { name: "Laporan Absensi Karyawan", isFolder: true },
    { name: "Surat Izin Cuti.docx" },
    { name: "Monthly Report Presentation.pptx" },
    { name: "Payroll-2026.xlsx" },
    { name: "tree-trunk.png" },
    { name: "Home_Renovation_Plan.xlsx" },
    { name: "Surat Resign Samsul.pdf" },
    { name: "music.mp3" },
    { name: "Vacation_Photos_Italy.zip" },
    { name: "Laporan Absensi Karyawan", isFolder: true },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <header className="flex items-center justify-between px-6 py-6">
          {/* Left: Toggle Sidebar */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-1  font-medium transition"
          >
            <HiHome className="text-[#497fff]" size={20}/>
            Home
          </button>

          {/* Right: Upload + Avatar */}
          <div className="flex items-center gap-4">
            <button onClick={()=>setIsModalOpen(!isModalOpen)} className="flex items-center gap-3 bg-[#497fff] text-white px-4 py-2 rounded-md hover:bg-[#3a6ee8] transition">
              <LuUpload size={18}/> 
              Upload file
            </button>
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-semibold">
              C
            </div>
            <span className="font-medium text-gray-800">HR/GA</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 items-center p-6 overflow-auto">
          <div className="px-[15%] w-full">
            <div className="mt-[30px] text-gray-600 text-lg">
              <input
                type="text"
                placeholder="Search"
                onChange={(e) =>
                  setActiveFilter((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 text-lg bg-[#f5f4f4] rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#497fff]"
              />
            </div>

            <div className="py-6 space-y-4">
              <div>
                <div className="flex justify-between items-center p-2">
                  <h1 className="text-sm font-bold text-[#5b5b5b]">Files</h1>
                  <SectionViewMode action={setViewMode} viewMode={viewMode} />
                </div>
                <SectionGroupFilter action={setActiveFilter} activeFilter={activeFilter} />
              </div>

              {viewMode === "grid" ? (
                <FileGridView files={dummyFiles} activeFilter={activeFilter} />
              ) : (
                <FileListView files={dummyFiles} activeFilter={activeFilter} />
              )}
            </div>


            {/* <div className="mt-[60px] flex items-center justify-between">
              <h4 className="text-[#5b5b5b]">Your Workspace</h4> 
              <div className="flex gap-1">
                <div className="p-1 rounded bg-[#f1f1f1] text-[#497fff]">
                  <CiGrid41 size={18} />
                </div>
                <div className="p-1 text-[#656565]">
                  <IoIosList size={18} />
                </div>
              </div>
            </div>
            
            <div className="mt-[30px] grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              <div className="lg:col-span-2 border-[1.5px] border-[#d9d9d9] bg-white shadow-md rounded-xl p-6 self-start">
                <div className="flex mb-3 items-center justify-between">
                  <h3>College</h3> 
                  <button onClick={()=>{}} className="p-1 rounded hover:bg-[#f1f1f1] hover:text-[#497fff]">
                    <IoIosMore size={18}/>
                  </button>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-3">
                  <button className="flex items-center gap-[0.7rem] text-base px-[1.2rem] py-[.8rem] rounded-lg text-[#497fff] bg-[#f7f9ff]">
                    <FaFolder />
                    <p className="text-black truncate overflow-hidden text-ellipsis whitespace-nowrap w-24 text-[14px]">Assigments</p>
                  </button>
                  <button className="flex items-center gap-[0.7rem] text-base px-[1.2rem] py-[.8rem] rounded-lg text-[#497fff] bg-[#f7f9ff]">
                    <FaFolder />
                    <p className="text-black truncate overflow-hidden text-ellipsis whitespace-nowrap w-24 text-[14px]">Resert paper lorem ipsum</p>
                  </button>
                  <button className="flex items-center gap-[0.7rem] text-base px-[1.2rem] py-[.8rem] rounded-lg text-[#ec880c] bg-[#f7f9ff]">
                    <HiOutlinePresentationChartLine size={20} />
                    <p className="text-black truncate overflow-hidden text-ellipsis whitespace-nowrap w-24 text-[14px]">Resert paper lorem ipsum.ppt</p>
                  </button>
                  <button className="flex items-center gap-[0.7rem] text-base px-[1.2rem] py-[.8rem] rounded-lg text-[#3f82ee] bg-[#f7f9ff]">
                    <GoDatabase size={20} />
                    <p className="text-black truncate overflow-hidden text-ellipsis whitespace-nowrap w-24 text-[14px]">Resert paper lorem ipsum</p>
                  </button>
                  <button className="flex items-center gap-[0.7rem] text-base px-[1.2rem] py-[.8rem] rounded-lg text-[#3f82ee] bg-[#f7f9ff]">
                    <CgFileDocument size={20} />
                    <p className="text-black truncate overflow-hidden text-ellipsis whitespace-nowrap w-24 text-[14px]">Resert paper lorem ipsum.txt</p>
                  </button>
                  <button className="flex items-center gap-[0.7rem] text-base px-[1.2rem] py-[.8rem] rounded-lg text-[#3f82ee] bg-[#f7f9ff]">
                    <BsFileEarmarkZip size={20} />
                    <p className="text-black truncate overflow-hidden text-ellipsis whitespace-nowrap w-24 text-[14px]">Resert paper lorem ipsum.pdf.mp3</p>
                  </button>
                  <button className="flex items-center gap-[0.7rem] text-base px-[1.2rem] py-[.8rem] rounded-lg text-[#3f82ee] bg-[#f7f9ff]">
                    <SlPicture size={20} />
                    <p className="text-black truncate overflow-hidden text-ellipsis whitespace-nowrap w-24 text-[14px]">Resert paper lorem ipsum.jpg</p>
                  </button>
                </div>
              </div>
              <div className="lg:col-span-2 border-[1.5px] border-[#d9d9d9] bg-white shadow-md rounded-xl p-6 self-start">
                <div className="flex mb-3  items-center justify-between">
                  <h3>College</h3> 
                  <button onClick={()=>{}} className="p-1 rounded hover:bg-[#f1f1f1] hover:text-[#497fff]">
                    <IoIosMore size={18}/>
                  </button>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-3">
                  <button className="flex items-center gap-[0.7rem] text-base px-[1.2rem] py-[.8rem] rounded-lg text-[#497fff] bg-[#f7f9ff]">
                    <FaFolder />
                    <p className="text-black truncate overflow-hidden text-ellipsis whitespace-nowrap w-24 text-[14px]">Assigments</p>
                  </button>
                  <button className="flex items-center gap-[0.7rem] text-base px-[1.2rem] py-[.8rem] rounded-lg text-[#497fff] bg-[#f7f9ff]">
                    <FaFolder />
                    <p className="text-black truncate overflow-hidden text-ellipsis whitespace-nowrap w-24 text-[14px]">Resert paper lorem ipsum</p>
                  </button>
                  <button className="flex items-center gap-[0.7rem] text-base px-[1.2rem] py-[.8rem] rounded-lg text-[#ec880c] bg-[#f7f9ff]">
                    <HiOutlinePresentationChartLine size={20} />
                    <p className="text-black truncate overflow-hidden text-ellipsis whitespace-nowrap w-24 text-[14px]">Resert paper lorem ipsum.ppt</p>
                  </button>
                  <button className="flex items-center gap-[0.7rem] text-base px-[1.2rem] py-[.8rem] rounded-lg text-[#3f82ee] bg-[#f7f9ff]">
                    <GoDatabase size={20} />
                    <p className="text-black truncate overflow-hidden text-ellipsis whitespace-nowrap w-24 text-[14px]">Resert paper lorem ipsum</p>
                  </button>
                  <button className="flex items-center gap-[0.7rem] text-base px-[1.2rem] py-[.8rem] rounded-lg text-[#3f82ee] bg-[#f7f9ff]">
                    <CgFileDocument size={20} />
                    <p className="text-black truncate overflow-hidden text-ellipsis whitespace-nowrap w-24 text-[14px]">Resert paper lorem ipsum.txt</p>
                  </button>
                  <button className="flex items-center gap-[0.7rem] text-base px-[1.2rem] py-[.8rem] rounded-lg text-[#3f82ee] bg-[#f7f9ff]">
                    <BsFileEarmarkZip size={20} />
                    <p className="text-black truncate overflow-hidden text-ellipsis whitespace-nowrap w-24 text-[14px]">Resert paper lorem ipsum.pdf.mp3</p>
                  </button>
                  <button className="flex items-center gap-[0.7rem] text-base px-[1.2rem] py-[.8rem] rounded-lg text-[#3f82ee] bg-[#f7f9ff]">
                    <SlPicture size={20} />
                    <p className="text-black truncate overflow-hidden text-ellipsis whitespace-nowrap w-24 text-[14px]">Resert paper lorem ipsum.jpg</p>
                  </button>
                </div>
              </div>
              <div className="lg:col-span-2 border-[1.5px] border-[#d9d9d9] bg-white shadow-md rounded-xl p-6 self-start">
                <div className="flex mb-3  items-center justify-between">
                  <h3>College</h3> 
                  <button onClick={()=>{}} className="p-1 rounded hover:bg-[#f1f1f1] hover:text-[#497fff]">
                    <IoIosMore size={18}/>
                  </button>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-3">
                  <button className="flex items-center gap-[0.7rem] text-base px-[1.2rem] py-[.8rem] rounded-lg text-[#497fff] bg-[#f7f9ff]">
                    <FaFolder />
                    <p className="text-black truncate overflow-hidden text-ellipsis whitespace-nowrap w-24 text-[14px]">Assigments</p>
                  </button>
                  <button className="flex items-center gap-[0.7rem] text-base px-[1.2rem] py-[.8rem] rounded-lg text-[#497fff] bg-[#f7f9ff]">
                    <FaFolder />
                    <p className="text-black truncate overflow-hidden text-ellipsis whitespace-nowrap w-24 text-[14px]">Resert paper lorem ipsum</p>
                  </button>
                  <button className="flex items-center gap-[0.7rem] text-base px-[1.2rem] py-[.8rem] rounded-lg text-[#ec880c] bg-[#f7f9ff]">
                    <HiOutlinePresentationChartLine size={20} />
                    <p className="text-black truncate overflow-hidden text-ellipsis whitespace-nowrap w-24 text-[14px]">Resert paper lorem ipsum.ppt</p>
                  </button>
                  <button className="flex items-center gap-[0.7rem] text-base px-[1.2rem] py-[.8rem] rounded-lg text-[#3f82ee] bg-[#f7f9ff]">
                    <GoDatabase size={20} />
                    <p className="text-black truncate overflow-hidden text-ellipsis whitespace-nowrap w-24 text-[14px]">Resert paper lorem ipsum</p>
                  </button>
                  <button className="flex items-center gap-[0.7rem] text-base px-[1.2rem] py-[.8rem] rounded-lg text-[#3f82ee] bg-[#f7f9ff]">
                    <CgFileDocument size={20} />
                    <p className="text-black truncate overflow-hidden text-ellipsis whitespace-nowrap w-24 text-[14px]">Resert paper lorem ipsum.txt</p>
                  </button>
                  <button className="flex items-center gap-[0.7rem] text-base px-[1.2rem] py-[.8rem] rounded-lg text-[#3f82ee] bg-[#f7f9ff]">
                    <BsFileEarmarkZip size={20} />
                    <p className="text-black truncate overflow-hidden text-ellipsis whitespace-nowrap w-24 text-[14px]">Resert paper lorem ipsum.pdf.mp3</p>
                  </button>
                  <button className="flex items-center gap-[0.7rem] text-base px-[1.2rem] py-[.8rem] rounded-lg text-[#3f82ee] bg-[#f7f9ff]">
                    <SlPicture size={20} />
                    <p className="text-black truncate overflow-hidden text-ellipsis whitespace-nowrap w-24 text-[14px]">Resert paper lorem ipsum.jpg</p>
                  </button>
                </div>
              </div>
            </div> */}
            
          </div>
        </main>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <p className="text-gray-700">
          Ini contoh konten modal seperti di Bootstrap, tapi dengan React + Tailwind.
        </p>
      </Modal>
    </div>
  );
};

function SectionViewMode({action, viewMode}){
  return  <div className="flex gap-1">
            <button
              className={`px-3 py-2 flex items-center gap-2 rounded ${viewMode === "grid" ? "text-[#497fff] bg-[#e1e7f4]":"bg-transparent text-[#929292]"}`}
              onClick={() => action("grid")}
            >
              <IoGridOutline size={15}/>
            </button>
            <button
              className={`px-3 py-2 flex items-center gap-2 rounded ${viewMode === "list" ? "text-[#497fff] bg-[#e1e7f4]":"bg-transparent text-[#929292]"}`}
              onClick={() => action("list")}
            >
              <FaListUl size={15}/>
            </button>
          </div>
}
function SectionGroupFilter({activeFilter, action}){
  const list_group_filters = [
    {
      label: 'Documents',
      extensions: ['doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'],
    },
    {
      label: 'Photos',
      extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'],
    },
    {
      label: 'Videos',
      extensions: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
    },
    {
      label: 'Compressed ZIPs',
      extensions: ['zip'],
    },
    {
      label: 'Audio',
      extensions: ['mp3'],
    },
    {
      label: 'Folders',
      extensions: [],
    },
    {
      label: 'Select type type',
      extensions: [],
    },
  ];
  
  return  <div className="flex flex-wrap gap-3">
            {list_group_filters.map((filter) => (
              <button
                key={filter.label}
                onClick={()=>{
                  action((prev) => ({
                    ...prev,
                    group: prev.group?.label===filter.label? null:filter,
                  }))
                }}
                className={`${activeFilter.group?.label === filter.label? "text-[#497fff] bg-[#e1e7f4]":"border border-gray-300 text-gray-700"} rounded-lg px-4 py-2 text-sm hover:bg-gray-100`}
              >
                {filter.label}
              </button>
            ))}
          </div>
}

function Modal({ isOpen, onClose }) {
  const [files, setFiles] = useState([]); // semua file, termasuk status progress
  const inputRef = useRef(null);

  // Handle browse click
  const handleBrowse = () => inputRef.current.click();

  // Handle file selection (tidak langsung upload)
  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      file,
      progress: 0,
      uploaded: false
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  // Handle drag & drop (tidak langsung upload)
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).map(file => ({
      file,
      progress: 0,
      uploaded: false
    }));
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleDragOver = (e) => e.preventDefault();

  // Remove file
  const handleRemove = (fileToRemove) => {
    setFiles(prev => prev.filter(f => f.file !== fileToRemove.file));
  };

  // Simulate upload saat klik tombol dengan delay 3 detik per file
  const handleUploadFiles = () => {
    files.forEach((f, index) => {
      if (f.uploaded) return; // skip jika sudah di-upload

      setTimeout(() => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setFiles(prev =>
            prev.map((fileObj, i) =>
              i === index ? { ...fileObj, progress: Math.min(progress, 100) } : fileObj
            )
          );
          if (progress >= 100) {
            clearInterval(interval);
            setFiles(prev =>
              prev.map((fileObj, i) =>
                i === index ? { ...fileObj, uploaded: true, progress: 100 } : fileObj
              )
            );
          }
        }, 200);
      }, index * 3000); // delay 3 detik per file
    });
  };

  // Close modal on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
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
          onClick={onClose} // klik di area luar modal menutup modal
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
            onClick={(e) => e.stopPropagation()} // klik di modal tidak menutup
          >
            {/* Header */}
            <div className="text-2xl font-semibold text-center p-4">
              <h2>Upload</h2>
            </div>

            {/* Body */}
            <div className="max-w-lg mx-auto p-6 space-y-4">
              {/* Drag & Drop Area */}
              <div
                className={`${files.length==0? `h-[300px]`:``} bg-[#f8f8ff] rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 transition`}
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

              {/* Uploading Files */}
              {uploadingCount > 0 && (
                <div>
                  <p className="font-medium mb-2">
                    Uploading - {files.filter(f => f.uploaded).length + 1}/
                    {files.length} files
                  </p>
                  {files
                    .filter(f => !f.uploaded)
                    .map((f) => (
                      <div key={f.file.name} className="mb-2">
                        <div className="relative border border-gray-400 rounded p-2 mb-2 text-sm">
                          <span className="truncate">{f.file.name}</span>
                          <button
                            onClick={() => handleRemove(f)}
                            className="absolute right-2 p-[2px] bg-gray-300 rounded-full text-white"
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
                        key={f.file.name}
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

export default FileManagerPage;
