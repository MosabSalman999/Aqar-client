"use client";

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
      <div className="absolute inset-0 bg-black opacity-60">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-1/3 transform -translate-y-1/2 text-center w-full"
        >
          <div className="max-w-4xl mx-auto px-16 sm:px-12">
            <h1 className="text-3xl md:text-4xl sm:text-2xl xl:text-7xl font-bold text-white mb-4">
              {" "}
              Start Your Journey for Finding the perfect place to call home
            </h1>
            <p className="text-xl text-white mb-8">
              Explore our wide range of rental properties tailored to fit your
              lifestyle and budget. From cozy apartments to spacious homes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300">
              Browse Properties
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-3 px-8 rounded-lg transition-colors duration-300">
              Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
