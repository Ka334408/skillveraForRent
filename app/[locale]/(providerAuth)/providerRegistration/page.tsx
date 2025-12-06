"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import GuestPage from "@/app/components/protectedpages/guestPage";
import { CheckCircle, AlertCircle, EyeIcon, EyeOff } from "lucide-react";
import { useProviderStore } from "@/app/store/providerStore";

export default function SignUp() {
  const t = useTranslations("signup");
  const locale = useLocale();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const setSignupData = useProviderStore((s: any) => s.setSignupData);
  const setVerificationEmail = useProviderStore((s: any) => s.setVerificationEmail);

  const rules = [
    { id: 1, label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { id: 2, label: "Contains uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { id: 3, label: "Contains lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { id: 4, label: "Contains a number", test: (p: string) => /[0-9]/.test(p) },
    { id: 5, label: "Contains a special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ];

  const handleSignup = () => {
    // Validate phone: 11 digits, no letters
    const phoneDigits = phone.replace(/\D/g, " "); // remove non-digit chars
    if (phoneDigits.length !== 13) {
      setPhoneError("Phone number must be 11 digits");
      return;
    }
    setPhoneError("");

    const providerData = {
      name,
      email,
      phone: `+${phone}`,
      password,
    };

    setSignupData(providerData);
    setVerificationEmail(email);
    router.push("providerview/proType");
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

              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col space-y-5" autoComplete="off">

                <input
                  type="text"
                  placeholder={t("full_name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                  className="border rounded-full px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0E766E] w-full"
                  required
                />

                <input
                  type="email"
                  placeholder={t("email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  className="border rounded-full px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0E766E] w-full"
                  required
                />

                {/* Phone input */}
                <div className="relative">
                  <PhoneInput
                    country={"eg"}
                    value={phone}
                    onChange={(value) => {
                      setPhone(value);
                      const digits = value.replace(/\D/g, " ");
                      if (digits.length !== 13) setPhoneError("Phone number must be 11 digits");
                      else setPhoneError("");
                    }}
                    inputProps={{ name: "phone", required: true, autoComplete: "off" }}
                    placeholder="your phone"
                    inputClass="!w-full !rounded-full !py-5 !pl-17 !pr-4 !text-gray-700 !border !focus:outline-none focus:ring-2 focus:ring-[#0E766E]"
                    buttonClass="!absolute !left-0 !top-0 !bottom-0 !rounded-l-full !border !bg-transparent focus:ring-2 focus:ring-[#0E766E]"
                    containerClass="!w-full"
                  />
                  {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
                </div>

                {/* Password field */}
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setShowPasswordRules(true)}
                    onBlur={() => password === "" && setShowPasswordRules(false)}
                    autoComplete="new-password"
                    className="border rounded-full px-5 py-3 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0E766E] w-full"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeIcon size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>

                {/* Password Rules */}
                {showPasswordRules && (
                  <div className="mt-3 bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-sm space-y-2 border dark:border-gray-700">
                    <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Password must include:
                    </p>

                    {rules.map((rule) => {
                      const isValid = rule.test(password);
                      return (
                        <div
                          key={rule.id}
                          className={`flex items-center gap-2 ${isValid ? "text-green-600" : "text-gray-600 dark:text-gray-400"}`}
                        >
                          {isValid ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                          <span>{rule.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Signup button */}
                <button
                  type="button"
                  onClick={handleSignup}
                  disabled={
                    password.trim() === "" || phoneError !== "" || name.trim() === "" || email.trim() === ""
                  }
                  className={`rounded-full py-3 font-semibold transition ${
                    password.trim() === "" || phoneError !== "" || name.trim() === "" || email.trim() === ""
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-[#0E766E] text-white hover:bg-[#054e47]"
                  }`}
                >
                  {t("signup")}
                </button>
              </form>

              <p className="mt-6 text-sm text-gray-600 text-center">
                {t("have_account")}{" "}
                <Link
                  href="/proLogin"
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