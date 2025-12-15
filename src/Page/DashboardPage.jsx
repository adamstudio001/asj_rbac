import React, { useEffect, useRef, useState } from "react";
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
import { filterAndSortFiles, isEmpty } from "@/Common/Utils";
import Pagination from "@/Components/Pagination";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  return (
    // <ToastProvider>
      <DashboardContent />
    // </ToastProvider>
  );
};

const DashboardContent = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { folderKeys } = useParams();
  const { user, token, isAdminAccess, isCompanyAccess, isUserAccess, isExpired, refreshSession } = useAuth();

  const { 
    isModalOpen, 
    setIsModalOpen,
    viewMode, 
    viewModeFolders, 
    viewModeFiles, 
    activeFilter,
    setActiveFilter,
    getDirectory,
    findParentFolderKey
  } = useFileManager();

  const [groupFilters, setGroupFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [listFileFiltered, setListFileFiltered] = useState([]);
  const [listFiles, setListFiles] = useState([]);
  const [loadingFile, setLoadingFile] = useState(true);
  const [errorFile, setErrorFile] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fetchTimeout = useRef(null);

  const baseUrlFiles =
    isAdminAccess() || isCompanyAccess()
      ? `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1`
      : `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/app/company/1`;

  async function loadFilterAction() {
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

  const fetchFiles = async (fetchPage = page, fetchFolderKeys = folderKeys) => {
    setLoadingFile(true);

    if (fetchTimeout.current) clearTimeout(fetchTimeout.current);

    fetchTimeout.current = setTimeout(async () => {
      setErrorFile(null);

      try {
        if (isExpired()) await refreshSession();

        const searchQuery = activeFilter?.search ?? "";
        const url = isEmpty(fetchFolderKeys)
          ? `${baseUrlFiles}/storage/search?name=${searchQuery}&page=${fetchPage}`
          : `${baseUrlFiles}/storage/${fetchFolderKeys}?order_by[]=name&sort_by[]=asc&name=${searchQuery}&page=${fetchPage}`;

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const res = response.data;
        if (res?.success) {
          setListFiles(res.data || []);
          setTotalPages(res?.last_page ?? 1);
        } else {
          x ("error", res?.error || "Gagal mengambil file");
        }
      } catch (err) {
        addToast(
          "error",
          err?.response?.data?.error || err?.message || "Terjadi masalah saat mengambil file."
        );
      } finally {
        setLoadingFile(false);
      }
    }, 1500); // debounce
  };

  // Load filter & initial data
  useEffect(() => {
    if (token) loadFilterAction();
  }, [token, folderKeys]);

  // Reset page saat folder berubah & fetch page 1
  useEffect(() => {
    setPage(1);
    setActiveFilter((prev) => ({
      ...prev,
      search: "",
    }));
    fetchFiles(1, folderKeys);
  }, [folderKeys]);

  // Fetch saat page berubah (kecuali page=1 sudah di-handle di atas)
  useEffect(() => {
    if (page !== 1) fetchFiles(page, folderKeys);
  }, [page]);

  // Fetch saat search berubah (debounced)
  useEffect(() => {
    setPage(1);
    fetchFiles(1, folderKeys);
  }, [activeFilter.search]);

  // Filter & sort untuk UI
  useEffect(() => {
    setListFileFiltered(filterAndSortFiles(listFiles, activeFilter));
  }, [listFiles, activeFilter.group]);

  function renderPaging(){
        if(loadingFile){
          return  <div className="flex items-center justify-center">
            <div className="skeleton h-4 w-32 mt-8"></div>
          </div>;
        } else if(error){
          return <></>;
        }
    
        return <Pagination
            className="mt-8"
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
  }

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
                <button
                  onClick={() => navigate(-1)} className="flex w-[min-content] items-center gap-1 text-black font-bold px-1 py-2 rounded-md hover:bg-gray-300 transition">
                  <IoArrowBack />
                  Back
                </button>
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
                  <FileGridView lists={listFileFiltered} isLoading={loadingFile} error={errorFile} folderKeys={folderKeys}/>
                ) : (
                  <FileListView lists={listFileFiltered} isLoading={loadingFile} error={errorFile} folderKeys={folderKeys}/>
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
                    <FileGridView lists={listFileFiltered} isLoading={loadingFile} error={errorFile} folderKeys={folderKeys} mode="Folders"/>
                  ) : (
                    <FileListView lists={listFileFiltered} isLoading={loadingFile} error={errorFile} folderKeys={folderKeys} mode="Folders"/>
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
                    <FileGridView lists={listFileFiltered} isLoading={loadingFile} error={errorFile} folderKeys={folderKeys} mode="Files"/>
                  ) : (
                    <FileListView lists={listFileFiltered} isLoading={loadingFile} error={errorFile} folderKeys={folderKeys} mode="Files"/>
                  )}
                </div>
              </>
            }
            
            {renderPaging()}
          </div>
        </main>

      <ModalUpload refreshData={()=>{}} idFolder={folderKeys} token={token} isAdmin={isAdminAccess()} isCompany={isCompanyAccess()} isUser={isUserAccess()}/>
    </>
  );
};

