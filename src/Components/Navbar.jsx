import { useSidebar } from "@src/Providers/SidebarProvider";
import { HiHome } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import { useSearch } from "@src/Providers/SearchProvider";
import { BsArrowsAngleExpand } from "react-icons/bs";

const Navbar = ({renderActionModal = null}) => {
    const location = useLocation();
    const currentPath = location.pathname;
    const { toggleSidebar, toggleCollapse } = useSidebar();
    const { setSearch } = useSearch();
  
    function renderContent(){
        if(["/dashboard"].some((p) => currentPath.startsWith(p))){
            return <>
                <button onClick={toggleSidebar} className="lg:hidden flex text-black text-left font-inter font-[542] text-[14px] items-center gap-2 transition">
                    <HiHome className="text-[#497fff]" size={20}/>
                    Home
                </button>

                {/* Tombol Collapse Sidebar untuk Desktop */}
                <button onClick={toggleCollapse} className="hidden lg:flex text-black text-left font-inter font-[542] text-[14px] items-center gap-2 transition">
                    <HiHome className="text-[#497fff]" size={20}/>
                    Home
                </button>

                {typeof renderActionModal === "function" && renderActionModal()}
            </>;
        } else if(["/filemanager"].some((p) => currentPath.startsWith(p))){
            return <>
                <button onClick={toggleSidebar} className="lg:hidden flex items-center text-black text-left font-inter font-medium text-[14px] text-[#243874] gap-2 transition">
                    <BsArrowsAngleExpand className="-rotate-10" size={14}/>
                    Expand
                </button>

                {/* Tombol Collapse Sidebar untuk Desktop */}
                <button onClick={toggleCollapse} className="hidden lg:flex items-center text-black text-left font-inter font-medium text-[14px] text-[#243874] gap-2 transition">
                    <BsArrowsAngleExpand className="-rotate-10" size={14}/>
                    Expand
                </button>

                {typeof renderActionModal === "function" && renderActionModal()}
            </>;
        } else if(["/users"].some((p) => currentPath.startsWith(p))){
            return <>
                <button onClick={toggleSidebar} className="lg:hidden w-full sm:w-auto text-left font-inter font-semibold text-[18px] text-[#243874]">
                    User Management
                </button>
                <button onClick={toggleCollapse} className="hidden lg:flex w-full sm:w-auto text-left font-inter font-semibold text-[18px] text-[#243874]">
                    User Management
                </button>

                <div className="flex flex-wrap  w-full sm:w-auto items-center gap-3">
                    {/* Search */}
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
            </>
        } else if(["/role_permissions"].some((p) => currentPath.startsWith(p))){
            return <>
                <button onClick={toggleSidebar} className="lg:hidden w-full sm:w-auto text-left text-left font-inter font-semibold text-[18px] text-[#243874]">
                   Roles & Permissions
                </button>
                <button onClick={toggleCollapse} className="hidden lg:flex w-full sm:w-auto text-left text-left font-inter font-semibold text-[18px] text-[#243874]">
                   Roles & Permissions
                </button>

                <div className="flex flex-wrap  w-full sm:w-auto items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                    <input
                        type="text"
                        onChange={(e)=>setSearch(e.target.value)}
                        placeholder="Search by name"
                        className="w-full min-w-0  pl-4 pr-10 py-2 rounded-md bg-[#F4F3F3] placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#497fff]"
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
            </>
        } else if(["/logs"].some((p) => currentPath.startsWith(p))){
            return <>
                <button onClick={toggleSidebar} className="lg:hidden w-full sm:w-auto text-left text-left font-inter font-semibold text-[18px] text-[#243874]">
                   Activity Log History
                </button>
                <button onClick={toggleCollapse} className="hidden lg:flex w-full sm:w-auto text-left text-left font-inter font-semibold text-[18px] text-[#243874]">
                   Activity Log History
                </button>

                <div className="flex flex-wrap  w-full sm:w-auto items-center gap-3">
                    {/* Search */}
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
            </>
        } else if(["/settings"].some((p) => currentPath.startsWith(p))){
            return <>
                <button onClick={toggleSidebar} className="lg:hidden w-full sm:w-auto text-left text-left font-inter font-semibold text-[18px] text-[#243874]">
                   Settings
                </button>
                <button onClick={toggleCollapse} className="hidden lg:flex w-full sm:w-auto text-left text-left font-inter font-semibold text-[18px] text-[#243874]">
                   Settings
                </button>
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