import React, { useRef } from "react";
import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { ArrowUpRight, ArrowRight, FileText, Send, Sparkles, BrainCircuit, BrainCog } from "lucide-react";
import { motion, useInView } from "framer-motion";

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });


  // Feature grid data
  const features = [
    {
      title: "Instant Generation",
      description: "Generate high-quality content in seconds. No waiting queues, just immediate results.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop", 
      isNew: true,
    },
    {
      title: "All-in-One Suite",
      description: "Access powerful tools for text, images, and editing in a single professional dashboard.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop", // Dashboard/UI
      isNew: true,
    },
    {
      title: "Professional Quality",
      description: "Enterprise-grade AI models ensure your content is polished and ready for production.",
      image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&auto=format&fit=crop", // Abstract High-End/Polished
    },
    {
      title: "Export & Publish",
      description: "Download your creations instantly or copy them directly to your workflow.",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop", // Digital Transfer/Tech
    },
    {
      title: "Secure History",
      description: "Keep a private archive of all your generations and iterate on your best ideas.",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop", // Encryption/Code/Security
    },
  ];

// ... (omitting unchanged code) ...

            {/* Stats */}
            <div className="border-t border-white/10 pt-6 mt-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="hover:scale-105 transition-transform cursor-pointer">
                  <span className="text-2xl tracking-tight font-medium text-white">Advanced</span>
                  <p className="text-xs text-white/60">AI Models</p>
                </div>
                <div className="hover:scale-105 transition-transform cursor-pointer">
                  <span className="text-2xl tracking-tight font-medium text-white">Instant</span>
                  <p className="text-xs text-white/60">Content Creation</p>
                </div>
              </div>
            </div>

  return (
    <div ref={sectionRef} className="relative bg-black overflow-hidden">
      {/* Section 1: Features Bento Grid */}
      <section id="work" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
        >
          <div>
            <p className="text-sm font-medium text-white/50">Why VectorAI</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white">
              Everything you need to create
            </h2>
            <p className="mt-3 text-base text-white/70 max-w-2xl">
              From instant content generation to transparent pricing, our AI platform helps you scale content creation with confidence.
            </p>
          </div>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid gap-5 md:grid-cols-3">
          {/* Big Feature Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:col-span-2 md:row-span-2"
          >
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=1200&auto=format&fit=crop" 
                alt="AI Content Creation" 
                className="aspect-video w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/15 px-2 py-0.5 text-[11px] font-medium text-purple-300">NEW</span>
                <span className="text-xs text-white/60">Unlimited pipeline</span>
              </div>
              <h3 className="mt-3 text-2xl sm:text-3xl font-medium tracking-tight text-white">Create at the speed of thought</h3>
              <p className="mt-2 text-sm sm:text-base text-white/70">
                Unlock instant access to a suite of professional AI tools. Generate articles, stunning images, and engaging social posts in seconds—empowering you to move faster than ever.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur hover:bg-white/10 transition">
                  <FileText className="w-4 h-4" />
                  See case studies
                </button>
                <button
                  onClick={() => user ? navigate("/ai") : navigate("/sign-in")}
                  className="inline-flex items-center gap-2 text-sm font-medium text-black bg-purple-500 hover:bg-purple-400 rounded-lg px-4 py-2 transition"
                >
                  <Send className="w-4 h-4" />
                  Start creating
                </button>
              </div>
            </div>
          </motion.div>

          {/* Small Feature Cards top row */}
          {features.slice(0, 2).map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-colors"
            >
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium tracking-tight text-white flex items-center gap-2">
                    {feature.title}
                  </h3>
                  {feature.isNew && (
                    <span className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/15 px-2 py-0.5 text-[11px] font-medium text-purple-300">NEW</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-white/70">{feature.description}</p>
                <div className="mt-4 rounded-lg overflow-hidden border border-white/10">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    src={feature.image} 
                    alt={feature.title} 
                    className="aspect-video w-full object-cover" 
                  />
                </div>
              </div>
            </motion.div>
          ))}

          {/* Bottom row small cards */}
          {features.slice(2).map((feature, index) => (
            <motion.div
              key={index + 2}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (index + 2) * 0.15 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-colors"
            >
              <div className="p-5 sm:p-6">
                <h3 className="text-lg font-medium tracking-tight text-white flex items-center gap-2">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-white/70">{feature.description}</p>
                <div className="mt-4 rounded-lg overflow-hidden border border-white/10">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    src={feature.image} 
                    alt={feature.title} 
                    className="aspect-video w-full object-cover" 
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 2: AI Intelligence Showcase */}
      <section id="tools" className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 md:mt-24 pb-20">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: Diagram/Visual */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative rounded-[36px] p-5 overflow-hidden"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&auto=format&fit=crop')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              maskImage: "linear-gradient(130deg, transparent, black 10%, black 70%, transparent)",
              WebkitMaskImage: "linear-gradient(130deg, transparent, black 10%, black 70%, transparent)",
            }}
          >
            <article className="group relative overflow-hidden transition-shadow hover:shadow-md bg-black/70 border border-white/10 rounded-3xl shadow-xl backdrop-blur-xl">
              <div className="p-6 sm:p-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <h3 className="text-2xl font-semibold tracking-tight text-white">Smart Content Manager</h3>
                  <span className="inline-flex items-center gap-2 text-xs text-white/80 bg-white/5 border border-white/10 rounded-full px-2.5 py-1 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    AI Powered
                  </span>
                </div>

                {/* UI Mockup */}
                <div className="relative h-56 sm:h-64 rounded-2xl bg-gradient-to-b from-white/5 to-white/10 ring-1 ring-inset ring-white/5 mb-8 backdrop-blur-sm overflow-hidden">
                  {/* Main window */}
                  <motion.div 
                    initial={{ x: 50, y: -20, opacity: 0 }}
                    animate={isInView ? { x: 0, y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
                    className="absolute right-4 sm:right-6 top-4 sm:top-6 w-[75%] h-[65%] rounded-2xl bg-black/90 backdrop-blur border border-white/10 shadow-lg"
                  >
                    <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                      </div>
                      <span className="text-xs text-white/60">6 projects active</span>
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-lg px-2 py-1.5">
                        <div className="w-3 h-3 bg-purple-400 rounded" />
                        <div className="h-1.5 w-20 bg-purple-400/40 rounded" />
                        <Sparkles className="w-3 h-3 text-purple-400" />
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5">
                        <div className="w-3 h-3 bg-white/20 rounded" />
                        <div className="h-1.5 w-16 bg-white/20 rounded" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Tools sidebar */}
                  <motion.div 
                    initial={{ x: -30, y: 30, opacity: 0 }}
                    animate={isInView ? { x: 0, y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
                    className="absolute left-4 sm:left-8 bottom-8 sm:bottom-10 w-[58%] h-[48%] rounded-2xl bg-black/90 backdrop-blur border border-white/10 shadow-lg"
                  >
                    <div className="px-3 py-2 border-b border-white/10">
                      <span className="text-xs text-white/60 tracking-widest">AI TOOLS</span>
                    </div>
                    <div className="p-2 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs bg-blue-500/10 border border-blue-500/20 rounded px-2 py-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        <span className="text-white/80">Writer</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs bg-purple-500/10 border border-purple-500/20 rounded px-2 py-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full" />
                        <span className="text-white/80">Images</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Features grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="text-lg font-semibold text-white tracking-tight">Auto-Generate</h4>
                    <p className="mt-2 text-sm text-white/60">AI creates content based on your prompts and preferences.</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold tracking-tight text-white">Multi-Format</h4>
                    <p className="mt-2 text-sm text-white/60">Export to articles, images, and more with one click.</p>
                  </div>
                </div>

                <a href="#" className="inline-flex items-center gap-2 text-xs font-medium text-white/90 hover:text-white">
                  Explore features
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </article>
          </motion.div>

          {/* Right: Content & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-4xl sm:text-5xl font-medium text-white tracking-tight">
              Revolutionary AI intelligence, built for creators
            </h3>

            {/* Features */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <h4 className="text-lg font-semibold text-white mb-4">Core Intelligence Features</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center mt-0.5">
                    <BrainCircuit className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h5 className="font-medium text-white">Intelligent Generation</h5>
                    <p className="text-sm text-white/60 mt-1">Machine learning creates content tailored to your brand voice and audience.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center mt-0.5">
                    <BrainCog className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h5 className="font-medium text-white">Smart Optimization</h5>
                    <p className="text-sm text-white/60 mt-1">Automatic improvements based on performance data and best practices.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="border-t border-white/10 pt-6 mt-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="hover:scale-105 transition-transform cursor-pointer">
                  <span className="text-2xl tracking-tight font-medium text-white">Advanced</span>
                  <p className="text-xs text-white/60">AI Models</p>
                </div>
                <div className="hover:scale-105 transition-transform cursor-pointer">
                  <span className="text-2xl tracking-tight font-medium text-white">Instant</span>
                  <p className="text-xs text-white/60">Content Creation</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="border-t border-white/10 pt-6 mt-8">
              <button
                onClick={() => user ? navigate("/ai") : navigate("/sign-in")}
                className="inline-flex items-center justify-center gap-2 h-10 hover:bg-purple-500 transition text-sm font-medium text-white bg-purple-600 rounded-full px-5"
              >
                Explore AI Tools
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 3: AI Tools Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-10"
        >
          <h3 className="text-2xl font-semibold text-white">Our AI Tools</h3>
          <p className="text-gray-500 text-sm mt-2">Click any tool to start creating</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {AiToolsData.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
              onClick={() => user && navigate(tool.path)}
              className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] cursor-pointer
                hover:bg-white/[0.08] hover:border-purple-500/20 transition-all duration-300"
            >
              {/* Arrow indicator */}
              <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-4 h-4 text-purple-400" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">{tool.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{tool.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => user ? navigate("/ai") : navigate("/sign-in")}
            className="group inline-flex items-center gap-3 px-8 py-3 bg-white text-black rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105"
          >
            Try AI-Powered Tools Today
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default AiTools;
