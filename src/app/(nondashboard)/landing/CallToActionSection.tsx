"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLocale } from "next-intl";

const CallToActionSection = () => {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  
  return (
    <div className="relative py-24">
      <Image
        src="/landing-call-to-action.jpg"
        alt="Aqar - Jordan Real Estate Call to Action"
        fill
        className=" object-center object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 via-black/70 to-secondary-900/80"></div>
      
      {/* Arabic pattern overlay */}
      <div className="absolute inset-0 arabic-pattern opacity-10"></div>
      
      {/* Jordanian accent border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary-600 via-jordanian-green-600 to-secondary-600"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-4xl xl:max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-12"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="mb-6 md:mb-0 md:mr-10 flex-1">
            <h2 className={`text-3xl md:text-4xl font-bold text-white mb-4 ${isArabic ? 'arabic-font' : 'english-font'}`}>
              {isArabic 
                ? 'ابحث عن عقار أحلامك في الأردن'
                : 'Find Your Dream Property in Jordan'
              }
            </h2>
            <p className={`text-secondary-300 text-lg ${isArabic ? 'arabic-font' : ''}`}>
              {isArabic
                ? 'اكتشف مجموعة واسعة من العقارات للإيجار في جميع أنحاء المملكة'
                : 'Discover a wide range of rental properties across the Hashemite Kingdom'
              }
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={`inline-block text-white bg-secondary-600 rounded-lg px-8 py-4 font-bold hover:bg-secondary-700 border-2 border-secondary-500 hover:border-secondary-600 transition-all shadow-lg hover:shadow-xl ${isArabic ? 'arabic-font' : ''}`}
            >
              {isArabic ? 'بحث' : 'Search'}
            </button>
            <Link
              href="/signup"
              className={`inline-block text-primary-900 bg-white rounded-lg px-8 py-4 font-bold hover:bg-desert-gold hover:text-white border-2 border-white transition-all shadow-lg hover:shadow-xl ${isArabic ? 'arabic-font' : ''}`}
              scroll={false}
            >
              {isArabic ? 'إنشاء حساب' : 'Sign Up'}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CallToActionSection;
