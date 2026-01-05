"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axiosInstance from "@/lib/axiosInstance";
import { 
  Loader2, CheckCircle, Camera, User, 
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function MyProfile() {
  const locale = useLocale();
  const t = useTranslations("providerProfile");
  const tv = useTranslations("Validation");
  const isRTL = locale === "ar";

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [userPhotoFile, setUserPhotoFile] = useState<File | null>(null);

  // Schema مع ترجمة رسائل الخطأ
  const schema = yup.object().shape({
    fullName: yup.string().required(tv("nameRequired")),
    email: yup.string().email(tv("emailInvalid")).required(tv("emailRequired")),
    phone: yup.string().required(tv("phoneRequired")),
    taxNumber: yup.string().required(tv("taxRequired")),
    gender: yup.string().oneOf(["male", "female", "other"], tv("genderRequired")).required(),
    dob: yup.string().required(tv("dobRequired")),
  });

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchCurrentUserData = async () => {
      try {
        const res = await axiosInstance.get("/authentication/current-user");
        const userData = res.data?.data;
        if (userData) {
          setValue("fullName", userData.name || "");
          setValue("email", userData.email || "");
          setValue("phone", userData.phone || "");
          setValue("gender", userData.gender || "");
          setValue("dob", userData.dob || "");
          if (userData.image) {
            setPhotoPreview(`/api/media?media=${userData.image}`);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchCurrentUserData();
  }, [setValue]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserPhotoFile(file); 
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const formData = new FormData();
          formData.append("name", data.fullName);
          formData.append("email", data.email);
          formData.append("phone", data.phone);
          formData.append("taxNumber", data.taxNumber);
          formData.append("gender", data.gender);
          formData.append("dob", data.dob);
          formData.append("location", `${latitude},${longitude}`);
          
          if (userPhotoFile) formData.append("image", userPhotoFile);

          const response = await axiosInstance.patch("/provider/profile", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (response.status === 200 || response.status === 204) {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
          }
        } catch (error) {
          console.error("Submit error", error);
        } finally {
          setLoading(false);
        }
      },
      () => {
        alert(t("locationRequired"));
        setLoading(false);
      }
    );
  };

  if (fetching) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-teal-600 mb-4" size={48} />
      <p className="text-gray-400 font-bold">{t("loading")}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* IMAGE SECTION */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-48 h-48 bg-white rounded-[2.5rem] p-2 shadow-xl border border-gray-100 flex items-center justify-center overflow-hidden">
                {photoPreview ? (
                  <img 
                    src={photoPreview} 
                    className="max-w-full max-h-full object-contain transition-transform group-hover:scale-105" 
                    alt="Profile" 
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-300">
                     <User size={48} />
                     <span className="text-[10px] font-bold mt-2 uppercase">{t("noImage")}</span>
                  </div>
                )}
              </div>
              
              <label className={`absolute -bottom-2 ${isRTL ? '-left-2' : '-right-2'} bg-gray-900 hover:bg-black text-white p-3.5 rounded-2xl cursor-pointer shadow-2xl transition-all border-4 border-[#F8FAFC]`}>
                <Camera size={20} />
                <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
              </label>
            </div>
            <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">{t("providerIdentity")}</p>
          </div>

          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t("fullName")}</label>
                <input {...register("fullName")} className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-teal-500/10 outline-none transition-all" />
                {errors.fullName && <p className="text-red-500 text-[10px] font-bold px-1 uppercase">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t("taxNumber")}</label>
                <input {...register("taxNumber")} className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none transition-all" />
                {errors.taxNumber && <p className="text-red-500 text-[10px] font-bold px-1 uppercase">{errors.taxNumber.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t("dob")}</label>
                <input type="date" {...register("dob")} className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none transition-all" />
                {errors.dob && <p className="text-red-500 text-[10px] font-bold px-1 uppercase">{errors.dob.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t("gender.label")}</label>
                <select {...register("gender")} className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none appearance-none cursor-pointer">
                  <option value="">{t("gender.select")}</option>
                  <option value="male">{t("gender.male")}</option>
                  <option value="female">{t("gender.female")}</option>
                  <option value="other">{t("gender.other")}</option>
                </select>
                {errors.gender && <p className="text-red-500 text-[10px] font-bold px-1 uppercase">{errors.gender.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t("phone")}</label>
                <input {...register("phone")} className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none" />
                {errors.phone && <p className="text-red-500 text-[10px] font-bold px-1 uppercase">{errors.phone.message}</p>}
              </div>

              <div className="space-y-1 opacity-50">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t("email")}</label>
                <input {...register("email")} readOnly className="w-full bg-gray-100 border-none rounded-2xl p-4 outline-none cursor-not-allowed" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-10 py-5 rounded-[2rem] font-black text-white transition-all flex items-center justify-center gap-3 shadow-lg ${
                success ? "bg-green-500" : "bg-teal-600 hover:bg-teal-700 active:scale-95 shadow-teal-500/20"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : success ? (
                <><CheckCircle size={20} /> {t("updatedSuccess")}</>
              ) : (
                t("updateBtn")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}