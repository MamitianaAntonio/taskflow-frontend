import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../layouts/Navbar";
import BottomNav from "../layouts/BottomNav";
import Sidebar from "../components/Sidebar/Sidebar";

export default function Dashboard() {
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="relative flex-1 overflow-y-auto overflow-x-hidden p-2 pb-24 md:pb-2">
          <motion.div
            key={pathname}
            className="h-full"
            initial={{ opacity: 0.35, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