function RecentOpened() {
  const navigate = useNavigate();
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];

  const [recents, setRecents] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [errorRecent, setErrorRecent] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const { addToast } = useToast();
  const { token, isExpired, refreshSession, isAdminAccess, isCompanyAccess } = useAuth();

  const baseUrlFiles =
    isAdminAccess() || isCompanyAccess()
      ? `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1`
      : `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/app/company/1`;

  useEffect(() => {
    if (!token) return;

    async function fetchRecent() {
      setLoadingRecent(true);
      setErrorRecent(false);

      setTimeout(async ()=>{
        try {
          if (isExpired()) await refreshSession();

          const res = await axios.get(
            `${baseUrlFiles}/storage/recent-activity`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const mapped = res.data.data.map((item) => ({
            storage_item_id: item.storage_item_id,
            name: item.storage_item_name,
            type: isEmpty(item.storage_item_extension)
              ? 'folder'
              : item.storage_item_extension.toLowerCase(),
            preview: imageExtensions.includes(item.storage_item_extension?.toLowerCase())
                  ? `https://staging-backend.rbac.asj-shipagency.co.id/download/${item.storage_item_name}`
                  : null,
          }));

          setRecents(mapped);
        } catch (err) {
          setErrorRecent(true);
          addToast(
            'error',
            err?.response?.data?.error ||
              err?.message ||
              'Terjadi masalah saat mengambil recent file.'
          );
        } finally {
          setLoadingRecent(false);
        }
      },1500);
    }

    fetchRecent();
  }, [token, reloadKey]);

  const clear = () => setRecents([]);

  const renderIcon = (file) => {
    if(imageExtensions.includes(file.type)){
      return <img
            src={file.preview}
            alt={file.name}
            className="w-full h-24 object-cover rounded-xl"
          />;
    }

    return getFileIconBig(file.name, file.type=="folder");
  };

  if (loadingRecent) {
    return (
      <>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-black">
          Recently Opened
        </h3>
        <button
          onClick={clear}
          className="text-[#999999] text-sm px-2 py-1 rounded-md hover:bg-gray-300 hover:text-black"
        >
          Clear
        </button>
      </div>
      
      <div
        className="grid gap-4 p-4"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-2xl p-4 space-y-3">
            <div className="skeleton h-24 w-full rounded-xl" />
            <div className="skeleton h-4 w-3/4" />
          </div>
        ))}
      </div>
      </>
    );
  }

  if (errorRecent) {
    return (
      <div className="flex flex-col items-center justify-center p-6 gap-1">
        <p className="text-sm text-gray-500">
          Gagal memuat recent file
        </p>
        <button
          onClick={() => setReloadKey((k) => k + 1)}
          className="
            px-3 py-1
            rounded
            border-0
            hover:border hover:border-gray-400
            active:border active:border-gray-500
            focus:outline-none focus:ring-2 focus:ring-gray-400
            transition-all duration-150
          "
        >
          Klik muat ulang
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-black">
          Recently Opened
        </h3>
        <button
          onClick={clear}
          className="text-[#999999] text-sm px-2 py-1 rounded-md hover:bg-gray-300 hover:text-black"
        >
          Clear
        </button>
      </div>

      <div
        className="grid gap-4 p-4"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}
      >
        {recents.map((file, idx) => (
          <button
            key={idx}
            onClick={()=>{
              if (file.type === 'folder') {
                navigate(`/filemanager/${file.storage_item_id}`);
              } else {
                window.open(
                  `https://staging-backend.rbac.asj-shipagency.co.id/download/${file.name}`,
                  '_blank',
                  'noopener,noreferrer'
                );
              }
            }}
            className="bg-gray-50 hover:bg-gray-100 cursor-pointer p-4 rounded-2xl flex flex-col items-center text-center shadow-sm"
          >
            <div className={imageExtensions.includes(file.type)? 'w-full' : 'w-[5cqi]'}>
              {renderIcon(file)}
            </div>
            <div className="text-sm truncate w-full">
              {file.name}
            </div>
          </button>
        ))}
      </div>
    </>
  );
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
              group:
                prev.group?.identifier === filter.identifier
                  ? null
                  : {
                      identifier: filter?.identifier ?? "", // WAJIB
                      label: filter?.label ?? "",          // string label
                      extensions: filter?.extensions ?? [], // array extension
                    },
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
