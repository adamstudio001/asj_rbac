import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "@src/Components/Navbar";
import Pagination from "@src/Components/Pagination";
import { useSearch } from "@src/Providers/SearchProvider";
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
import { FiRotateCcw } from "react-icons/fi";
import Copy from "@assets/copy.svg";
import Info from "@assets/info.svg";
import Rename from "@assets/edit.svg";
import Collaboration from "@assets/collaboration.svg";
import Classification from "@assets/classification.svg";
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
import { Controller, useForm } from "react-hook-form";
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
import { ClipboardIcon, ClipboardPaste, Download, X } from "lucide-react";
import { MenuProvider, useMenu } from "@/Providers/MenuContext";
import { useLongPress } from "@/Hooks/useLongPress";
import { createFileObject } from "@/Common/FileFactory";
import UserProfileMenu from "@/Components/UserProfileMenu";
import { Checkbox } from "@/Components/ui/Checkbox";
import RadioGroup from "@/Components/RadioGroup";
import CustomSelect from "@/Components/CustomSelect";
import { BASEURL } from "@/Common/Constant";

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
  const {
    user,
    token,
    logout,
    hasPermission,
    getRole,
    isAdminAccess,
    isCompanyAccess,
    isUserAccess,
    isExpired,
    refreshSession,
    getCompany,
    getMyFolder,
  } = useAuth();

  const { folderKeys } = useParams();
  const isRoot = isEmpty(getMyFolder() ?? folderKeys);
  const navigate = useNavigate();
  const { showMenu, data, setData } = useMenu();

  const { search, setSearch } = useSearch();
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isModalDeleteRestoreOpen, setIsModalDeleteRestoreOpen] =
    useState(false);
  const [page, setPage] = useState(1);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { addToast } = useToast();
  const { setIsModalOpen } = useFileManager(); //#getFileDirectory

  const [isModalRenameFileOpen, setIsModalRenameFileOpen] = useState(false);
  const [isModalClassificationOpen, setIsModalClassificationOpen] =
    useState(false);

  const [isModalCollaboratorOpen, setIsModalCollaboratorOpen] = useState(false);
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
  const [renamingId, setRenamingId] = useState(null);

  const [isLoadVisible, setIsLoadVisible] = useState(false);
  const [listVisible, setListVisible] = useState(
    JSON.parse(sessionStorage.getItem("storage_visibility") ?? "[]"),
  );

  const isAdmin = isAdminAccess() || isCompanyAccess();
  const [loadingRename, setLoadingRename] = useState(false);

  const [mode, setMode] = useState("default");
  const [isDownloadConfirmOpen, setIsDownloadConfirmOpen] = useState(false);
  const [downloadTarget, setDownloadTarget] = useState(null);
  const [passwordFile, setPasswordFile] = useState(null);

  useEffect(() => {
    if (!textRef.current) return;

    const ro = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // jika tinggi lebih dari line-height, berarti wrap
        const lineHeight = parseInt(
          getComputedStyle(entry.target).lineHeight,
          10,
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
    const selectedItem = listVisible.find((v) => v.is_default);
    const selectedIdentifier = selectedItem?.identifier ?? "";

    if (isEmpty(selectedIdentifier)) {
      return;
    }

    if (isExpired()) {
      await refreshSession();
    }

    const baseUrl = isAdmin
      ? `${BASEURL}/api/v1/company/1`
      : `${BASEURL}/api/v1/app/company/1`;

    const url = `${baseUrl}/${
      !isRoot ? `storage/${folderKeys ?? getMyFolder()}` : `storage`
    }?order_by[]=name&sort_by[]=asc&visibility_identifier=${selectedIdentifier}`;

    // --- Breadcrumb URL hanya jika folderKeys punya nilai ---
    const hasFolder =
      folderKeys !== undefined && folderKeys !== null && folderKeys !== "";
    const urlBreadcrumb = hasFolder
      ? `${baseUrl}/storage/${folderKeys}/path`
      : null;

    setIsLoad(true);
    setError(null);

    setTimeout(async () => {
      try {
        // --- Buat array promise dinamis ---
        const promises = [
          axios.get(`${BASEURL}/api/v1/helper/storage-item-type`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }),
          axios.get(url, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }),
        ];

        if (hasFolder) {
          promises.push(
            axios.get(urlBreadcrumb, {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
            }),
          );
        } else {
          // Push resolved promise berisi array kosong untuk breadcrumb
          promises.push(Promise.resolve({ data: { success: true, data: [] } }));
        }

        // === Jalankan paralel ===
        const [resItemType, resList, resBreadcrumb] =
          await Promise.all(promises);

        const dataList = resList.data;
        const dataBreadcrumb = resBreadcrumb.data;
        const dataItemType = resItemType.data;

        if (
          (isEmpty(dataList?.success) && isEmpty(dataBreadcrumb?.success)) ||
          isEmpty(dataList?.success)
        ) {
          throw new Error(
            "One of the API responses returned unsuccessful status.",
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

  async function loadDataRestore() {
    if (isExpired()) {
      await refreshSession();
    }

    setIsLoad(true);
    setError(null);

    setTimeout(async () => {
      try {
        // --- Buat array promise dinamis ---
        const dataList = await axios.get(
          `${BASEURL}/api/v1/app/company/${getCompany()}/restore/storage`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          },
        );

        setLists(dataList?.data?.data ?? []);
        setTotalPages(dataList?.last_page ?? 1);
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan saat memuat data.");
      } finally {
        setIsLoad(false);
      }
    }, 1500);
  }

  // async function loadVisibility() {
  // if (isExpired()) {
  //   await refreshSession();
  // }

  // const url = `${BASEURL}/api/v1/helper/storage-item-visibility`;

  // setIsLoadVisible(true);

  // setTimeout(async () => {
  //   try {
  //     // --- Buat array promise dinamis ---
  //     const res = await axios.get(url, {
  //       headers: {
  //         Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  //       },
  //     });
  //     const body = res.data;

  //     setListVisible(body?.data ?? []);
  //   } catch (err) {
  //     console.error(err);
  //     setError("Terjadi kesalahan saat memuat data.");
  //   } finally {
  //     setIsLoadVisible(false);
  //   }
  // }, 1500);
  // }

  useEffect(() => {
    setSearch("");
    // loadVisibility();
  }, []);

  useEffect(() => {
    if (mode == "restore") {
      loadDataRestore();
    } else {
      loadData();
    }
  }, [folderKeys, listVisible, mode]);

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
      await refreshSession();
    }

    let urlDelete = null; //[check] masih belum bedain antara delete folder dengan file
    if (fileSelected.type_identifier.toLowerCase() == "folder") {
      if (isAdmin) {
        urlDelete = `${BASEURL}/api/v1/company/${getCompany()}/storage/${folderKeys ?? getMyFolder()}/folder/${fileSelected.id}`;
      } else {
        urlDelete = `${BASEURL}/api/v1/app/company/${getCompany()}/storage/${folderKeys ?? getMyFolder()}/folder/${fileSelected.id}`;
      }
    } else {
      if (isAdmin) {
        urlDelete = `${BASEURL}/api/v1/company/${getCompany()}/storage/${folderKeys ?? getMyFolder()}/file/${fileSelected.id}`;
      } else {
        urlDelete = `${BASEURL}/api/v1/app/company/${getCompany()}/storage/${folderKeys ?? getMyFolder()}/file/${fileSelected.id}`;
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
        addToast("error", response?.error);
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

    setIsModalRenameFileOpen(true);
    setFileSelected(file);
  }

  function classificationHandler(file) {
    if (!file) {
      addToast("error", "belum pilih file/folder yang di klasifikasi");
      return;
    }

    setIsModalClassificationOpen(true);
    setFileSelected(file);
  }

  function collaboratorHandler(file) {
    if (!file) {
      addToast("error", "belum pilih file/folder yang di collaboration");
      return;
    }

    setIsModalCollaboratorOpen(true);
    setFileSelected(file);
  }

  function hasGrantedDownloadHandler(file) {
    return (
      (file?.visibility_identifier != "GENERAL" &&
        !hasPermission("DOWNLOAD_SECRET_FILE") &&
        isUserAccess()) ||
      isAdmin
    );
  }

  const hasGrantedButtonDownload = true || isAdmin; //hasPermission("DOWNLOAD_FILE")

  const hasGrantedInfoPopper = hasPermission("GET_INFO_FILE_FOLDER") || isAdmin;

  const hasGrantedButtonReleteFile = true || isAdmin; //hasPermission("DELETE_FILE")
  const hasGrantedButtonReleteFolder = true || isAdmin; //hasPermission("DELETE_FOLDER")

  const hasGrantedCollaboration =
    (isUserAccess &&
      (hasPermission("VIEW_SUPER_SECRET_FOLDER_FILE") ||
        hasPermission("VIEW_SECRET_FOLDER_FILE"))) ||
    isAdmin;

  function hasGrantedCheckboxFilter(visible) {
    const isGeneral = visible?.identifier == "GENERAL";
    const isSecret =
      visible?.identifier == "SECRET" &&
      hasPermission("VIEW_SECRET_FOLDER_FILE") &&
      getRole();
    const isSuperSecret =
      visible?.identifier == "SUPER_SECRET" &&
      hasPermission("VIEW_SUPER_SECRET_FOLDER_FILE") &&
      getRole();

    return isAdmin || isGeneral || isSecret || isSuperSecret;
  }

  const hasGrantedButtonUploadFile = () => {
    const hasGrantedInRoot = isAdmin || (isRoot && true); //hasPermission("UPLOAD_FILE")
    const hasGrantedInFolder = isAdmin || (!isRoot && true); //hasPermission("UPLOAD_FILE")

    // console.log(isRoot, folderKeys ?? getMyFolder(), hasGrantedInRoot, hasGrantedInFolder)
    if (isRoot && isAdmin) {
      return false;
    }

    if (isUserAccess() && isRoot) {
      return false;
    }

    return hasGrantedInRoot || hasGrantedInFolder;
  };

  const listCheckboxFilter = listVisible.filter((visible) =>
    hasGrantedCheckboxFilter(visible),
  );

  function renderCreateFolder() {
    const hasGrantedInRoot = isAdmin || (isRoot && true); //hasPermission("CREATE_FOLDER")
    const hasGrantedInFolder = isAdmin || (!isRoot && true); //hasPermission("CREATE_FOLDER")

    // console.log(isRoot, folderKeys ?? getMyFolder(), hasGrantedInRoot, hasGrantedInFolder)
    if (isRoot && isAdmin) {
      return <></>;
    }

    if (isUserAccess() && isRoot) {
      return;
    }

    return (
      (hasGrantedInRoot || hasGrantedInFolder) && (
        <button
          onClick={() => {
            setIsModalRenameFileOpen(true);
            setFileSelected(null);
          }}
          className="flex max-sm:flex-1 items-center gap-3 bg-[#1B2E48] text-white font-inter font-medium text-[14px] px-4 py-2 rounded-md hover:bg-[#1b2e48d9] transition"
        >
          <img src={FolderCreate} width={18} />
          Create Folder
        </button>
      )
    );
  }

  async function downloadHandler(file, isConfirm = false) {
    console.log("download", file);

    if (!file) {
      addToast("error", "Belum pilih file/folder yang di download");
      return;
    }

    if (file.visibility_identifier === "SUPER_SECRET" && !isConfirm) {
      setDownloadTarget(file);
      setIsDownloadConfirmOpen(true);
      return;
    }

    // if (hasGrantedDownloadHandler(file)) {
    //   addToast("error", "anda tidak memiliki akses DOWNLOAD_SECRET_FILE");
    //   return;
    // }

    if (isExpired()) {
      await refreshSession();
    }

    const urlDownload = isAdmin
      ? `${BASEURL}/api/v1/company/${getCompany()}/storage/${file.id}/url-download`
      : `${BASEURL}/api/v1/app/company/${getCompany()}/storage/${file.id}/url-download`;

    // const newTab = window.open("about:blank");
    // if (!newTab) {
    //   addToast("error", "Popup diblokir. Izinkan pop-up untuk website ini.");
    //   return;
    // }

    setIsDownloadConfirmOpen(false);
    setIsModalLoading(true);

    try {
      const info = JSON.parse(sessionStorage.getItem("info") || "{}");
      const headers = buildHeaders(info, token);

      const { data: response } = await axios.post(
        urlDownload,
        { password: passwordFile ?? ""},
        {
          headers: headers,
        },
      );

      if (response?.success) {
        const urlTarget = response.data.download_url;

        const blobResponse = await axios.get(urlTarget, {
          responseType: "blob",
          // headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        });

        const blob = new Blob([blobResponse.data]);
        const blobUrl = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = blobUrl;

        // fallback nama file
        let fileName = file?.name || "downloaded_file";
        if (file?.type_identifier === "FOLDER") {
          fileName = `${fileName}.zip`;
        }

        a.download = fileName;

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
          "Terjadi masalah saat mengambil file.",
      );
    } finally {
      setIsModalLoading(false);
      setDownloadTarget(null);
      setPasswordFile(null);
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

  const onSubmitRename = async (values) => {
    if (isExpired()) {
      await refreshSession();
    }

    setLoadingRename(true);
    // setErrorMessage("");
    try {
      const formData =
        values.type_identifier == "FOLDER"
          ? {
              folder_name: values.name,
              visibility_identifier: values?.visibility_identifier ?? "GENERAL",
            }
          : {
              file_name: values.name,
              visibility_identifier: values?.visibility_identifier ?? "GENERAL",
            };

      const url = isAdmin
        ? `${BASEURL}/api/v1/company/${getCompany()}/storage/${folderKeys ?? getMyFolder()}/${values.type_identifier == "FOLDER" ? "folder" : "file"}/${values.id}`
        : `${BASEURL}/api/v1/app/company/${getCompany()}/storage/${folderKeys ?? getMyFolder()}/${values.type_identifier == "FOLDER" ? "folder" : "file"}/${values.id}`;

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
      }
    } catch (err) {
      console.error(err);
      addToast("error", "ada masalah pada aplikasi");
    } finally {
      setLoadingRename(false);
    }

    // reset();
    // onOpenChange(false);
    // addToast("success", "Save successfully");
  };

  const onRename = async (updatedFile) => {
    setRenamingId(updatedFile.id);

    try {
      await onSubmitRename(updatedFile);
      setLists((prev) =>
        prev.map((f) =>
          f.id === updatedFile.id ? { ...f, name: updatedFile.name } : f,
        ),
      );
    } catch (err) {
      console.error(err);
      // rollback (simple version)
      setLists((prev) => [...prev]);
    } finally {
      setRenamingId(null);
    }
  };

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
                item={file}
                selectedItem={selectedFile}
                setSelectedItem={setSelectedFile}
                onRename={(updatedFile) => {
                  console.log(updatedFile);
                  onRename(updatedFile);
                }}
                isLoadingRename={renamingId === file.id}
                disabledRename={!((getMyFolder() ?? folderKeys))}
                rowCells={
                  <>
                    <td className="px-4 py-3 text-gray-800 flex gap-2 items-center ">
                      {getFileIcon(
                        file.name,
                        file.type_identifier.toLowerCase() == "folder",
                        24,
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
                {(getMyFolder() ?? folderKeys) && (
                  <>
                    <button
                      className="flex gap-2 items-center w-full px-3 py-2 text-sm text-[#424242] hover:bg-[#F4F4F4] hover:rounded-sm hover:text-[#242424]"
                      onClick={() => setData(file)}
                    >
                      <img src={Copy} alt="copy" /> Copy
                    </button>
                    {data && (
                      <>
                        <button
                          className="flex gap-2 items-center w-full px-3 py-2 text-sm text-[#424242] hover:bg-[#F4F4F4] hover:rounded-sm hover:text-[#242424]"
                          onClick={() => {
                            setData(null);
                            handlerPaste(data);
                          }}
                        >
                          <ClipboardIcon size={16} /> Paste
                        </button>
                        <button
                          className="flex gap-2 items-center w-full px-3 py-2 text-sm text-[#424242] hover:bg-[#F4F4F4] hover:rounded-sm hover:text-[#242424]"
                          onClick={() => {
                            setData(null);
                          }}
                        >
                          <X size={18} /> Cancel
                        </button>
                      </>
                    )}

                    <button
                      className="flex gap-2 items-center w-full px-3 py-2 text-sm text-[#424242] hover:bg-[#F4F4F4] hover:rounded-sm hover:text-[#242424]"
                      onClick={() => {
                        setData(null);
                        editHandler(file);
                      }}
                    >
                      <img src={Rename} alt="Rename" /> Rename
                    </button>

                    <button
                      className="flex gap-2 items-center w-full px-3 py-2 text-sm text-[#424242] hover:bg-[#F4F4F4] hover:rounded-sm hover:text-[#242424] disabled:hover:bg-[transparent] disabled:text-[#242424]/50"
                      disabled={!(listCheckboxFilter<2)}
                      onClick={() => {
                        setData(null);
                        classificationHandler(file);
                      }}
                    >
                      <img src={Classification} alt="Classification" />{" "}
                      Classification
                    </button>

                    <button
                      className="flex gap-2 items-center w-full px-3 py-2 text-sm text-[#424242] hover:bg-[#F4F4F4] hover:rounded-sm hover:text-[#242424]"
                      onClick={() => {
                        setData(null);
                        collaboratorHandler(file);
                      }}
                    >
                      <img src={Collaboration} alt="Collabolator" /> Add
                      Collaborator
                    </button>

                    <button
                      className="flex gap-2 items-center w-full px-3 py-2 text-sm text-[#424242] hover:bg-[#F4F4F4] hover:rounded-sm hover:text-[#242424] disabled:hover:bg-[transparent] disabled:text-[#242424]/50"
                      disabled={!hasGrantedButtonDownload}
                      onClick={() => {
                        if (hasGrantedButtonDownload) {
                          setData(null);
                          downloadHandler(file);
                        }
                      }}
                    >
                      <Download size={18} /> Download
                    </button>

                    <button
                      className="flex gap-2 items-center w-full px-3 py-2 text-sm text-[#424242] hover:bg-[#F4F4F4] hover:rounded-sm hover:text-[#242424] disabled:hover:bg-[transparent] disabled:text-[#242424]/50"
                      disabled={!hasGrantedInfoPopper}
                      onClick={() => {
                        if (hasGrantedInfoPopper) {
                          setSelectedFile(file);
                          setIsInfoModalOpen(true);
                        }
                      }}
                    >
                      <img src={Info} alt="Info" /> Get Info
                    </button>

                    {/* <FileInfoPopper
                       file={file}
                       changeFile={setSelectedFile}
                       eventInfoModal={setIsInfoModalOpen}
                       paths={listsPath}
                       types={itemType}
                     /> */}

                    <button
                      className="flex gap-2 items-center w-full px-3 py-2 text-sm text-[#424242] hover:bg-[#F4F4F4] hover:rounded-sm hover:text-[#242424] disabled:hover:bg-[transparent] disabled:text-[#242424]/50"
                      disabled={
                        !(
                          (hasGrantedButtonReleteFile &&
                            file.type_identifier != "FOLDER") ||
                          (hasGrantedButtonReleteFolder &&
                            file.type_identifier == "FOLDER")
                        )
                      }
                      onClick={() => {
                        if (
                          (hasGrantedButtonReleteFile &&
                            file.type_identifier != "FOLDER") ||
                          (hasGrantedButtonReleteFolder &&
                            file.type_identifier == "FOLDER")
                        ) {
                        }
                        setData(null);
                        setFileSelected(file);
                        setIsModalDeleteOpen(true);
                      }}
                    >
                      <img src={Trash} alt="Trash" /> Remove
                    </button>
                  </>
                )}
              </TableRowActionMenu>
            ))
          )}
        </tbody>
      </table>
    );
  }

  function renderTableRestore() {
    if (isLoad) {
      return (
        <>
          <div className="skeleton h-4 w-[100px]"></div>
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
                  Delete On
                </th>
                <th className="px-4 py-3 font-medium text-[14px] text-[#5B5B5B]">
                  Delete
                </th>
                <th className="px-4 py-3 font-medium text-[14px] text-[#5B5B5B]">
                  Restore
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
                    <td className="border px-4 py-2">
                      <div className="skeleton h-4 w-full"></div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      );
    }

    return (
      <>
        <div
          className={`flex max-sm:flex-1 items-center gap-3 font-inter font-medium text-[14px] rounded-md transition`}
        >
          <img src={RestoreFile} width={18} />
          Restore File
        </div>
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
                Delete On
              </th>
              <th className="px-4 py-3 font-medium text-[14px] text-[#5B5B5B]">
                Delete
              </th>
              <th className="px-4 py-3 font-medium text-[14px] text-[#5B5B5B]">
                Restore
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
                <tr>
                  <td className="px-4 py-3 text-gray-800 flex gap-2 items-center ">
                    {getFileIcon(
                      file.name,
                      file.type_identifier.toLowerCase() == "folder",
                      24,
                    )}
                    <EllipsisTooltip className={"w-[250px]"}>
                      {file.name}
                    </EllipsisTooltip>
                  </td>
                  <td className="px-4 py-3">{formatFileType(file.name)}</td>
                  <td className="px-4 py-3">
                    {formatDate(file.deleted_at, 2)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        handlerRemoveRestore(file);
                      }}
                    >
                      <X size={16} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        handlerRestore(file);
                      }}
                    >
                      <FiRotateCcw size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </>
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

  const handlerRemoveRestore = async (file) => {
    setFileSelected(file);
    setIsModalDeleteRestoreOpen(true);

    // console.log("remove:", file);
  };

  const doRemoveRestore = async () => {
    if (!fileSelected) {
      addToast("error", "belum pilih file/folder yang di hapus");
      return;
    }

    if (isExpired()) {
      await refreshSession();
    }

    // setLoading(true);
    setIsModalDeleteRestoreOpen(false);
    try {
      const info = JSON.parse(sessionStorage.getItem("info") || "{}");
      const headers = buildHeaders(info, token);
      const request = await axios.delete(
        `${BASEURL}/api/v1/app/company/${getCompany()}/restore/storage/${fileSelected.id}`,
        {
          headers: headers,
        },
      );
      const response = request.data;
      if (response?.success) {
        addToast("success", response?.success);
        loadDataRestore();
      } else {
        addToast("error", response?.error);
      }
      console.log(response);
    } catch (err) {
      console.error(err);
      addToast("error", "ada masalah pada aplikasi");
    } finally {
      setIsModalDeleteRestoreOpen(false);
    }
  };

  const handlerRestore = async (file) => {
    //kenapa pertama kali klik selalu null tapi klik ke 2 ada datanya
    // console.log("restore:", file);
    if (!file) {
      addToast("error", "belum pilih file/folder yang di hapus");
      return;
    }

    if (isExpired()) {
      await refreshSession();
    }

    // setIsLoad(true);
    try {
      const info = JSON.parse(sessionStorage.getItem("info") || "{}");
      const headers = buildHeaders(info, token);
      const request = await axios.post(
        `${BASEURL}/api/v1/app/company/${getCompany()}/restore/storage/${file.id}`,
        {},
        {
          headers: headers,
        },
      );
      const response = request.data;
      if (response?.success) {
        addToast("success", response?.success);
        loadDataRestore();
      } else {
        addToast("error", response?.error);
      }
      console.log(response);
    } catch (err) {
      console.error(err);
      addToast("error", "ada masalah pada aplikasi");
    } finally {
      // setIsLoad(false);
    }
  };

  const handlerPaste = async (file) => {
    const fileObj = await createFileObject({
      reference: file,
      name: file?.name ?? "unknown",
    });
    setFiles([fileObj]);
    setIsModalOpen(true);
  };
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
                hasGrantedCheckboxFilter(visible) ? (
                  <div key={index}>
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
                            }),
                          );
                        }}
                      />
                      <span>{visible.label}</span>
                    </label>
                  </div>
                ) : (
                  <></>
                ),
              )
            )}

            <div
              className={`max-w-[24rem]:w-full flex flex-wrap items-center gap-4`}
            >
              {renderCreateFolder()}
              {/* {isAdminAccess &&  */}
              <button
                onClick={() => {
                  setMode((prev) =>
                    prev === "restore" ? "default" : "restore",
                  );
                  setFileSelected(null);
                  loadDataRestore();
                }}
                className={`flex max-sm:flex-1 items-center gap-3 ${mode != "default" ? "border border-[#1B2E48]" : "bg-[#F3F3F3] text-[#1E293B]"} font-inter font-medium text-[14px] px-4 py-2 rounded-md hover:bg-[#e6e5e5] transition`}
              >
                <img src={RestoreFile} width={18} />
                Restore File
              </button>
              {/* } */}
              {hasGrantedButtonUploadFile() && (
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
          {mode == "default" && renderBreadCrumb()}
          {mode == "default" && renderTable()}
          {mode == "restore" && renderTableRestore()}
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

      <DeleteModal
        titleMessage="Delete File Permanenly"
        message={"Are you sure want to delete this item?"}
        isOpen={isModalDeleteRestoreOpen}
        onClose={() => setIsModalDeleteRestoreOpen(false)}
        onConfirm={() => doRemoveRestore()}
      />

      {/* Modal Info */}
      <Dialog
        open={isInfoModalOpen}
        onOpenChange={() => setIsInfoModalOpen(false)}
      >
        <DialogContent className="flex flex-col p-0 max-h-[min(640px,80vh)] sm:max-w-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between bg-white px-6 py-4">
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
                          itemType,
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

            <hr className="h-px my-8 bg-[#DDDDDD] border-0"></hr>

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
                          itemType,
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
        idFolder={folderKeys ?? getMyFolder()}
        token={sessionStorage.getItem("token")}
        hasPermission={true} //hasPermission("UPLOAD_FILE") || isAdmin
        initialFiles={files}
        isAdmin={isAdminAccess()}
        isCompany={isCompanyAccess()}
        isUser={isUserAccess()}
        listVisible={listCheckboxFilter}
      />

      {/* Modal Folder */}
      {/* <ModalFolder
        open={isModalFolderOpen}
        onOpenChange={setIsModalFolderOpen}
        folderKeys={folderKeys}
        data={fileSelected}
        mode={fileSelected ? "edit" : "create"}
        extraAction={() => loadData()}
        listVisible={listVisible}
      /> */}

      {isModalRenameFileOpen && (
        <ModalRenameFile
          open={isModalRenameFileOpen}
          onOpenChange={setIsModalRenameFileOpen}
          folderKeys={folderKeys ?? getMyFolder()}
          mode="rename"
          data={fileSelected}
          extraAction={() => loadData()}
          listVisible={listCheckboxFilter}
        />
      )}

      {isModalClassificationOpen && (
        <ModalRenameFile
          open={isModalClassificationOpen}
          onOpenChange={setIsModalClassificationOpen}
          folderKeys={folderKeys ?? getMyFolder()}
          mode="classification"
          data={fileSelected}
          extraAction={() => loadData()}
          listVisible={listCheckboxFilter}
        />
      )}

      <ModalCollaborator
        open={isModalCollaboratorOpen}
        onOpenChange={setIsModalCollaboratorOpen}
        folderKeys={folderKeys ?? getMyFolder()}
        data={fileSelected}
        extraAction={() => loadData()}
      />

      <Dialog
        open={isDownloadConfirmOpen}
        onOpenChange={(open) => {
          setIsDownloadConfirmOpen(open);

          if (!open) {
            setDownloadTarget(null);
            setPasswordFile(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <div className="border-b px-6 py-4">
            <DialogTitle className="text-base font-semibold">
              Download Super Secret File
            </DialogTitle>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div className="rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-700">
              File ini memiliki level akses <b>SUPER_SECRET</b>.
            </div>

            <div>
              <p className="text-sm text-slate-500 mb-1">Nama File</p>
              <p className="text-sm font-medium text-slate-800 break-all">
                {downloadTarget?.name || "-"}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Password File
              </label>

              <input
                type="password"
                value={passwordFile || ""}
                onChange={(e) => setPasswordFile(e.target.value)}
                placeholder="Masukkan password file"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t px-6 py-4">
            <button
              type="button"
              className="rounded-md border px-4 py-2 text-sm hover:bg-slate-50"
              onClick={() => {
                setIsDownloadConfirmOpen(false);
                setDownloadTarget(null);
                setPasswordFile(null);
              }}
            >
              Batal
            </button>

            <button
              type="button"
              disabled={!passwordFile}
              className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
              onClick={() => downloadHandler(downloadTarget, true)}
            >
              Lanjut Download
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <ModalLoader show={isModalLoading} />
    </>
  );
};

export default FileManagementPage;

// export function ModalFolder({
//   open,
//   onOpenChange,
//   folderKeys,
//   data,
//   mode,
//   extraAction = function () {},
//   listVisible = [],
// }) {
//   const { addToast } = useToast();
//   const {
//     token,
//     hasPermission,
//     isAdminAccess,
//     isCompanyAccess,
//     isUserAccess,
//     isExpired,
//     refreshSession,
//     getCompany,
//   } = useAuth();

//   const [loading, setLoading] = useState(false);
//   const [category, setCategory] = useState(null);
//   const isAdmin = isAdminAccess() || isCompanyAccess();

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//     reset,
//   } = useForm({
//     defaultValues: {
//       folder_name: data?.name ?? "",
//     },
//   });

//   const isEdit = mode == "edit";
//   const isRoot =
//     !folderKeys ||
//     folderKeys === null ||
//     folderKeys === undefined ||
//     folderKeys === Object;

//   useEffect(() => {
//     reset({
//       folder_name: data?.name ?? "",
//     });
//   }, [data, reset]);

//   const onSubmit = async (values) => {
//     if (isExpired()) {
//       await refreshSession();
//     }

//     setLoading(true);
//     // setErrorMessage("");
//     try {
//       const formData = {
//         folder_name: values.folder_name,
//         visibility_identifier: category ?? "GENERAL",
//       };
//       // if (!isEdit && !hasPermission("CREATE_FOLDER") && isUserAccess()) {
//       //   addToast("error", "anda tidak memiliki permission CREATE_FOLDER");
//       //   setLoading(false);
//       //   return;
//       // }

//       let url = null;
//       if (isAdmin) {
//         if (isEdit) {
//           url = `${BASEURL}/api/v1/company/${getCompany()}/storage/${folderKeys}/folder/${data.id}`;
//         } else {
//           url = `${BASEURL}/api/v1/company/${getCompany()}/storage/${folderKeys}/folder`;
//         }
//       } else {
//         if (isRoot) {
//           // if (isEdit) {
//           //   setLoading(true);
//           //   alert("fitur edit root folder belum ada");
//           //   return;
//           // } else {
//           url = `${BASEURL}/api/v1/app/company/${getCompany()}/storage/root/folder`;
//           // }
//         } else {
//           if (isEdit) {
//             url = `${BASEURL}/api/v1/app/company/${getCompany()}/storage/${folderKeys}/folder/${data.id}`;
//           } else {
//             url = `${BASEURL}/api/v1/app/company/${getCompany()}/storage/${folderKeys}/folder`;
//           }
//         }
//       }

//       const info = JSON.parse(sessionStorage.getItem("info") || "{}");
//       const headers = buildHeaders(info, token);

//       const res = isEdit
//         ? await axios.put(url, formData, {
//             headers: headers,
//           })
//         : await axios.post(url, formData, {
//             headers: headers,
//           });
//       const body = res.data;
//       console.log(body);

//       if (body.error) {
//         addToast("error", body.error);
//       } else if (body.success) {
//         addToast("success", body.success);
//         onOpenChange(false);
//         extraAction();
//       }
//     } catch (err) {
//       console.error(err);
//       addToast("error", "ada masalah pada aplikasi");
//     } finally {
//       setLoading(false);
//     }

//     // reset();
//     // onOpenChange(false);
//     // addToast("success", "Save successfully");
//   };

//   useEffect(() => {
//     if (!open) {
//       reset();
//     }
//   }, [open, reset]);

//   return (
//     <DialogModal open={open} onOpenChange={onOpenChange}>
//       <DialogModalContent className="flex flex-col gap-0 p-0 sm:max-h-full sm:max-w-5xl">
//         {" "}
//         {/*max-h-[min(640px,80vh)]*/}
//         <DialogModalHeader>
//           <DialogModalTitle className="px-6 py-4 font-inter font-bold text-[22px] text-[#1B2E48]">
//             {mode == "edit" ? `Rename Folder` : `New Folder`}
//           </DialogModalTitle>

//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="overflow-y-auto scroll-custom"
//           >
//             <DialogModalDescription asChild>
//               <div className="px-6 pb-8 space-y-8">
//                 <CustomInput
//                   label="Folder Name"
//                   name="folder_name"
//                   register={register}
//                   errors={errors}
//                   rules={{
//                     required: "Folder name is required",
//                   }}
//                 />

//                 <RadioGroup
//                   className="justify-end"
//                   value={category}
//                   onChange={setCategory}
//                   orientation="horizontal"
//                   options={listVisible}
//                 />
//               </div>
//             </DialogModalDescription>

//             <DialogModalFooter className="px-6 pb-6 items-center">
//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full max-w-[40cqi] bg-[#1a2f48] hover:bg-[#1a2f48]/80 text-white"
//               >
//                 {loading ? "Sending..." : "Save"}
//               </Button>
//             </DialogModalFooter>
//           </form>
//         </DialogModalHeader>
//       </DialogModalContent>
//     </DialogModal>
//   );
// }

export function ModalRenameFile({
  open,
  onOpenChange,
  folderKeys,
  mode,
  data,
  extraAction = function () {},
  listVisible = [],
}) {
  const { addToast } = useToast();
  const {
    token,
    hasPermission,
    isAdminAccess,
    isCompanyAccess,
    isUserAccess,
    isExpired,
    refreshSession,
    getCompany,
    getMyFolder,
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(null);
  const [styledListVisible, setStyledListVisible] = useState([]);
  const isAdmin = isAdminAccess() || isCompanyAccess();

  const isFolder =
    data?.type_identifier?.toLowerCase() == "folder" ||
    data?.type_identifier == null;
  const keyField = isFolder ? "folder_name" : "file_name";
  const isCreate = isEmpty(data);

  console.log("modalrename", listVisible);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      [keyField]: data?.name ?? "",
    },
  });

  useEffect(() => {
    reset({
      [keyField]: data?.name ?? "",
    });
  }, [data, reset]);

  useEffect(() => {
    if (mode === "classification") {
      const mapped = listVisible.map((item) => {
        let className = "";

        switch (item.identifier) {
          case "GENERAL":
            className = "bg-emerald-50 border-emerald-700 text-emerald-700";
            break;

          case "SECRET":
            className = "bg-amber-50 border-amber-700 text-amber-700";
            break;

          case "SUPER_SECRET":
            className = "bg-rose-50 border-rose-700 text-rose-700";
            break;

          default:
            className = "bg-gray-50 border-gray-400 text-gray-700";
        }

        return {
          ...item,
          className,
        };
      });

      console.log(mapped);

      setStyledListVisible(mapped);
    } else {
      setStyledListVisible(listVisible);
    }
  }, [mode, listVisible]);

  async function getUrl({
    isCreate,
    isAdmin,
    info,
    token,
    formData,
    data = null,
    folderKeys,
    isFolder,
  }) {
    const headers = buildHeaders(info, token);

    if (isCreate) {
      const url = isAdmin
        ? `${BASEURL}/api/v1/company/${getCompany()}/storage/${folderKeys ?? "#"}/${isFolder ? "folder" : "file"}`
        : `${BASEURL}/api/v1/app/company/${getCompany()}/storage/${folderKeys ?? "#"}/${isFolder ? "folder" : "file"}`;

      return await axios.post(url, formData, { headers });
    } else {
      const url = isAdmin
        ? `${BASEURL}/api/v1/company/${getCompany()}/storage/${folderKeys ?? "#"}/${isFolder ? "folder" : "file"}/${data?.id ?? "#"}`
        : `${BASEURL}/api/v1/app/company/${getCompany()}/storage/${folderKeys ?? "#"}/${isFolder ? "folder" : "file"}/${data?.id ?? "#"}`;

      return await axios.put(url, formData, { headers });
    }
  }

  const onSubmit = async (values) => {
    if (isExpired()) {
      await refreshSession();
    }

    setLoading(true);
    // setErrorMessage("");
    try {
      const formData = {
        [keyField]: values[keyField],
        visibility_identifier: category ?? "GENERAL",
      };

      const info = JSON.parse(sessionStorage.getItem("info") || "{}");
      const res = await getUrl({
        isCreate,
        isAdmin,
        info,
        token,
        formData,
        data,
        folderKeys,
        isFolder,
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
            {mode == "classification"
              ? "Classification"
              : `${isCreate ? "Create" : "Rename"} ${isFolder ? "Folder" : "File"}`}
          </DialogModalTitle>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="overflow-y-auto scroll-custom"
          >
            <DialogModalDescription asChild>
              {mode == "classification" ? (
                <div className="px-6 pb-4 text-[16px] !text-[#1B2E48]">
                  <div className="space-y-8">
                    <p>
                      <b>File/Folder Name:</b> {data?.name ?? "-"}
                    </p>

                    <RadioGroup
                      className="space-y-4 justify-end"
                      value={category}
                      mode="classification"
                      onChange={setCategory}
                      orientation="vertical"
                      options={styledListVisible}
                    />
                  </div>
                </div>
              ) : (
                <div className="px-6 pb-8 space-y-8">
                  <CustomInput
                    label={isFolder ? "Folder Name" : "File Name"}
                    name={keyField}
                    register={register}
                    errors={errors}
                    rules={{
                      required: `${isFolder ? "Folder name" : "File name"} is required`,
                    }}
                  />

                  {styledListVisible.length > 1 && (
                    <RadioGroup
                      className="justify-end"
                      value={category}
                      onChange={setCategory}
                      orientation="horizontal"
                      options={styledListVisible}
                    />
                  )}
                </div>
              )}
            </DialogModalDescription>

            <DialogModalFooter className="px-6 py-6 items-center">
              <Button
                type="submit"
                disabled={loading}
                className="w-full max-w-[40cqi] !py-6 bg-[#1a2f48] hover:bg-[#1a2f48]/80 text-white"
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

export function ModalCollaborator({
  open,
  onOpenChange,
  folderKeys,
  data,
  extraAction = function () {},
}) {
  const { addToast } = useToast();
  const {
    token,
    hasPermission,
    isAdminAccess,
    isCompanyAccess,
    isUserAccess,
    isExpired,
    refreshSession,
    getCompany,
    getMyFolder,
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [collaborations, setCollaborations] = useState([]);
  const [users, setUsers] = useState([]);

  const [isLoad, setIsLoad] = useState(false);
  const [error, setError] = useState(null);
  const isAdmin = isAdminAccess() || isCompanyAccess();

  const url_collaboration =
    isAdmin || isCompanyAccess
      ? `${BASEURL}/api/v1/app/company/${getCompany()}/storage/${data?.id ?? "#"}/collaboration`
      : `${BASEURL}/api/v1/company/${getCompany()}/storage/${data?.id ?? "#"}/collaboration`;
  const url_user = `${BASEURL}/api/v1/app/company/${getCompany()}/user/all`;

  async function fetchUsers(token, url) {
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res?.data?.success) {
        throw new Error("API users returned unsuccessful status");
      }

      const response = res?.data?.data || [];

      return response.map((u) => ({
        identifier: u.employment[0]?.id,
        label: u.full_name,
      }));
    } catch (err) {
      console.error("Fetch Users Error:", err);
      throw err;
    }
  }

  async function fetchCollaboration(token, url) {
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res?.data?.success) {
        throw new Error("API users returned unsuccessful status");
      }

      const response = res?.data?.data || [];

      return response.map((c) => ({
        id: c.id,
        name: c?.employment?.user?.full_name ?? "-",
        role: c?.employment?.job_identifier ?? "",
      }));
    } catch (err) {
      console.error("Fetch Users Error:", err);
      throw err;
    }
  }

  async function loadData(onlyCollaboration = false) {
    if (isExpired()) {
      await refreshSession();
    }

    // if (isAdmin) {
    setError(null);
    setIsLoad(true);
    setTimeout(async () => {
      try {
        if (onlyCollaboration) {
          const [collaborationRes] = await Promise.allSettled([
            fetchCollaboration(token, url_collaboration),
          ]);

          const collaboration =
            collaborationRes.status === "fulfilled"
              ? collaborationRes.value
              : [];

          setCollaborations(collaboration);
        } else {
          const [collaborationRes, usersRes] = await Promise.allSettled([
            fetchCollaboration(token, url_collaboration),
            fetchUsers(token, url_user),
          ]);

          const collaboration =
            collaborationRes.status === "fulfilled"
              ? collaborationRes.value
              : [];

          const users = usersRes.status === "fulfilled" ? usersRes.value : [];

          setUsers(users);
          setCollaborations(collaboration);
        }
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan saat memuat data.");
      } finally {
        setIsLoad(false);
      }
    }, 1500);
    // }
  }

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open, data?.id]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      targets: data?.targets ?? [],
    },
  });

  useEffect(() => {
    reset({
      targets: data?.targets ?? [],
    });
  }, [data, reset]);

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      const formData = {
        employment_id: values.targets.identifier,
      };

      const info = JSON.parse(sessionStorage.getItem("info") || "{}");
      const headers = buildHeaders(info, token);

      const res = await axios.post(url_collaboration, formData, {
        headers: headers,
      });
      const body = res.data;
      console.log(body);

      if (body.error) {
        addToast("error", body.error);
      } else if (body.success) {
        addToast("success", body.success);
        // onOpenChange(false);
        // extraAction();
        loadData(true);
      }
    } catch (err) {
      console.error(err);
      addToast("error", "ada masalah pada aplikasi");
    } finally {
      setLoading(false);
    }
    console.log(values);
  };

  const revokeCollaborator = async (values) => {
    setLoading(true);

    try {
      const info = JSON.parse(sessionStorage.getItem("info") || "{}");
      const headers = buildHeaders(info, token);

      const res = await axios.delete(`${url_collaboration}/${values.id}`, {
        headers: headers,
      });
      const body = res.data;
      console.log(body);

      if (body.error) {
        addToast("error", body.error);
      } else if (body.success) {
        addToast("success", body.success);
        loadData(true);
      }
    } catch (err) {
      console.error(err);
      addToast("error", "ada masalah pada aplikasi");
    } finally {
      setLoading(false);
    }
    console.log(values);
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <DialogModal open={open} onOpenChange={onOpenChange}>
      <DialogModalContent className="flex flex-col gap-0 p-0 sm:max-h-full sm:max-w-xl">
        {" "}
        {/*max-h-[min(640px,80vh)]*/}
        <DialogModalHeader>
          <DialogModalTitle className="px-6 py-4 font-inter font-bold text-[22px] text-[#1B2E48]">
            Add Collaborator
          </DialogModalTitle>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="overflow-y-auto scroll-custom"
          >
            <DialogModalDescription asChild>
              {error ? (
                <div className="px-6 pb-8 space-y-4 text-center">
                  <p>{error}</p>

                  <button
                    type="button"
                    className="
          px-3 py-1
          rounded
          border-0
          hover:border hover:border-gray-400
          active:border active:border-gray-500
          focus:outline-none focus:ring-2 focus:ring-gray-400
          transition-all duration-150
        "
                    onClick={loadData}
                  >
                    Klik muat ulang
                  </button>
                </div>
              ) : (
                <div className="px-6 pb-8 space-y-8">
                  {/* CustomSelect */}
                  {isLoad ? (
                    <div className="space-y-2">
                      <div className="skeleton h-4 w-24"></div>
                      <div className="skeleton h-10 w-full"></div>
                    </div>
                  ) : (
                    <Controller
                      name="targets"
                      control={control}
                      rules={{ required: "Name is required" }}
                      render={({ field }) => (
                        <CustomSelect
                          label="Name"
                          records={users}
                          value={field.value}
                          onChange={field.onChange}
                          error={errors.targets?.message}
                        />
                      )}
                    />
                  )}

                  {/* People With Access */}
                  <div className="space-y-4">
                    <h3 className="font-inter font-semibold text-[18px] text-[#1B2E48]">
                      People With Access
                    </h3>

                    <div className="max-h-[220px] overflow-y-auto pr-2 scroll-custom space-y-5">
                      {isLoad
                        ? Array.from({ length: 3 }).map((_, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between"
                            >
                              <div className="skeleton h-4 w-40"></div>
                              <div className="skeleton h-4 w-20"></div>
                            </div>
                          ))
                        : collaborations.map((c, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <span className="text-[18px] font-medium text-black">
                                {c.name}
                              </span>

                              <div className="flex items-center justify-center gap-2">
                                <span className="text-[18px] text-gray-400 font-medium">
                                  {c.role}
                                </span>
                                <button
                                  type="button"
                                  className="bg-red-300 hover:bg-red-400 p-1 rounded-full"
                                  onClick={() => revokeCollaborator(c)}
                                >
                                  <img src={Trash} />
                                </button>
                              </div>
                            </div>
                          ))}
                    </div>
                  </div>
                </div>
              )}
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
