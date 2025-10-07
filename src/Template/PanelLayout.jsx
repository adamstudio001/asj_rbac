import { Outlet } from "react-router-dom";
import Sidebar from "@src/Components/Sidebar";
import { FileManagerProvider } from "@src/Providers/FileManagerProvider";
import { useSidebar } from "@src/Providers/SidebarProvider";
import { motion, AnimatePresence } from "framer-motion";

const PanelLayout = () => {
    const { isSidebarOpen } = useSidebar();

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  className="flex-shrink-0 h-screen bg-gray-100"
                  initial={{ x: -300 }}       
                  animate={{ x: 0 }}          
                  exit={{ x: -300 }}           
                  transition={{ type: "tween", duration: 0.3 }}
                >
                  <Sidebar isOpen={isSidebarOpen} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main content */}
            <FileManagerProvider>
                <Outlet />
            </FileManagerProvider>
        </div>
    );
};

export default PanelLayout;
