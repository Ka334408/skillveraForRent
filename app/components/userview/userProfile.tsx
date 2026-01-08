"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/userStore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { 
  User, 
  MapPin, 
  Calendar as CalendarIcon, 
  ChevronRight, 
  ChevronLeft,
  Loader2, 
  ShieldCheck, 
  Phone as PhoneIcon,
  Users
} from "lucide-react";

export default function ProfilePage() {
  const t = useTranslations("userprofile");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const router = useRouter();
  const { user, token, isHydrated } = useUserStore();

  const [username, setUsername] = useState("User");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState(""); // محافظ على الـ string logic بتاعك
  const [gender, setGender] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState<{ phone?: string; dob?: string }>({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, title: "", message: "" });

  useEffect(() => {
    if (!isHydrated || !user) return;

    setUsername(user.name || "User");
    setPhone(user.phone || "");
    setDob(user.dob || "");
    setGender(user.gender || "");

    if (user.image) {
      setProfileImg(user.image.startsWith("uploads/") ? `/api/media?media=${user.image}` : user.image);
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation(`${pos.coords.latitude},${pos.coords.longitude}`),
      (err) => console.error(err)
    );
  }, [isHydrated, user]);

  if (!isHydrated) return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#0E766E] mb-4" size={48} />
      <h1 className="text-2xl font-black text-[#0E766E] tracking-tighter">Skillvera</h1>
    </div>
  );

  const validate = () => {
    const errs: { phone?: string; dob?: string } = {};
    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(phone)) errs.phone = t("invalidPhone");
    if (!dob) errs.dob = t("dobRequired");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", username);
      formData.append("email", user?.email || "");
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("phone", phone);
      formData.append("addressLatLong", location);

      if (profileImg && !profileImg.startsWith("/api/media")) {
        const res = await fetch(profileImg);
        const blob = await res.blob();
        formData.append("image", blob, "profile.png");
      }

      const response = await fetch(`/api/user/update-profile`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error();

      setModal({ open: true, title: t("successTitle"), message: t("successMsg") });
    } catch (err) {
      setModal({ open: true, title: t("errorTitle"), message: t("errorMsg") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans" dir={isRTL ? "rtl" : "ltr"}>
      {/* SUCCESS/ERROR MODAL */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-sm p-8 rounded-[2rem] shadow-2xl text-center animate-in zoom-in duration-300">
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${modal.title === t("successTitle") ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
              {modal.title === t("successTitle") ? <ShieldCheck size={32} /> : <span className="text-2xl">❌</span>}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{modal.title}</h2>
            <p className="text-gray-500 mb-8">{modal.message}</p>
            <button
              onClick={() => {
                setModal({ open: false, title: "", message: "" });
                if (modal.title === t("successTitle")) router.push(`/${locale}/userview/Home`);
              }}
              className="w-full bg-[#0E766E] text-white py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-teal-100 transition-all flex items-center justify-center gap-2"
            >
              {modal.title === t("successTitle") ? t("letsGo") : t("tryAgain")} 
              {isRTL ? <ChevronLeft size={20}/> : <ChevronRight size={20}/>}
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT PANEL: IDENTITY CARD */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0E766E] rounded-[2.5rem] p-8 text-white shadow-xl shadow-teal-900/10 relative overflow-hidden group">
            <div className={`absolute top-[-20%] ${isRTL ? 'left-[-20%]' : 'right-[-20%]'} w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all`} />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-3xl border-4 border-white/20 overflow-hidden bg-white shadow-lg mb-4">
                {profileImg ? (
                  <img src={profileImg} alt="Profile" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300"><User size={48}/></div>
                )}
              </div>
              <h1 className="text-2xl font-bold">{username}</h1>
              <p className="text-teal-100 text-sm opacity-80 mb-6">{user?.email}</p>
              
              <div className="w-full space-y-3">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3 text-sm">
                   <div className="bg-white/20 p-2 rounded-xl"><MapPin size={16}/></div>
                   <span className="truncate">{location ? t("locVerified") : t("locDetecting")}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hidden lg:block">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#0E766E]"/> {t("securityTip")}
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              {t("securityDesc")}
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: EDIT FORM */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-12 border border-gray-100 shadow-sm">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{t("title")}</h2>
              <p className="text-gray-500 font-medium">{t("desc")}</p>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className={`flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ${isRTL ? 'mr-1' : 'ml-1'}`}>
                  <User size={14}/> {t("fullName")}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 text-gray-800 font-semibold focus:ring-2 focus:ring-[#0E766E]/20 transition-all outline-none"
                  placeholder={t("namePlaceholder")}
                />
              </div>

              {/* Phone Input */}
              <div className="md:col-span-1">
                <label className={`flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ${isRTL ? 'mr-1' : 'ml-1'}`}>
                  <PhoneIcon size={14}/> {t("phone")}
                </label>
                <div dir="ltr">
                  <PhoneInput
                    country={"sa"}
                    value={phone}
                    onChange={(value) => setPhone("+" + value)}
                    containerClass="!w-full"
                    inputClass="!w-full !h-14 !bg-gray-50 !border-none !rounded-2xl !text-gray-800 !font-semibold !pl-14"
                    buttonClass="!bg-transparent !border-none !rounded-l-2xl !pl-2"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase ml-1">{errors.phone}</p>}
              </div>

              {/* DOB (Modern Calendar) */}
              <div className="md:col-span-1">
                <label className={`flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ${isRTL ? 'mr-1' : 'ml-1'}`}>
                  <CalendarIcon size={14}/> {t("dob")}
                </label>
                <div className="relative">
                  <DatePicker
                    selected={dob ? new Date(dob) : null}
                    onChange={(date:any) => setDob(date ? date.toISOString().split('T')[0] : "")}
                    dateFormat="yyyy-MM-dd"
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-gray-800 font-semibold focus:ring-2 focus:ring-[#0E766E]/20 transition-all outline-none h-14"
                    placeholderText="YYYY-MM-DD"
                    maxDate={new Date()}
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={50}
                  />
                  <CalendarIcon className={`absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none ${isRTL ? 'left-4' : 'right-4'}`} size={18}/>
                </div>
                {errors.dob && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase ml-1">{errors.dob}</p>}
              </div>

              {/* Gender */}
              <div className="md:col-span-2">
                <label className={`flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ${isRTL ? 'mr-1' : 'ml-1'}`}>
                  <Users size={14}/> {t("gender")}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["male", "female", "other"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-4 rounded-2xl text-sm font-bold capitalize transition-all border-2 ${
                        gender === g 
                        ? "bg-[#0E766E] border-[#0E766E] text-white shadow-lg shadow-teal-100" 
                        : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                      }`}
                    >
                      {t(g)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-5 rounded-[2rem] text-white font-black text-lg tracking-tight shadow-xl transition-all flex items-center justify-center gap-3 ${
                    loading 
                    ? "bg-gray-300 cursor-not-allowed shadow-none" 
                    : "bg-gray-900 hover:bg-black shadow-gray-200 hover:-translate-y-1"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={24}/>
                      {t("saving")}
                    </>
                  ) : (
                    <>
                      {t("updateProfile")}
                      {isRTL ? <ChevronLeft size={24}/> : <ChevronRight size={24}/>}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
      <style jsx global>{`
        .react-datepicker-wrapper { width: 100%; }
        .react-datepicker {
          font-family: inherit;
          border-radius: 1.5rem;
          border: none;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          padding: 10px;
        }
        .react-datepicker__header {
          background-color: white;
          border-bottom: 1px solid #f0f0f0;
        }
        .react-datepicker__day--selected {
          background-color: #0E766E !important;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
}