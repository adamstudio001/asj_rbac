import React, { useEffect, useState } from "react";
import FileGridView from "@src/Components/FileGridView";
import FileListView from "@src/Components/FileListView";
import { IoGridOutline } from "react-icons/io5";
import { FaListUl } from "react-icons/fa6";
import { useFileManager } from "@src/Providers/FileManagerProvider";
import { NavLink, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { getFileIconBig } from '@src/Common/Utils';
import Navbar from "@src/Components/Navbar";
import { LuUpload } from "react-icons/lu";
import ImgItems from "@assets/item-img.png";
import { IoIosArrowDown } from "react-icons/io";
// import { ToastProvider } from "@src/Providers/ToastProvider";
import ModalUpload from "@/Components/ModalUpload";
import { useAuth } from "@/Providers/AuthProvider";
import axios from "axios";
import { useToast } from "@/Providers/ToastProvider";

const DashboardPage = () => {
  return (
    // <ToastProvider>
      <DashboardContent />
    // </ToastProvider>
  );
};

const DashboardContent = () => {
  const { addToast } = useToast();
  const { folderKeys } = useParams();
  const { user, token, isAdminAccess, isCompanyAccess, isUserAccess, isExpired, refreshSession } = useAuth();

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

  const [groupFilters, setGroupFilters] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadData() {
      setLoading(true);
      setError(null);

      setTimeout(async ()=>{
        try {
          // PARALLEL REQUEST
          const [filtersRes, listRes] = await Promise.all([
            axios.get(
              "https://staging-backend.rbac.asj-shipagency.co.id/api/v1/helper/storage-item-type",
              { headers: { Authorization: `Bearer ${token}` } }
            ),
            Promise.resolve({ data: { data: [] } })
          ]);

          if(filtersRes && listRes){
            // MAP FILTERS
            const mappedFilters = filtersRes.data.data.map((item) => ({
              label: item.label,
              identifier: item.identifier,
              extensions: item.extension ?? [],
            }));

            setGroupFilters(mappedFilters);
            setLists(listRes.data.data ?? []);
          } else{
            setError("ada masalah dalam load data");
          }
        } catch (err) {
          addToast(
            "error",
            err?.response?.data?.error ||
            err?.message ||
            "Terjadi masalah saat mengambil file."
          );
        } finally {
          setLoading(false);
        }
      },1500);
  }
  
  useEffect(() => {
    loadData();
  }, [token, folderKeys]);

  return (
    <>
      <Navbar renderActionModal={()=> (
        <div className="flex items-center gap-8">
                    <button onClick={()=>{
                      alert("feature in development");
                      // setIsModalOpen(!isModalOpen);
                    }} className="flex items-center gap-3 bg-[#1B2E48] text-white font-inter font-medium text-[14px] px-4 py-2 rounded-md hover:bg-[#1b2e48d9] transition">
                    <LuUpload size={18}/> 
                    Upload file
                    </button>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                        C
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-800">{user?.full_name ?? "Unknown"}</span>
                        <IoIosArrowDown className="w-4 text-[#a5a5a5]"/>
                      </div>
                    </div>
                </div>
      )}/>
      <main className="flex-1 overflow-auto items-center p-6">
          <div className="px-[2cqi] sm:px-[10cqi] w-full">
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
                <NavLink to={`/dashboard/${findParentFolderKey(folderKeys)==null? "":findParentFolderKey(folderKeys)}`} className="flex w-[min-content] items-center gap-1 text-black font-bold px-1 py-2 rounded-md hover:bg-gray-300 transition">
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
                    <h1 className="text-sm font-medium text-black font-inter text-[14px] leading-[100%]">Files</h1>
                    <SectionViewMode />
                  </div>
                  <SectionGroupFilter 
                    groupFilters={groupFilters}
                    loading={loading}
                    error={error}
                  />
                </div>
                
                {viewMode === "grid" ? (
                  <FileGridView lists={lists} folderKeys={folderKeys}/>
                ) : (
                  <FileListView lists={lists} folderKeys={folderKeys}/>
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
                    <FileGridView lists={lists} folderKeys={folderKeys} mode="Folders"/>
                  ) : (
                    <FileListView lists={lists} folderKeys={folderKeys} mode="Folders"/>
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
          </div>
        </main>

      <ModalUpload refreshData={()=>{}} idFolder={folderKeys} token={token} isAdmin={isAdminAccess()} isCompany={isCompanyAccess()} isUser={isUserAccess()}/>
    </>
  );
};

function RecentOpened(){
  const [recents, setRecents] = useState([
    { name: "Laporan Absensi Karyawan", type: "folder" },
    { name: "Surat Izin Cuti.docx", type: "doc" },
    { name: "Monthly Report Presentation.pptx", type: "image", preview: ImgItems },
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
      <h3 className="text-sm font-medium text-black font-inter text-[14px] leading-[100%]">Recenly Opened</h3>
      <button
        onClick={() => clear()}
        className="flex w-[min-content] items-center gap-1 text-[#999999] font-inter font-medium text-[14px] leading-[100%] px-2 py-1 rounded-md hover:bg-gray-300 hover:text-black transition"
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
          <div className="font-inter font-medium text-[13px] leading-[18px] text-gray-900 truncate w-full">
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
              className={`p-2 flex items-center gap-2 rounded ${getMode() === "grid" ? "text-[#497FFF] bg-[#7979791A]":"bg-transparent text-[#929292]"}`}
              onClick={() => changeMode("grid")}
            >
              <IoGridOutline size={15}/>
            </button>
            <button
              className={`p-2 flex items-center gap-2 rounded ${getMode() === "list" ? "text-[#497FFF] bg-[#7979791A]":"bg-transparent text-[#929292]"}`}
              onClick={() => changeMode("list")}
            >
              <FaListUl size={15}/>
            </button>
          </div>
}

function SectionGroupFilter({ groupFilters, loading, error }) {
  const { activeFilter, setActiveFilter } = useFileManager();

  if (loading) {
    return <div className="flex flex-wrap gap-3">
      <div className="skeleton h-6 w-16"></div>
      <div className="skeleton h-6 w-16"></div>
      <div className="skeleton h-6 w-16"></div>
      <div className="skeleton h-6 w-16"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  if (!groupFilters.length) {
    return <div className="text-gray-500 text-sm">No filters available</div>;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {groupFilters.map((filter) => (
        <button
          key={filter.identifier}
          onClick={() =>
            setActiveFilter((prev) => ({
              ...prev,
              group: prev.group?.identifier === filter.identifier ? null : filter,
            }))
          }
          className={`${
            activeFilter.group?.identifier === filter.identifier
              ? "text-[#497fff] bg-[#e1e7f4]"
              : "border border-gray-300 text-gray-700"
          } rounded-lg px-4 py-2 font-dmSans text-[12px] hover:bg-gray-100`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}


export default DashboardPage;
