import React from "react";
import Hero from "../components/Hero";
import AiTools from "../components/AiTools";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="bg-[#030306]">
      {/* Hero now includes its own navbar */}
      <Hero />
      <AiTools />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Home;
