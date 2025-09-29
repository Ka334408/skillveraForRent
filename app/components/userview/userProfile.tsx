"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  const t = useTranslations("userprofile"); // نجيب الترجمات الخاصة بالـ profile

  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("");
  const [username, setUsername] = useState("User");
  const [profileImg, setProfileImg] = useState("");

  useEffect(() => {
    const storedPhone = localStorage.getItem("phone");
    const storedDob = localStorage.getItem("dob");
    const storedLocation = localStorage.getItem("addressLatLong"); 
    const storedGender = localStorage.getItem("gender");
    const storedUsername = localStorage.getItem("name");
    const storedProfileImg = localStorage.getItem("image") || "/herosec.jpg";

    if (storedPhone) setPhone(storedPhone);
    if (storedDob) setDob(storedDob);
    if (storedGender) setGender(storedGender);
    if (storedUsername) setUsername(storedUsername);
    if (storedProfileImg) setProfileImg(storedProfileImg);

    if (storedLocation && storedLocation !== "null") {
      setLocation(storedLocation);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
              // تحويل الـ Lat/Lng إلى Address readable
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              );
              const data = await res.json();
              const loc = data?.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
              setLocation(loc);
              localStorage.setItem("addressLatLong", loc);
            } catch {
              setLocation(t("unableLocation"));
            }
          },
          () => setLocation(t("unableLocation"))
        );
      }
    }
  }, [t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("phone", phone);
    localStorage.setItem("dob", dob);
    localStorage.setItem("gender", gender);
    alert("Profile saved ✅");
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 flex flex-col md:flex-row gap-8 items-start">
        {/* الكارت الأزرق */}
        <div className="bg-blue-600 text-white rounded-xl p-6 w-48 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center mb-3 overflow-hidden bg-white">
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
          <h3 className="text-base font-semibold text-center">{username}</h3>
        </div>

        {/* الفورم */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{t("title")}</h2>
          <p className="text-gray-500 text-sm mb-6">{t("desc")}</p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold mb-2">{t("phone")}</label>
              <input
                type="tel"
                placeholder={t("phone")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-[400px] border-2 border-blue-400 rounded-lg p-3 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">{t("dob")}</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-[400px] border-2 border-blue-400 rounded-lg p-3 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">{t("location")}</label>
              <input
                type="text"
                placeholder={t("fetchingLocation")}
                value={location}
                readOnly
                className="w-[400px] border-2 border-blue-400 rounded-lg p-3 bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">{t("gender")}</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-[400px] border-2 border-blue-400 rounded-lg p-3 focus:outline-none focus:border-blue-600"
              >
                <option value="">{t("gender")}</option>
                <option value="male">{t("genderMale")}</option>
                <option value="female">{t("genderFemale")}</option>
                <option value="other">{t("genderOther")}</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {t("save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}