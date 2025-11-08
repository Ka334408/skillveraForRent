"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import GuestPage from "@/app/components/protectedpages/guestPage";

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
      const res = await fetch("/api/authentication/reset-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      console.log("✅ Reset API response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Reset request failed");
      }


      localStorage.setItem("resetEmail", email);
      router.push("/auth/varCode");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div><GuestPage>

      <main className="min-h-screen bg-gray-200 flex items-center justify-center px-4 dark:bg-[#0a0a0a]">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl min-h-[550px] flex flex-col md:flex-row overflow-hidden dark:bg-black">

          {/* Left side - image */}
          <div className="md:w-1/3 flex items-center justify-center p-6">
            <span className="text-gray-700">[Image]</span>
          </div>

          {/* Right side - form */}
          <div className="flex flex-col justify-center p-8 md:w-2/3 w-full">
            <h1 className="text-2xl font-bold mb-2">{t("reset")}</h1>
            <p className="text-gray-500 text-sm mb-8">{t("associated")}</p>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
              <input
                type="email"
                placeholder={t("email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded-full px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0E766E] w-full"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#0E766E] text-white rounded-full py-3 font-semibold hover:bg-[#06554e] transition disabled:opacity-50"
              >
                {loading ? "Sending..." : t("send")}
              </button>
            </form>

            {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}

            <div className="mt-6 flex justify-center items-center gap-2 text-sm">
              <Link href="/auth/login" className="text-black font-semibold hover:underline dark:text-white">
                ← {t("goBack")}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </GuestPage>
    </div>
  );
}