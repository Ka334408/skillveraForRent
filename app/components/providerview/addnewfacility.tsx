"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useLocale, useTranslations } from "next-intl";
import toast, { Toaster } from "react-hot-toast";

import {
  Plus,
  X,
  MapPin,
  Info,
  Image as ImageIcon,
  Loader2,
  ListChecks,
} from "lucide-react";
import { useUserStore } from "@/app/store/userStore";

// --- Helpers ---
const extractLatLng = (url: string) => {
  try {
    const match = url.match(/@([-0-9.]+),([-0-9.]+)/);
    if (match) return `${match[1]},${match[2]}`;
  } catch { }
  return "";
};

const toBlob = async (fileOrUrl: File | string): Promise<Blob> => {
  if (typeof fileOrUrl === "string") {
    const res = await fetch(fileOrUrl);
    return await res.blob();
  }
  return fileOrUrl;
};

// --- Components ---
const FormInput = ({ label, required, ...props }: { label: string; required?: boolean;[key: string]: any }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      className="w-full border border-gray-300 bg-white p-3 rounded-lg shadow-sm focus:border-[#0E766E] focus:ring-1 focus:ring-[#0E766E] transition duration-150"
      {...props}
    />
  </div>
);

const FormTextarea = ({ label, required, ...props }: { label: string; required?: boolean;[key: string]: any }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      rows={3}
      className="w-full border border-gray-300 bg-white p-3 rounded-lg shadow-sm focus:border-[#0E766E] focus:ring-1 focus:ring-[#0E766E] transition duration-150"
      {...props}
    />
  </div>
);

const FormSelect = ({ label, children, isRTL, required, ...props }: { label: string; children: React.ReactNode; isRTL: boolean; required?: boolean;[key: string]: any }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        className={`w-full border border-gray-300 bg-white p-3 rounded-lg shadow-sm focus:border-[#0E766E] focus:ring-1 focus:ring-[#0E766E] transition duration-150 appearance-none ${isRTL ? 'pl-10' : 'pr-10'}`}
        {...props}
      >
        {children}
      </select>
      <div className={`absolute inset-y-0 ${isRTL ? 'left-3' : 'right-3'} flex items-center pointer-events-none text-gray-400`}>
        <Plus className="w-4 h-4 rotate-45" />
      </div>
    </div>
  </div>
);

