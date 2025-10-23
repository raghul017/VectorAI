import { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { SignIn, useUser } from "@clerk/clerk-react";

const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUser();

  return user ? (
    <div className="flex flex-col items-start justify-start h-screen bg-[#0A0A0F]">
      {/* Floating Glassmorphic Navbar */}
      <div className="w-full px-4 sm:px-8 pt-4 fixed top-0 z-50">
        <nav
          className="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between 
        bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl
        shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-slideDown"
        >
          <img
            className="cursor-pointer w-32 sm:w-44 brightness-200 contrast-125 saturate-150 
            hover:scale-105 transition-transform duration-300"
            src={assets.logo}
            alt="logo"
            onClick={() => navigate("/")}
          />
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
        </nav>
      </div>

      {/* Main Content with top padding for floating navbar */}
      <div className="flex-1 w-full flex h-screen pt-20">
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div className="flex-1 bg-[#0A0A0F]">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen bg-[#0A0A0F]">
      <SignIn />
    </div>
  );
};

export default Layout;
