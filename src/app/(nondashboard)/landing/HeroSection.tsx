"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useGetAuthUserQuery } from "@/state/api";
import { toast } from "sonner";

const HeroSection = () => {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const router = useRouter();
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = () => {
    if (!authUser) {
      toast.error(
        isArabic 
          ? "يجب تسجيل الدخول للبحث عن العقارات" 
          : "Please sign in to search for properties",
        {
          action: {
            label: isArabic ? "تسجيل الدخول" : "Sign In",
            onClick: () => router.push("/signin"),
          },
        }
      );
      return;
    }
    
    // Navigate to search page with query
    const searchParams = new URLSearchParams();
    if (searchQuery.trim()) {
      searchParams.set("location", searchQuery.trim());
    }
    router.push(`/search?${searchParams.toString()}`);
  };

  const handleCityClick = (city: string) => {
    if (!authUser) {
      toast.error(
        isArabic 
          ? "يجب تسجيل الدخول للبحث عن العقارات" 
          : "Please sign in to search for properties",
        {
          action: {
            label: isArabic ? "تسجيل الدخول" : "Sign In",
            onClick: () => router.push("/signin"),
          },
        }
      );
      return;
    }
    
    router.push(`/search?location=${encodeURIComponent(city)}`);
  };
  
  return (
    <div className="relative h-screen">
      <Image
        src="/landing-splash.jpg"
        alt="Aqar - Jordan Real Estate Platform"
        fill
        className="object-cover object-center"
        priority
      />
      {/* Jordanian-inspired gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-primary-900/60 to-secondary-900/50">
        {/* Arabic geometric pattern overlay */}
        <div className="absolute inset-0 arabic-pattern opacity-20"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-1/2 transform -translate-y-1/2 text-center w-full"
        >
          <div className="max-w-4xl mx-auto px-16 sm:px-12">
            {/* Bilingual Heading */}
            <h1 className={`text-3xl md:text-5xl sm:text-2xl xl:text-7xl font-bold text-white mb-2 ${isArabic ? 'arabic-font' : 'english-font'}`}>
              {isArabic ? (
                <>
                  <span className="block text-secondary-400 mb-2">ابحث عن بيتك في الأردن</span>
                  <span className="block text-4xl md:text-5xl xl:text-6xl">من عمّان إلى العقبة، من البتراء إلى جرش</span>
                </>
              ) : (
                <>
                  <span className="block text-secondary-400 mb-2">Find Your Home in Jordan</span>
                  <span className="block text-4xl md:text-5xl xl:text-6xl">From Amman to Aqaba, Petra to Jerash</span>
                </>
              )}
            </h1>
            
            <p className={`text-xl text-white/90 mb-8 mt-6 ${isArabic ? 'arabic-font' : ''}`}>
              {isArabic 
                ? "اكتشف أفضل العقارات للإيجار في جميع أنحاء المملكة الأردنية الهاشمية"
                : "Discover the finest rental properties across the Hashemite Kingdom of Jordan"
              }
            </p>

            {/* Search Bar with Jordanian styling */}
            <div className="flex justify-center mt-8">
              <div className="w-full max-w-2xl relative">
                <div className="absolute -top-1 -left-1 -right-1 -bottom-1 bg-gradient-to-r from-secondary-600 via-jordanian-green-600 to-secondary-600 rounded-xl blur opacity-30"></div>
                <div className="relative flex bg-white rounded-xl overflow-hidden shadow-2xl border-2 border-secondary-500">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder={isArabic ? "ابحث عن مدينة، حي أو عنوان في الأردن..." : "Search by city, neighborhood or address in Jordan..."}
                    className={`w-full rounded-none border-none bg-white h-14 opacity-100 text-primary-900 px-6 text-lg ${isArabic ? 'text-right' : 'text-left'}`}
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-none border-none hover:from-secondary-700 hover:to-secondary-800 h-14 px-8 font-bold text-lg"
                  >
                    {isArabic ? "بحث" : "Search"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Auth indicator */}
            {!authUser && !isLoading && (
              <p className="text-white/70 text-sm mt-3">
                {isArabic ? "سجّل دخولك للبحث عن العقارات" : "Sign in to search for properties"}
              </p>
            )}

            {/* Popular Jordanian Cities */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {[
                { ar: 'عمّان', en: 'Amman' },
                { ar: 'إربد', en: 'Irbid' },
                { ar: 'الزرقاء', en: 'Zarqa' },
                { ar: 'العقبة', en: 'Aqaba' },
                { ar: 'السلط', en: 'Salt' },
                { ar: 'مادبا', en: 'Madaba' },
              ].map((city, index) => (
                <motion.button
                  key={city.en}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  onClick={() => handleCityClick(city.en)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-secondary-600 hover:border-secondary-500 transition-all text-sm arabic-font"
                >
                  {isArabic ? city.ar : city.en}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
