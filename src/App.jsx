import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Page/LoginPage";
import DashboardPage from "./Page/DashboardPage";
import UserPage from "./Page/UserPage";
import LogHistoryPage from "./Page/LogHistoryPage";
import { SidebarProvider } from "./Providers/SidebarProvider";
import RolePermissionPage from "./Page/RolePermissionPage";
import PanelLayout from "./Template/PanelLayout";
import SettingPage from "./Page/SettingPage";
import FileManagementPage from "./Page/FileManagementPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import { AuthProvider } from "./Providers/AuthProvider";

export default function App() {
  return (
    <SidebarProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<PanelLayout />}>
                <Route path="/dashboard/:folderKeys?" element={<DashboardPage />} />
                <Route path="/filemanager/:folderKeys?" element={<FileManagementPage />} />
                <Route path="/users/" element={<UserPage />} />
                <Route path="/logs/" element={<LogHistoryPage />} />
                <Route path="/role_permissions/" element={<RolePermissionPage />} />
                <Route path="/settings/" element={<SettingPage />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </SidebarProvider>
  );
}
