import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll detection for blur effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't render until Clerk is loaded
  if (!isLoaded) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-8 pt-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-6 h-16 bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-2xl">
            <div className="w-28 h-6 bg-white/10 rounded animate-pulse"></div>
            <div className="w-20 h-8 bg-white/10 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#work", label: "Features" },
    { href: "#work", label: "AI Tools" },
    { href: "#testimonials", label: "Reviews" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-8 pt-4"
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`flex items-center justify-between px-6 sm:px-8 h-16 
          backdrop-blur-xl border rounded-2xl transition-all duration-500
          ${
            scrolled
              ? "bg-[#050508]/80 border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              : "bg-white/[0.02] border-white/[0.06]"
          }`}
        >
          {/* Logo */}
          <img
            src={assets.logo}
            alt="logo"
            className="w-24 sm:w-28 cursor-pointer brightness-200 hover:opacity-80 transition-opacity duration-300"
            onClick={() => navigate("/")}
          />

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 px-2">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white 
                rounded-lg transition-all duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side - Login/Register or User Button */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/ai")}
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-black bg-white rounded-lg 
                  transition-all duration-300 hover:bg-gray-100"
                >
                  Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <button
                  onClick={() => openSignIn()}
                  className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => openSignIn()}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-black bg-white rounded-lg 
                  transition-all duration-300 hover:bg-gray-100"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-2 p-4 bg-[#050508]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl"
          >
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-gray-400 hover:text-white 
                hover:bg-white/[0.05] rounded-lg transition-all duration-300"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Navbar;
