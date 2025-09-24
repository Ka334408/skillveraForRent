"use client";
import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyAccount() {
  const [code, setCode] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // جاي من signup
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // handle typing inside code boxes
  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 3) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  // verify account
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const verificationCode = code.join("");
    if (verificationCode.length < 4) {
      setError("Please enter the 4-digit code");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/authentication/verify-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await res.json();
      console.log("✅ Verify response:", data);

      if (!res.ok) throw new Error(data.message || "Verification failed");

      router.push("/auth/login");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // resend code
  const handleResend = async () => {
    setError(null);
    setMessage(null);
    setResending(true);
    try {
      const res = await fetch("/api/authentication/request-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      console.log("📩 Resend response:", data);

      if (!res.ok) throw new Error(data.message || "Failed to resend code");

      setMessage("Verification code has been resent to your email");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          You're ready to go!
        </h1>
        <p className="text-gray-600 mb-6">
          Please check your mail for a verification code to complete your sign up
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                maxLength={1}
                ref={(el) => (inputsRef.current[index] = el)}
                onChange={(e) => handleChange(e.target.value, index)}
                className="w-14 h-14 text-center text-xl border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-blue-600 font-semibold hover:underline disabled:opacity-50"
          >
            {resending ? "Resending..." : "Resend"}
          </button>
        </p>
      </div>
    </main>
  );
}