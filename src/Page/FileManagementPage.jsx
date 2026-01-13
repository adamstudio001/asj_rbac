import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "@src/Components/Navbar";
import Pagination from "@src/Components/Pagination";
import { useSearch } from "@src/Providers/SearchProvider";
import { IoIosArrowDown } from "react-icons/io";
import { useFileManager } from "@src/Providers/FileManagerProvider";
import {
  buildHeaders,
  filterAndSortFiles,
  formatDate,
  formatDatetime,
  formatFileSize,
  formatFileType,
  getFileIcon,
  getLabelByIdentifier,
  isEmpty,
} from "../Common/Utils";
import { useToast } from "@/Providers/ToastProvider";
import ModalUpload from "@/Components/ModalUpload";
import { TableRowActionMenu } from "@/Components/TableRowActionMenu";
import DeleteModal from "@/Components/DeleteModal";
import EllipsisTooltip from "@/Components/EllipsisTooltip";
import Copy from "@assets/copy.svg";
import Rename from "@assets/edit.svg";
import Trash from "@assets/trash.svg";
import FolderCreate from "@assets/folder_create.svg";
import RestoreFile from "@assets/restore.svg";
import UploadFile from "@assets/upload_file.svg";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/Components/ui/Dialog";
import BreadcrumbFolder from "@/Components/BreadcrumbFolder";
import { useNavigate, useParams } from "react-router-dom";
import FileInfoPopper from "@/Components/FileInfoPopper";
import { useAuth } from "@/Providers/AuthProvider";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
  DialogModal,
  DialogModalClose,
  DialogModalContent,
  DialogModalDescription,
  DialogModalFooter,
  DialogModalHeader,
  DialogModalTitle,
  DialogModalTrigger,
} from "@/Components/ui/DialogModal";
import CustomInput from "@/Components/CustomInput";
import { Button } from "@/Components/ui/Button";
// import { IoDownload } from "react-icons/io5";
import { Download } from "lucide-react";
import { MenuProvider, useMenu } from "@/Providers/MenuContext";
import { useLongPress } from "@/Hooks/useLongPress";
import { createFileObject } from "@/Common/FileFactory";
import UserProfileMenu from "@/Components/UserProfileMenu";
import { Checkbox } from "@/Components/ui/Checkbox";
import RadioGroup from "@/Components/RadioGroup";

const FileManagementPage = () => {
  return (
    // <ToastProvider>
    <MenuProvider>
      <FileManagementContent />
    </MenuProvider>
    // </ToastProvider>
  );
};

