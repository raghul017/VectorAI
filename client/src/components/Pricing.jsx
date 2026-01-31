import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();
  const [billing, setBilling] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState("starter");

  const plans = {
    starter: {
      name: "Starter",
      tagline: "Great for individuals getting started.",
      priceMonthly: 19,
      priceAnnual: 190,
      features: [
        "Up to 5 projects",
        "Basic AI generations",
        "30-day history",
        "Email support",
      ],
    },
    pro: {
      name: "Pro",
      tagline: "Built for growing teams and creators.",
      priceMonthly: 49,
      priceAnnual: 490,
      features: [
        "Up to 50 projects",
        "Advanced AI models",
        "Priority processing",
        "Analytics dashboard",
        "Team collaboration",
        "Priority support",
      ],
    },
    enterprise: {
      name: "Enterprise",
      tagline: "Custom solutions for scale & security.",
      priceMonthly: null,
      priceAnnual: null,
      features: [
        "Unlimited projects",
        "Dedicated account manager",
        "SSO & advanced security",
        "Custom integrations",
        "Private deployment",
        "24/7 premium support",
        "Custom SLAs",
      ],
    },
  };

  const currentPlan = plans[selectedPlan];
  const price = billing === "monthly" ? currentPlan.priceMonthly : currentPlan.priceAnnual;

  return (
    <section id="pricing" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Main Card Container */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            show: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.6,
                staggerChildren: 0.15
              }
            }
          }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0f]"
        >
          {/* Decorative blurs */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />

          <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
            {/* LEFT: Copy + Plan list */}
            <div className="p-6 sm:p-10 flex flex-col">
              {/* Header */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight">
                  Simple pricing
                  <span className="block text-gray-400">that grows with you</span>
                </h2>
                <p className="mt-4 text-base text-gray-400 max-w-md">
                  Pick a plan today and switch anytime. Clear value across Starter, Pro, and Enterprise.
                </p>
              </motion.div>

              {/* Billing Toggle */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="mt-6">
                <div className="inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.05] p-1">
                  <button
                    onClick={() => setBilling("monthly")}
                    className={`px-4 py-2 text-xs rounded-xl uppercase tracking-wide transition ${
                      billing === "monthly"
                        ? "text-white bg-white/[0.08] ring-1 ring-white/20"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBilling("annual")}
                    className={`px-4 py-2 text-xs rounded-xl uppercase tracking-wide transition ${
                      billing === "annual"
                        ? "text-white bg-white/[0.08] ring-1 ring-white/20"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Annually
                  </button>
                </div>
              </motion.div>

              {/* Plan list */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="mt-10 space-y-3">
                {Object.entries(plans).map(([key, plan]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPlan(key)}
                    className={`group flex text-left w-full rounded-2xl p-5 items-center justify-between transition
                      ${selectedPlan === key 
                        ? "bg-white/[0.08] ring-1 ring-white/20" 
                        : "bg-gradient-to-br from-white/10 to-transparent hover:bg-white/[0.07]"
                      }`}
                  >
                    <div>
                      <p className="text-white text-lg tracking-tight font-semibold">{plan.name}</p>
                      <p className="text-xs tracking-wide text-gray-400 mt-1 uppercase">{plan.tagline}</p>
                    </div>
                    <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/5 ring-1 ring-white/10 text-gray-300 group-hover:bg-white/10 transition">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>
                ))}
              </motion.div>
            </div>

            {/* RIGHT: Plan detail */}
            <div className="flex flex-col p-6 sm:p-8 bg-gradient-to-br from-white/5 via-white/10 to-transparent m-6 sm:m-8 rounded-2xl border border-white/10">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-2xl text-white font-semibold tracking-tight">{currentPlan.name}</h3>
                {billing === "annual" && price && (
                  <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs text-gray-300">
                    Save 20%
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mt-6 flex items-end gap-2">
                <span className="text-6xl text-white tracking-tight font-light">
                  {price ? `$${price}` : "Custom"}
                </span>
                {price && (
                  <span className="text-gray-400 mb-2 text-sm">
                    /{billing === "monthly" ? "month" : "year"}
                  </span>
                )}
              </div>

              {/* Tagline */}
              <p className="mt-4 text-xs tracking-wide text-gray-300 uppercase">
                {currentPlan.tagline}
              </p>

              {/* Features */}
              <div className="mt-8 bg-gradient-to-br from-white/10 to-transparent rounded-2xl p-6 border border-white/10">
                <ul className="space-y-3">
                  {currentPlan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-200">
                      <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span className="uppercase tracking-wide text-xs">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-4 border-t border-white/10 text-xs text-gray-400">
                  Have special requirements?{" "}
                  <a href="#contact" className="underline hover:text-white transition">
                    Talk to sales
                  </a>
                </div>

                {/* CTA */}
                <button
                  onClick={() => navigate("/sign-up")}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black h-12 px-5 text-sm font-semibold transition hover:bg-gray-100"
                >
                  {selectedPlan === "enterprise" ? "Contact Sales" : "Get Started"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
