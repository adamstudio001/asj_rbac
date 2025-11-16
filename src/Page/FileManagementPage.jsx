import React, { useEffect, useState } from "react";
import Navbar from "@src/Components/Navbar";
import Pagination from "@src/Components/Pagination";
import { useSearch } from "@src/Providers/SearchProvider";
import { IoIosArrowDown } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import { useFileManager } from "@src/Providers/FileManagerProvider";
import { filterAndSortFiles, formatDate, formatFileSize, formatFileType, getFileIcon, isEmpty } from "../Common/Utils";
import { useToast } from "@/Providers/ToastProvider";
import ModalUpload from "@/Components/ModalUpload";
import { TableRowActionMenu } from "@/Components/TableRowActionMenu";
import DeleteModal from "@/Components/DeleteModal";
import EllipsisTooltip from "@/Components/EllipsisTooltip";
import Copy from "@assets/copy.svg";
import Rename from "@assets/edit.svg";
import Trash from "@assets/trash.svg";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/Components/ui/Dialog";
import BreadcrumbFolder from "@/Components/BreadcrumbFolder";
import { useNavigate, useParams } from "react-router-dom";
import FileInfoPopper from "@/Components/FileInfoPopper";
import { BsPlusLg } from "react-icons/bs";
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

const FileManagementPage = () => {
  return (
    // <ToastProvider>
      <FileManagementContent />
    // </ToastProvider>
  );
};

