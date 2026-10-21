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
        <main className="relative flex-1 overflow-y-auto overflow-x-hidden p-2 md:pb-2">
          <motion.div
            key={pathname}
            className="min-h-full"
            initial={{ opacity: 0.35, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
          {/* The bottom nav floats over this scroll area. A scroll container
              drops its own bottom padding as soon as the content overflows it,
              which is exactly the case on a full page — so reserve the
              clearance with an explicit spacer instead. */}
          <div
            aria-hidden
            className="h-[calc(3.75rem+env(safe-area-inset-bottom))] md:hidden"
          />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
