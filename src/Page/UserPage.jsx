import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { FaUserEdit, FaLock, FaTrash } from "react-icons/fa";
import Navbar from "@src/Components/Navbar";
import { useSearch } from "@src/Providers/SearchProvider";
import { TableActionMenu } from "@src/Components/TableActionMenu";
import DeleteModal from "@src/Components/DeleteModal";
import Pagination from "@src/Components/Pagination";
import { ToastProvider, useToast } from "@src/Providers/ToastProvider";

const UserPage = () => {
  return (
    <ToastProvider>
      <UserPageContent />
    </ToastProvider>
  );
};

const UserPageContent = () => {
  const { search, setSearch } = useSearch();
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [modeForm, setModeForm] = useState("create");
  const [page, setPage] = useState(1);
  const totalPages = 6;

  const users = [
    { id: 1, name: "Desy Puji Astuti", email: "admin@gmail.com", phone: "087870590000", position: "HR/GA" },
    { id: 2, name: "Hani Ayu Wula..", email: "admin@gmail.com", phone: "087870590000", position: "Finance" },
    { id: 3, name: "Rahul", email: "admin@gmail.com", phone: "087870590000", position: "Operation" },
    { id: 4, name: "Dika", email: "admin@gmail.com", phone: "087870590000", position: "Operation" },
  ];

  useEffect(() => setSearch(""), []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar
        renderActionModal={() => (
          <button
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="bg-[#1e3264] text-white px-4 py-2 rounded-md font-medium hover:bg-[#15234a] transition"
          >
            + New User
          </button>
        )}
      />

      <main className="flex-1 items-center p-6 overflow-auto">
        <div className="w-full overflow-x-scroll rounded-lg">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F3F3F3]">
                <tr className="border border-gray-200">
                  <th className="px-4 py-3 w-10"></th>
                  <th className="px-4 py-3 font-inter font-medium text-[14px] text-black">Name</th>
                  <th className="px-4 py-3 font-inter font-medium text-[14px] text-black">Email</th>
                  <th className="px-4 py-3 font-inter font-medium text-[14px] text-black">Position</th>
                  <th className="px-4 py-3 font-inter font-medium text-[14px] text-black">Phone</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition border-b border-gray-200"
                  >
                    <td className="px-4 py-3">
                      <TableActionMenu>
                        <button
                          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => {
                            setIsModalOpen(true);
                            setModeForm("update");
                          }}
                        >
                          <FaUserEdit className="mr-2 text-gray-500" />
                          Edit User
                        </button>
                        <button
                          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => alert("Reset Password")}
                        >
                          <FaLock className="mr-2 text-gray-500" />
                          Reset Password
                        </button>
                        <button
                          className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-50"
                          onClick={() => setIsModalDeleteOpen(true)}
                        >
                          <FaTrash className="mr-2 text-red-500" />
                          Delete User
                        </button>
                      </TableActionMenu>
                    </td>
                    <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">{user.name}</td>
                    <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">{user.email}</td>
                    <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">{user.position}</td>
                    <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">{user.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="w-full">
            <Pagination className="mt-8" currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
      </main>

      <ModalCreateUser
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modeForm}
      />

      <DeleteModal
        isOpen={isModalDeleteOpen}
        onClose={() => setIsModalDeleteOpen(false)}
        onConfirm={() => {
          setIsModalDeleteOpen(false);
          addToast("error", "Delete failed");
        }}
      />
    </>
  );
};

export default UserPage;

