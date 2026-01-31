import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, FileText, Pen, Image, Eraser, Users, Sparkles, PlayCircle, ArrowRight, Menu, X } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Professional icons for the tool row (matching reference metallic style)
  const toolIcons = [
    { Icon: FileText, label: "Articles" },
    { Icon: Pen, label: "Writing" },
    { Icon: Image, label: "Images" },
    { Icon: Eraser, label: "Remove BG" },
    { Icon: Users, label: "Community" },
    { Icon: Sparkles, label: "AI" },
  ];

  return (
    <div
      id="home"
      className="relative flex flex-col items-center w-full min-h-[130vh] bg-black overflow-hidden"
    >
      {/* Spline 3D Planet Background */}
      <div className="absolute inset-0 z-0" style={{ transform: 'scale(1.58)', transformOrigin: 'center center' }}>
        <iframe 
          src="https://my.spline.design/glowingplanetparticles-nhVHji30IRoa5HBGe8yeDiTs" 
          frameBorder="0" 
          width="100%" 
          height="100%" 
          id="aura-spline"
          style={{ pointerEvents: 'none' }}
        />
      </div>
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 z-[1] bg-black/20 pointer-events-none" />

      {/* Bottom fade gradient - seamless transition */}
      {/* Bottom fade gradient - seamless transition */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-[2] h-40 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.9) 70%, rgba(0,0,0,1) 100%)",
        }}
      />

      {/* Navbar */}
      <nav className="relative z-50 w-full px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo - Triangle icon + VECTORAI */}
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8" viewBox="0 0 48 48" aria-hidden="true" strokeWidth="2">
              <path d="M24 8 L40 36 H8 Z" fill="url(#logoGradient)" />
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-semibold text-xl tracking-tight text-white">VectorAI</span>
          </div>
          
          {/* Nav Links - Professional */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-white text-sm font-medium">Home</a>
            <a href="#work" className="text-gray-500 text-sm hover:text-white transition-colors">Features</a>
            <a href="#tools" className="text-gray-500 text-sm hover:text-white transition-colors">AI Suite</a>
            <a href="#pricing" className="text-gray-500 text-sm hover:text-white transition-colors">Pricing</a>
            <a href="#contact" className="text-gray-500 text-sm hover:text-white transition-colors">Contact</a>
          </div>

          {/* Right side - Login/Register or User Button */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/ai")}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-white rounded-full 
                  transition-all duration-300 hover:bg-gray-200 hover:scale-105"
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
                  className="hidden sm:block text-gray-400 text-sm font-medium hover:text-white transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => openSignIn()}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-white rounded-full 
                  transition-all duration-300 hover:bg-gray-200 hover:scale-105"
                >
                  Get Started
                </button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 overflow-hidden"
            >
              <div className="flex flex-col p-6 space-y-6">
                <a href="#home" onClick={() => setMobileMenuOpen(false)} className="text-white text-lg font-medium">Home</a>
                <a href="#work" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 text-lg font-medium hover:text-white">Features</a>
                <a href="#tools" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 text-lg font-medium hover:text-white">AI Suite</a>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 text-lg font-medium hover:text-white">Pricing</a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 text-lg font-medium hover:text-white">Contact</a>
                
                <div className="h-px bg-white/10 w-full my-4" />
                
                {user ? (
                  <button
                    onClick={() => { navigate("/ai"); setMobileMenuOpen(false); }}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-base font-semibold text-black bg-white rounded-xl"
                  >
                    Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => { openSignIn(); setMobileMenuOpen(false); }}
                      className="w-full px-4 py-3 text-base font-semibold text-white border border-white/20 rounded-xl hover:bg-white/5"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => { openSignIn(); setMobileMenuOpen(false); }}
                      className="w-full px-4 py-3 text-base font-semibold text-black bg-white rounded-xl hover:bg-gray-200"
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-12 pb-32 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] rounded-full border border-white/[0.1] mb-8"
        >
          <span className="text-emerald-400 text-xs">✓</span>
          <span className="text-xs text-gray-300 tracking-wide uppercase">Powered by Advanced AI</span>
        </motion.div>

        {/* Main Headline - Innovative & Professional */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] mb-10 tracking-[-0.02em]"
        >
          <span className="text-white">Transform Ideas Into</span>
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
            Content Creation
          </span>
          <span className="text-white">.</span>
        </motion.h1>

        {/* Professional Metallic Icons Row */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.3 }
            }
          }}
          initial="hidden"
          animate="show"
          className="flex items-center justify-center gap-3 mb-10"
        >
          {toolIcons.map((tool, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.8 },
                show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300 } }
              }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
              style={{
                background: "linear-gradient(145deg, rgba(60, 50, 100, 0.8) 0%, rgba(40, 35, 70, 0.9) 100%)",
                border: "1px solid rgba(120, 100, 180, 0.3)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              <tool.Icon className="w-6 h-6 text-gray-300" />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex items-center gap-4"
        >
          {/* Primary CTA - Shiny Animated Button */}
          <button
            onClick={() => navigate("/ai")}
            className="shiny-cta"
          >
            <span>
              Start Creating
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </button>

          {/* Fancy Watch Demo Button - Gradient Border */}
          <div className="inline-block group relative">
            <button 
              onClick={() => document.getElementById("work").scrollIntoView({ behavior: "smooth" })}
              className="group inline-flex min-w-[140px] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-105 text-sm font-medium text-white/80 hover:text-white tracking-tight bg-white/5 backdrop-blur-xl rounded-full py-3 px-5 relative items-center justify-center gap-2"
              style={{
                border: "1px solid rgba(139, 92, 246, 0.3)",
              }}
            >
              <PlayCircle className="h-4 w-4" style={{ strokeWidth: 1.5 }} />
              <span className="relative">Watch demo</span>
              {/* Bottom gradient line */}
              <span 
                aria-hidden="true" 
                className="transition-all duration-300 group-hover:opacity-80 opacity-20 w-[70%] h-[1px] rounded-full absolute bottom-0 left-1/2 -translate-x-1/2"
                style={{ background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)" }}
              />
            </button>
            {/* Hover glow effect */}
            <span 
              className="pointer-events-none absolute -bottom-3 left-1/2 z-0 h-6 w-44 -translate-x-1/2 rounded-full opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" 
              style={{ 
                background: "radial-gradient(60% 100% at 50% 50%, rgba(139,92,246,.55), rgba(139,92,246,.28) 35%, transparent 70%)", 
                filter: "blur(10px) saturate(120%)" 
              }} 
              aria-hidden="true"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
