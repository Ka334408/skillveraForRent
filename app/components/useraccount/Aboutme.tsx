"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUserStore } from "@/app/store/userStore";
import { Camera, CheckCircle2, Loader2, ArrowLeft, ArrowRight, User as UserIcon } from "lucide-react";

export default function ProfileCard() {
  const { user, setUser } = useUserStore();
  const t = useTranslations("AboutUser"); // تأكد من وجود هذا القسم في ملفات الـ JSON
  const locale = useLocale();
  const isRTL = locale === "ar";
  const router = useRouter();

  const [name, setName] = useState("");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

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
    setTimeout(() => {
      setSaving(false);
      setUser({ ...user!, name, image: filePreview });
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    }, 1200);
  };

  if (loading) return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-[#0E766E] mb-4" size={48} />
      <h1 className="text-2xl font-black text-gray-800 tracking-tight">Skillvera</h1>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className={`flex flex-col lg:flex-row gap-12 items-center lg:items-start`}>
        
        {/* LEFT/RIGHT: PROFILE IMAGE CARD */}
        <div className="w-full max-w-[340px] group" data-aos="fade-up">
          <div className="relative bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-white/5 flex flex-col items-center">
            
            {/* Avatar Container */}
            <div className="relative">
              <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-teal-50 dark:ring-[#0E766E]/20 ring-offset-4 dark:ring-offset-zinc-900 bg-gray-100 shadow-inner transition-transform duration-500 group-hover:scale-105">
                {filePreview ? (
                  <img src={filePreview} className="w-full h-full object-contain" alt="profile" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-teal-50 dark:bg-zinc-800">
                    <UserIcon size={60} className="text-[#0E766E] opacity-40" />
                  </div>
                )}
              </div>
              
              {/* Floating Camera Button */}
              <button 
                onClick={() => fileRef.current?.click()}
                className={`absolute bottom-1 ${isRTL ? "left-1" : "right-1"} bg-[#0E766E] text-white p-3 rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-all z-10`}
              >
                <Camera size={20} />
              </button>
            </div>

            <h3 className="mt-6 text-xl font-black text-gray-800 dark:text-white">
              {name || t("yourNamePlaceholder")}
            </h3>
            <p className="text-[#0E766E] text-xs uppercase tracking-widest font-bold mt-2 bg-teal-50 dark:bg-[#0E766E]/10 px-3 py-1 rounded-full">
              {t("accountType")}
            </p>

            <div className="w-full mt-8 space-y-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                  savedMessage 
                    ? "bg-green-500 text-white shadow-green-100" 
                    : "bg-[#0E766E] text-white shadow-[#0E766E]/20 shadow-xl hover:bg-[#095F59] hover:-translate-y-1"
                }`}
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : savedMessage ? <CheckCircle2 size={20} /> : null}
                <span>{saving ? t("saving") : savedMessage ? t("saved") : t("saveBtn")}</span>
              </button>
            </div>

            <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
          </div>
        </div>

        {/* RIGHT/LEFT: SETTINGS FORM */}
        <div className="flex-1 w-full space-y-8" data-aos={isRTL ? "fade-right" : "fade-left"}>
          <div className="space-y-4">
            <h4 className={`text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight ${isRTL ? "text-right" : "text-left"}`}>
              {t("completeTitle")}
            </h4>
            <p className={`text-gray-500 dark:text-gray-400 text-md leading-relaxed max-w-2xl ${isRTL ? "text-right" : "text-left"}`}>
              {t("completeDesc")}
            </p>
          </div>

          <div className="bg-gray-50/50 dark:bg-white/5 p-2 rounded-[2.5rem] border border-gray-100 dark:border-white/5">
            <div className="bg-white dark:bg-zinc-900 p-6 md:p-10 rounded-[2.2rem] shadow-sm space-y-8">
              
              <div className="space-y-3">
                <label className={`block text-xs font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest ${isRTL ? "mr-2" : "ml-2"}`}>
                  {t("labelFullName")}
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-6 py-4 bg-gray-50 dark:bg-zinc-800 border-2 border-transparent focus:border-[#0E766E]/30 rounded-2xl outline-none transition-all text-gray-700 dark:text-zinc-200 font-bold text-lg ${isRTL ? "text-right" : "text-left"}`}
                  placeholder={t("namePlaceholder")}
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={() => router.push("/userview/userProfile")}
                  className={`group w-full sm:w-auto min-w-[240px] bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white px-8 py-5 rounded-2xl font-black transition-all hover:bg-black dark:hover:bg-zinc-200 shadow-xl flex items-center justify-center gap-3 active:scale-95`}
                >
                  {t("getStarted")}
                  {isRTL ? 
                    <ArrowLeft size={22} className="transition-transform group-hover:-translate-x-2" /> : 
                    <ArrowRight size={22} className="transition-transform group-hover:translate-x-2" />
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