import { useEffect, useRef } from "react";
import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { ArrowRight, Sparkles, FileText, Zap } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AiToolsGSAP = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const featureCardsRef = useRef([]);
  const toolCardsRef = useRef([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header animation on scroll
      if (headerRef.current && headerRef.current.children) {
        gsap.from(headerRef.current.children, {
          y: 60,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
          },
        });
      }

      // Feature cards stagger animation
      featureCardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.from(card, {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
          delay: index * 0.2,
        });

        // Add hover animation
        const onMouseEnter = () => {
          gsap.to(card, {
            y: -10,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        const onMouseLeave = () => {
          gsap.to(card, {
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        card.addEventListener("mouseenter", onMouseEnter);
        card.addEventListener("mouseleave", onMouseLeave);
      });

      // Tool cards stagger animation
      toolCardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.from(card, {
          scale: 0.8,
          opacity: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
          },
          delay: index * 0.1,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      id="work"
      className="relative px-4 sm:px-20 xl:px-32 py-32 bg-[#0A0A0F] overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="relative z-10">
        <div ref={headerRef} className="text-center mb-20">
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

        {/* Feature Cards Grid - 2 Columns */}
        <div className="grid md:grid-cols-2 gap-8 mb-20 max-w-6xl mx-auto">
          {/* Upload & Connect Card */}
          <div
            ref={(el) => (featureCardsRef.current[0] = el)}
            className="group relative p-8 rounded-3xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 
          backdrop-blur-sm border border-purple-500/30 hover:border-purple-400/50 
          transition-all duration-500 hover:shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <FileText className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Upload & Connect
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Seamlessly integrate your data sources or upload files directly.
                Our AI understands multiple formats and connects everything in
                one place.
              </p>
            </div>
          </div>

          {/* Analyze & Visualize Card */}
          <div
            ref={(el) => (featureCardsRef.current[1] = el)}
            className="group relative p-8 rounded-3xl bg-gradient-to-br from-pink-600/20 to-purple-600/20 
          backdrop-blur-sm border border-pink-500/30 hover:border-pink-400/50 
          transition-all duration-500 hover:shadow-[0_0_50px_rgba(236,72,153,0.3)] overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Zap className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Analyze & Visualize
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Watch as AI transforms raw data into beautiful, actionable
                insights with real-time charts and intelligent recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
          {AiToolsData.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <div
                key={index}
                ref={(el) => (toolCardsRef.current[index] = el)}
                onClick={() =>
                  user ? navigate(tool.route) : navigate("/sign-in")
                }
                className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 
                hover:bg-white/10 hover:border-purple-500/30 
                transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]
                cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <IconComponent className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {tool.desc}
                  </p>
                  <div className="flex items-center gap-2 text-purple-400 text-sm font-medium group-hover:gap-4 transition-all duration-300">
                    Try Now
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <button
            onClick={() => (user ? navigate("/ai") : navigate("/sign-in"))}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 
            hover:from-purple-500 hover:to-pink-500 rounded-xl text-white font-semibold
            shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)]
            transition-all duration-500 transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiToolsGSAP;
