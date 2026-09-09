import { Outlet } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import BottomNav from "../layouts/BottomNav";
import Sidebar from "../components/Sidebar/Sidebar";

export default function Dashboard() {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="relative flex-1 overflow-y-auto overflow-x-hidden p-2 pb-24 md:pb-2">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}