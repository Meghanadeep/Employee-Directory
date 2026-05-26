"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { saveUser, getUser } from "@/lib/idb-users";

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

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"employee" | "manager">("employee");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const strength = getPasswordStrength(password);

  async function checkUsername() {
    if (!username) return;
    const existing = await getUser(username);
    setUsernameError(existing ? "Username already taken." : "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !username || !email || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (usernameError) return;
    if (!strength || strength.level === 1) {
      setError("Password is too weak. Use 8+ chars with uppercase, numbers, or symbols.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const existing = await getUser(username);
      if (existing) {
        setError("Username already taken. Please choose another.");
        return;
      }
      await saveUser({ username, password, name, email, role });
      router.push("/");
    } catch {
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(to bottom, #fdf8f0 0%, #f5e6cc 40%, #e8c99a 100%)" }}>
      <div className="w-full min-h-[calc(100vh-3rem)] shadow-2xl overflow-hidden bg-white flex rounded-2xl">

        {/* LEFT: tab bar + form */}
        <div className="flex flex-col w-full md:w-[42%] shrink-0">

          {/* Tab bar */}
          <div className="flex items-center gap-3 px-10 pt-7 pb-4 border-b border-gray-100">
            <button
              onClick={() => router.push("/")}
              className="cursor-pointer rounded-full px-5 py-1.5 text-xs font-medium text-gray-400 hover:bg-gray-50 transition"
            >
              Login
            </button>
            <button className="cursor-pointer rounded-full border border-gray-300 bg-gray-50 px-5 py-1.5 text-xs font-semibold text-gray-700">
              Register
            </button>
          </div>

          {/* Form */}
          <div className="flex flex-col justify-between flex-1 px-10 pt-6 pb-10">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                Create Account
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Join the Employee Directory
              </p>
              <p className="mt-3 text-xs text-gray-400 italic leading-relaxed">
                Create your profile and become part of a connected, transparent workplace where everyone is just a search away.
              </p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    autoComplete="username"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setUsernameError(""); }}
                    onBlur={checkUsername}
                    className={`w-full rounded-xl bg-gray-50 border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${usernameError ? "border-red-300 focus:border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-violet-300 focus:ring-violet-100"}`}
                  />
                  {usernameError && (
                    <p className="mt-1 text-xs text-red-500">{usernameError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Role
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRole("employee")}
                      className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition focus:outline-none ${
                        role === "employee"
                          ? "border-stone-400 bg-stone-100 text-stone-800"
                          : "border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300"
                      }`}
                    >
                      Employee
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("manager")}
                      className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition focus:outline-none ${
                        role === "manager"
                          ? "border-stone-400 bg-stone-100 text-stone-800"
                          : "border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300"
                      }`}
                    >
                      Manager
                    </button>
                  </div>
                  {role === "manager" && (
                    <p className="mt-1 text-xs text-stone-500">Managers can view all appraisals and submit manager reviews.</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100 transition"
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
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100 transition"
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
                  disabled={loading}
                  className="w-full rounded-xl bg-violet-200 hover:bg-violet-300 active:bg-violet-400 py-2.5 text-sm font-bold text-violet-900 transition focus:outline-none focus:ring-2 focus:ring-violet-200 mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Account…" : "Create Account"}
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="mt-8 flex items-center justify-between text-xs text-gray-400">
              <a href="#" className="hover:text-gray-600 transition">Terms</a>
              <a href="#" className="hover:text-gray-600 transition">Privacy &amp; Policy</a>
            </div>
          </div>
        </div>

        {/* RIGHT: image spanning full height */}
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
              &ldquo;Join a workplace where every colleague is visible, every team is reachable, and no one is a stranger.&rdquo;
            </p>
            <p className="mt-2 text-white/50 text-xs italic">— Employee Directory</p>
          </div>
        </div>
      </div>
    </div>
  );
}
