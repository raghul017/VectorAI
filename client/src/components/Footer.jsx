import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer id="contact" className="overflow-hidden text-white bg-[#050505] border-t border-neutral-800 pt-24">
      {/* Giant Brand Text */}
      <div 
        className="text-center w-full mb-20 px-4"
        style={{
          maskImage: "linear-gradient(180deg, transparent, black 0%, black 55%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 55%, transparent)",
        }}
      >
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          whileInView={{ opacity: 1, scale: 1.1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-[22vw] leading-[0.7] select-none font-bold text-[#141414] tracking-tighter"
        >
          VECTOR
        </motion.h1>
      </div>

      {/* Links Grid */}
      <div className="border-t border-neutral-900 grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Navigation Links */}
        <div className="p-8 md:p-16 grid grid-cols-2 gap-12 lg:border-r border-neutral-900">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <a href="#home" className="text-xs font-medium text-neutral-500 uppercase tracking-widest hover:text-white transition-colors">
              Home
            </a>
            <a href="#work" className="text-xs font-medium text-neutral-500 uppercase tracking-widest hover:text-white transition-colors">
              Features
            </a>
            <a href="#tools" className="text-xs font-medium text-neutral-500 uppercase tracking-widest hover:text-white transition-colors">
              AI Suite
            </a>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <a href="#pricing" className="text-xs font-medium text-neutral-500 uppercase tracking-widest hover:text-white transition-colors">
              Pricing
            </a>
            <a href="mailto:contact@vectorai.com" className="text-xs font-medium text-neutral-500 uppercase tracking-widest hover:text-white transition-colors">
              Contact Us
            </a>
            <a href="#" className="text-xs font-medium text-neutral-500 uppercase tracking-widest hover:text-white transition-colors">
              Twitter/X
            </a>
            <a href="#" className="text-xs font-medium text-neutral-500 uppercase tracking-widest hover:text-white transition-colors">
              LinkedIn
            </a>
          </motion.div>
        </div>

        {/* Right Side: AI Illustration */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="lg:h-auto lg:border-t-0 flex overflow-hidden w-full h-48 border-neutral-900 border-t relative items-center justify-center"
        >
          <svg viewBox="0 0 400 120" className="opacity-20 max-h-[160px] w-[600px] h-[160px]" preserveAspectRatio="xMidYMid meet">
            {/* AI Brain/Circuit Pattern */}
            <g stroke="white" strokeWidth="1" fill="none">
              {/* Central Circle */}
              <circle cx="200" cy="60" r="35" />
              <circle cx="200" cy="60" r="25" />
              <circle cx="200" cy="60" r="8" fill="white" opacity="0.3" />
              
              {/* Neural connections - left */}
              <motion.path 
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.8 }}
                viewport={{ once: true }}
                d="M165 60 L100 30 M165 60 L100 60 M165 60 L100 90" 
              />
              <circle cx="100" cy="30" r="6" />
              <circle cx="100" cy="60" r="6" />
              <circle cx="100" cy="90" r="6" />
              
              {/* Neural connections - right */}
              <motion.path 
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.8 }}
                viewport={{ once: true }}
                d="M235 60 L300 30 M235 60 L300 60 M235 60 L300 90" 
              />
              <circle cx="300" cy="30" r="6" />
              <circle cx="300" cy="60" r="6" />
              <circle cx="300" cy="90" r="6" />
              
              {/* Top nodes */}
              <path d="M200 25 L170 0 M200 25 L230 0" />
              <circle cx="170" cy="0" r="4" />
              <circle cx="230" cy="0" r="4" />
              
              {/* Bottom nodes */}
              <path d="M200 95 L170 120 M200 95 L230 120" />
              <circle cx="170" cy="120" r="4" />
              <circle cx="230" cy="120" r="4" />
              
              {/* Data flow dots */}
              <circle cx="130" cy="45" r="2" fill="white" opacity="0.5" />
              <circle cx="150" cy="55" r="2" fill="white" opacity="0.5" />
              <circle cx="250" cy="55" r="2" fill="white" opacity="0.5" />
              <circle cx="270" cy="45" r="2" fill="white" opacity="0.5" />
            </g>
          </svg>
        </motion.div>
      </div>

      {/* Copyright Row */}
      <div className="border-t border-neutral-800 px-8 md:px-16 py-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-neutral-600 font-medium tracking-wide">
        <div>© 2024 VectorAI. All rights reserved</div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
          <a href="#" className="hover:text-white transition-colors">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
