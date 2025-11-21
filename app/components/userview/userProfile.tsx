"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRouter } from "next/navigation";
import axios from "@/lib/axiosInstance";
import { useUserStore } from "@/app/store/userStore";

export default function ProfilePage() {
  const t = useTranslations("userprofile");
  const router = useRouter();

  const { user, setUser, token, isHydrated } = useUserStore();

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState<{ phone?: string; dob?: string }>({});
  const [loading, setLoading] = useState(false);

  // ⭐ انتظر الهيدرشن قبل تحميل الداتا
  useEffect(() => {
    if (!isHydrated) return;
    

    if (user) {
      setUsername(user.name || "");
      setPhone(user.phone || "");
      setDob(user.dob || "");
      setGender(user.gender || "");

      if (user.image) {
        if (user.image.startsWith("uploads/")) {
          setProfileImg(`/api/media?media=${user.image}`);
        } else {
          setProfileImg(user.image);
        }
      }
    }

    // Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const long = pos.coords.longitude;
          setLocation(`${lat},${long}`);
        },
        (err) => console.error("Location error:", err)
      );
    }
  }, [isHydrated]);


  const validate = () => {
    const errs: { phone?: string; dob?: string } = {};
    const phoneRegex = /^\+\d{10,15}$/;

    if (!phoneRegex.test(phone)) errs.phone = "Invalid phone number";
    if (!dob) errs.dob = "Date of Birth is required";

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

      // Update local store immediately
      setUser({
        ...user!,
        dob,
        gender,
        name: username,
        phone,
      });

      // Add image
      if (profileImg && !profileImg.startsWith("/api/media")) {
        const res = await fetch(profileImg);
        const blob = await res.blob();
        formData.append("image", blob, "profile.png");
      }

      formData.append(
        "facility",
        JSON.stringify({
          name: "string",
          addressLatLong: location,
          taxNumber: "string",
          email: "string",
          website: "string",
          phone: "+20 1159675941",
          image: "string",
        })
      );

      // ⭐ axios request بديل لـ fetch
      const response = await axios.patch(`/user/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Profile updated successfully 🎉");
      router.push("/userview/Home");
    } catch (err: any) {
      console.log("Update error:", err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6 md:p-8 flex flex-col md:flex-row gap-6">
        
        {/* Profile Card */}
        <div className="bg-[#0E766E] text-white rounded-xl p-4 w-full md:w-48 h-[150px] flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full border-2 border-white overflow-hidden bg-white">
            {profileImg ? (
              <img src={profileImg} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">👤</span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-center mt-2">
            {username || "User"}
          </h3>
        </div>

        {/* Form */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{t("title")}</h2>
          <p className="text-gray-500 text-sm mb-6">{t("desc")}</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                {t("fullName")}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-2 border-blue-400 rounded-lg p-3"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                {t("phone")}
              </label>
              <PhoneInput
                country={"eg"}
                value={phone}
                onChange={(value) => setPhone("+" + value)}
                inputProps={{ required: true }}
                containerClass="w-full"
                inputClass="!w-full !rounded-lg !p-3 !pl-12 !border-2 !border-blue-400"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                {t("dob")}
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full border-2 border-blue-400 rounded-lg p-3"
              />
              {errors.dob && (
                <p className="text-red-500 text-sm">{errors.dob}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                {t("gender")}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full border-2 border-blue-400 rounded-lg p-3"
              >
                <option value="">Select gender</option>
                <option value="male">{t("genderMale")}</option>
                <option value="female">{t("genderFemale")}</option>
                <option value="other">{t("genderOther")}</option>
              </select>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 rounded-lg text-white ${
                  loading ? "bg-gray-400" : "bg-[#0E766E] hover:bg-[#054944]"
                }`}
              >
                {loading ? "Uploading..." : t("save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}