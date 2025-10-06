import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import Sidebar from "@src/Components/Sidebar";
import { FiLock, FiTrash2 } from "react-icons/fi";

const UserPage = () => {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); //provider
  const [selected, setSelected] = useState([]);
  const users = [
    { id: 1, name: "Desy Puji Astuti", role: "Super Admin", position: "HR/GA", status: "27 mins" },
    { id: 2, name: "Hani Ayu Wula..", role: "Admin", position: "Finance", status: "11 mins" },
    { id: 3, name: "Rahul", role: "Admin", position: "Operation", status: "8 mins" },
    { id: 4, name: "Dika", role: "Super Admin", position: "Operation", status: "1 mins" },
  ];

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === users.length) {
      setSelected([]);
    } else {
      setSelected(users.map((u) => u.id));
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

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
       <header className="flex items-center justify-between px-6 py-6 border-b border-[#eaeaea]">
          {/* Left: Title */}
          <h1 className="text-xl font-semibold text-[#1e3264]">User Management</h1>

          {/* Right: Search + Button */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                onChange={(e)=>setSearch(e.target.value)}
                placeholder="Search by name"
                className="pl-4 pr-10 py-2 rounded-md bg-gray-200 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#497fff]"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* New User Button */}
            <button onClick={()=>setIsModalOpen(!isModalOpen)} className="bg-[#1e3264] text-white px-4 py-2 rounded-md font-medium hover:bg-[#15234a] transition">
              + New User
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 items-center p-6 overflow-auto">
          <div className="w-full overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f8f8f8] text-black font-medium">
                  <tr>
                    <th className="px-4 py-3 w-10">
                      <input
                          type="checkbox"
                          onClick={toggleSelectAll}
                          className="appearance-none w-4 h-4 border border-gray-300 rounded-sm bg-white 
                            checked:before:pt-[2px] checked:bg-white checked:border-gray-300 
                            checked:before:content-['✔'] checked:before:text-[8px] 
                            checked:before:flex checked:before:items-center checked:before:justify-center 
                            cursor-pointer"
                        />
                    </th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Position</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.includes(user.id)}
                          onChange={() => toggleSelect(user.id)}
                          className="appearance-none w-4 h-4 border border-gray-300 rounded-sm bg-white 
                            checked:before:pt-[2px] checked:bg-white checked:border-gray-300 
                            checked:before:content-['✔'] checked:before:text-[8px] 
                            checked:before:flex checked:before:items-center checked:before:justify-center 
                            cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                      <td className="px-4 py-3">{user.role}</td>
                      <td className="px-4 py-3">{user.position}</td>
                      <td className="px-4 py-3">{user.status}</td>
                      <td className="px-4 py-3 flex items-center gap-4 text-gray-500">
                        <button onClick={()=>alert("fungsi reset")} className="flex items-center gap-1 hover:text-red-600 transition">
                          <FiLock size={14} />
                          <span className="text-sm">Reset Password</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-red-600 transition">
                          <FiTrash2 size={14} />
                          <span onClick={()=>alert("fungsi delete")} className="text-sm">Delete User</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

export default UserPage;
