"use client";
import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { useLocale } from "next-intl";

const FooterSection = () => {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  
  return (
    <footer className="border-t-4 border-secondary-600 py-20 bg-gradient-to-b from-primary-900 to-primary-800 text-white relative overflow-hidden">
      {/* Arabic pattern overlay */}
      <div className="absolute inset-0 arabic-pattern opacity-10"></div>
      
      {/* Jordanian flag colors accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-900 via-secondary-600 to-jordanian-green-600"></div>
      
      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 bg-secondary-600 rounded-md flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl arabic-font">ع</span>
              </div>
              <div>
                <h3 className={`text-2xl font-bold ${isArabic ? 'arabic-font' : 'english-font'}`}>
                  {isArabic ? 'عقار' : 'AQAR'}
                </h3>
                <p className="text-xs text-secondary-300">
                  {isArabic ? 'Jordan Real Estate' : 'العقارات الأردنية'}
                </p>
              </div>
            </div>
            <p className={`text-sm text-gray-300 ${isArabic ? 'arabic-font' : ''}`}>
              {isArabic 
                ? 'منصتك الموثوقة للعقارات في الأردن'
                : 'Your trusted real estate platform in Jordan'
              }
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`font-bold mb-4 text-secondary-400 ${isArabic ? 'arabic-font' : ''}`}>
              {isArabic ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:text-secondary-400 transition-colors text-sm">
                    {isArabic ? 'من نحن' : 'About Us'}
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-secondary-400 transition-colors text-sm">
                    {isArabic ? 'البحث عن عقار' : 'Search Properties'}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-secondary-400 transition-colors text-sm">
                    {isArabic ? 'اتصل بنا' : 'Contact Us'}
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-secondary-400 transition-colors text-sm">
                    {isArabic ? 'الأسئلة الشائعة' : 'FAQ'}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Cities */}
          <div>
            <h4 className={`font-bold mb-4 text-secondary-400 arabic-font`}>
              {isArabic ? 'المدن' : 'Cities'}
            </h4>
            <ul className="space-y-2 arabic-font text-sm">
              <li><Link href="/search?city=amman" className="hover:text-secondary-400 transition-colors">عمّان</Link></li>
              <li><Link href="/search?city=irbid" className="hover:text-secondary-400 transition-colors">إربد</Link></li>
              <li><Link href="/search?city=zarqa" className="hover:text-secondary-400 transition-colors">الزرقاء</Link></li>
              <li><Link href="/search?city=aqaba" className="hover:text-secondary-400 transition-colors">العقبة</Link></li>
              <li><Link href="/search?city=salt" className="hover:text-secondary-400 transition-colors">السلط</Link></li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className={`font-bold mb-4 text-secondary-400 ${isArabic ? 'arabic-font' : ''}`}>
              {isArabic ? 'تواصل معنا' : 'Connect With Us'}
            </h4>
            <div className="flex space-x-4 mb-6">
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-secondary-400 transition-colors bg-white/10 p-2 rounded-full hover:bg-secondary-600"
              >
                <FontAwesomeIcon icon={faFacebook} className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-secondary-400 transition-colors bg-white/10 p-2 rounded-full hover:bg-secondary-600"
              >
                <FontAwesomeIcon icon={faInstagram} className="h-5 w-5" />
              </a>
              <a
                href="#" 
                aria-label="Twitter"
                className="hover:text-secondary-400 transition-colors bg-white/10 p-2 rounded-full hover:bg-secondary-600"
              >
                <FontAwesomeIcon icon={faTwitter} className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Linkedin"
                className="hover:text-secondary-400 transition-colors bg-white/10 p-2 rounded-full hover:bg-secondary-600"
              >
                <FontAwesomeIcon icon={faLinkedin} className="h-5 w-5" />
              </a>
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-secondary-400 transition-colors text-sm">
                  {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-secondary-400 transition-colors text-sm">
                  {isArabic ? 'شروط الاستخدام' : 'Terms of Service'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
            <span className={`mb-4 md:mb-0 ${isArabic ? 'arabic-font' : ''}`}>
              {isArabic 
                ? '© 2026 عقار. جميع الحقوق محفوظة'
                : '© 2026 AQAR. All rights reserved'
              }
            </span>
            <span className={`text-xs ${isArabic ? 'arabic-font' : ''}`}>
              {isArabic 
                ? 'صنع بـ ❤️ في الأردن'
                : 'Made with ❤️ in Jordan'
              }
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
