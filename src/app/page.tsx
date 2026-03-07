import CareerGuide from "@/components/CareerGuide";
import Hero from "@/components/Hero";
import ResumeAnalyzer from "@/components/ResumeAnalyzer";
import { Button } from "@/components/ui/button";
import React from "react";

const Home = () => {
  return (
    <div>
      <Hero />
      <CareerGuide />
      <ResumeAnalyzer/>
    </div>
  );
};

export default Home;