export function ModalCreateUser({ isOpen, onClose, data=null, mode="create" }) {
  // Close modal on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
            className="bg-white relative rounded-lg shadow-lg w-full p-4 max-w-3xl mx-4 z-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()} // klik di modal tidak menutup
          >
            <h2 className="font-inter font-bold text-left text-[30px] text-[#1B2E48]">{mode=="create"? "Add New User":"Edit User"}</h2>
            <button onClick={onClose} className="absolute top-4 right-4 group w-7 h-7 p-[2px] flex justify-center items-center bg-white border border-2 border-black hover:bg-black rounded-lg text-white">
              <X size={16} className="text-black group-hover:text-white transition" />
            </button>

            <div className="flex flex-col justify-center py-4">
              <div className="w-full">
                <h5 className="font-inter font-bold text-[22px] text-[#1B2E48] pb-4">General Information</h5>
              </div>

              <div className="w-full flex gap-4 pb-6">
                <div className="flex-1 flex-col">
                  <label className="font-inter font-semibold text-[16px] text-[#1B2E48]">First Name</label>
                  <input
                    type="text"
                    className="w-full pl-4 pr-10 py-2 rounded-md border border-2 border-black placeholder-gray-500 focus:outline-none focus:border-1 focus:border-[#497fff]"
                  />
                </div>
                <div className="flex-1 flex-col">
                  <label className="font-inter font-semibold text-[16px] text-[#1B2E48]">Last Name</label>
                  <input
                    type="text"
                    className="w-full pl-4 pr-10 py-2 rounded-md border border-2 border-black placeholder-gray-500 focus:outline-none focus:border-1 focus:border-[#497fff]"
                  />
                </div>
              </div>

              <div className="w-full flex gap-4">
                <div className="flex-1 flex-col">
                  <label className="font-inter font-semibold text-[16px] text-[#1B2E48]">Whatsapp No</label>
                  <input
                    type="text"
                    className="w-full pl-4 pr-10 py-2 rounded-md border border-2 border-black placeholder-gray-500 focus:outline-none focus:border-1 focus:border-[#497fff]"
                  />
                </div>
                <div className="flex-1 flex-col">
                  <label className="font-inter font-semibold text-[16px] text-[#1B2E48]">Password</label>
                  <input
                    type="text"
                    className="w-full pl-4 pr-10 py-2 rounded-md border border-2 border-black placeholder-gray-500 focus:outline-none focus:border-1 focus:border-[#497fff]"
                  />
                </div>
                <div className="flex-1 flex-col">
                  <label className="font-inter font-semibold text-[16px] text-[#1B2E48]">Address</label>
                  <input
                    type="text"
                    className="w-full pl-4 pr-10 py-2 rounded-md border border-2 border-black placeholder-gray-500 focus:outline-none focus:border-1 focus:border-[#497fff]"
                  />
                </div>
              </div>

              <div className="w-full py-6">
                <h5 className="font-inter font-bold text-[22px] text-[#1B2E48]">Professional Information</h5>
              </div>

              <div className="w-full flex gap-4 pb-4">
                <div className="flex-1 flex-col">
                  <label className="font-inter font-semibold text-[16px] text-[#1B2E48]">Job Position</label>
                  <input
                    type="text"
                    className="w-full pl-4 pr-10 py-2 rounded-md border border border-2 border-black placeholder-gray-500 focus:outline-none focus:border-1 focus:border-[#497fff]"
                  />
                </div>
                <div className="flex-1 flex-col">
                  <label className="font-inter font-semibold text-[16px] text-[#1B2E48]">Work Location / Branch</label>
                  <input
                    type="text"
                    className="w-full pl-4 pr-10 py-2 rounded-md border border border-2 border-black placeholder-gray-500 focus:outline-none focus:border-1 focus:border-[#497fff]"
                  />
                </div>
              </div>

              <div className="w-full flex gap-2">
                <div className="flex-1 flex-col">
                  <label className="font-inter font-semibold text-[16px] text-[#1B2E48]">Select Role</label>
                  <input
                    type="text"
                    className="w-full pl-4 pr-10 py-2 rounded-md border border border-2 border-black placeholder-gray-500 focus:outline-none focus:border-1 focus:border-[#497fff]"
                  />
                </div>
                <div className="flex-1 flex-col"></div>
              </div>

            </div>

            {/* Body */}
            <div className="flex justify-center pt-4 max-w-lg mx-auto">
              <button
                className="w-[300px] bg-[#1a2f48] hover:bg-[#1a2f48]/80 text-white py-3 rounded-xl transition disabled:opacity-50"
                onClick={()=>{}}
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}