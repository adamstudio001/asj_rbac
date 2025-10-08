import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pencil } from "lucide-react";
import { FiLock } from "react-icons/fi";
import { useSearch } from "../Providers/SearchProvider";
import Navbar from "@src/Components/Navbar";

const RolePermissionPage = () => {
  const { search, setSearch } = useSearch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const roles = [
    { id: 1, role: "HR/GA", permission: ["create"]},
    { id: 2, role: "Finance", permission: []},
    { id: 3, role: "Operation", permission: []},
    { id: 4, role: "Developer", permission: []},
  ];

  useEffect(()=>{
      setSearch("");
  },[]);

  const filteredRoles = roles.filter(user =>
    user.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      
      <main className="flex-1 items-center p-6 overflow-auto">
        <div className="w-full overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f8f8f8] text-black font-medium">
              <tr>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Permission</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((role) => (
                <tr
                  key={role.id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{role.role}</td>
                  <td className="px-4 py-3">{
                role.permission.map(p => <span className="px-2 py-1 bg-green-400 rounded rounded-xl">{p}</span>)  
                  }</td>
                  <td className="px-4 py-3 flex items-center gap-4 text-gray-500">
                <button onClick={()=>alert("fungsi edit")} className="flex items-center gap-1 hover:text-red-600 transition">
                  <Pencil size={14} />
                  <span className="text-sm">Edit</span>
                </button>
                <button className="flex items-center gap-1 hover:text-red-600 transition">
                  <FiLock size={14} />
                  <span onClick={()=>alert("fungsi permission")} className="text-sm">Set Permission</span>
                </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            className="bg-white rounded-lg shadow-lg w-full p-4 max-w-xl mx-4 z-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()} // klik di modal tidak menutup
          >
            {/* Header */}
            <div className="flex justify-between items-center text-2xl font-semibold text-center">
              <h2 className="flex-3">General Information</h2>
              <button
                onClick={onClose}
                className="w-6 h-6 p-[2px] flex justify-center items-center bg-black hover:bg-black/50 rounded-full text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-8 justify-center py-6">
              <div className="w-full flex gap-2">
                <div className="flex-1 flex-col">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="w-full pl-4 pr-10 py-2 rounded-md border border-black placeholder-gray-500 focus:outline-none focus:border-1 focus:border-[#497fff]"
                  />
                </div>
                <div className="flex-1 flex-col">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="w-full pl-4 pr-10 py-2 rounded-md border border-black placeholder-gray-500 focus:outline-none focus:border-1 focus:border-[#497fff]"
                  />
                </div>
              </div>

              <div className="w-full flex gap-2">
                <div className="flex-1 flex-col">
                  <label>Whatsapp No</label>
                  <input
                    type="text"
                    className="w-full pl-4 pr-10 py-2 rounded-md border border-black placeholder-gray-500 focus:outline-none focus:border-1 focus:border-[#497fff]"
                  />
                </div>
                <div className="flex-1 flex-col">
                  <label>Password</label>
                  <input
                    type="text"
                    className="w-full pl-4 pr-10 py-2 rounded-md border border-black placeholder-gray-500 focus:outline-none focus:border-1 focus:border-[#497fff]"
                  />
                </div>
                <div className="flex-1 flex-col">
                  <label>Address</label>
                  <input
                    type="text"
                    className="w-full pl-4 pr-10 py-2 rounded-md border border-black placeholder-gray-500 focus:outline-none focus:border-1 focus:border-[#497fff]"
                  />
                </div>
              </div>

              <div className="w-full flex gap-2">
                <div className="flex-1 flex-col">
                  <label>Job Type</label>
                  <input
                    type="text"
                    className="w-full pl-4 pr-10 py-2 rounded-md border border-black placeholder-gray-500 focus:outline-none focus:border-1 focus:border-[#497fff]"
                  />
                </div>
                <div className="flex-1 flex-col">
                  <label>Designation</label>
                  <input
                    type="text"
                    className="w-full pl-4 pr-10 py-2 rounded-md border border-black placeholder-gray-500 focus:outline-none focus:border-1 focus:border-[#497fff]"
                  />
                </div>
              </div>

              <div className="w-full flex gap-2">
                <div className="flex-1 flex-col">
                  <label>Select Role</label>
                  <input
                    type="text"
                    className="w-full pl-4 pr-10 py-2 rounded-md border border-black placeholder-gray-500 focus:outline-none focus:border-1 focus:border-[#497fff]"
                  />
                </div>
                <div className="flex-1 flex-col">
                  <label>Reporting Manager</label>
                  <input
                    type="text"
                    className="w-full pl-4 pr-10 py-2 rounded-md border border-black placeholder-gray-500 focus:outline-none focus:border-1 focus:border-[#497fff]"
                  />
                </div>
              </div>

            </div>

            {/* Body */}
            <div className="flex justify-center pt-4 max-w-lg mx-auto">
              <button
                className="w-[300px] bg-[#1a2f48] hover:bg-[#1a2f48]/80 text-white py-4 rounded-xl transition disabled:opacity-50"
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

export default RolePermissionPage;