export function AddFacilityPage() {
  const t = useTranslations("AddFacility");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useUserStore();

  const [facility, setFacility] = useState({
    nameEn: "", nameAr: "", taxNumber: "", price: "", categoryId: "",
    descriptionEn: "", descriptionAr: "", email: "", phone: "",
    website: "", address: "", mapUrl: "", lat: "", lng: "",
    policyEn: "", policyAr: "",
    featuresEn: "", featuresAr: "",
    overviewEn: "", overviewAr: ""
  });

  const [coverPic, setCoverPic] = useState<File | string | null>(null);
  const [facilityPics, setFacilityPics] = useState<(File | string)[]>([]);

  useEffect(() => {
    const loadCats = async () => {
      try {
        const res = await axiosInstance.get("/api/category/categories");
        setCategories(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoadingCats(false);
      }
    };
    loadCats();
  }, []);

  const handleChange = (key: string, value: any) => {
    setFacility((prev) => ({ ...prev, [key]: value }));
    if (key === "mapUrl") {
      const latlng = extractLatLng(value);
      const [lat, lng] = latlng.split(",");
      setFacility((prev) => ({ ...prev, lat: lat || "", lng: lng || "" }));
    }
  };

  // وظيفة التحقق من الحقول
  const validateForm = () => {
    const requiredFields = [
      { key: 'nameEn', label: t("fields.nameEn") },
      { key: 'nameAr', label: t("fields.nameAr") },
      { key: 'descriptionEn', label: t("fields.descEn") },
      { key: 'descriptionAr', label: t("fields.descAr") },
      { key: 'price', label: t("fields.price") },
      { key: 'categoryId', label: t("fields.category") },
      { key: 'email', label: t("fields.email") },
      { key: 'phone', label: t("fields.phone") },
      { key: 'address', label: t("fields.address") },
      { key: 'lat', label: t("fields.googleMaps") },
    ];

    for (const field of requiredFields) {
      if (!facility[field.key as keyof typeof facility]) {
        toast.error(`${isRTL ? 'يرجى إكمال الحقل:' : 'Please complete field:'} ${field.label}`);
        return false;
      }
    }
    if (facility.phone && !/^\+?[0-9]{8,15}$/.test(facility.phone)) {
      toast.error(isRTL ? "رقم الهاتف غير صحيح" : "Invalid phone number");
      return false;
    }

    if (!coverPic) {
      toast.error(t("alerts.coverRequired"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading(t("buttons.submitting"));

    try {
      const fd = new FormData();
      fd.append("name", JSON.stringify({ en: facility.nameEn, ar: facility.nameAr }));
      fd.append("description", JSON.stringify({ en: facility.descriptionEn, ar: facility.descriptionAr }));
      fd.append("taxNumber", facility.taxNumber);
      fd.append("price", facility.price);
      fd.append("categoryId", facility.categoryId);
      fd.append("email", facility.email);
      fd.append("phone", facility.phone);
      fd.append("website", facility.website);
      fd.append("address", facility.address);
      fd.append("addressLatLong", `${facility.lat},${facility.lng}`);
      fd.append("rules", JSON.stringify({ en: "rule" }));

      fd.append("policy", JSON.stringify({ en: facility.policyEn, ar: facility.policyAr }));
      fd.append("features", JSON.stringify({ en: facility.featuresEn, ar: facility.featuresAr }));
      fd.append("overview", JSON.stringify({ en: facility.overviewEn, ar: facility.overviewAr }));

      if (coverPic) {
        const blob = await toBlob(coverPic);
        fd.append("cover", blob, "cover.png");
      }

      for (let i = 0; i < facilityPics.length; i++) {
        const blob = await toBlob(facilityPics[i]);
        fd.append("images", blob, `image-${i}.png`);
      }

      await axiosInstance.post("/provider-facility/create", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });

      toast.success(t("alerts.success"), { id: loadingToast });

      setFacility({
        nameEn: "", nameAr: "", taxNumber: "", price: "", categoryId: "",
        descriptionEn: "", descriptionAr: "", email: "", phone: "",
        website: "", address: "", mapUrl: "", lat: "", lng: "",
        policyEn: "", policyAr: "", featuresEn: "", featuresAr: "", overviewEn: "", overviewAr: ""
      });
      setCoverPic(null);
      setFacilityPics([]);

    } catch (err) {
      toast.error(t("alerts.error"), { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleNumberOnly = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight"].includes(e.key) ||
      ((e.key === "a" || e.key === "c" || e.key === "v" || e.key === "x") && e.ctrlKey === true)
    ) {
      return;
    }

    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-white shadow-xl rounded-2xl my-10" dir={isRTL ? "rtl" : "ltr"}>
      <Toaster position="top-center" reverseOrder={false} />

      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-extrabold text-[#0E766E] flex items-center">
          <Plus className={`w-8 h-8 ${isRTL ? 'ml-3' : 'mr-3'}`} />
          {t("title")}
        </h1>
        <p className="text-gray-500 mt-1">{t("subtitle")}</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* 1. MEDIA SECTION */}
        <section className="p-6 border border-gray-200 rounded-xl bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <ImageIcon className={`w-6 h-6 ${isRTL ? 'ml-2' : 'mr-2'} text-[#0E766E]`} />
            {t("sections.images")}
          </h2>

          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2 text-gray-700">{t("media.coverLabel")} <span className="text-red-500">*</span></h3>
            <div
              className="relative w-full h-64 border-2 border-dashed border-[#0E766E]/50 bg-white rounded-xl flex items-center justify-center text-[#0E766E] text-4xl cursor-pointer transition hover:bg-[#0E766E]/10 overflow-hidden"
              onClick={() => document.getElementById("coverInput")?.click()}
            >
              {coverPic ? (
                <>
                  <img
                    src={typeof coverPic === "string" ? coverPic : URL.createObjectURL(coverPic)}
                    alt="Cover"
                    className="max-w-full max-h-full object-contain"
                  />
                  <button type="button" onClick={(e) => { e.stopPropagation(); setCoverPic(null); }} className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition`}>
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <Plus className="w-8 h-8" />
                  <span className="text-base mt-2">{t("media.uploadPlaceholder")}</span>
                </div>
              )}
            </div>
            <input id="coverInput" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && setCoverPic(e.target.files[0])} />
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 text-gray-700">{t("media.additionalLabel")}</h3>
            <div className="flex flex-wrap gap-4">
              {facilityPics.map((file, i) => (
                <div key={i} className="relative w-32 h-32">
                  <img src={typeof file === "string" ? file : URL.createObjectURL(file)} alt={`Facility ${i}`} className="max-w-full max-h-full object-contain rounded-xl border border-gray-300 shadow-md" />
                  <button type="button" onClick={() => setFacilityPics(facilityPics.filter((_, idx) => idx !== i))} className={`absolute -top-2 ${isRTL ? '-left-2' : '-right-2'} bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition`}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-3xl text-gray-500 cursor-pointer hover:border-[#0E766E] hover:text-[#0E766E] transition bg-white">
                <Plus className="w-6 h-6" />
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && setFacilityPics([...facilityPics, e.target.files[0]])} key={facilityPics.length} />
              </label>
            </div>
          </div>
        </section>

        {/* 2. BASIC INFO SECTION */}
        <section className="p-6 border border-gray-200 rounded-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Info className={`w-6 h-6 ${isRTL ? 'ml-2' : 'mr-2'} text-[#0E766E]`} />
            {t("sections.basicInfo")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput required label={t("fields.nameEn")} value={facility.nameEn} onChange={(e: any) => handleChange("nameEn", e.target.value)} />
            <FormInput required label={t("fields.nameAr")} value={facility.nameAr} onChange={(e: any) => handleChange("nameAr", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <FormTextarea required label={t("fields.descEn")} value={facility.descriptionEn} onChange={(e: any) => handleChange("descriptionEn", e.target.value)} />
            <FormTextarea required label={t("fields.descAr")} value={facility.descriptionAr} onChange={(e: any) => handleChange("descriptionAr", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
            <FormInput label={t("fields.tax")} value={facility.taxNumber} onChange={(e: any) => handleChange("taxNumber", e.target.value)} />
            <FormInput required label={t("fields.price")} type="number" value={facility.price} onChange={(e: any) => handleChange("price", e.target.value)} />
            <FormSelect required label={t("fields.category")} isRTL={isRTL} onChange={(e: any) => handleChange("categoryId", e.target.value)} value={facility.categoryId}>
              <option value="">{loadingCats ? t("media.loadingCats") : t("fields.selectCategory")}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name[locale] || cat.name.en}</option>
              ))}
            </FormSelect>
          </div>
        </section>

        {/* ADDITIONAL DETAILS SECTION */}
        <section className="p-6 border border-gray-200 rounded-xl bg-gray-50/50">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <ListChecks className={`w-6 h-6 ${isRTL ? 'ml-2' : 'mr-2'} text-[#0E766E]`} />
            {t("sections.additionalDetails") || "Additional Details"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormTextarea label={`${t("fields.policy") || "Policy"} (EN)`} value={facility.policyEn} onChange={(e: any) => handleChange("policyEn", e.target.value)} />
            <FormTextarea label={`${t("fields.policy") || "Policy"} (AR)`} value={facility.policyAr} onChange={(e: any) => handleChange("policyAr", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <FormTextarea label={`${t("fields.features") || "Features"} (EN)`} value={facility.featuresEn} onChange={(e: any) => handleChange("featuresEn", e.target.value)} />
            <FormTextarea label={`${t("fields.features") || "Features"} (AR)`} value={facility.featuresAr} onChange={(e: any) => handleChange("featuresAr", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <FormTextarea label={`${t("fields.overview") || "Overview"} (EN)`} value={facility.overviewEn} onChange={(e: any) => handleChange("overviewEn", e.target.value)} />
            <FormTextarea label={`${t("fields.overview") || "Overview"} (AR)`} value={facility.overviewAr} onChange={(e: any) => handleChange("overviewAr", e.target.value)} />
          </div>
        </section>

        {/* 3. CONTACT & LOCATION SECTION */}
        <section className="p-6 border border-gray-200 rounded-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <MapPin className={`w-6 h-6 ${isRTL ? 'ml-2' : 'mr-2'} text-[#0E766E]`} />
            {t("sections.contact")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput required label={t("fields.email")} type="email" value={facility.email} onChange={(e: any) => handleChange("email", e.target.value)} />
            <FormInput
              required
              label={t("fields.phone")}
              type="tel"
              value={facility.phone}
              onKeyDown={handleNumberOnly} 
              onChange={(e: any) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                handleChange("phone", val);
              }}
            />          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <FormInput label={t("fields.website")} value={facility.website} onChange={(e: any) => handleChange("website", e.target.value)} />
            <FormInput required label={t("fields.address")} value={facility.address} onChange={(e: any) => handleChange("address", e.target.value)} />
          </div>
          <div className="mt-5">
            <FormInput required label={t("fields.googleMaps")} placeholder="https://goo.gl/maps/..." value={facility.mapUrl} onChange={(e: any) => handleChange("mapUrl", e.target.value)} />
            {facility.lat && (
              <p className="text-sm text-green-600 mt-2 flex items-center font-bold">
                <MapPin className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                {t("media.coordsExtracted")}: {facility.lat}, {facility.lng}
              </p>
            )}
          </div>
        </section>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#0E766E] hover:bg-[#0A5D57] text-white px-6 py-4 rounded-xl w-full text-lg font-bold transition duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
        >
          {isSubmitting ? (
            <><Loader2 className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />{t("buttons.submitting")}</>
          ) : (
            t("buttons.submit")
          )}
        </button>
      </form>
    </div>
  );
}