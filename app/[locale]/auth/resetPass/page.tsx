"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

export default function ResetPassword() {
  const t = useTranslations("resetPassWords");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.exists) throw new Error("Email not found");

      
      console.log("✅ Reset API response:", data);
      localStorage.setItem("resetEmail",email);
      router.push("/auth/Varcode");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-200 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl min-h-[550px] flex flex-col md:flex-row overflow-hidden">
        
        {/* Left side - image */}
        <div className="md:w-1/3 flex items-center justify-center p-6">
          <span className="text-gray-700">[Image]</span>
        </div>

        {/* Right side - form */}
        <div className="flex flex-col justify-center p-8 md:w-2/3 w-full">
          <h1 className="text-2xl font-bold mb-2">{t("reset")}</h1>
          <p className="text-gray-500 text-sm mb-8">{t("associated")}</p>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            <input type="email" placeholder={t("reset")} value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded-full px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full" required />
            <button type="submit" disabled={loading} className="bg-blue-600 text-white rounded-full py-3 font-semibold hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? "Sending..." : t("send")}
            </button>
          </form>

          {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}

          <div className="mt-6 flex justify-center items-center gap-2 text-sm">
            <a href="/auth/login" className="text-black font-semibold hover:underline">← {t("goBack")}</a>
          </div>
        </div>
      </div>
    </main>
  );
}