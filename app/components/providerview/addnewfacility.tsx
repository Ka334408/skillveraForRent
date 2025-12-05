"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

// Helper Icons for better visual appeal
import {
  Plus,
  X,
  MapPin,
  Info,
  DollarSign,
  Image,
  Loader2,
} from "lucide-react";
import { useUserStore } from "@/app/store/userStore";

// --- START: Helper Functions and Components ---

// Extract lat,lng from Google Maps URL
const extractLatLng = (url: string) => {
  try {
    const match = url.match(/@([-0-9.]+),([-0-9.]+)/);
    if (match) return `${match[1]},${match[2]}`;
  } catch { }
  return "";
};

// Convert File / Blob URL to Blob (Crucial for FormData submission)
const toBlob = async (fileOrUrl: File | string): Promise<Blob> => {
  if (typeof fileOrUrl === "string") {
    // If it's a string, fetch the data (assuming it's a URL) and convert to Blob
    const res = await fetch(fileOrUrl);
    return await res.blob();
  }
  // If it's already a File (which is a Blob), return it directly
  return fileOrUrl;
};


// Helper Component for Input (Reusable and consistent design)
const FormInput = ({ label, ...props }: { label: string;[key: string]: any }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      className="w-full border border-gray-300 bg-white p-3 rounded-lg shadow-sm focus:border-[#0E766E] focus:ring-1 focus:ring-[#0E766E] transition duration-150"
      {...props}
    />
  </div>
);

// Helper Component for Textarea
const FormTextarea = ({ label, ...props }: { label: string;[key: string]: any }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <textarea
      rows={3}
      className="w-full border border-gray-300 bg-white p-3 rounded-lg shadow-sm focus:border-[#0E766E] focus:ring-1 focus:ring-[#0E766E] transition duration-150"
      {...props}
    />
  </div>
);

// Helper Component for Select
const FormSelect = ({ label, children, ...props }: { label: string; children: React.ReactNode;[key: string]: any }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      className="w-full border border-gray-300 bg-white p-3 rounded-lg shadow-sm focus:border-[#0E766E] focus:ring-1 focus:ring-[#0E766E] transition duration-150 appearance-none pr-10"
      {...props}
    >
      {children}
    </select>
  </div>
);
// --- END: Helper Functions and Components ---


