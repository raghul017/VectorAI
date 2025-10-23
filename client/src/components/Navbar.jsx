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
      <div
        className="fixed z-5 w-full backdrop-blur-2xl flex justify-between 
            items-center py-3 px-4 sm:px-20 xl:px-32 "
      >
        <img
          src={assets.logo}
          alt="logo"
          className="w-32 sm:w-44 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="fixed z-50 w-full backdrop-blur-xl bg-[#0A0A0F]/80 border-b border-white/5 flex justify-between items-center py-4 px-4 sm:px-20 xl:px-32">
      <img
        src={assets.logo}
        alt="logo"
        className="w-32 sm:w-44 cursor-pointer brightness-200 contrast-125 saturate-150"
        onClick={() => navigate("/")}
      />

      {user ? (
        <UserButton />
      ) : (
        <button
          onClick={() => openSignIn()}
          className="flex items-center gap-2 rounded-full text-sm font-semibold
          cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500
          text-white py-3 px-8 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]
          transition-all transform hover:scale-105"
        >
          Get Started
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
