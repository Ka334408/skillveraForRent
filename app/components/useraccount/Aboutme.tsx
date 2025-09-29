"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function ProfileCard() {
  const t = useTranslations("proPhoto");
  const [name, setName] = useState("");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router=useRouter();

  // تحميل الاسم والصورة من localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedImage = localStorage.getItem("image");

    if (storedName) setName(storedName);
    if (storedImage && storedImage !== "null") {
      setFilePreview(storedImage);
    }
  }, []);

  // يفتح input file
  const handleChoose = () => fileRef.current?.click();

  // لما يغير الصورة
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setFilePreview(url);
  };

  // لما يغير الاسم
  const handleNameChange = (value: string) => {
    setName(value);
  };

  // لما يضغط Save
  const handleSave = () => {
    localStorage.setItem("name", name);
    localStorage.setItem("image", filePreview ?? "null");
    setMessage("Profile saved successfully ✅");
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h3 className="text-2xl font-semibold mb-6">
        {t ? t("aboutTitle") : "About me"}
      </h3>

      <div className="flex flex-col md:flex-row items-start gap-10">
        {/* left card */}
        <div className="w-full md:w-1/2 lg:w-1/3">
          <div className="rounded-2xl p-6 text-center min-h-[220px] flex flex-col items-center justify-center">
            {/* صورة أو Placeholder */}
            {filePreview ? (
              <div className="rounded-lg overflow-hidden w-48 h-48 mx-auto">
                <Image
                  src={filePreview}
                  alt="avatar"
                  className="w-auto h-auto object-cover"
                  width={100}
                  height={100}
                />
              </div>
            ) : (
              <div className="w-48 h-48 flex items-center justify-center rounded-lg bg-blue-500 mx-auto">
                <svg
                  width="72"
                  height="72"
                  viewBox="0 0 24 24"
                  className="text-white opacity-90"
                >
                  <path
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                  />
                  <path
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    d="M4 20a8 8 0 0 1 16 0"
                  />
                </svg>
              </div>
            )}

            <div className="mt-4 text-black font-semibold text-lg">{name}</div>

            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              <button
                onClick={handleChoose}
                className="bg-gray-300 text-black px-5 py-2 rounded-full font-medium"
              >
                {t ? t("choose") : "Choose image"}
              </button>

              <button
                onClick={handleSave}
                className="bg-blue-800 text-white px-5 py-2 rounded-full font-medium"
              >
                {t ? t("save") : "Save"}
              </button>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />

            {message && (
              <div className="mt-3 text-sm text-green-600">{message}</div>
            )}
          </div>
        </div>

        {/* right info */}
        <div className="flex-1">
          <h4 className="text-2xl font-bold mb-3">
            {t ? t("completeTitle") : "Complete your profile"}
          </h4>
          <p className="text-gray-600 mb-4 leading-6">
            {t
              ? t("completeDesc")
              : "Add a profile picture and some info to complete your profile."}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="px-4 py-3 border rounded-lg w-full sm:flex-1"
              placeholder={t ? t("namePlaceholder") : "Your name"}
            />
            <button
              onClick={()=>router.push("/userview/userProfile")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full sm:w-auto"
            >
              {t ? t("getStarted") : "getStarted"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}