import { Outlet } from "react-router-dom";
import Navbar from "../layouts/Navbar.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";

export default function Dashboard() {
  return (
    <div className="dashboard-layout flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-2 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