const FileManagementContent = () => {
  const { folderKeys } = useParams();
  const isRoot = isEmpty(folderKeys);
  const navigate = useNavigate();
  const { showMenu, data, setData } = useMenu();

  const { search, setSearch } = useSearch();
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { addToast } = useToast();
  const { setIsModalOpen } = useFileManager(); //#getFileDirectory

  const {
    user,
    token,
    logout,
    hasPermission,
    isAdminAccess,
    isCompanyAccess,
    isUserAccess,
    isExpired,
    refreshSession,
  } = useAuth();
  const [isModalFolderOpen, setIsModalFolderOpen] = useState(false);
  const [isModalRenameFileOpen, setIsModalRenameFileOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [itemType, setItemType] = useState([]);
  const [lists, setLists] = useState([]);
  const [listsPath, setListsPath] = useState([]);
  const [fileSelected, setFileSelected] = useState(null);
  // const [loading, setLoading] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [error, setError] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const [isWrapped, setIsWrapped] = useState(false);
  const textRef = useRef(null);
  const [files, setFiles] = useState([]);

  const [isLoadVisible, setIsLoadVisible] = useState(false);
  const [listVisible, setListVisible] = useState([]);

  useEffect(() => {
    if (!textRef.current) return;

    const ro = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // jika tinggi lebih dari line-height, berarti wrap
        const lineHeight = parseInt(
          getComputedStyle(entry.target).lineHeight,
          10
        );
        if (entry.contentRect.height > lineHeight) {
          setIsWrapped(true);
        } else {
          setIsWrapped(false);
        }
      }
    });

    ro.observe(textRef.current);

    return () => ro.disconnect();
  }, [textRef]);

  async function loadData() {
    if (isExpired()) {
      refreshSession();
    }

    const selectedItem = listVisible.find((v) => v.is_default);
    const selectedIdentifier = selectedItem?.identifier ?? "";

    const baseUrl =
      isAdminAccess() || isCompanyAccess()
        ? `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1`
        : `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/app/company/1`;

    const url = `${baseUrl}/${
      !isRoot ? `storage/${folderKeys}` : `storage`
    }?order_by[]=name&sort_by[]=asc&visibility_identifier=${selectedIdentifier}`;

    // --- Breadcrumb URL hanya jika folderKeys punya nilai ---
    const hasFolder =
      folderKeys !== undefined && folderKeys !== null && folderKeys !== "";
    const urlBreadcrumb = hasFolder
      ? `${baseUrl}/storage/${folderKeys}/path`
      : null;

    setIsLoad(true);

    setTimeout(async () => {
      try {
        // --- Buat array promise dinamis ---
        const promises = [
          axios.get(
            "https://staging-backend.rbac.asj-shipagency.co.id/api/v1/helper/storage-item-type",
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(url, { headers: { Authorization: `Bearer ${token}` } }),
        ];

        if (hasFolder) {
          promises.push(
            axios.get(urlBreadcrumb, {
              headers: { Authorization: `Bearer ${token}` },
            })
          );
        } else {
          // Push resolved promise berisi array kosong untuk breadcrumb
          promises.push(Promise.resolve({ data: { success: true, data: [] } }));
        }

        // === Jalankan paralel ===
        const [resItemType, resList, resBreadcrumb] = await Promise.all(
          promises
        );

        const dataList = resList.data;
        const dataBreadcrumb = resBreadcrumb.data;
        const dataItemType = resItemType.data;

        console.log(dataList?.success, dataBreadcrumb?.success); //undefined undefined
        if (
          (isEmpty(dataList?.success) && isEmpty(dataBreadcrumb?.success)) ||
          isEmpty(dataList?.success)
        ) {
          throw new Error(
            "One of the API responses returned unsuccessful status."
          );
        }

        setItemType(dataItemType?.data ?? []);
        setLists(dataList?.data ?? []);
        setTotalPages(dataList?.last_page ?? 1);
        setListsPath(dataBreadcrumb?.data ?? []);
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan saat memuat data.");
      } finally {
        setIsLoad(false);
      }
    }, 1500);
  }

  async function loadVisibility() {
    if (isExpired()) {
      refreshSession();
    }

    const url = `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/helper/storage-item-visibility`;

    setIsLoadVisible(true);

    setTimeout(async () => {
      try {
        // --- Buat array promise dinamis ---
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const body = res.data;

        setListVisible(body?.data ?? []);
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan saat memuat data.");
      } finally {
        setIsLoadVisible(false);
      }
    }, 1500);
  }

  useEffect(() => {
    setSearch("");
    loadVisibility();
  }, []);

  useEffect(() => {
    loadData();
  }, [folderKeys, listVisible]);

  // const files = getFileDirectory(lists, folderKeys);
  const sortedFiles = filterAndSortFiles(lists, {
    search: search,
    group: { extensions: [] },
  });

  async function deleteHandler() {
    if (!fileSelected) {
      addToast("error", "belum pilih file/folder yang di hapus");
      return;
    }

    if (isExpired()) {
      refreshSession();
    }

    let urlDelete = null; //[check] masih belum bedain antara delete folder dengan file
    if (fileSelected.type_identifier.toLowerCase() == "folder") {
      if (isAdminAccess() || isCompanyAccess()) {
        urlDelete = `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/storage/${folderKeys}/folder/${fileSelected.id}`;
      } else {
        urlDelete = `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/app/company/1/storage/${folderKeys}/folder/${fileSelected.id}`;
      }
    } else {
      if (isAdminAccess() || isCompanyAccess()) {
        urlDelete = `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/storage/${folderKeys}/file/${fileSelected.id}`;
      } else {
        urlDelete = `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/app/company/1/storage/${folderKeys}/file/${fileSelected.id}`;
      }
    }

    // setLoading(true);
    setIsModalDeleteOpen(false);
    try {
      const info = JSON.parse(sessionStorage.getItem("info") || "{}");
      const headers = buildHeaders(info, token);

      const request = await axios.delete(urlDelete, {
        headers: headers,
      });
      const response = request.data;

      if (response?.success) {
        addToast("success", response?.success);
        loadData();
      } else {
        addToast("errors", response?.error);
      }
      console.log(response);
    } catch (err) {
      console.error(err);
      // addToast("error", "ada masalah pada aplikasi");
    } finally {
      setIsModalDeleteOpen(false);
    }
  }

  function editHandler(file) {
    if (!file) {
      addToast("error", "belum pilih file/folder yang di edit");
      return;
    }

    if (file.type_identifier.toLowerCase() == "folder") {
      setIsModalFolderOpen(true);
      setFileSelected(file);
    } else {
      setIsModalRenameFileOpen(true);
      setFileSelected(file);
    }
  }

  async function downloadHandler(file) {
    if (!file) {
      addToast("error", "belum pilih file/folder yang di download");
      return;
    }
    if(file?.visibility_identifier!="GENERAL" && !hasPermission("DOWNLOAD_SECRET_FILE")){
      addToast("error", "anda tidak memiliki akses DOWNLOAD_SECRET_FILE");
      return;
    }

    if (isExpired()) {
      await refreshSession();
    }

    const urlDownload =
      isAdminAccess() || isCompanyAccess()
        ? `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/storage/${file.id}/url-download`
        : `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/app/company/1/storage/${file.id}/url-download`;

    // const newTab = window.open("about:blank");
    // if (!newTab) {
    //   addToast("error", "Popup diblokir. Izinkan pop-up untuk website ini.");
    //   return;
    // }

    setIsModalLoading(true);

    try {
      const info = JSON.parse(sessionStorage.getItem("info") || "{}");
      const headers = buildHeaders(info, token);

      const { data: response } = await axios.post(
        urlDownload,
        {},
        {
          headers: headers,
        }
      );
      console.log(response, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response?.success) {
        const urlTarget = response.data.download_url;

        const blobResponse = await axios.get(urlTarget, {
          responseType: "blob",
          // headers: { Authorization: `Bearer ${token}` },
        });

        const blob = new Blob([blobResponse.data]);
        const blobUrl = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = blobUrl;

        // fallback nama file
        a.download = file.name || "downloaded_file";
        document.body.appendChild(a);
        a.click();
        a.remove();

        // bersihkan
        window.URL.revokeObjectURL(blobUrl);
      } else {
        // newTab.close();
        addToast("error", response?.error);
      }
    } catch (err) {
      // newTab.close();

      addToast(
        "error",
        err?.response?.data?.error ||
          err?.message ||
          "Terjadi masalah saat mengambil file."
      );
    } finally {
      setIsModalLoading(false);
    }
  }

  function renderBreadCrumb() {
    if (isLoad) {
      return <div className="skeleton h-4 w-32"></div>;
    } else if (error) {
      return <></>;
    }

    return (
      <BreadcrumbFolder
        lists={listsPath}
        onNavigate={(key) => {
          if (key) navigate(`/filemanager/${key}`);
          else navigate(`/filemanager`);
        }}
      />
    );
  }

  function renderTable() {
    if (isLoad) {
      return (
        <table className="w-full table-auto border-collapse">
          <thead className="bg-[#F3F3F3]">
            <tr className="border border-gray-200">
              <th className="px-4 py-3 font-medium text-[14px] text-[#5B5B5B] w-[250px]">
                File Name
              </th>
              <th className="px-4 py-3 font-medium text-[14px] text-[#5B5B5B]">
                File Type
              </th>
              <th className="px-4 py-3 font-medium text-[14px] text-[#5B5B5B]">
                Last Modified
              </th>
              <th className="px-4 py-3 font-medium text-[14px] text-[#5B5B5B]">
                File Size
              </th>
            </tr>
          </thead>
          <tbody>
            {Array(3)
              .fill(null)
              .map((_, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">
                    <div className="skeleton h-4 w-full"></div>
                  </td>
                  <td className="border px-4 py-2">
                    <div className="skeleton h-4 w-full"></div>
                  </td>
                  <td className="border px-4 py-2">
                    <div className="skeleton h-4 w-full"></div>
                  </td>
                  <td className="border px-4 py-2">
                    <div className="skeleton h-4 w-full"></div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      );
    }

    return (
      <table className="w-full text-left text-sm">
        <thead className="bg-[#F3F3F3]">
          <tr className="border border-gray-200">
            <th className="px-4 py-3 font-medium text-[14px] text-[#5B5B5B] w-[250px]">
              File Name
            </th>
            <th className="px-4 py-3 font-medium text-[14px] text-[#5B5B5B]">
              File Type
            </th>
            <th className="px-4 py-3 font-medium text-[14px] text-[#5B5B5B]">
              Last Modified
            </th>
            <th className="px-4 py-3 font-medium text-[14px] text-[#5B5B5B]">
              File Size
            </th>
          </tr>
        </thead>
        <tbody>
          {error ? (
            <tr>
              <td colSpan={5} className="text-center flex-col gap-2">
                <p>{error}</p>
                <button
                  className="
                              px-3 py-1
                              rounded
                              border-0
                              hover:border hover:border-gray-400
                              active:border active:border-gray-500
                              focus:outline-none focus:ring-2 focus:ring-gray-400
                              transition-all duration-150
                            "
                  onClick={() => window.location.reload()}
                >
                  Klik muat ulang
                </button>
              </td>
            </tr>
          ) : (
            sortedFiles.map((file) => (
              <TableRowActionMenu
                key={file.id}
                isFolder={file.type_identifier.toLowerCase() == "folder"}
                refId={file.id}
                rowCells={
                  <>
                    <td className="px-4 py-3 text-gray-800 flex gap-2 items-center ">
                      {getFileIcon(
                        file.name,
                        file.type_identifier.toLowerCase() == "folder",
                        24
                      )}
                      <EllipsisTooltip className={"w-[250px]"}>
                        {file.name}
                      </EllipsisTooltip>
                    </td>
                    <td className="px-4 py-3">{formatFileType(file.name)}</td>
                    <td className="px-4 py-3">
                      {formatDate(file.updated_datetime)}
                    </td>
                    <td className="px-4 py-3">{formatFileSize(file.size)}</td>
                  </>
                }
              >
                <>
                  <button
                    className="flex gap-2 items-center w-full px-3 py-2 text-sm text-[#424242] hover:bg-[#F4F4F4] hover:rounded-sm hover:text-[#242424]"
                    onClick={() => setData(file)}
                  >
                    <img src={Copy} alt="copy" /> Copy
                  </button>
                  {hasPermission("DOWNLOAD_FILE") && (
                    <button
                      className="flex gap-2 items-center w-full px-3 py-2 text-sm text-[#424242] hover:bg-[#F4F4F4] hover:rounded-sm hover:text-[#242424]"
                      onClick={() => downloadHandler(file)}
                    >
                      <Download size={18} /> Download
                    </button>
                  )}
                  <button
                    className="flex gap-2 items-center w-full px-3 py-2 text-sm text-[#424242] hover:bg-[#F4F4F4] hover:rounded-sm hover:text-[#242424]"
                    onClick={() => editHandler(file)}
                  >
                    <img src={Rename} alt="Rename" /> Rename
                  </button>
                  {hasPermission("GET_INFO_FILE_FOLDER") && (
                    <FileInfoPopper
                      file={file}
                      changeFile={setSelectedFile}
                      eventInfoModal={setIsInfoModalOpen}
                      paths={listsPath}
                      types={itemType}
                    />
                  )}
                  {hasPermission("REMOVE_FILE_FOLDER") && (
                    <button
                      className="flex gap-2 items-center w-full px-3 py-2 text-sm text-[#424242] hover:bg-[#F4F4F4] hover:rounded-sm hover:text-[#242424]"
                      onClick={() => {
                        setFileSelected(file);
                        setIsModalDeleteOpen(true);
                      }}
                    >
                      <img src={Trash} alt="Trash" /> Remove
                    </button>
                  )}
                </>
              </TableRowActionMenu>
            ))
          )}
        </tbody>
      </table>
    );
  }

  function renderPaging() {
    if (isLoad) {
      return (
        <div className="flex items-center justify-center">
          <div className="skeleton h-4 w-32 mt-8"></div>
        </div>
      );
    } else if (error) {
      return <></>;
    }

    return (
      <Pagination
        className="mt-8"
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    );
  }

  const handleContextMenu = (e) => {
    e.preventDefault();
    showMenu(e.clientX, e.clientY, async (d) => {
      const fileObj = await createFileObject({
        reference: d,
        name: d?.name ?? "unknown",
      });
      setFiles([fileObj]);
      setIsModalOpen(true);
    });
  };

  const longPress = useLongPress((e) => {
    showMenu(e.touches[0].clientX, e.touches[0].clientY, (d) => {
      setIsModalOpen(true);
    });
  });

  return (
    <>
      <Navbar
        renderActionModal={() => (
          <div className="flex flex-wrap items-center max-[400px]:flex-wrap gap-4">
            {isLoadVisible ? (
              <>
                <div className="skeleton h-4 w-8"></div>
                <div className="skeleton h-4 w-8"></div>
              </>
            ) : (
              listVisible.map((visible, index) =>
                visible?.identifier == "GENERAL" ||
                (visible?.identifier == "SECRET" &&
                  hasPermission("VIEW_SECRET_FOLDER_FILE")) ||
                (visible?.identifier == "SUPER_SECRET" &&
                  hasPermission("VIEW_SUPER_SECRET_FOLDER_FILE")) ? (
                  <>
                    <label
                      key={visible.id ?? index}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        key={visible?.identifier}
                        checked={!!visible?.is_default}
                        onCheckedChange={(checked) => {
                          setListVisible((prev) =>
                            prev.map((v) => {
                              if (v.identifier === visible.identifier) {
                                // toggle current item
                                return { ...v, is_default: !v.is_default };
                              }
                              // unselect all others
                              return { ...v, is_default: false };
                            })
                          );
                        }}
                      />
                      <span>{visible.label}</span>
                    </label>
                  </>
                ) : (
                  <></>
                )
              )
            )}

            <div
              className={`max-w-[24rem]:w-full flex flex-wrap items-center gap-4`}
            >
              {((isRoot && hasPermission("CREATE_FOLDER")) ||
                (!isRoot && hasPermission("CREATE_FOLDER"))) && (
                <button //!isRoot || (isUserAccess() || isCompanyAccess())
                  onClick={() => {
                    setIsModalFolderOpen(true);
                    setFileSelected(null);
                  }}
                  className="flex max-sm:flex-1 items-center gap-3 bg-[#1B2E48] text-white font-inter font-medium text-[14px] px-4 py-2 rounded-md hover:bg-[#1b2e48d9] transition"
                >
                  <img src={FolderCreate} width={18} />
                  Create Folder
                </button>
              )}
              {/* {isAdminAccess &&  */}
              <button
                onClick={() => {}}
                className="flex max-sm:flex-1 items-center gap-3 bg-[#F3F3F3] text-[#1E293B] font-inter font-medium text-[14px] px-4 py-2 rounded-md hover:bg-[#e6e5e5] transition"
              >
                <img src={RestoreFile} width={18} />
                Restore File
              </button>
              {/* } */}
              {folderKeys && hasPermission("UPLOAD_FILE") && (
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                  className={`${
                    isWrapped ? "w-full" : "max-w-[24rem]"
                  } flex max-sm:flex-1 items-center gap-3 bg-[#1B2E48] text-white font-inter font-medium text-[14px] px-4 py-2 rounded-md hover:bg-[#1b2e48d9] transition`}
                >
                  <img src={UploadFile} width={18} />
                  Upload file
                </button>
              )}
            </div>

            {/* <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                C
              </div>
              <div className="flex items-center gap-1">
                <span ref={textRef} className="font-medium text-gray-800">{user?.full_name ?? "Unknown"}</span>
                <IoIosArrowDown className="w-4 text-[#a5a5a5]" />
              </div>
            </div> */}
            <UserProfileMenu
              reftext={textRef}
              user={user}
              onLogout={() => logout()}
            />
          </div>
        )}
      />

      <main
        className="flex-1 items-center py-6 px-[2.5cqi] overflow-auto scroll-custom"
        onContextMenu={(e) => handleContextMenu(e)}
        {...longPress}
      >
        <div className="w-full mb-8 pb-4 sm:w-auto flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="w-full rounded-lg space-y-6">
          {" "}
          {/* overflow-x-scroll scroll-custom  */}
          {renderBreadCrumb()}
          {renderTable()}
        </div>

        {renderPaging()}
      </main>

      {/* Modal Delete */}
      <DeleteModal
        titleMessage="Delete File"
        message={"Are you sure want to delete this file?"}
        isOpen={isModalDeleteOpen}
        onClose={() => setIsModalDeleteOpen(false)}
        onConfirm={() => deleteHandler()}
      />

      {/* Modal Info */}
      <Dialog
        open={isInfoModalOpen}
        onOpenChange={() => setIsInfoModalOpen(false)}
      >
        <DialogContent className="flex flex-col p-0 max-h-[min(640px,80vh)] sm:max-w-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
            {/* <h2 className="text-base font-semibold">
              {selectedFile?.name || "File Info"}
            </h2> */}
            <DialogTitle className="text-xl">
              {selectedFile?.name || "File Info"}
            </DialogTitle>
            <DialogClose asChild>
              <div className="p-1 rounded text-black hover:text-white hover:bg-black inline-flex items-center justify-center cursor-pointer group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:stroke-white" // <-- stroke berubah saat hover
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </div>
            </DialogClose>
          </div>
          <div className="px-6 text-sm overflow-y-auto scroll-custom space-y-8">
            {/* General Section */}
            <div>
              <h3 className="font-inter font-semibold text-[14px] mb-2">
                General:
              </h3>
              <div className="space-y-1 font-inter text-[14px]">
                <table className="text-[14px] font-inter w-full table-fixed">
                  <tbody>
                    <tr>
                      <td className="font-normal text-gray-500 text-right align-top pr-3 w-24">
                        Kind:
                      </td>
                      <td className="font-medium">
                        {getLabelByIdentifier(
                          selectedFile?.type_identifier,
                          itemType
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-normal text-gray-500 text-right pr-3">
                        Size:
                      </td>
                      <td className="font-medium">
                        {selectedFile?.size || ""}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-normal text-gray-500 text-right align-top pr-3">
                        Where:
                      </td>
                      <td className="font-medium leading-snug break-words">
                        {[
                          ...(listsPath?.map((item) => item.name) || []),
                          selectedFile?.name || "",
                        ]
                          .filter(Boolean)
                          .join(" > ")}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-normal text-gray-500 text-right pr-3">
                        Created:
                      </td>
                      <td className="font-medium">
                        {formatDatetime(selectedFile?.created_datetime || "")}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-normal text-gray-500 text-right pr-3">
                        Modified:
                      </td>
                      <td className="font-medium">
                        {formatDatetime(selectedFile?.updated_datetime || "")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* More Info Section */}
            <div>
              <h3 className="font-inter font-semibold text-[14px] mb-2">
                More Info:
              </h3>
              <div className="space-y-1 font-inter text-[14px]">
                <table className="text-[14px] font-inter w-full table-fixed">
                  <tbody>
                    <tr>
                      <td className="font-normal text-gray-500 text-right align-top pr-3 w-24">
                        Kind:
                      </td>
                      <td className="font-medium">
                        {getLabelByIdentifier(
                          selectedFile?.type_identifier,
                          itemType
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-normal text-gray-500 text-right align-top pr-3">
                        Where From:
                      </td>
                      <td className="font-medium leading-snug break-words">
                        {[
                          ...(listsPath?.map((item) => item.name) || []),
                          selectedFile?.name || "",
                        ]
                          .filter(Boolean)
                          .join(" > ")}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-normal text-gray-500 text-right pr-3">
                        Created By:
                      </td>
                      <td className="font-medium">
                        {selectedFile?.createdByUser
                          ? `${selectedFile.createdByUser.full_name} (${
                              selectedFile.createdByUser.employment?.[0]?.role
                                ?.name ?? "-"
                            })`
                          : ""}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-normal text-gray-500 text-right pr-3">
                        Lastest Modified:
                      </td>
                      <td className="font-medium">
                        {selectedFile?.updatedByUser
                          ? `${selectedFile.updatedByUser.full_name} (${
                              selectedFile.updatedByUser.employment?.[0]?.role
                                ?.name ?? "-"
                            })`
                          : ""}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Upload */}
      <ModalUpload
        refreshData={() => loadData()}
        idFolder={folderKeys}
        token={token}
        hasPermission={hasPermission("UPLOAD_FILE")}
        initialFiles={files}
        isAdmin={isAdminAccess()}
        isCompany={isCompanyAccess()}
        isUser={isUserAccess()}
        listVisible={listVisible}
      />

      {/* Modal Folder */}
      <ModalFolder
        open={isModalFolderOpen}
        onOpenChange={setIsModalFolderOpen}
        folderKeys={folderKeys}
        data={fileSelected}
        mode={fileSelected ? "edit" : "create"}
        extraAction={() => loadData()}
        listVisible={listVisible}
      />

      <ModalRenameFile
        open={isModalRenameFileOpen}
        onOpenChange={setIsModalRenameFileOpen}
        folderKeys={folderKeys}
        data={fileSelected}
        extraAction={() => loadData()}
        listVisible={listVisible}
      />

      <ModalLoader show={isModalLoading} />
    </>
  );
};

export default FileManagementPage;

export function ModalFolder({
  open,
  onOpenChange,
  folderKeys,
  data,
  mode,
  extraAction = function () {},
  listVisible = [],
}) {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      folder_name: data?.name ?? "",
    },
  });

  const { addToast } = useToast();
  const {
    token,
    hasPermission,
    isAdminAccess,
    isCompanyAccess,
    isExpired,
    refreshSession,
  } = useAuth();
  const isEdit = mode == "edit";
  const isRoot =
    !folderKeys ||
    folderKeys === null ||
    folderKeys === undefined ||
    folderKeys === Object;

  useEffect(() => {
    reset({
      folder_name: data?.name ?? "",
    });
  }, [data, reset]);

  const onSubmit = async (values) => {
    if (isExpired()) {
      refreshSession();
    }

    setLoading(true);
    // setErrorMessage("");
    try {
      const formData = {
        folder_name: values.folder_name,
        visibility_identifier: category ?? "GENERAL",
      };
      if (!isEdit && !hasPermission("CREATE_FOLDER")) {
        addToast("error", "anda tidak memiliki permission CREATE_FOLDER");
        setLoading(false);
        return;
      }

      let url = null;
      if (isAdminAccess() || isCompanyAccess()) {
        if (isEdit) {
          url = `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/storage/${folderKeys}/folder/${data.id}`;
        } else {
          url = `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/storage/${folderKeys}/folder`;
        }
      } else {
        if (isRoot) {
          if (isEdit) {
            alert("fitur edit root folder belum ada");
          } else {
            url = `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/app/company/1/storage/root/folder`;
          }
        } else {
          if (isEdit) {
            url = `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/app/company/1/storage/${folderKeys}/folder/${data.id}`;
          } else {
            url = `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/app/company/1/storage/${folderKeys}/folder`;
          }
        }
      }

      const info = JSON.parse(sessionStorage.getItem("info") || "{}");
      const headers = buildHeaders(info, token);

      const res = isEdit
        ? await axios.put(url, formData, {
            headers: headers,
          })
        : await axios.post(url, formData, {
            headers: headers,
          });
      const body = res.data;
      console.log(body);

      if (body.error) {
        addToast("error", body.error);
      } else if (body.success) {
        addToast("success", body.success);
        onOpenChange(false);
        extraAction();
      }
    } catch (err) {
      console.error(err);
      addToast("error", "ada masalah pada aplikasi");
    } finally {
      setLoading(false);
    }

    // reset();
    // onOpenChange(false);
    // addToast("success", "Save successfully");
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <DialogModal open={open} onOpenChange={onOpenChange}>
      <DialogModalContent className="flex flex-col gap-0 p-0 sm:max-h-full sm:max-w-5xl">
        {" "}
        {/*max-h-[min(640px,80vh)]*/}
        <DialogModalHeader>
          <DialogModalTitle className="px-6 py-4 font-inter font-bold text-[22px] text-[#1B2E48]">
            {mode == "edit" ? `Rename Folder` : `New Folder`}
          </DialogModalTitle>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="overflow-y-auto scroll-custom"
          >
            <DialogModalDescription asChild>
              <div className="px-6 pb-8 space-y-8">
                <CustomInput
                  label="Folder Name"
                  name="folder_name"
                  register={register}
                  errors={errors}
                  rules={{
                    required: "Folder name is required",
                  }}
                />

                <RadioGroup
                  className="justify-end"
                  value={category}
                  onChange={setCategory}
                  orientation="horizontal"
                  options={listVisible}
                />
              </div>
            </DialogModalDescription>

            <DialogModalFooter className="px-6 pb-6 items-center">
              <Button
                type="submit"
                disabled={loading}
                className="w-full max-w-[40cqi] bg-[#1a2f48] hover:bg-[#1a2f48]/80 text-white"
              >
                {loading ? "Sending..." : "Save"}
              </Button>
            </DialogModalFooter>
          </form>
        </DialogModalHeader>
      </DialogModalContent>
    </DialogModal>
  );
}

export function ModalRenameFile({
  open,
  onOpenChange,
  folderKeys,
  data,
  extraAction = function () {},
  listVisible = [],
}) {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      file_name: data?.name ?? "",
    },
  });

  const { addToast } = useToast();
  const {
    token,
    hasPermission,
    isAdminAccess,
    isCompanyAccess,
    isExpired,
    refreshSession,
  } = useAuth();

  useEffect(() => {
    reset({
      file_name: data?.name ?? "",
    });
  }, [data, reset]);

  const onSubmit = async (values) => {
    if (isExpired()) {
      refreshSession();
    }

    setLoading(true);
    // setErrorMessage("");
    try {
      console.log(values);
      const formData = {
        file_name: values.file_name,
        visibility_identifier: category ?? "GENERAL",
      };
      const url =
        isAdminAccess() || isCompanyAccess()
          ? `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/storage/${folderKeys}/file/${data.id}`
          : `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/app/company/1/storage/${folderKeys}/file/${data.id}`;

      const info = JSON.parse(sessionStorage.getItem("info") || "{}");
      const headers = buildHeaders(info, token);

      const res = await axios.put(url, formData, {
        headers: headers,
      });
      const body = res.data;
      console.log(body);

      if (body.error) {
        addToast("error", body.error);
      } else if (body.success) {
        addToast("success", body.success);
        onOpenChange(false);
        extraAction();
      }
    } catch (err) {
      console.error(err);
      addToast("error", "ada masalah pada aplikasi");
    } finally {
      setLoading(false);
    }

    // reset();
    // onOpenChange(false);
    // addToast("success", "Save successfully");
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <DialogModal open={open} onOpenChange={onOpenChange}>
      <DialogModalContent className="flex flex-col gap-0 p-0 sm:max-h-full sm:max-w-5xl">
        {" "}
        {/*max-h-[min(640px,80vh)]*/}
        <DialogModalHeader>
          <DialogModalTitle className="px-6 py-4 font-inter font-bold text-[22px] text-[#1B2E48]">
            Rename File
          </DialogModalTitle>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="overflow-y-auto scroll-custom"
          >
            <DialogModalDescription asChild>
              <div className="px-6 pb-8 space-y-8">
                <CustomInput
                  label="File Name"
                  name="file_name"
                  register={register}
                  errors={errors}
                  rules={{
                    required: "File name is required",
                  }}
                />

                <RadioGroup
                  className="justify-end"
                  value={category}
                  onChange={setCategory}
                  orientation="horizontal"
                  options={listVisible}
                />
              </div>
            </DialogModalDescription>

            <DialogModalFooter className="px-6 pb-6 items-center">
              <Button
                type="submit"
                disabled={loading}
                className="w-full max-w-[40cqi] bg-[#1a2f48] hover:bg-[#1a2f48]/80 text-white"
              >
                {loading ? "Sending..." : "Save"}
              </Button>
            </DialogModalFooter>
          </form>
        </DialogModalHeader>
      </DialogModalContent>
    </DialogModal>
  );
}

export function ModalLoader({ show = false }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-full px-6 py-3 flex items-center gap-3 shadow-xl">
        <span className="text-gray-700 font-medium">Loading...</span>

        <div className="w-6 h-6 border-4 border-gray-300 border-t-[#1e293b] rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
