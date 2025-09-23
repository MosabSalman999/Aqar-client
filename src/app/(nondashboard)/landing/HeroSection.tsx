"use client";

import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

const HeroSection = () => {
  return (
    <div className="relative h-screen">
      <Image
        src="/landing-splash.jpg"
        alt="Rentiful Rental Platform Hero Section"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-black/60 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-1/2 transform -translate-y-1/2 text-center w-full"
        >
          <div className="max-w-4xl mx-auto px-16 sm:px-12">
            <h1 className="text-3xl md:text-4xl sm:text-2xl xl:text-7xl font-bold text-white mb-4">
              {" "}
              Start Your Journey for Finding the perfect place to call home
            </h1>
            <p className="text-white mb-8">
              Explore our wide range of rental properties tailored to fit your
              lifestyle and budget. From cozy apartments to spacious homes.
            </p>

            <div className="flex justify-center ">
              <Input 
                type="text"
                
                onChange={() => {}}
                placeholder="Search by city, neighborhood or address"
                className="w-full max-w-lg rounded-none rounded-l-xl border-none bg-white h-12 opacity-100" 
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
