import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Menu, X, Home, ChevronsRight } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { SignIn, useUser } from "@clerk/clerk-react";

const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useUser();

  return user ? (
    <div className="flex h-screen bg-[#050505]">
      <Sidebar 
        sidebar={sidebar} 
        setSidebar={setSidebar} 
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div className="flex-1 h-screen overflow-y-auto relative">
        {/* Top Bar */}
        <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between">
          {/* Left - Expand button (desktop) / Menu (mobile) */}
          <div className="flex items-center gap-2">
            {collapsed && (
              <button
                onClick={() => setCollapsed(false)}
                className="hidden sm:flex p-2 border border-neutral-800 
                rounded-lg hover:bg-neutral-800 transition-all text-neutral-500 hover:text-white"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            )}
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setSidebar(!sidebar)}
              className="sm:hidden p-2 border border-neutral-800 rounded-lg text-neutral-500"
            >
              {sidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Right - Home Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-800 
            rounded-lg hover:bg-neutral-800 transition-all text-white text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>
        </div>

        <Outlet />
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen bg-[#050505]">
      <SignIn />
    </div>
  );
};

export default Layout;
