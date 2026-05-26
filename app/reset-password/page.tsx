"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { updateUserPassword } from "@/lib/idb-users";

function getPasswordStrength(pwd: string): { level: 1 | 2 | 3 | 4; label: string } | null {
  if (!pwd) return null;
  if (pwd.length < 6) return { level: 1, label: "Weak" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { level: 1, label: "Weak" };
  if (score === 2) return { level: 2, label: "Fair" };
  if (score === 3) return { level: 3, label: "Good" };
  return { level: 4, label: "Strong" };
}

const STRENGTH_COLOR: Record<number, string> = {
  1: "bg-red-400",
  2: "bg-orange-400",
  3: "bg-yellow-400",
  4: "bg-green-400",
};
const STRENGTH_TEXT: Record<number, string> = {
  1: "text-red-500",
  2: "text-orange-500",
  3: "text-yellow-600",
  4: "text-green-600",
};

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const username = searchParams.get("username") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const strength = getPasswordStrength(password);

  useEffect(() => {
    if (!token || !username) {
      setError("Invalid reset link. Please request a new one.");
    }
  }, [token, username]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || !confirm) {
      setError("Please fill in both fields.");
      return;
    }
    if (!strength || strength.level === 1) {
      setError("Password is too weak. Use 8+ chars with uppercase, numbers, or symbols.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      // Validate token server-side (also consumes it so it can't be reused)
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, username }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to validate reset link.");
        return;
      }

      // Update password in IndexedDB
      await updateUserPassword(username, password);
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "linear-gradient(145deg, #fdf6ed 0%, #f0e0c8 55%, #e5c9a0 100%)" }}
    >
      <div className="w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden bg-white">
        {/* Tab bar */}
        <div className="flex items-center gap-3 px-10 pt-7 pb-4 border-b border-gray-100">
          <button
            onClick={() => router.push("/")}
            className="cursor-pointer rounded-full px-5 py-1.5 text-xs font-medium text-gray-400 hover:bg-gray-50 transition"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/register")}
            className="cursor-pointer rounded-full px-5 py-1.5 text-xs font-medium text-gray-400 hover:bg-gray-50 transition"
          >
            Register
          </button>
        </div>

        <div className="flex">
          {/* Left: form */}
          <div className="flex flex-col justify-between w-full md:w-[42%] shrink-0 px-10 pt-6 pb-10">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                Set New Password
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Choose a new password for your account
              </p>

              {success ? (
                <div className="mt-7 space-y-4">
                  <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-4 text-sm text-green-700">
                    <p className="font-semibold">Password updated!</p>
                    <p className="mt-1 text-xs text-green-600">
                      Your password has been reset successfully. You can now sign in with your new password.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push(`/?username=${encodeURIComponent(username)}`)}
                    className="w-full rounded-xl bg-violet-200 hover:bg-violet-300 active:bg-violet-400 py-2.5 text-sm font-bold text-violet-900 transition focus:outline-none focus:ring-2 focus:ring-violet-200"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-7 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={!token || !username}
                        className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100 transition disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {strength && (
                      <div className="mt-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-colors ${i <= strength.level ? STRENGTH_COLOR[strength.level] : "bg-gray-200"}`}
                            />
                          ))}
                        </div>
                        <p className={`mt-1 text-xs font-medium ${STRENGTH_TEXT[strength.level]}`}>
                          {strength.label}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Re-enter new password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        disabled={!token || !username}
                        className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100 transition disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                        tabIndex={-1}
                      >
                        {showConfirm ? (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !token || !username}
                    className="w-full rounded-xl bg-violet-200 hover:bg-violet-300 active:bg-violet-400 py-2.5 text-sm font-bold text-violet-900 transition focus:outline-none focus:ring-2 focus:ring-violet-200 mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving…" : "Reset Password"}
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition focus:outline-none"
                  >
                    Back to Login
                  </button>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 flex items-center justify-between text-xs text-gray-400">
              <a href="#" className="hover:text-gray-600 transition">Terms</a>
              <a href="#" className="hover:text-gray-600 transition">Privacy &amp; Policy</a>
            </div>
          </div>

          {/* Right: image */}
          <div className="hidden md:block relative flex-1 rounded-3xl overflow-hidden m-3">
            <Image
              src="/team-photo.jpg"
              alt="Team collaborating"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
