import React, { useEffect, useRef, useState } from "react";
import Navbar from "@src/Components/Navbar";
import Pagination from "@src/Components/Pagination";
import { useSearch } from "@src/Providers/SearchProvider";
import { IoIosArrowDown } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import { useFileManager } from "@src/Providers/FileManagerProvider";
import { formatDate, formatFileSize, formatFileType, getFileIcon } from "../Common/Utils";
import { ToastProvider, useToast } from "@/Providers/ToastProvider";
import ModalUpload from "@/Components/ModalUpload";
import { TableRowActionMenu } from "@/Components/TableRowActionMenu";
import DeleteModal from "@/Components/DeleteModal";
import EllipsisTooltip from "@/Components/EllipsisTooltip";

const FileManagementPage = () => {
  return (
    <ToastProvider>
      <FileManagementContent />
    </ToastProvider>
  );
};

const FileManagementContent = () => {
  const { search, setSearch } = useSearch();
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [page, setPage] = useState(1);
  const totalPages = 6;
  const { addToast } = useToast();

  const files = [
    { id: 1, name: "Laporan Absensi Karyawan", isFolder: true, lastModified: "2025-01-01 10:00:00", fileSize: 20202000000 },
    { id: 2, name: "Reimbursment.xlsx", isFolder: false, lastModified: "2025-01-01 10:00:00", fileSize: 10240},
    { id: 3, name: "surat izin cuti.docx", isFolder: false, lastModified: "2025-01-01 10:00:00", fileSize: 30000 },
    { id: 4, name: "dokumen operasional.zip", isFolder: false, lastModified: "2025-01-01 10:00:00", fileSize: 645000 },
  ];

  const { 
      setIsModalOpen,
  } = useFileManager();

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
              <button onClick={()=>{
                setIsModalOpen(true);
              }} className="flex items-center gap-3 bg-[#1B2E48] text-white font-inter font-medium text-[14px] px-4 py-2 rounded-md hover:bg-[#1b2e48d9] transition">
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
                  <th className="px-4 py-3 font-inter font-medium text-[14px] text-[#5B5B5B] min-w-0 w-[250px]">File Name</th>
                  <th className="px-4 py-3 font-inter font-medium text-[14px] text-[#5B5B5B]">File Type</th>
                  <th className="px-4 py-3 font-inter font-medium text-[14px] text-[#5B5B5B]">Last Modified</th>
                  <th className="px-4 py-3 font-inter font-medium text-[14px] text-[#5B5B5B]">File Size</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => {
                  return file.isFolder? 
                    <tr
                      key={file.id}
                      onClick={()=>alert("fitur belum di implementasi")}
                      className="hover:bg-gray-50 transition border-b border-gray-200"
                    >
                      <td className="px-4 py-3 text-gray-800 flex gap-2 items-center ">
                        {getFileIcon(file.name, file.isFolder, 24)}
                        <EllipsisTooltip className={"w-[250px]"}>{file.name}</EllipsisTooltip>
                      </td>
                      <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">{formatFileType(file.name)}</td>
                      <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">{formatDate(file.lastModified)}</td>
                      <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">{formatFileSize(file.fileSize)}</td>
                    </tr> : 
                    <TableRowActionMenu
                      key={file.id}
                      rowCells={
                        <>
                          <td className="px-4 py-3 text-gray-800 flex gap-2 items-center ">
                            {getFileIcon(file.name, file.isFolder, 24)}
                            <EllipsisTooltip className={"w-[250px]"}>{file.name}</EllipsisTooltip>
                          </td>
                          <td className="px-4 py-3 font-inter text-[14px]">
                            {formatFileType(file.name)}
                          </td>
                          <td className="px-4 py-3 font-inter text-[14px]">
                            {formatDate(file.lastModified)}
                          </td>
                          <td className="px-4 py-3 font-inter text-[14px]">
                            {formatFileSize(file.fileSize)}
                          </td>
                        </>
                      }
                    >
                      <button
                        className="flex items-center w-full px-3 py-2 text-sm text-[#979797] hover:bg-[#1B2E48] hover:text-white"
                        onClick={() => alert("Download")}
                      >
                        Download
                      </button>
                      <button
                        className="flex items-center w-full px-3 py-2 text-sm text-[#979797] hover:bg-[#1B2E48] hover:text-white"
                        onClick={() => {
                          setIsModalDeleteOpen(true);
                        }}
                      >
                        Delete
                      </button>
                    </TableRowActionMenu>
                })}
              </tbody>
            </table>
          </div>

          <div className="w-full">
            <Pagination className="mt-8" currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
      </main>

      <DeleteModal
          isOpen={isModalDeleteOpen}
          onClose={() => setIsModalDeleteOpen(false)}
          onConfirm={() => {
            setIsModalDeleteOpen(false);
            addToast("success", "Deleted successfully");
          }}
      />

      <ModalUpload/>
    </>
  );
};

export default FileManagementPage;