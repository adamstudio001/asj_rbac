import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Page/LoginPage";
import FileManagerPage from "./Page/FileManagerPage";
import UserPage from "./Page/UserPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/filemanager/" element={<FileManagerPage />} />
        <Route path="/users/" element={<UserPage />} />
        {/* <Route path="/portofolio/:id" element={<PortfolioDetail />} /> */}
      </Routes>
    </Router>
  );
}