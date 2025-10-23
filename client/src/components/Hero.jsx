import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { Sparkles, ArrowRight, Star } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex flex-col justify-center items-center w-full px-4 sm:px-20 xl:px-32 min-h-screen bg-[#0A0A0F] overflow-hidden">
      {/* Animated Gradient Orb Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-600/20 to-blue-600/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-20 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10 text-center mb-12 max-w-5xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-8 hover:bg-white/10 transition-all animate-fadeIn">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span className="text-sm font-medium text-gray-300">
            AI-Powered Content Creation
          </span>
          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full font-semibold">
            NEW
          </span>
        </div>

        {/* Main Heading with Gradient */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-6 tracking-tight animate-fadeIn animation-delay-100">
          <span className="text-white">Turn Raw Data into</span>
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
            Actionable Insights
          </span>
          <span className="text-white"> – Instantly</span>
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-gray-400 text-base sm:text-lg leading-relaxed animate-fadeIn animation-delay-200">
          Transform your content creation with our suite of powerful AI tools.
          Write articles, generate stunning images, and enhance your workflow in
          seconds.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="relative z-10 flex flex-wrap justify-center gap-4 text-sm sm:text-base mb-16 animate-fadeIn animation-delay-300">
        <button
          onClick={() => navigate("/ai")}
          className="group flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 
          hover:from-purple-500 hover:to-pink-500 text-white px-8 py-4 rounded-xl 
          shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)]
          transition-all transform hover:scale-105 active:scale-95 font-semibold animate-pulseGlow"
        >
          <Sparkles className="w-5 h-5" />
          Start Creating Now
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 animate-fadeIn animation-delay-400">
        {/* Stat 1 */}
        <div className="flex flex-col items-center hover:scale-105 transition-transform duration-300">
          <div className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all">
            <img src={assets.user_group} alt="" className="h-8" />
            <div className="text-left">
              <p className="text-xs text-gray-400 font-medium">Trusted by</p>
              <p className="text-sm font-bold text-white">10,000+ Creators</p>
            </div>
          </div>
        </div>

        {/* Stat 2 - Rating */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>
            <div className="text-left">
              <p className="text-lg font-bold text-white">4.9/5</p>
              <p className="text-xs text-gray-400">Verified Reviews</p>
            </div>
          </div>
        </div>

        {/* Stat 3 - Productivity */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="text-right">
              <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                7x
              </p>
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-400">Faster, Smarter</p>
              <p className="text-sm font-semibold text-white">Productivity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
