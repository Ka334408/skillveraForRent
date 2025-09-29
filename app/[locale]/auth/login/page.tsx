"use client";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import LocalizedLink from "@/app/components/localized-link";
import { useRouter } from "next/navigation";

export default function Login() {
  const t = useTranslations("loginWords");
  const locale = useLocale();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      switch (role) {
        case "user":
          router.replace("/userview/Home");
          break;
        case "admin":
          router.replace("/admin/dashboard");
          break;
        case "provider":
          router.replace("/provider/dashboard");
          break;
        case "moderator":
          router.replace("/moderator/dashboard");
          break;
        default:
          router.replace("/");
      }
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(
        "/api/authentication/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            fcm: "string",
            bioAuthToken: "string",
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      const payload = data.data;
      if (!payload) {
        throw new Error("⚠ No 'data' object found in response");
      }

      const token = payload.accessToken;
      const user = payload.user;

      if (!user) {
        throw new Error("⚠ No user object found in response data");
      }

      localStorage.setItem("token", token || "");
      localStorage.setItem("email", email);
      localStorage.setItem("name", user.name);
      localStorage.setItem("image", user.image);

      const role = user.type ? user.type.toLowerCase() : null;

      if (!role) {
        throw new Error("⚠ No role type found for this user");
      }

      localStorage.setItem("role", role);

      switch (role) {
        case "user":
          router.replace("/userview/Home");
          break;
        case "admin":
          router.replace("/admin/dashboard");
          break;
        case "provider":
          router.replace("/provider/dashboard");
          break;
        case "moderator":
          router.replace("/moderator/dashboard");
          break;
        default:
          router.replace("/");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200 dark:bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 animate-bounce">
          Skillvera
        </h1>
        </div>
      </div>
    );
  }

  return (
    <main
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-gray-200 flex items-center justify-center px-4 dark:bg-[#0a0a0a]"
    >
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl min-h-[550px] flex flex-col md:flex-row overflow-hidden dark:bg-black">
        {/* Left side */}
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

        {/* Right side */}
        <div className="flex flex-col justify-center p-8 md:w-1/2 w-full">
          <h1 className="text-black text-2xl font-bold mb-2">{t("welcome")}</h1>
          <p className="text-gray-500 text-sm mb-8">{t("tagline")}</p>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
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

            <div className="flex justify-end">
              <a
                href="/auth/resetPass"
                className="text-sm text-gray-500 hover:underline whitespace-nowrap"
              >
                {t("forgot")}
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white rounded-full py-3 font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? t("loading") : t("login")}
            </button>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </form>

          <div className="mt-6 flex justify-center items-center gap-2 text-sm">
            <span className="text-gray-600">{t("no_account")}</span>
            <LocalizedLink
              href="/auth/signUp"
              className="text-blue-600 font-semibold hover:underline"
            >
              {t("signup")}
            </LocalizedLink>
          </div>
        </div>
      </div>
    </main>
  );
}