import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import FileGridView from "@src/Components/FileGridView";
import FileListView from "@src/Components/FileListView";
import { IoGridOutline } from "react-icons/io5";
import { FaListUl } from "react-icons/fa6";
import { useFileManager } from "@src/Providers/FileManagerProvider";
import { NavLink, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { getFileIconBig } from '@src/Common/Utils';
import { v4 as uuidv4 } from 'uuid';
import Navbar from "@src/Components/Navbar";
import { LuUpload } from "react-icons/lu";


const FileManagerPage = () => {
  const { folderKeys } = useParams();
  console.log(folderKeys)

  const { 
    isModalOpen, 
    setIsModalOpen,
    viewMode, 
    viewModeFolders, 
    viewModeFiles, 
    setActiveFilter,
    getDirectory,
    findParentFolderKey
  } = useFileManager();

  return (
    <>
      <Navbar renderActionModal={()=> (
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
      )}/>
      <main className="flex-1 overflow-auto items-center p-6">
          <div className="px-[10vw] w-full">
            {
              !folderKeys?  
              <>
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
                    className="w-full px-4 py-2 text-lg bg-[#f5f4f4] rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#497fff] focus:bg-white"
                  />
                </div>

                <div className="mt-16">
                  <RecentOpened />
                </div>
              </> : 
              <>
                <NavLink to={`/filemanager/${findParentFolderKey(folderKeys)==null? "":findParentFolderKey(folderKeys)}`} className="flex w-[min-content] items-center gap-1 text-black font-bold px-1 py-2 rounded-md hover:bg-gray-300 transition">
                  <IoArrowBack />
                  Back
                </NavLink>
                <h2 className="text-black text-3xl my-4">{getDirectory(folderKeys)}</h2>
              </>
            }

            {
              folderKeys == null?
              <div className="py-6 space-y-4">
                <div>
                  <div className="flex justify-between items-center p-2">
                    <h1 className="text-sm font-bold text-[#5b5b5b]">Files</h1>
                    <SectionViewMode />
                  </div>
                  <SectionGroupFilter />
                </div>
                
                {viewMode === "grid" ? (
                  <FileGridView folderKeys={folderKeys}/>
                ) : (
                  <FileListView folderKeys={folderKeys}/>
                )}
              </div> : 
              <>
                <div className="py-6 space-y-4">
                  <div>
                    <div className="flex justify-between items-center p-2">
                      <h1 className="text-sm font-bold text-[#5b5b5b]">Folders</h1>
                      <SectionViewMode isNested={true} mode="Folders"/>
                    </div>
                  </div>
                  
                  {viewModeFolders === "grid" ? (
                    <FileGridView folderKeys={folderKeys} mode="Folders"/>
                  ) : (
                    <FileListView folderKeys={folderKeys} mode="Folders"/>
                  )}
                </div>
                <div className="py-6 space-y-4">
                  <div>
                    <div className="flex justify-between items-center p-2">
                      <h1 className="text-sm font-bold text-[#5b5b5b]">Files</h1>
                      <SectionViewMode isNested={true} mode="Files"/>
                    </div>
                  </div>
                  
                  {viewModeFiles === "grid" ? (
                    <FileGridView folderKeys={folderKeys} mode="Files"/>
                  ) : (
                    <FileListView folderKeys={folderKeys} mode="Files"/>
                  )}
                </div>
              </>
            }

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

function RecentOpened(){
  const [recents, setRecents] = useState([
    { name: "Laporan Absensi Karyawan", type: "folder" },
    { name: "Surat Izin Cuti.docx", type: "doc" },
    { name: "Monthly Report Presentation.pptx", type: "image", preview: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
    { name: "Payroll-2026.xlsx", type: "excel" },
  ]);

  const renderIcon = (file) => {
    switch (file.type) {
      case "image":
        return (
          <img
            src={file.preview}
            alt={file.name}
            className="w-full h-24 object-cover rounded-xl"
          />
        );
      default:
        return getFileIconBig(file.name, file.type=="folder");
    }
  };

  function clear(){
    setRecents([]);
  }

  return <>
    <div className="flex justify-between items-center">
      <h3 className="text-sm font-bold text-[#5b5b5b]">Recenly Opened</h3>
      <button
        onClick={() => clear()}
        className="flex w-[min-content] items-center gap-1 text-[#999999] px-2 py-1 rounded-md hover:bg-gray-300 hover:text-black transition"
      >
        Clear
      </button>
    </div>

    <div
      className="grid gap-4 p-4"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
    >
      {recents.map((file, idx) => (
        <div
          key={idx}
          className="bg-gray-50 space-y-2 hover:bg-gray-100 cursor-pointer p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm transition"
        >
          <div className={`${file.type === "image" ? "w-full" : "w-[5cqi]"}`}>
            {renderIcon(file)}
          </div>
          <div className="text-sm font-medium text-gray-900 truncate w-full">
            {file.name}
          </div>
        </div>
      ))}
    </div>
  </>
}

function SectionViewMode({isNested = false, mode=null}){
  const { 
    viewMode, 
    setViewMode,
    viewModeFolders, 
    setViewModeFolders,
    viewModeFiles, 
    setViewModeFiles,
  } = useFileManager();

  function changeMode(target){
    console.log({target, isNested, mode})
    if(!isNested && mode==null){
      setViewMode(target)
    } else if(isNested && mode=="Folders"){
      setViewModeFolders(target);
    } else if(isNested && mode=="Files"){
      setViewModeFiles(target);
    }
  }

  function getMode(){
    if(!isNested && mode==null){
      return viewMode;
    } else if(isNested && mode=="Folders"){
      return viewModeFolders
    } else if(isNested && mode=="Files"){
      return viewModeFiles;
    }
  }

  return  <div className="flex gap-1">
            <button
              className={`px-3 py-2 flex items-center gap-2 rounded ${getMode() === "grid" ? "text-[#497fff] bg-[#e1e7f4]":"bg-transparent text-[#929292]"}`}
              onClick={() => changeMode("grid")}
            >
              <IoGridOutline size={15}/>
            </button>
            <button
              className={`px-3 py-2 flex items-center gap-2 rounded ${getMode() === "list" ? "text-[#497fff] bg-[#e1e7f4]":"bg-transparent text-[#929292]"}`}
              onClick={() => changeMode("list")}
            >
              <FaListUl size={15}/>
            </button>
          </div>
}

function SectionGroupFilter(){
  const { 
    activeFilter, 
    setActiveFilter,
  } = useFileManager();

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
                  setActiveFilter((prev) => ({
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

export default FileManagerPage;
