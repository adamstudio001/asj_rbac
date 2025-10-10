import { Outlet } from "react-router-dom";
import Sidebar from "@src/Components/Sidebar";
import { FileManagerProvider } from "@src/Providers/FileManagerProvider";
import { useSidebar } from "@src/Providers/SidebarProvider";
import { SearchProvider } from "../Providers/SearchProvider";

const PanelLayout = () => {
  const { isSidebarOpen, toggleSidebar, isCollapsed } = useSidebar();

  return (
    <div className="md:flex h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        isCollapsed={isCollapsed} 
      />

      <div className="flex-1 flex flex-col">
        <SearchProvider>
          <FileManagerProvider>
            <Outlet />
          </FileManagerProvider>
        </SearchProvider>
      </div>
    </div>
  );
};
export default PanelLayout;
