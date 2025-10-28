import { useLocation } from "react-router-dom";
import { IoNotificationsOutline } from "react-icons/io5";
import { LiaHomeSolid } from "react-icons/lia";
import Logo from "@assets/logo.png";
import { FaRegUser } from "react-icons/fa6";
import { BsPersonLock } from "react-icons/bs";
import { GoGear } from "react-icons/go";
import { Link } from "react-router-dom";
import { IoFileTrayStacked } from "react-icons/io5";
import { useAuth } from "@/Providers/AuthProvider";

const Sidebar = ({ isOpen, toggleSidebar, isCollapsed }) => {
  const location = useLocation();
  const active = "text-[#497fff] bg-[#e5eaf7]";
  const noactive = "text-[#656565]";
  const currentPath = location.pathname;

  const { logout } = useAuth();

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed lg:relative top-0 left-0 h-[-webkit-fill-available] overflow-y-auto scroll-custom bg-gray-100 border-r-2 border-gray-100 transition-all duration-300 ease-in-out z-50 p-3 flex flex-col justify-between
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 
          ${isCollapsed ? "w-18" : "w-64"}`}
      >
        <div className="flex flex-col">
          {/* Sidebar Content */}
          <div className="flex justify-center items-center gap-3 mb-4">
            <img src={Logo} alt="logo" className='w-[120px] aspect-square'/>
          </div>

          {/* Sidebar Menu */}
          <ul className="flex flex-col gap-3 mt-4">
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center gap-3 ${["/dashboard"].some((p) => currentPath.startsWith(p))? active:noactive} hover:bg-[#e5eaf7] hover:text-[#497fff] p-3 rounded-lg transition`}
                onClick={toggleSidebar} // Tutup sidebar saat di mobile
              >
                <LiaHomeSolid size={24} />
                <span className={`${isCollapsed ? "hidden" : "block"}`}>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/filemanager"
                className={`flex items-center gap-3 ${["/filemanager"].some((p) => currentPath.startsWith(p))? active:noactive} hover:bg-[#e5eaf7] hover:text-[#497fff] p-3 rounded-lg transition`}
                onClick={toggleSidebar} // Tutup sidebar saat di mobile
              >
                <IoFileTrayStacked size={18} />
                <span className={`${isCollapsed ? "hidden" : "block"}`}>File Management</span>
              </Link>
            </li>
            <li>
              <Link
                to="/users"
                className={`flex items-center gap-3 ${["/users"].some((p) => currentPath.startsWith(p))? active:noactive} hover:bg-[#e5eaf7] hover:text-[#497fff] p-3 rounded-lg transition`}
                onClick={toggleSidebar} // Tutup sidebar saat di mobile
              >
                <FaRegUser size={18} />
                <span className={`${isCollapsed ? "hidden" : "block"}`}>Users</span>
              </Link>
            </li>
            <li>
              <Link
                to="/role_permissions"
                className={`flex items-center gap-3 ${["/role_permissions"].some((p) => currentPath.startsWith(p))? active:noactive} hover:bg-[#e5eaf7] hover:text-[#497fff] p-3 rounded-lg transition`}
                onClick={toggleSidebar} // Tutup sidebar saat di mobile
              >
                <BsPersonLock size={24} />
                <span className={`${isCollapsed ? "hidden" : "block"}`}>Role & Permissions</span>
              </Link>
            </li>
            <li>
              <Link
                to="/logs"
                className={`flex items-center gap-3 ${["/logs"].some((p) => currentPath.startsWith(p))? active:noactive} hover:bg-[#e5eaf7] hover:text-[#497fff] p-3 rounded-lg transition`}
                onClick={toggleSidebar} // Tutup sidebar saat di mobile
              >
                <IoNotificationsOutline size={24} />
                <span className={`${isCollapsed ? "hidden" : "block"}`}>Logs History</span>
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className={`flex items-center gap-3 ${["/settings"].some((p) => currentPath.startsWith(p))? active:noactive} hover:bg-[#e5eaf7] hover:text-[#497fff] p-3 rounded-lg transition`}
                onClick={toggleSidebar} // Tutup sidebar saat di mobile
              >
                <GoGear size={24} />
                <span className={`${isCollapsed ? "hidden" : "block"}`}>Settings</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col flex-wrap gap-2">
          <hr className="border border-t border-gray-300"/>
          <button className={`flex items-center gap-3 hover:bg-[#e5eaf7] hover:text-[#497fff] p-3 rounded-lg transition text-venter`}>
            <span className={`w-full text-center ${isCollapsed ? "hidden" : "block"}`} onClick={()=>logout()}>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay untuk Mobile */}
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
