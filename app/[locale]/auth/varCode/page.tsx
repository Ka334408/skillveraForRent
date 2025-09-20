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

  // Focus management
  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < code.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Verify manually with button
  const handleVerify = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length < code.length) {
      setError("Please enter full code");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const email = localStorage.getItem("resetEmail");
      if (!email) throw new Error("Email not found");

      const res = await fetch(
        "/api/authentication/reset-password/validate-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: verificationCode }),
        }
      );

      if (!res.ok) {
        throw new Error("Invalid verification code");
      }

      const data = await res.json();
      console.log("✅ Verified:", data);

      // Save token and email in localStorage
      const token = data?.data?.token || verificationCode;
      localStorage.setItem("resetEmail", email);
      localStorage.setItem("resetToken", token);

      router.push("/auth/setNewPass");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Resend new code
  const handleResend = async () => {
    try {
      setLoading(true);
      setError(null);

      const email = localStorage.getItem("resetEmail");

      const res = await fetch(
        "http://156.67.24.200:4000/api/authentication/reset-password/request",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) throw new Error("Failed to resend code");

      const data = await res.json();
      console.log("📩 New code sent:", data);

      setTimer(30);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/auth/resetPass");
  };

  return (
    <main
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-gray-200 flex items-center justify-center px-4 dark:bg-[#0a0a0a]"
    >
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl flex flex-col items-center justify-center p-8 dark:bg-black">
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

        {/* Verify button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "..." : t("verifyBtn")}
        </button>

        {/* Timer / Resend */}
        <div className="mt-4">
          {timer > 0 ? (
            <p className="text-gray-600 text-sm">
              {t("resend", { seconds: timer })}
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-blue-600 text-sm hover:underline"
            >
              {loading ? "..." : t("resendBtn")}
            </button>
          )}
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </main>
  );
}