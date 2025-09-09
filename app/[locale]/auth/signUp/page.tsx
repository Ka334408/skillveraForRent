"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function SignUp() {
  const t = useTranslations("signup");
  const locale = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) throw new Error("Sign up failed");

      const data = await res.json();
      console.log("✅ Signup response:", data);

      router.push("/login");
    } catch (err: any) {
      setError(err.message || t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-200 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl min-h-[550px] flex flex-col md:flex-row overflow-hidden">
        
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
              className="border rounded-full px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              required
            />
            <input
              type="email"
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-full px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              required
            />
            <input
              type="password"
              placeholder={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded-full px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white rounded-full py-3 font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Signing Up..." : t("signup")}
            </button>
          </form>

          {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}

          <p className="mt-6 text-sm text-gray-600 text-center">
            {t("have_account")}{" "}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
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
  );
}