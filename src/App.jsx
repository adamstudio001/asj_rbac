import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; //HashRouter
import LoginPage from "./Page/LoginPage";
import DashboardPage from "./Page/DashboardPage";
import UserPage from "./Page/UserPage";
import LogHistoryPage from "./Page/LogHistoryPage";
import { SidebarProvider } from "./Providers/SidebarProvider";
import RolePermissionPage from "./Page/RolePermissionPage";
import PanelLayout from "./Template/PanelLayout";
// import SettingPage from "./Page/SettingPage";
import FileManagementPage from "./Page/FileManagementPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import { AuthProvider } from "./Providers/AuthProvider";
import { ToastProvider } from "./Providers/ToastProvider";
import AccessControlRoute from "./Components/AccessControlRoute";
import NotFoundPage from "./Page/NotFoundPage";

export default function App() {
  return (
    <ToastProvider>
      <SidebarProvider>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<PanelLayout />}>
                  <Route path="/dashboard/:folderKeys?" element={<DashboardPage />} />
                  <Route path="/filemanager/:folderKeys?" element={<FileManagementPage />} />
                  <Route element={<AccessControlRoute checkAccess={(auth) => {
                    const isAdmin = auth.isAdminAccess() || auth.isCompanyAccess();
                    const hasGrantedShowMenuUser = auth.canAccessModule("User") || isAdmin;
                    return hasGrantedShowMenuUser;
                  }} />}>
                    <Route path="/users" element={<UserPage />} />
                  </Route>
                  <Route element={<AccessControlRoute checkAccess={(auth) => {
                    const isAdmin = auth.isAdminAccess() || auth.isCompanyAccess();
                    const hasGrantedShowMenuRole = auth.canAccessModule("Role Access") || isAdmin;
                    return hasGrantedShowMenuRole;
                  }} />}>
                    <Route path="/role_permissions" element={<RolePermissionPage />} />
                  </Route>
                  <Route path="/logs/" element={<LogHistoryPage />} />
                  {/* <Route path="/settings/" element={<SettingPage />} /> */}
                </Route>
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </Router>
      </SidebarProvider>
    </ToastProvider>
  );
}
