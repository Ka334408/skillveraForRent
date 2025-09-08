"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export default function VerifyCode() {
  const t = useTranslations("verify");
  const locale = useLocale();
  const router = useRouter();

  const [code, setCode] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Auto focus next input + auto submit if 4 digits
  const handleChange = async (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // focus next input
      if (value && index < code.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }

      // Auto submit if all digits filled
      if (newCode.every((digit) => digit !== "")) {
        await handleVerify(newCode.join(""));
      }
    }
  };

  // Handle backspace focus previous
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Function to verify code with API
  const handleVerify = async (verificationCode: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:4000/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: verificationCode }),
      });

      if (!res.ok) {
        throw new Error("Invalid verification code");
      }

      const data = await res.json();
      console.log("✅ Verified:", data);

      router.push("/home"); // لو صح يوديه على الصفحة الرئيسية
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/auth/login");
  };

  return (
    <main
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-[#85ADEF] flex items-center justify-center px-4"
    >
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl flex flex-col items-center justify-center p-8">
        {/* Back */}
        <button
          onClick={handleBack}
          className="self-start text-blue-600 mb-6 hover:underline"
        >
          ← {t("back")}
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-2 text-center">{t("title")}</h1>
        <p className="text-gray-500 text-sm mb-6 text-center">
          {t("subtitle")}
        </p>

        {/* Code inputs */}
        <div className="flex gap-4 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              value={digit}
              maxLength={1}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-14 h-14 text-center border-2 border-blue-400 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {/* Timer */}
        {timer > 0 ? (
          <p className="text-gray-600 text-sm">
            {t("resend", { seconds: timer })}
          </p>
        ) : (
          <button
            onClick={() => setTimer(30)}
            className="text-blue-600 text-sm hover:underline"
          >
            {t("resendBtn")}
          </button>
        )}

        {/* Error */}
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </main>
  );
}