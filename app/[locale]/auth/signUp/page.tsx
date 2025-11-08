"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import GuestPage from "@/app/components/protectedpages/guestPage";

export default function SignUp() {
  const t = useTranslations("signup");
  const locale = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1) signup
      const res = await fetch("/api/authentication/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: `+${phone}`,
          password,
        }),
      });

      const data = await res.json();
      console.log("✅ Signup response:", data);

      if (!res.ok) throw new Error(data.message || "Sign up failed");

      // 2) request verification
      const verifyRes = await fetch("/api/authentication/request-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const verifyData = await verifyRes.json();
      console.log("📩 Request verification response:", verifyData);

      if (!verifyRes.ok)
        throw new Error(verifyData.message || "Verification request failed");

      // 3) redirect to verify page
      router.push(`/auth/verifyAccount?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message || t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <GuestPage>
        <main
          dir={locale === "ar" ? "rtl" : "ltr"}
          className="min-h-screen bg-gray-200 flex items-center justify-center px-4 dark:bg-[#0a0a0a]"
        >
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl min-h-[550px] flex flex-col md:flex-row overflow-hidden dark:bg-black">
            {/* Left side - form */}
            <div className="flex flex-col justify-center p-8 md:w-1/2 w-full">
              <h1 className="text-blue-600 text-3xl font-bold mb-4">{t("title")}</h1>
              <h2 className="text-2xl font-bold mb-6">{t("subtitle")}</h2>

              <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
                <input
                  type="text"
                  placeholder={t("full_name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border rounded-full px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0E766E] w-full"
                  required
                />
                <input
                  type="email"
                  placeholder={t("email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border rounded-full px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0E766E] w-full"
                  required
                />

                {/* Phone input */}
                <div className="relative">
                  <PhoneInput
                    country={"eg"}
                    value={phone}
                    onChange={(value) => setPhone(value)}
                    inputProps={{
                      name: "phone",
                      required: true,
                    }}
                    placeholder="your phone"
                    inputClass="!w-full !rounded-full !py-5 !pl-17 !pr-4 !text-gray-700 !border !focus:outline-none !focus:ring-2 !focus:ring-blue-400"
                    buttonClass="!absolute !left-0 !top-0 !bottom-0 !rounded-l-full !border-none !bg-transparent !focus:ring-blue-400"
                    containerClass="!w-full"
                  />
                </div>

                <input
                  type="password"
                  placeholder={t("password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border rounded-full px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0E766E] w-full"
                  required
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#0E766E] text-white rounded-full py-3 font-semibold hover:bg-[#054e47] transition disabled:opacity-50"
                >
                  {loading ? "Signing Up..." : t("signup")}
                </button>
              </form>

              {error && (
                <p className="text-red-500 text-sm text-center mt-3">{error}</p>
              )}

              <p className="mt-6 text-sm text-gray-600 text-center">
                {t("have_account")}{" "}
                <Link
                  href="/auth/login"
                  className="text-[#0E766E] font-semibold hover:underline"
                >
                  {t("login")}
                </Link>
              </p>
            </div>

            {/* Right side - image */}
            <div className="md:w-1/2 flex items-center justify-center p-6">
              <span className="text-gray-700">[Image]</span>
            </div>
          </div>
        </main>
      </GuestPage>
    </div>
  );
}