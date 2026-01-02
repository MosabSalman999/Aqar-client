"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale } from "next-intl";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const DiscoverSection = () => {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  
  const cards = [
    {
      imageSrc: "/landing-icon-wand.png",
      titleEn: "Search for Properties",
      titleAr: "ابحث عن العقارات",
      descriptionEn: "Browse through our extensive collection of rental properties across all Jordanian cities and governorates.",
      descriptionAr: "تصفح مجموعتنا الواسعة من العقارات للإيجار في جميع المدن والمحافظات الأردنية",
    },
    {
      imageSrc: "/landing-icon-calendar.png",
      titleEn: "Book Your Rental",
      titleAr: "احجز عقارك",
      descriptionEn: "Once you've found the perfect property in Jordan, easily book it online with just a few clicks.",
      descriptionAr: "بمجرد العثور على العقار المثالي في الأردن، احجزه بسهولة عبر الإنترنت بنقرات قليلة",
    },
    {
      imageSrc: "/landing-icon-heart.png",
      titleEn: "Enjoy Your New Home",
      titleAr: "استمتع ببيتك الجديد",
      descriptionEn: "Move into your new property and start enjoying life in the beautiful Hashemite Kingdom of Jordan.",
      descriptionAr: "انتقل إلى عقارك الجديد وابدأ بالاستمتاع بالحياة في المملكة الأردنية الهاشمية",
    },
  ];
  
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true}}
      variants={containerVariants}
      className="py-20 bg-gradient-to-b from-white to-desert-sand/20 mb-16 relative overflow-hidden"
    >
      {/* Decorative Jordanian elements */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary-900 via-secondary-600 to-jordanian-green-600 opacity-20"></div>
      
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <motion.div variants={itemVariants} className="my-12 text-center">
          <h2 className={`text-4xl font-bold leading-tight text-primary-900 mb-4 ${isArabic ? 'arabic-font' : 'english-font'}`}>
            {isArabic ? 'اكتشف عقارك المثالي' : 'Discover Your Perfect Property'}
          </h2>
          <p className={`mt-4 text-xl text-secondary-700 font-semibold ${isArabic ? 'arabic-font' : ''}`}>
            {isArabic 
              ? 'ابحث عن بيت أحلامك في الأردن اليوم!'
              : 'Find Your Dream Rental in Jordan Today!'
            }
          </p>
          <p className={`mt-2 text-gray-600 max-w-3xl mx-auto ${isArabic ? 'arabic-font' : ''}`}>
            {isArabic
              ? 'لم يعد البحث عن عقارك المثالي أسهل من ذي قبل. مع خاصية البحث السهلة الاستخدام، يمكنك العثور بسرعة على المنزل المثالي الذي يلبي جميع احتياجاتلك في الأردن!'
              : 'Searching for your dream rental property in Jordan has never been easier. With our user-friendly search feature, you can quickly find the perfect home that meets all your needs across the Kingdom!'
            }
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16 text-center">
          {cards.map((card, index) => (
            <motion.div key={index} variants={itemVariants}>
              <DiscoverCard 
                imageSrc={card.imageSrc}
                title={isArabic ? card.titleAr : card.titleEn}
                description={isArabic ? card.descriptionAr : card.descriptionEn}
                isArabic={isArabic}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const DiscoverCard = ({
  imageSrc,
  title,
  description,
  isArabic,
}: {
  imageSrc: string;
  title: string;
  description: string;
  isArabic: boolean;
}) => (
  <div className="px-6 py-12 shadow-xl rounded-lg bg-white md:h-80 border-t-4 border-secondary-600 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-secondary-600/10 to-transparent rounded-bl-full"></div>
    <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 p-3 rounded-full mb-6 h-16 w-16 mx-auto shadow-lg">
      <Image
        src={imageSrc}
        width={40}
        height={40}
        className="w-full h-full"
        alt={title}
      />
    </div>
    <h3 className={`mt-4 text-xl font-bold text-primary-900 ${isArabic ? 'arabic-font' : 'english-font'}`}>{title}</h3>
    <p className={`mt-3 text-base text-gray-600 ${isArabic ? 'arabic-font' : ''}`}>{description}</p>
  </div>
);

export default DiscoverSection;
