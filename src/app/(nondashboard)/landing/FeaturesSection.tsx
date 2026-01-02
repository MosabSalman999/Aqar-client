"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Building2, Shield, Search } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2,
    },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FeaturesSection = () => {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  
  const features = [
    {
      icon: Shield,
      titleEn: "Verified Listings Across Jordan",
      titleAr: "قوائم عقارية موثقة في جميع أنحاء الأردن",
      descEn: "All properties are verified and inspected to ensure quality and authenticity",
      descAr: "جميع العقارات موثقة ومفحوصة لضمان الجودة والأصالة",
      linkText: isArabic ? "استكشف" : "Explore",
      linkHref: "/explore",
      imageSrc: "/landing-search3.png"
    },
    {
      icon: Building2,
      titleEn: "Modern Living in Historic Jordan",
      titleAr: "حياة عصرية في الأردن التاريخي",
      descEn: "From contemporary apartments in Amman to traditional homes near Petra",
      descAr: "من الشقق العصرية في عمان إلى المنازل التقليدية بالقرب من البتراء",
      linkText: isArabic ? "بحث" : "Search",
      linkHref: "/search",
      imageSrc: "/landing-search2.png"
    },
    {
      icon: Search,
      titleEn: "Advanced Search for Your Perfect Home",
      titleAr: "بحث متقدم لمنزلك المثالي",
      descEn: "Filter by location, price, amenities and more across all Jordanian cities",
      descAr: "فلتر حسب الموقع والسعر والمرافق والمزيد في جميع المدن الأردنية",
      linkText: isArabic ? "اكتشف" : "Discover",
      linkHref: "/discover",
      imageSrc: "/landing-search1.png"
    },
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="py-24 px-6 sm:px-8 lg:px-12 xl:px-16 bg-gradient-to-b from-white via-desert-sand/10 to-white relative overflow-hidden"
    >
      {/* Arabic pattern background */}
      <div className="absolute inset-0 arabic-pattern opacity-30"></div>
      
      {/* Jordanian inspired decorative element */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary-600 to-transparent"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-jordanian-green-600 to-transparent mt-1"></div>
      
      <div className="max-w-4xl xl:max-w-6xl mx-auto relative z-10">
        <motion.h2
          variants={itemVariants}
          className={`text-4xl font-bold text-center mb-4 text-primary-900 ${isArabic ? 'arabic-font' : 'english-font'}`}
        >
          {isArabic 
            ? "اكتشف منزلك المثالي في المملكة الأردنية" 
            : "Discover Your Perfect Home in Jordan"
          }
        </motion.h2>
        
        <motion.p
          variants={itemVariants}
          className={`text-center text-secondary-700 mb-16 text-lg ${isArabic ? 'arabic-font' : ''}`}
        >
          {isArabic
            ? "نساعدك في العثور على العقار المثالي في جميع أنحاء الأردن"
            : "We help you find the perfect property across all of Jordan"
          }
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <FeatureCard
                icon={feature.icon}
                imageSrc={feature.imageSrc}
                title={isArabic ? feature.titleAr : feature.titleEn}
                description={isArabic ? feature.descAr : feature.descEn}
                linkText={feature.linkText}
                linkHref={feature.linkHref}
                isArabic={isArabic}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const FeatureCard = ({
  icon: Icon,
  imageSrc,
  title,
  description,
  linkText,
  linkHref,
  isArabic,
}: {
  icon: any;
  imageSrc: string;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
  isArabic: boolean;
}) => {
  return (
    <div className="text-center flex flex-col justify-between h-full bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 border-secondary-600 group">
      <div className="relative">
        {/* Icon overlay */}
        <div className="absolute top-4 right-4 z-10 bg-secondary-600 text-white p-3 rounded-full shadow-lg">
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="p-5 rounded-lg flex items-center justify-center h-48 bg-gradient-to-br from-desert-sand/20 to-petra-rose/10">
          <Image
            src={imageSrc}
            width={400}
            height={400}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
            alt={title}
          />
        </div>
      </div>

      <div className="p-6">
        <h3 className={`text-xl font-bold mb-3 text-primary-900 ${isArabic ? 'arabic-font' : 'english-font'}`}>
          {title}
        </h3>
        <p className={`mb-5 text-gray-700 ${isArabic ? 'arabic-font' : ''}`}>
          {description}
        </p>
        <Link
          href={linkHref}
          className={`inline-block bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 text-white rounded-lg px-6 py-3 w-[60%] mx-auto text-center font-bold transition-all duration-300 shadow-md hover:shadow-lg ${isArabic ? 'arabic-font' : ''}`}
          scroll={false}
        >
          {linkText}
        </Link>
      </div>
    </div>
  );
};
export default FeaturesSection;
