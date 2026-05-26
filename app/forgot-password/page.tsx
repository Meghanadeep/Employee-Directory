"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getUserByEmail } from "@/lib/idb-users";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      setError("Please enter your Gmail ID.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const user = await getUserByEmail(email);
      if (!user) {
        setError("No account found with this email address.");
        return;
      }
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, username: user.username }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(145deg, #fdf6ed 0%, #f0e0c8 55%, #e5c9a0 100%)" }}>
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
                Reset Password
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Enter your Gmail ID and we&apos;ll send a reset link to your inbox
              </p>

              {submitted ? (
                <div className="mt-7 space-y-4">
                  <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-4 text-sm text-green-700">
                    <p className="font-semibold">Check your inbox</p>
                    <p className="mt-1 text-xs text-green-600">
                      A password reset link has been sent to <span className="font-medium">{email}</span>. Check your Gmail inbox (and spam folder).
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/")}
                    className="w-full rounded-xl bg-violet-200 hover:bg-violet-300 active:bg-violet-400 py-2.5 text-sm font-bold text-violet-900 transition focus:outline-none focus:ring-2 focus:ring-violet-200"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-7 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Gmail ID
                    </label>
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="Enter your Gmail address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100 transition"
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-violet-200 hover:bg-violet-300 active:bg-violet-400 py-2.5 text-sm font-bold text-violet-900 transition focus:outline-none focus:ring-2 focus:ring-violet-200 mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending…" : "Send Reset Link"}
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
