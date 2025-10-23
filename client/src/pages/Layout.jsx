import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Menu, X, Home } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { SignIn, useUser } from "@clerk/clerk-react";

const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUser();

  return user ? (
    <div className="flex items-start justify-start h-screen bg-[#0A0A0F]">
      <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
      <div className="flex-1 bg-[#0A0A0F] h-screen overflow-y-auto">
        {/* Go to Home Button - Top Right */}
        <div className="absolute top-4 right-4 z-40 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 
            rounded-xl hover:bg-white/10 transition-all duration-300 hover-lift text-white text-sm font-medium
            shadow-[0_4px_16px_rgba(0,0,0,0.3)] animate-slideInRight"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>
          {/* Mobile Menu Toggle */}
          {sidebar ? (
            <X
              onClick={() => setSidebar(false)}
              className="w-6 h-6 text-gray-300 sm:hidden hover:text-white hover:rotate-90 
              transition-all duration-300 cursor-pointer"
            />
          ) : (
            <Menu
              onClick={() => setSidebar(true)}
              className="w-6 h-6 text-gray-300 sm:hidden hover:text-white hover:scale-110 
              transition-all duration-300 cursor-pointer"
            />
          )}
        </div>

        <Outlet />
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen bg-[#0A0A0F]">
      <SignIn />
    </div>
  );
};

export default Layout;
