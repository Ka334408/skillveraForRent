// components/ProfileCard.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

export default function ProfileCard() {
  const t =  useTranslations("proPhoto") ;
  const [name, setName] = useState("");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // ✅ هات النيم من localStorage أول ما الكومبوننت يترندر
  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const handleChoose = () => fileRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setFilePreview(url);
  };

  const handleUpload = async () => {
    const f = fileRef.current?.files?.[0];
    if (!f) {
      setMessage("Choose an image first");
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      // Fake upload
      const form = new FormData();
      form.append("file", f);

      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Upload failed");
      await res.json();

      const imageUrl = URL.createObjectURL(f);
      setSavedUrl(imageUrl);

      setMessage("Profile saved successfully");
    } catch (err: any) {
      setMessage(err?.message || "Error");
    } finally {
      setUploading(false);
    }
  };

  // ✅ كل مرة النيم يتغير نحفظه في localStorage
  const handleNameChange = (value: string) => {
    setName(value);
    localStorage.setItem("name", value);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h3 className="text-2xl font-semibold mb-6">
        {t ? t("aboutTitle") : "About me"}
      </h3>

      {/* flex container */}
      <div className="flex flex-col md:flex-row items-start gap-10">
        {/* left card */}
        <div className="w-full md:w-1/2 lg:w-1/3">
          <div className="rounded-2xl p-6 text-center min-h-[220px] flex flex-col items-center justify-center">
            {/* image or placeholder */}
            {filePreview || savedUrl ? (
              <div className="rounded-lg overflow-hidden w-48 h-48 mx-auto">
                <img
                  src={filePreview || savedUrl || ""}
                  alt="avatar"
                  className="w-full h-full object-cover"
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
                disabled={uploading}
              >
                {t ? t("choose") : "Choose image"}
              </button>

              <button
                onClick={handleUpload}
                className="bg-blue-800 text-white px-5 py-2 rounded-full font-medium disabled:opacity-60"
                disabled={uploading}
              >
                {uploading
                  ? t
                    ? t("uploading")
                    : "Uploading..."
                  : t
                  ? t("save")
                  : "Save"}
              </button>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
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
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full sm:w-auto">
              {t ? t("getStarted") : "Get Started"}
            </button>
          </div>

          {message && <div className="mt-3 text-sm text-gray-700">{message}</div>}
        </div>
      </div>
    </div>
  );
}