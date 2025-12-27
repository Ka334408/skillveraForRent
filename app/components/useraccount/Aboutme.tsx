"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUserStore } from "@/app/store/userStore";
import { Camera, CheckCircle2, Loader2, ArrowRight, User as UserIcon } from "lucide-react";

export default function ProfileCard() {
  const { user, setUser } = useUserStore();
  const t = useTranslations("proPhoto");
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
      <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Skillvera</h1>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
        
        {/* LEFT: PROFILE IMAGE CARD */}
        <div className="w-full max-w-[340px] group">
          <div className="relative bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center">
            
            {/* Avatar Container */}
            <div className="relative">
              <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-teal-50 ring-offset-2 bg-gray-100 shadow-inner">
                {filePreview ? (
                  <img src={filePreview} className="w-full h-full object-contain" alt="profile" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-teal-50">
                    <UserIcon size={60} className="text-[#0E766E] opacity-40" />
                  </div>
                )}
              </div>
              
              {/* Floating Camera Button */}
              <button 
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-1 right-1 bg-[#0E766E] text-white p-3 rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-all"
              >
                <Camera size={20} />
              </button>
            </div>

            <h3 className="mt-6 text-xl font-bold text-gray-800">{name || "Your Name"}</h3>
            <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mt-1">Personal Account</p>

            <div className="w-full mt-8 space-y-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                  savedMessage 
                    ? "bg-green-500 text-white shadow-green-100" 
                    : "bg-[#0E766E] text-white shadow-teal-100 shadow-lg hover:bg-[#095F59]"
                }`}
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : savedMessage ? <CheckCircle2 size={20} /> : null}
                {saving ? "Saving Changes..." : savedMessage ? "Updated Successfully" : t("save")}
              </button>
            </div>

            <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
          </div>
        </div>

        {/* RIGHT: SETTINGS FORM */}
        <div className="flex-1 w-full space-y-8">
          <div className="space-y-2">
            <h4 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              {t("completeTitle")}
            </h4>
            <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">
              {t("completeDesc")}
            </p>
          </div>

          <div className="bg-gray-50/50 p-2 rounded-[2rem] border border-gray-100">
            <div className="bg-white p-6 md:p-8 rounded-[1.7rem] shadow-sm space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Display Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0E766E]/20 outline-none transition-all text-gray-700 font-medium"
                  placeholder={t("namePlaceholder")}
                />
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push("/userview/userProfile")}
                  className="flex-1 bg-gray-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2"
                >
                  {t("getStarted")}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}