export function AddFacilityPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, token, isHydrated } = useUserStore();

  const [facility, setFacility] = useState({
    nameEn: "",
    nameAr: "",
    taxNumber: "",
    price: "",
    categoryId: "",
    descriptionEn: "",
    descriptionAr: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    mapUrl: "",
    lat: "",
    lng: "",
  });

  const [coverPic, setCoverPic] = useState<File | string | null>(null);
  const [facilityPics, setFacilityPics] = useState<(File | string)[]>([]);

  // Fetch Categories
  useEffect(() => {
    const loadCats = async () => {
      try {
        const res = await axiosInstance.get("/category/categories");
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
      setFacility((prev) => ({
        ...prev,
        // Ensure lat/lng are set correctly, or to empty string if extraction fails
        lat: lat || "",
        lng: lng || "",
      }));
    }
  };

  const removeCover = () => setCoverPic(null);
  const removeFacilityImage = (index: number) =>
    setFacilityPics((prev) => prev.filter((_, i) => i !== index));


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 🛑 CRITICAL CHECK: Cover Image is Required
    if (!coverPic) {
      alert("Cover Image is required before submission.");
      setIsSubmitting(false);
      return;
    }

    try {
      const fd = new FormData();

      // 1. Append Text Data
      fd.append(
        "name",
        JSON.stringify({ en: facility.nameEn, ar: facility.nameAr })
      );
      fd.append(
        "description",
        JSON.stringify({ en: facility.descriptionEn, ar: facility.descriptionAr })
      );

      fd.append("taxNumber", facility.taxNumber);
      fd.append("price", facility.price);
      fd.append("categoryId", facility.categoryId);
      fd.append("email", facility.email);
      fd.append("phone", facility.phone);
      fd.append("website", facility.website);
      fd.append("address", facility.address);
      fd.append("addressLatLng", `${facility.lat},${facility.lng}`);
      fd.append("rules", JSON.stringify({ en: " " }));

      // 2. Append Cover Image (as Blob/File)
      if (coverPic) {
        const blob = await toBlob(coverPic);
        // The third argument specifies the filename, crucial for multipart form data
        fd.append("cover", blob, "cover.png");
      }

      // 3. Append Facility Images (as Blob/File array)
      for (let i = 0; i < facilityPics.length; i++) {
        const blob = await toBlob(facilityPics[i]);
        // The key "images" should be expected by the backend for an array of files
        fd.append("images", blob, `image-${i}.png`);
      }

      // 4. Send Request
      const res = await axiosInstance.post("/provider-facility/create", fd, {
        headers: {
          // Setting content-type is often unnecessary for FormData, but good practice
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });

      alert("Facility Created Successfully!");
      console.log(res.data);
    } catch (err) {
      console.error("Error creating facility:", err);
      alert("Error creating facility. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-white shadow-xl rounded-2xl my-10">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-extrabold text-[#0E766E] flex items-center">
          <Plus className="w-8 h-8 mr-3" />
          Add New Facility
        </h1>
        <p className="text-gray-500 mt-1">
          Please fill in the details below to register a new facility.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. MEDIA SECTION */}
        <section className="p-6 border border-gray-200 rounded-xl bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Image className="w-6 h-6 mr-2 text-[#0E766E]" />
            Facility Images
          </h2>

          {/* COVER IMAGE */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2 text-gray-700">
              Cover Image (Required)
            </h3>
            <div
              className="relative w-full h-64 border-2 border-dashed border-[#0E766E]/50 bg-white rounded-xl flex items-center justify-center text-[#0E766E] text-4xl cursor-pointer transition hover:bg-[#0E766E]/10 overflow-hidden"
              onClick={() => document.getElementById("coverInput")?.click()}
            >
              {coverPic ? (
                <>
                  <img
                    src={typeof coverPic === "string" ? coverPic : URL.createObjectURL(coverPic)}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCover();
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <Plus className="w-8 h-8" />
                  <span className="text-base mt-2">Click to Upload</span>
                </div>
              )}
            </div>
            <input
              id="coverInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && setCoverPic(e.target.files[0])}
            />
          </div>

          {/* FACILITY IMAGES */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-gray-700">
              Additional Facility Images
            </h3>
            <div className="flex flex-wrap gap-4">
              {facilityPics.map((file, i) => (
                <div key={i} className="relative w-32 h-32">
                  <img
                    src={typeof file === "string" ? file : URL.createObjectURL(file)}
                    alt={`Facility ${i}`}
                    className="w-full h-full object-cover rounded-xl border border-gray-300 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeFacilityImage(i)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* + box for new image */}
              <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-3xl text-gray-500 cursor-pointer hover:border-[#0E766E] hover:text-[#0E766E] transition bg-white">
                <Plus className="w-6 h-6" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files && setFacilityPics([...facilityPics, e.target.files[0]])
                  }
                  key={facilityPics.length}
                />
              </label>
            </div>
          </div>
        </section>

        {/* 2. BASIC INFO & CATEGORY SECTION */}
        <section className="p-6 border border-gray-200 rounded-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2 text-[#0E766E]" />
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput
              label="Facility Name (English)"
              placeholder="Name (EN)"
              value={facility.nameEn}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("nameEn", e.target.value)}
            />
            <FormInput
              label="Facility Name (Arabic)"
              placeholder="Name (AR)"
              value={facility.nameAr}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("nameAr", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <FormTextarea
              label="Description (English)"
              placeholder="Description (EN)"
              value={facility.descriptionEn}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("descriptionEn", e.target.value)}
            />
            <FormTextarea
              label="Description (Arabic)"
              placeholder="Description (AR)"
              value={facility.descriptionAr}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("descriptionAr", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
            <FormInput
              label="Tax Number"
              placeholder="Tax Number"
              value={facility.taxNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("taxNumber", e.target.value)}
            />
            <FormInput
              label="Estimated Price/Cost"
              placeholder="Price"
              type="number"
              value={facility.price}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("price", e.target.value)}
            />
            <FormSelect label="Main Category" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange("categoryId", e.target.value)}>
              <option value="">{loadingCats ? "Loading Categories..." : "Select Category"}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name?.en || cat.name?.ar || cat.name}
                </option>
              ))}
            </FormSelect>
          </div>
        </section>

        {/* 3. CONTACT & LOCATION SECTION */}
        <section className="p-6 border border-gray-200 rounded-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-[#0E766E]" />
            Contact & Location
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput
              label="Email Address"
              placeholder="Email"
              type="email"
              value={facility.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("email", e.target.value)}
            />
            <FormInput
              label="Phone Number"
              placeholder="Phone"
              type="tel"
              value={facility.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("phone", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <FormInput
              label="Website URL"
              placeholder="Website"
              value={facility.website}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("website", e.target.value)}
            />
            <FormInput
              label="Detailed Address"
              placeholder="Address"
              value={facility.address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("address", e.target.value)}
            />
          </div>
          <div className="mt-5">
            <FormInput
              label="Google Maps URL (for coordinates extraction)"
              placeholder="Google Maps URL (e.g., https://goo.gl/maps/@30.1234,31.5678)"
              value={facility.mapUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("mapUrl", e.target.value)}
            />
            {facility.lat && facility.lng && (
              <p className="text-sm text-green-600 mt-2 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Coordinates extracted: Lat: **{facility.lat}**, Lng: **{facility.lng}**
              </p>
            )}
          </div>
        </section>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#0E766E] hover:bg-[#0A5D57] text-white px-6 py-3 rounded-xl w-full text-lg font-semibold transition duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Submitting Facility...
            </>
          ) : (
            "Confirm and Add Facility"
          )}
        </button>
      </form>
    </div>
  );
}