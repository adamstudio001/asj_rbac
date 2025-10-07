import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Page/LoginPage";
import FileManagerPage from "./Page/FileManagerPage";
import UserPage from "./Page/UserPage";
import LogHistoryPage from "./Page/LogHistoryPage";
import { SidebarProvider } from "./Providers/SidebarProvider";
import RolePermissionPage from "./Page/RolePermissionPage";
import PanelLayout from "./Template/PanelLayout";

export default function App() {
  return (
    <SidebarProvider>
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route element={<PanelLayout />}>
                    <Route path="/filemanager/:folderKeys?" element={<FileManagerPage />} />
                    <Route path="/users/" element={<UserPage />} />
                    <Route path="/logs/" element={<LogHistoryPage />} />
                    <Route path="/role_permissions/" element={<RolePermissionPage />} />
                    {/* <Route path="/portofolio/:id" element={<PortfolioDetail />} /> */}
                </Route>
            </Routes>
        </Router>
    </SidebarProvider>
  );
}