import { useSidebar } from "@src/Providers/SidebarProvider";
import { HiHome } from "react-icons/hi";
import { LuUpload } from "react-icons/lu";
import { useLocation } from "react-router-dom";
import { useSearch } from "@src/Providers/SearchProvider";

const Navbar = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const { toggleSidebar, toggleCollapse } = useSidebar();
    const { setSearch } = useSearch();
  
    function renderContent(){
        if(["/filemanager"].some((p) => currentPath.startsWith(p))){
            return <>
                <button onClick={toggleSidebar} className="lg:hidden flex items-center gap-1 text-left  font-medium transition">
                    <HiHome className="text-[#497fff]" size={20}/>
                    Home
                </button>

                {/* Tombol Collapse Sidebar untuk Desktop */}
                <button onClick={toggleCollapse} className="hidden lg:flex text-gray-700 items-center gap-1 text-left  font-medium transition">
                    <HiHome className="text-[#497fff]" size={20}/>
                    Home
                </button>

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
            </>;
        } else if(["/users"].some((p) => currentPath.startsWith(p))){
            return <>
                <button onClick={toggleSidebar} className="lg:hidden w-full sm:w-auto text-xl text-left font-semibold text-[#1e3264]">
                    User Management
                </button>
                <button onClick={toggleCollapse} className="hidden lg:flex w-full sm:w-auto text-xl text-left font-semibold text-[#1e3264]">
                    User Management
                </button>

                <div className="w-full sm:w-auto flex items-center gap-3">
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
            </>
        } else if(["/role_permissions"].some((p) => currentPath.startsWith(p))){
            return <>
                <button onClick={toggleSidebar} className="lg:hidden w-full sm:w-auto text-xl text-left font-semibold text-[#1e3264]">
                   Roles & Permissions
                </button>
                <button onClick={toggleCollapse} className="hidden lg:flex w-full sm:w-auto text-xl text-left font-semibold text-[#1e3264]">
                   Roles & Permissions
                </button>

                <div className="w-full sm:w-auto flex items-center gap-3">
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
            </>
        } else if(["/logs"].some((p) => currentPath.startsWith(p))){
            return <>
                <button onClick={toggleSidebar} className="lg:hidden w-full sm:w-auto text-xl text-left font-semibold text-[#1e3264]">
                   Activity Log History
                </button>
                <button onClick={toggleCollapse} className="hidden lg:flex w-full sm:w-auto text-xl text-left font-semibold text-[#1e3264]">
                   Activity Log History
                </button>

                <div className="w-full sm:w-auto flex items-center gap-3">
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
            </>
        }
    }
  return (
    <nav className="bg-white border-b-2 border-gray-100 p-4 flex flex-wrap gap-2 items-center justify-between">
        {renderContent()}
    </nav>
  );
};

export default Navbar;