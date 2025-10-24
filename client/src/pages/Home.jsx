import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AiTools from "../components/AiTools";
import Testimonial from "../components/Testimonial";
import Plan from "../components/Plan";
import Footer from "../components/Footer";

const Home = () => {
  console.log("Home component rendering...");

  return (
    <div className="bg-[#0A0A0F]">
      <Navbar />
      <Hero />
      <AiTools />
      <Testimonial />
      <Plan />
      <Footer />
    </div>
  );
};

export default Home;