const FileManagementContent = () => {
  const { folderKeys } = useParams();
  const isRoot = isEmpty(folderKeys);
  const navigate = useNavigate();

  const { search, setSearch } = useSearch();
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { addToast } = useToast();
  const { setIsModalOpen } = useFileManager(); //#getFileDirectory

  const { token, isAdminAccess, isCompanyAccess, isUserAccess, isExpired, refreshSession } = useAuth();
  const [isModalFolderOpen, setIsModalFolderOpen] = useState(false);
  const [lists, setLists] = useState([]);
  const [fileSelected, setFileSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  async function loadData() {
    if(isExpired()){
      refreshSession();
    }

    const url = (isAdminAccess() || isCompanyAccess())? 
    `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/${!isRoot? `storage/${folderKeys}`:`storage`}?order_by[]=name&sort_by[]=asc`:
    `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/app/company/1/${!isRoot? `storage/${folderKeys}`:`storage`}?order_by[]=name&sort_by[]=asc`;
    setLoading(true);
    try {
      const request = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = request.data;

      if(response?.success){
        setLists(response?.data ?? []);
        setTotalPages(response?.last_page ?? 1);
      }
      console.log(response.data);
    } catch (err) {
      console.error(err);
      // addToast("error", "ada masalah pada aplikasi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setSearch("");
  }, []);

  useEffect(() => {
    loadData();
  }, [folderKeys]);

  // const files = getFileDirectory(lists, folderKeys);
  const sortedFiles = filterAndSortFiles(lists, {
    search: search,
    group: { extensions: [] }
  });

  async function deleteHandler(){
    if(isExpired()){
      refreshSession();
    }

    const url = `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/app/company/1/storage/${folderKeys}/folder/${fileSelected.id}`;
    setLoading(true);
    setIsModalDeleteOpen(false);
    try {
      const request = await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = request.data;

      if(response?.success){
        addToast("success", response?.success);
        loadData();
      } else{
        addToast("errors", response?.error);
      }
      console.log(response);
    } catch (err) {
      console.error(err);
      // addToast("error", "ada masalah pada aplikasi");
    } finally {
      setLoading(false);
    }
  }

  function editHandler(file){
    if(file.type_identifier.toLowerCase()=="folder"){
      setIsModalFolderOpen(true);
      setFileSelected(file);
    }
  }

  return (
    <>
      <Navbar
        renderActionModal={() => (
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              {(!isRoot || isUserAccess()) && <button
                onClick={() => {
                  setIsModalFolderOpen(true);
                }}
                className="flex items-center gap-3 bg-[#1B2E48] text-white font-inter font-medium text-[14px] px-4 py-2 rounded-md hover:bg-[#1b2e48d9] transition"
              >
                <BsPlusLg size={18} />
                Folder
              </button>}
              <button
                onClick={() => {
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-3 bg-[#1B2E48] text-white font-inter font-medium text-[14px] px-4 py-2 rounded-md hover:bg-[#1b2e48d9] transition"
              >
                <LuUpload size={18} />
                Upload file
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                C
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-gray-800">HR/GA</span>
                <IoIosArrowDown className="w-4 text-[#a5a5a5]" />
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="w-full overflow-x-scroll scroll-custom rounded-lg space-y-6">
          <BreadcrumbFolder 
            lists={lists}
            currentKey={folderKeys || null}
            onNavigate={(key) => {
              if (key) navigate(`/filemanager/${key}`);
              else navigate(`/filemanager`);
            }}
          />

          <table className="w-full text-left text-sm">
            <thead className="bg-[#F3F3F3]">
              <tr className="border border-gray-200">
                <th className="px-4 py-3 font-medium text-[14px] text-[#5B5B5B] w-[250px]">File Name</th>
                <th className="px-4 py-3 font-medium text-[14px] text-[#5B5B5B]">File Type</th>
                <th className="px-4 py-3 font-medium text-[14px] text-[#5B5B5B]">Last Modified</th>
                <th className="px-4 py-3 font-medium text-[14px] text-[#5B5B5B]">File Size</th>
              </tr>
            </thead>
            <tbody>
              {sortedFiles.map((file) => 
                  <TableRowActionMenu
                    key={file.id}
                    refId={file.id}
                    rowCells={
                      <>
                        <td className="px-4 py-3 text-gray-800 flex gap-2 items-center ">
                          {getFileIcon(file.name, file.type_identifier.toLowerCase()=="folder", 24)}
                          <EllipsisTooltip className={"w-[250px]"}>{file.name}</EllipsisTooltip>
                        </td>
                        <td className="px-4 py-3">{formatFileType(file.name)}</td>
                        <td className="px-4 py-3">{formatDate(file.updated_datetime)}</td>
                        <td className="px-4 py-3">{formatFileSize(file.size)}</td>
                      </>
                    }
                  >
                    <button
                      className="flex gap-2 items-center w-full px-3 py-2 text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                      onClick={() => alert("Copy")}
                    >
                      <img src={Copy} alt="copy" /> Copy
                    </button>
                    <button
                      className="flex gap-2 items-center w-full px-3 py-2 text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                      onClick={() => editHandler(file)}
                    >
                      <img src={Rename} alt="Rename" /> Rename
                    </button>
                    <FileInfoPopper 
                      file={file} 
                      changeFile={setSelectedFile} 
                      eventInfoModal={setIsInfoModalOpen} 
                    />
                    <button
                      className="flex gap-2 items-center w-full px-3 py-2 text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                      onClick={() => {
                        setFileSelected(file);
                        setIsModalDeleteOpen(true);
                      }}
                    >
                      <img src={Trash} alt="Trash" /> Remove
                    </button>
                  </TableRowActionMenu>
              )}
            </tbody>
          </table>
        </div>

        <Pagination className="mt-8" currentPage={page} totalPages={totalPages} onPageChange={setPage} />
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
      <Dialog open={isInfoModalOpen} onOpenChange={() => setIsInfoModalOpen(false)}>
        <DialogContent className="flex flex-col p-0 max-h-[min(640px,80vh)] sm:max-w-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
            {/* <h2 className="text-base font-semibold">
              {selectedFile?.name || "File Info"}
            </h2> */}
            <DialogTitle className="text-xl">{selectedFile?.name || "File Info"}</DialogTitle>
            <DialogClose asChild className="text:black hover:text-gray-400">
              {/* <Button variant="ghost" size="icon" className="h-10 w-10 p-0"> */}
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.0503 20.2493L21.3753 16.9243L24.7003 20.2493L25.7897 19.1583L22.4647 15.8333L25.7897 12.5083L24.7003 11.4174L21.3753 14.7424L18.0503 11.4174L16.961 12.5083L20.286 15.8333L16.961 19.1583L18.0503 20.2493ZM12.8507 26.9167C12.1213 26.9167 11.5127 26.6728 11.0251 26.1852C10.5374 25.6975 10.2931 25.089 10.292 24.3596V7.30709C10.292 6.57875 10.5364 5.97023 11.0251 5.4815C11.5138 4.99278 12.1223 4.74895 12.8507 4.75H29.9016C30.6299 4.75 31.2384 4.99384 31.7272 5.4815C32.2159 5.96917 32.4597 6.5777 32.4587 7.30709V24.3596C32.4587 25.0879 32.2148 25.6959 31.7272 26.1836C31.2395 26.6713 30.6304 26.9156 29.9 26.9167H12.8507ZM12.8507 25.3333H29.9016C30.1444 25.3333 30.3676 25.232 30.5713 25.0293C30.7751 24.8267 30.8764 24.6034 30.8753 24.3596V7.30709C30.8753 7.06431 30.774 6.84106 30.5713 6.63734C30.3687 6.43361 30.1449 6.33228 29.9 6.33334H12.8507C12.6068 6.33334 12.3831 6.43467 12.1793 6.63734C11.9756 6.84 11.8743 7.06325 11.8753 7.30709V24.3596C11.8753 24.6024 11.9767 24.8256 12.1793 25.0293C12.382 25.2331 12.6052 25.3344 12.8491 25.3333M8.09908 31.6667C7.37075 31.6667 6.76222 31.4228 6.2735 30.9352C5.78477 30.4475 5.54094 29.839 5.542 29.1096V10.4738H7.12533V29.1096C7.12533 29.3524 7.22666 29.5756 7.42933 29.7793C7.632 29.9831 7.85525 30.0844 8.09908 30.0833H26.7349V31.6667H8.09908Z" fill="currentColor"/>
                </svg>
              {/* </Button> */}
            </DialogClose>
          </div>
          <div className="px-6 text-sm overflow-y-auto scroll-custom space-y-8">
          {/* General Section */}
          <div>
            <h3 className="font-inter font-semibold text-[14px] mb-2">General:</h3>
            <div className="space-y-1 font-inter text-[14px]">
              <table className="text-[14px] font-inter w-full table-fixed">
                <tbody>
                  <tr>
                    <td className="font-normal text-gray-500 text-right align-top pr-3 w-24">Kind:</td>
                    <td className="font-medium">docx / Microsoft Word</td>
                  </tr>
                  <tr>
                    <td className="font-normal text-gray-500 text-right pr-3">Size:</td>
                    <td className="font-medium">3.056.611 bytes (3,1 MB on cloud)</td>
                  </tr>
                  <tr>
                    <td className="font-normal text-gray-500 text-right align-top pr-3">Where:</td>
                    <td className="font-medium leading-snug break-words">
                      File Management &gt; Laporan Absensi Karyawan
                    </td>
                  </tr>
                  <tr>
                    <td className="font-normal text-gray-500 text-right pr-3">Created:</td>
                    <td className="font-medium">18 October 2015 at 09.06</td>
                  </tr>
                  <tr>
                    <td className="font-normal text-gray-500 text-right pr-3">Modified:</td>
                    <td className="font-medium">28 November 2025 at 11.02</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* More Info Section */}
          <div>
            <h3 className="font-inter font-semibold text-[14px] mb-2">More Info:</h3>
            <div className="space-y-1 font-inter text-[14px]">
              <table className="text-[14px] font-inter w-full table-fixed">
                <tbody>
                  <tr>
                    <td className="font-normal text-gray-500 text-right align-top pr-3 w-24">Kind:</td>
                    <td className="font-medium">docx / Microsoft Word</td>
                  </tr>
                  <tr>
                    <td className="font-normal text-gray-500 text-right align-top pr-3">Where From:</td>
                    <td className="font-medium leading-snug break-words">
                     Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </td>
                  </tr>
                  <tr>
                    <td className="font-normal text-gray-500 text-right pr-3">Created By:</td>
                    <td className="font-medium">
                      
                    </td>
                  </tr>
                  <tr>
                    <td className="font-normal text-gray-500 text-right pr-3">Lastest Modified:</td>
                    <td className="font-medium"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </DialogContent>
      </Dialog>

      {/* Modal Upload */}
      <ModalUpload />

      {/* Modal Folder */}
      <ModalFolder
        open={isModalFolderOpen}
        onOpenChange={setIsModalFolderOpen}
        folderKeys={folderKeys}
        data={fileSelected}
        mode={fileSelected? "edit":"create"}
        extraAction={()=>loadData()}
      />

    </>
  );
};

export default FileManagementPage;

export function ModalFolder({ open, onOpenChange, folderKeys, data, mode, extraAction = function(){} }) {
  const [loading, setLoading] = useState(false);
  
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
  const { token, isAdminAccess, isCompanyAccess, isExpired, refreshSession } = useAuth();
  const isEdit = mode=="edit";
  
  useEffect(() => {
    reset({
      folder_name: data?.name ?? "",
    });
  }, [data, reset]);

  const onSubmit = async (values) => {
    console.log(values)
    if(isExpired()){
      refreshSession();
    }

    setLoading(true);
    // setErrorMessage("");
    try {
      console.log(values)
      const formData = {
        "folder_name": values.folder_name,
      };
      const headers = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const url = (isAdminAccess() || isCompanyAccess())? 
      (isEdit? 
        `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/storage/${folderKeys}/folder/${data.id}`:
        `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/storage/${folderKeys}/folder`
      ) : 
      (isEdit?
        `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/app/company/1/storage/${folderKeys}/folder/${data.id}`:
        `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/app/company/1/storage/${folderKeys}/folder`
      ) ;
      
      const res = isEdit? await axios.put(url, formData, headers):await axios.post(url, formData, headers); 
      const body = res.data;
      console.log(body)

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
      <DialogModalContent className="flex flex-col gap-0 p-0 sm:max-h-full sm:max-w-5xl"> {/*max-h-[min(640px,80vh)]*/}
        <DialogModalHeader>
          <DialogModalTitle className="px-6 py-4 font-inter font-bold text-[22px] text-[#1B2E48]">
            {mode=="edit"? `Rename Folder`:`New Folder`}
          </DialogModalTitle>

          <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto scroll-custom">
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
              </div>
            </DialogModalDescription>

            <DialogModalFooter className="px-6 pb-6 items-center">
              <Button
                type="submit"
                disabled={loading}
                className="w-full max-w-[300px] bg-[#1a2f48] hover:bg-[#1a2f48]/80 text-white"
              >
                {loading? "Sending...":"Save"}
              </Button>
            </DialogModalFooter>
          </form>
        </DialogModalHeader>
      </DialogModalContent>
    </DialogModal>
  );
}
