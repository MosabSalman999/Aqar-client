import React from "react";
import HeroSection from "./(nondashboard)/landing/HeroSection";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="h-full w-full">
      <Navbar />
      <main className={`h-full flex w-full flex-col`}>
        <HeroSection />
        
      </main>
    </div>
  );
}
