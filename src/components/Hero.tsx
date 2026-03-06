import { ArrowRight, Briefcase, Search, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-secondary py-10 md:py-16">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-5 md:px-8 py-16 md:py-24 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 md:gap-16">
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-background/50 backdrop-blur-xl">
              <TrendingUp size={16} className="text-blue-600" />
              <span className="text-sm font-medium">
                #1 Job platform in INDIA
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Find your dream job at{" "}
              <span className="inline-block text-blue-600">
                Hire<span className="text-red-500">Heaven</span>
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl leading-relaxed opacity-80 max-w-2xl">
              Connect with top employers and discover oppurtunities
            </p>

            {/* stats  */}
            <div className="flex flex-wrap justify-center md:justify-start gap-8 py-4">
              <div className="text-center md:text-left">
                <p className="text-3xl font-bold text-blue-600">10K+</p>
                <p className="text-sm opacity-70">Active Jobs</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-3xl font-bold text-blue-600">52K+</p>
                <p className="text-sm opacity-70">Companies</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-3xl font-bold text-blue-600">235K+</p>
                <p className="text-sm opacity-70">Job Seekers</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href={"/jobs"}>
                <Button
                  size={"lg"}
                  className="text-base px-8 h-12 gap-2 group transition-all"
                >
                  <Search size={18} /> Browse Jobs{" "}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              </Link>

              <Link href={"/about"}>
                <Button
                  variant={"outline"}
                  size={"lg"}
                  className="text-base px-8 h-12 gap-2"
                >
                  <Briefcase size={18} /> Learn More
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="pt-6 w-full">
              <p className="text-sm opacity-70 mb-3 text-center md:text-left">
                Trusted by professionals from
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 opacity-80">
                <span className="font-semibold text-sm">Google</span>
                <span className="font-semibold text-sm">Amazon</span>
                <span className="font-semibold text-sm">Microsoft</span>
                <span className="font-semibold text-sm">Meta</span>
                <span className="font-semibold text-sm">Netflix</span>
              </div>
            </div>
          </div>

          {/* Hero image section */}
          <div className="flex justify-center md:justify-end relative group">
            <div className="relative w-[320px] md:w-105 lg:w-125 h-80 md:h-105 lg:h-125 transition-all duration-500 group-hover:scale-105">
              <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl transition-all duration-500 group-hover:blur-3xl group-hover:scale-110"></div>

              <Image
                src="/image-7.png"
                alt="Job search illustration"
                fill
                className="object-contain relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
