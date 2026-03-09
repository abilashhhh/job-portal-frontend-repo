"use client";
import CareerGuide from "@/components/CareerGuide";
import Hero from "@/components/Hero";
import ResumeAnalyzer from "@/components/ResumeAnalyzer";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
 import { useAppData } from "@/context/AppContext";
import React from "react";

const Home = () => {
  const { loading } = useAppData();
  if (loading) return <Loading/>
  return (
    <div>
      <Hero />
      <CareerGuide />
      <ResumeAnalyzer />
    </div>
  );
};

export default Home;
