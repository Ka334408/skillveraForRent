"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const t = useTranslations("userprofile");
  const router = useRouter();

  const [username, setUsername] = useState("User");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [location, setLocation] = useState("");
  const [facility, setFacility] = useState({});
  const [errors, setErrors] = useState<{ phone?: string; dob?: string }>({});
  const [loading, setLoading] = useState(false); // ✅ حالة اللودينج

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedPhone = localStorage.getItem("phone");
    const storedDob = localStorage.getItem("dob");
    const storedGender = localStorage.getItem("gender");
    const storedProfileImg = localStorage.getItem("image");
    const storedFacility = localStorage.getItem("facility");

    if (storedName) setUsername(storedName);
    if (storedPhone) setPhone(storedPhone);
    if (storedDob) setDob(storedDob);
    if (storedGender) setGender(storedGender);

    if (storedProfileImg) {
      if (storedProfileImg.startsWith("uploads/")) {
        setProfileImg(`/api/media?media=${storedProfileImg}`);
      } else {
        setProfileImg(storedProfileImg);
      }
    }

    if (storedFacility) setFacility(JSON.parse(storedFacility));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const long = pos.coords.longitude;
          setLocation(`${lat},${long}`);
        },
        (err) => {
          console.error("❌ Error getting location:", err);
        }
      );
    }
  }, []);

  const validate = () => {
    const errs: { phone?: string; dob?: string } = {};
    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(phone)) errs.phone = "Invalid phone number";
    if (!dob) errs.dob = "Date of birth is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true); // ✅ يبدأ اللودينج

    try {
      const formData = new FormData();
      formData.append("name", username);
      formData.append("email", localStorage.getItem("email") || "");
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("phone", phone);
      formData.append("addressLatLong", location);
      localStorage.setItem("gender",gender);
      localStorage.setItem("dob",dob);

      if (profileImg) {
        if (!profileImg.startsWith("/api/media")) {
          const res = await fetch(profileImg);
          const blob = await res.blob();
          formData.append("image", blob, "profile.png");
        }
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

      const response = await fetch(`/api/user/update-profile`, {
        method: "PATCH",
        headers: {
          Authorization:`Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Failed to update profile:", errorData);
        alert(`Failed to update profile: ${errorData.message}`);
        return;
      }

      const result = await response.json();
      console.log("✅ Profile updated:", result);
      alert("Profile updated successfully 🎉");
      router.push("/userview/Home");
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false); // ✅ يوقف اللودينج
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8">
        {/* الكارت الأزرق */}
        <div className="bg-[#0E766E] text-white rounded-xl p-4 w-full md:w-48 flex flex-col items-center justify-center gap-2 self-start">
          <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center overflow-hidden bg-white">
            {profileImg ? (
              <img
                src={profileImg}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl">👤</span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-center mt-2">{username}</h3>
        </div>

        {/* الفورم */}
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
                className="w-full border-2 border-blue-400 rounded-lg p-3 focus:outline-none focus:border-[#0E766E]"
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
                inputProps={{ name: "phone", required: true }}
                containerClass="w-full"
                inputClass="!w-full !rounded-lg !p-3 !pl-12 !border-2 !border-blue-400 !focus:outline-none !focus:border-[#0E766E]"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
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
                className="w-full border-2 border-blue-400 rounded-lg p-3 focus:outline-none focus:border-[#0E766E]"
              />
              {errors.dob && (
                <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
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
                className="w-full border-2 border-blue-400 rounded-lg p-3 focus:outline-none focus:border-[#0E766E]"
              >
                <option value="">Select gender</option>
                <option value="male">{t("genderMale")}</option>
                <option value="female">{t("genderFemale")}</option>
                <option value="other">{t("genderOther")}</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading} // ✅ يمنع الضغط وقت اللودينج
                className={`px-6 py-2 rounded-lg text-white transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#0E766E] hover:bg-[#054944]"
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