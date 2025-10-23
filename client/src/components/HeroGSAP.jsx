import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Zap, Users, TrendingUp } from "lucide-react";
import gsap from "gsap";

export default function HeroGSAP() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const badgeRef = useRef(null);
  const headingRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const blobsRef = useRef([]);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Animated blobs with smooth floating
      blobsRef.current.forEach((blob, index) => {
        if (!blob) return;
        gsap.to(blob, {
          x: `${gsap.utils.random(-100, 100)}`,
          y: `${gsap.utils.random(-100, 100)}`,
          duration: gsap.utils.random(15, 25),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.5,
        });
      });

      // Main timeline for entrance animations
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Badge animation with bounce
      if (badgeRef.current) {
        tl.from(badgeRef.current, {
          scale: 0,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        });
      }

      // Heading animation - each line separately
      if (headingRef.current) {
        const headingLines = headingRef.current.querySelectorAll("span");
        if (headingLines.length > 0) {
          tl.from(
            headingLines,
            {
              y: 100,
              opacity: 0,
              rotationX: -90,
              transformOrigin: "top center",
              duration: 1,
              stagger: 0.2,
            },
            "-=0.4"
          );
        }
      }

      // Description fade up
      if (descriptionRef.current) {
        tl.from(
          descriptionRef.current,
          {
            y: 50,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.6"
        );
      }

      // CTA button with scale
      if (ctaRef.current) {
        tl.from(
          ctaRef.current,
          {
            scale: 0.8,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        );

        // Continuous floating animation for CTA
        gsap.to(ctaRef.current, {
          y: -10,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Stats animation
      if (statsRef.current) {
        const statCards = statsRef.current.querySelectorAll(".stat-card");
        if (statCards.length > 0) {
          tl.from(
            statCards,
            {
              y: 30,
              opacity: 0,
              duration: 0.6,
              stagger: 0.15,
            },
            "-=0.4"
          );
        }
      }

      // Sparkle icon rotation
      if (badgeRef.current) {
        const sparkleIcon = badgeRef.current.querySelector("svg");
        if (sparkleIcon) {
          gsap.to(sparkleIcon, {
            rotation: 360,
            duration: 3,
            repeat: -1,
            ease: "linear",
          });
        }
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 pt-20 overflow-hidden bg-[#0A0A0F]"
    >
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          ref={(el) => (blobsRef.current[0] = el)}
          className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
        ></div>
        <div
          ref={(el) => (blobsRef.current[1] = el)}
          className="absolute top-1/3 -right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"
        ></div>
        <div
          ref={(el) => (blobsRef.current[2] = el)}
          className="absolute -bottom-1/4 left-1/3 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl"
        ></div>
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      {/* Content */}
      <div className="relative z-10 text-center mb-12 max-w-5xl">
        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-8 hover:bg-white/10 transition-all cursor-pointer group"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-gray-300">
            AI-Powered Content Creation
          </span>
          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full font-semibold">
            NEW
          </span>
        </div>

        {/* Main Heading with Gradient */}
        <h1
          ref={headingRef}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-6 tracking-tight"
        >
          <span className="block text-white">Turn Raw Data into</span>
          <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Actionable Insights
          </span>
          <span className="block text-white">– Instantly</span>
        </h1>

        <p
          ref={descriptionRef}
          className="mt-6 max-w-2xl mx-auto text-gray-400 text-base sm:text-lg leading-relaxed"
        >
          Transform your content creation with our suite of powerful AI tools.
          Write articles, generate stunning images, and enhance your workflow in
          seconds.
        </p>
      </div>

      {/* CTA Button */}
      <div ref={ctaRef} className="relative z-10 mb-16">
        <button
          onClick={() => navigate("/ai")}
          className="group flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 
          hover:from-purple-500 hover:to-pink-500 text-white px-8 py-4 rounded-xl 
          shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.7)]
          transition-all duration-500 transform hover:scale-110 font-semibold"
        >
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500" />
          Start Creating Now
          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
        </button>
      </div>

      {/* Stats Section */}
      <div
        ref={statsRef}
        className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12"
      >
        {/* Stat 1 */}
        <div className="stat-card flex flex-col items-center group cursor-pointer">
          <div className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transform group-hover:scale-110">
            <Zap className="w-5 h-5 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">10x</div>
              <div className="text-xs text-gray-400">Faster Creation</div>
            </div>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="stat-card flex flex-col items-center group cursor-pointer">
          <div className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 hover:border-pink-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transform group-hover:scale-110">
            <Users className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform duration-300" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-xs text-gray-400">Active Users</div>
            </div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="stat-card flex flex-col items-center group cursor-pointer">
          <div className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transform group-hover:scale-110">
            <TrendingUp className="w-5 h-5 text-cyan-400 group-hover:translate-y-[-4px] transition-transform duration-300" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">98%</div>
              <div className="text-xs text-gray-400">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
