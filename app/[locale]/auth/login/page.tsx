"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import LocalizedLink from "@/app/components/localized-link";

export default function Login() {
  const t = useTranslations("loginWords");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("https://reqres.in/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "reqres-free-v1"
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Invalid credentials");
      }

      const data = await res.json();
      console.log("✅ Login success:", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", email);
      window.location.href = '/userview/Home';

      alert("Login successful!");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-gray-200 flex items-center justify-center px-4 dark:bg-[#0a0a0a]">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl min-h-[550px] flex flex-col md:flex-row overflow-hidden dark:bg-black">

        {/* Left side - images */}
        <div className="md:w-1/2 grid grid-cols-2 gap-4 bg-gray-100 p-6 dark:bg-black">
          <div className="col-span-2 mt-5 bg-gray-300 rounded-xl h-40 flex items-center justify-center">
            <span className="text-gray-700">Image 1</span>
          </div>
          <div className="bg-gray-300 rounded-xl h-60 flex items-center justify-center">
            <span className="text-gray-700">Image 2</span>
          </div>
          <div className="bg-gray-300 rounded-xl h-60 flex items-center justify-center">
            <span className="text-gray-700">Image 3</span>
          </div>
        </div>

        {/* Right side - form */}
        <div className="flex flex-col justify-center p-8 md:w-1/2 w-full">
          <h1 className="text-black text-2xl font-bold mb-2">{t("welcome")}</h1>
          <p className="text-gray-500 text-sm mb-8">{t("tagline")}</p>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            <input type="email" placeholder={t("email")} value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded-full px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full" required />
            <input type="password" placeholder={t("password")} value={password} onChange={(e) => setPassword(e.target.value)} className="border rounded-full px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full" required />

            <div className="flex justify-end">
              <a href="/auth/resetPass" className="text-sm text-gray-500 hover:underline whitespace-nowrap">{t("forgot")}</a>
            </div>

            <button type="submit" disabled={loading} className="bg-blue-600 text-white rounded-full py-3 font-semibold hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? t("loading") : t("login")}
            </button>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>

          <div className="mt-6 flex justify-center items-center gap-2 text-sm">
            <span className="text-gray-600">{t("no_account")}</span>
            <LocalizedLink href="/auth/signUp" className="text-blue-600 font-semibold hover:underline">{t("signup")}</LocalizedLink>
          </div>
        </div>
      </div>
    </main>
  );
}