import React from "react";
import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { ArrowRight, Sparkles, FileText, Zap } from "lucide-react";

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  return (
    <div id="work" className="relative px-4 sm:px-20 xl:px-32 py-32 bg-[#0A0A0F] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 backdrop-blur-sm rounded-full border border-purple-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">
              HOW IT WORKS
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            Unlock the Power of Your{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Data
            </span>
            <br />
            with AI Tools
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Organize tasks, track progress, and achieve more—effortlessly.
          </p>
        </div>

        {/* Features Grid - 2 Main Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto mb-12">
          {/* Upload & Connect Card */}
          <div
            className="group relative p-8 rounded-3xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 
          backdrop-blur-sm border border-purple-500/30 hover:border-purple-400/50 
          transition-all duration-500 hover:shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Upload & Connect Seamlessly
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Easily integrate data from over 100+ sources and APIs
                effortlessly for seamless integration and efficient workflows.
              </p>
            </div>
          </div>

          {/* AI-Driven Processing Card */}
          <div
            className="group relative p-8 rounded-3xl bg-gradient-to-br from-indigo-600/20 to-cyan-600/20 
          backdrop-blur-sm border border-indigo-500/30 hover:border-indigo-400/50 
          transition-all duration-500 hover:shadow-[0_0_50px_rgba(99,102,241,0.3)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                AI-Driven Processing in Real-Time
              </h3>
              <p className="text-gray-400 leading-relaxed">
                No coding required. Instantly cleans, analyzes, and structures
                your data for seamless organization.
              </p>
            </div>
          </div>
        </div>

        {/* AI Tools Grid - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {AiToolsData.map((tool, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 
              hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 cursor-pointer
              hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:-translate-y-1"
              onClick={() => user && navigate(tool.path)}
            >
              <div className="flex items-start justify-between mb-4">
                <tool.Icon
                  className="w-12 h-12 p-2.5 text-white rounded-xl shadow-lg
                  group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})`,
                  }}
                />
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                {tool.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {tool.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <button
            onClick={() => (user ? navigate("/ai") : navigate("/sign-in"))}
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 
            hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold text-lg
            shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)]
            transition-all transform hover:scale-105"
          >
            Try AI-Powered Analysis Today
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiTools;
