"use client";

import { useLocale, useTranslations } from "next-intl";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; 

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const isArabic = locale === "ar";

  const mainLinks = [
    { label: isArabic ? "عن سكايفارينت" : "About SKV Rent", href: `/${locale}/userview/aboutUs` },
    { label: isArabic ? "تواصل" : "Contact us", href: `/${locale}/userview/contactUs` },
    { label: isArabic ? "جميع المرافق" : "All Facilities", href: `/${locale}/userview/facilities` },
    { label: isArabic ? "الانضمام كمؤجر" : "Join as Provider", href: `/${locale}/userview/register` },
  ];

  const socialLinks = [
    { 
      icon: <FaXTwitter />, 
      href: "https://x.com/skillvera_sa", 
      label: "X", 
      naturalColor: "#000000" 
    },
    { 
      icon: <FaLinkedinIn />, 
      href: "https://www.linkedin.com/company/skillvera", 
      label: "LinkedIn", 
      naturalColor: "#0A66C2" 
    },
    { 
      icon: <FaInstagram />, 
      href: "#", 
      label: "Instagram", 
      disabled: true, 
      naturalColor: "#E4405F" 
    },
  ];

  return (
    <footer
      dir={isArabic ? "rtl" : "ltr"}
      className="bg-white text-gray-700 border-t border-gray-200 py-16"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid gap-12 lg:grid-cols-3 md:grid-cols-1">
          
          {/* العمود الأول + اللوجو (في الموبايل فقط) */}
          <div className="flex flex-row justify-between items-start lg:block">
            <div className={clsx(isArabic ? "text-right" : "text-left")}>
              <h3 className="font-bold text-gray-900 mb-6 text-lg">
                {isArabic ? "الرئيسية" : "Main Menu"}
              </h3>
              <ul className="space-y-4">
                {mainLinks.map((item, j) => (
                  <li key={j}>
                    <Link
                      href={item.href}
                      className="hover:text-[#0C8A83] text-gray-500 transition-colors font-medium text-sm"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* اللوجو يظهر هنا بجانب العمود الأول في الموبايل فقط */}
            <div className="lg:hidden shrink-0">
               <Link href="/">
                <Image
                  src="/logo.png"
                  alt="SkillVera Logo"
                  width={180}
                  height={70}
                  className="object-contain"
                />
              </Link>
            </div>
          </div>

          <div className={clsx(isArabic ? "text-right" : "text-left")}>
            <h3 className="font-bold text-gray-900 mb-6 text-lg">
              {isArabic ? "تواصل معنا" : "Contact Us"}
            </h3>
            <ul className="space-y-5 text-sm text-gray-500 font-medium">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-[#0C8A83] mt-1 shrink-0" size={18} />
                <span>{isArabic ? "حي غرناطة - طريق الدمام الفرعي، الرياض، المملكة العربية السعودية" : "Granada Dist - Dammam Rd, Riyadh, KSA"}</span>
              </li>
              <li className="flex items-center gap-3" dir="ltr">
                 <span className={isArabic ? "text-right w-full" : ""}>00966566363355 / 00966581887757</span>
                <FaPhoneAlt className="text-[#0C8A83] shrink-0" size={16} />
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-[#0C8A83] shrink-0" size={16} />
                <a href="mailto:info@skillvera.tech" className="hover:text-[#0C8A83]">info@skillvera.tech</a>
              </li>
            </ul>
          </div>

          <div className={clsx("flex flex-col items-center lg:items-end")}>
       <div className="hidden lg:block">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="SkillVera Logo"
                  width={180}
                  height={60}
                  className="object-contain" 
                />
              </Link>
            </div>
            
            <div className="flex items-center gap-4 mt-6 lg:mt-52">
              {socialLinks.map((link, idx) => (
                link.disabled ? (
                  <span
                    key={idx}
                    style={{ color: link.naturalColor }}
                    className="p-3 bg-gray-50 rounded-full text-xl cursor-not-allowed opacity-30 border border-gray-100"
                    title="None"
                  >
                    {link.icon}
                  </span>
                ) : (
                  <a
                    key={idx}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: link.naturalColor }}
                    className="p-3 bg-gray-50 rounded-full text-xl transition-all duration-300 border border-gray-100
                               hover:bg-[#0C8A83] hover:text-white hover:-translate-y-1 shadow-sm"
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = link.naturalColor)}
                  >
                    {link.icon}
                  </a>
                )
              ))}
            </div>
          </div>

        </div>

        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2026 SKV Rent. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}