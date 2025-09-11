"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const t = useTranslations("resetPasswordWords");
  const locale = useLocale();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t("not_match"));
      return;
    }

    setLoading(true);

    try {
      const email=localStorage.getItem("resetEmail");
      if(!email)throw new Error("No Email found !.")
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email,password }),
      });

      if (!res.ok) {
        throw new Error("Failed to reset password");
      }

      router.push("/auth/login");
    } catch (err: any) {
      setError(err.message || t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-gray-200 flex items-center justify-center px-4 dark:bg-[#0a0a0a]"
    >
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl min-h-[500px] flex flex-col items-center justify-center p-10 dark:bg-black">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800 dark:text-white">
          {t("title")}
        </h1>
        <p className="text-sm text-center text-gray-500 mb-8">
          {t("subtitle")}
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-5 w-full max-w-md"
        >
          <input
            type="password"
            placeholder={t("new_password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-full px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            required
          />
          <input
            type="password"
            placeholder={t("confirm_password")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border rounded-full px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white rounded-full py-3 font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? t("loading") : t("button")}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
        </form>
      </div>
    </main>
  );
}