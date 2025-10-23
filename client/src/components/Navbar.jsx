import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();

  // Don't render until Clerk is loaded
  if (!isLoaded) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-8 pt-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-6 sm:px-8 h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="w-32 h-8 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="w-96 h-10 bg-gray-700/50 rounded-full animate-pulse hidden md:block"></div>
            <div className="w-24 h-8 bg-gray-700/50 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-8 pt-4 animate-slideDown">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-6 sm:px-8 h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {/* Logo */}
          <img
            src={assets.logo}
            alt="logo"
            className="w-28 sm:w-36 cursor-pointer brightness-200 contrast-125 saturate-150 hover:scale-105 transition-transform duration-300"
            onClick={() => navigate("/")}
          />

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full animate-fadeIn animation-delay-200">
            <a
              href="#home"
              className="px-5 py-2 text-sm font-medium text-white hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Home
            </a>
            <a
              href="#work"
              className="px-5 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Features
            </a>
            <a
              href="#work"
              className="px-5 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              AI Tools
            </a>
            <a
              href="#testimonials"
              className="px-5 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Reviews
            </a>
            <a
              onClick={() => user ? navigate("/ai") : openSignIn()}
              className="px-5 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              Dashboard
            </a>
          </nav>

          {/* Right side - Login/Register or User Button */}
          <div className="flex items-center gap-3 animate-fadeIn animation-delay-300">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/ai")}
                  className="hidden sm:flex items-center gap-2 px-5 py-2 text-sm font-medium text-white hover:text-purple-300 transition-colors"
                >
                  Dashboard
                </button>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <button
                  onClick={() => openSignIn()}
                  className="hidden sm:block px-5 py-2 text-sm font-medium text-white hover:text-purple-300 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => openSignIn()}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all transform hover:scale-105"
                >
                  Register
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
