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
      setError("Please enter your mailId.");
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
        body: JSON.stringify({ username: user.username, email }),
      });
      const data = await res.json();
      if (!res.ok) {
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
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(to bottom, #fdf8f0 0%, #f5e6cc 40%, #e8c99a 100%)" }}>
      <div className="w-full min-h-[calc(100vh-3rem)] shadow-2xl overflow-hidden bg-white flex rounded-2xl">

        {/* Left: tab bar + form */}
        <div className="flex flex-col w-full md:w-[42%] shrink-0">

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

          {/* Form */}
          <div className="flex flex-col justify-between flex-1 px-10 pt-6 pb-10">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                Reset Password
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Enter your mailId and we&apos;ll send a reset link to your inbox
              </p>

              {submitted ? (
                <div className="mt-7 space-y-4">
                  <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-4 text-sm text-green-700">
                    <p className="font-semibold">Check your inbox!</p>
                    <p className="mt-1 text-xs text-green-600">
                      We&apos;ve sent a password reset link to <span className="font-medium">{email}</span>. The link expires in 1 hour.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/")}
                    className="w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition focus:outline-none"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-7 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      mailId
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
        </div>

        {/* Right: image spanning full height */}
        <div className="hidden md:block relative flex-1">
          <Image
            src="/team-photo.jpg"
            alt="Team collaborating"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/65 to-transparent px-10 py-10">
            <p className="text-white text-base font-light italic leading-relaxed">
              &ldquo;One place to discover, connect, and collaborate with every person in your organization.&rdquo;
            </p>
            <p className="mt-2 text-white/50 text-xs italic">— Employee Directory</p>
          </div>
        </div>
      </div>
    </div>
  );
}
