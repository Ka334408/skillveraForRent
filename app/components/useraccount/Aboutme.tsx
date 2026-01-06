"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUserStore } from "@/app/store/userStore";
import { Camera, CheckCircle2, Loader2, ArrowLeft, ArrowRight, User as UserIcon } from "lucide-react";
import { tooltip } from "leaflet";

export default function ProfileCard() {
  const { user, setUser } = useUserStore();
  const t = useTranslations("AboutUser");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const router = useRouter();

  const [name, setName] = useState("");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const fetchImageFromApi = async (path: string) => {
    try {
      const res = await axios.get(`/api/media?media=${path}`, { responseType: "blob" });
      return URL.createObjectURL(res.data);
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    setName(user.name || "");
    if (user.image?.startsWith("uploads/")) {
      fetchImageFromApi(user.image).then((url) => {
        if (url) setFilePreview(url);
        setLoading(false);
      });
    } else {
      setFilePreview(user.image || null);
      setLoading(false);
    }
  }, [user]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setFilePreview(url);
  };

  const handleSave = () => {
    setSaving(true);
    setSavedMessage(false);
    setShowTooltip(false);

    setTimeout(() => {
      setSaving(false);
      setUser({ ...user!, name, image: filePreview });
      setSavedMessage(true);
      setShowTooltip(true); // إظهار التول تيب بعد الحفظ المؤقت
      
      // إخفاء الرسائل بعد فترة
      setTimeout(() => {
        setSavedMessage(false);
        setShowTooltip(false);
      }, 5000);
    }, 1200);
  };

  if (loading) return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-[#0E766E] mb-4" size={48} />
      <h1 className="text-2xl font-black text-gray-800 tracking-tight">Skillvera</h1>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-12 px-4 sm:px-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start">
        
        {/* LEFT/RIGHT: PROFILE IMAGE CARD */}
        <div className="w-full max-w-[340px] group shrink-0" data-aos="fade-up">
          <div className="relative bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-white/5 flex flex-col items-center">
            
            {/* Avatar Container */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-teal-50 dark:ring-[#0E766E]/20 ring-offset-4 dark:ring-offset-zinc-900 bg-gray-100 shadow-inner transition-transform duration-500 group-hover:scale-105">
                {filePreview ? (
                  <img src={filePreview} className="w-full h-full object-cover" alt="profile" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-teal-50 dark:bg-zinc-800">
                    <UserIcon size={50} className="md:size-[60px] text-[#0E766E] opacity-40" />
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => fileRef.current?.click()}
                className={`absolute bottom-1 ${isRTL ? "left-1" : "right-1"} bg-[#0E766E] text-white p-2.5 md:p-3 rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-all z-10`}
              >
                <Camera size={18} />
              </button>
            </div>

            <h3 className="mt-6 text-lg md:text-xl font-black text-gray-800 dark:text-white text-center">
              {name || t("yourNamePlaceholder")}
            </h3>
            <p className="text-[#0E766E] text-[10px] md:text-xs uppercase tracking-widest font-bold mt-2 bg-teal-50 dark:bg-[#0E766E]/10 px-3 py-1 rounded-full">
              {t("accountType")}
            </p>

            <div className="w-full mt-6 md:mt-8 relative">
              {/* Tooltip */}
              {showTooltip && (
                <div className="absolute -top-16 -translate-x-1/2 w-full max-w-[250px] bg-zinc-800 text-white text-[11px] md:text-xs py-2 px-3 rounded-xl shadow-xl animate-bounce z-20 text-center border border-white/10">
                  {t("tooltip")}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-zinc-800 rotate-45 border-r border-b border-white/10"></div>
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className={`w-full py-3.5 md:py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                  savedMessage 
                    ? "bg-green-500 text-white shadow-green-100" 
                    : "bg-[#0E766E] text-white shadow-[#0E766E]/20 shadow-xl hover:bg-[#095F59] active:scale-[0.98]"
                }`}
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : savedMessage ? <CheckCircle2 size={18} /> : null}
                <span className="text-sm md:text-base">{saving ? t("saving") : savedMessage ? t("saved") : t("saveBtn")}</span>
              </button>
            </div>

            <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
          </div>
        </div>

        {/* RIGHT/LEFT: SETTINGS FORM */}
        <div className="flex-1 w-full space-y-6 md:space-y-8 mt-4 lg:mt-0" data-aos={isRTL ? "fade-right" : "fade-left"}>
          <div className={`space-y-3 md:space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
            <h4 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">
              {t("completeTitle")}
            </h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-md leading-relaxed max-w-2xl">
              {t("completeDesc")}
            </p>
          </div>

          <div className="bg-gray-50/50 dark:bg-white/5 p-1.5 md:p-2 rounded-[2.2rem] md:rounded-[2.5rem] border border-gray-100 dark:border-white/5">
            <div className="bg-white dark:bg-zinc-900 p-5 md:p-10 rounded-[1.8rem] md:rounded-[2.2rem] shadow-sm space-y-6 md:space-y-8">
              
              <div className="space-y-2 md:space-y-3">
                <label className={`block text-[10px] md:text-xs font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest ${isRTL ? "mr-2" : "ml-2"}`}>
                  {t("labelFullName")}
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 md:px-6 py-3.5 md:py-4 bg-gray-50 dark:bg-zinc-800 border-2 border-transparent focus:border-[#0E766E]/30 rounded-xl md:rounded-2xl outline-none transition-all text-gray-700 dark:text-zinc-200 font-bold text-base md:text-lg ${isRTL ? "text-right" : "text-left"}`}
                  placeholder={t("namePlaceholder")}
                />
              </div>

              <div className="pt-2 md:pt-4">
                <button
                  onClick={() => router.push("/userview/userProfile")}
                  className={`group w-full sm:w-auto min-w-full sm:min-w-[240px] bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl font-black transition-all hover:bg-black dark:hover:bg-zinc-200 shadow-xl flex items-center justify-center gap-3 active:scale-95`}
                >
                  <span className="text-sm md:text-base">{t("getStarted")}</span>
                  {isRTL ? 
                    <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-2" /> : 
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-2" />
                  }
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}