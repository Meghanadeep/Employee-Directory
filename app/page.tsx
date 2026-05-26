"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { getUser } from "@/lib/idb-users";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "employee123";

function LoginForm() {
  const searchParams = useSearchParams();
  const prefillUsername = searchParams.get("username") ?? "";

  const [login, setLogin] = useState(prefillUsername);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    sessionStorage.removeItem("isLoggedIn");
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!login || !password) {
      setError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    try {
      const isAdmin = login === ADMIN_USERNAME && password === ADMIN_PASSWORD;
      const idbUser = !isAdmin ? await getUser(login) : null;
      const isRegistered = idbUser !== null && idbUser.password === password;
      if (!isAdmin && !isRegistered) {
        setError("Invalid username or password.");
        return;
      }
      setError("");
      sessionStorage.setItem("isLoggedIn", "true");
      router.push("/employees");
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(to bottom, #fdf8f0 0%, #f5e6cc 40%, #e8c99a 100%)" }}>
      {/* Floating modal card */}
      <div className="w-full min-h-[calc(100vh-3rem)] shadow-2xl overflow-hidden bg-white flex rounded-2xl">

        {/* ── LEFT: tab bar + form ── */}
        <div className="flex flex-col w-full md:w-[42%] shrink-0">

          {/* ── TOP: Login / Register tab bar ── */}
          <div className="flex items-center gap-3 px-10 pt-7 pb-4 border-b border-gray-100">
            <button className="cursor-pointer rounded-full border border-gray-300 bg-gray-50 px-5 py-1.5 text-xs font-semibold text-gray-700">
              Login
            </button>
            <button
              onClick={() => router.push("/register")}
              className="cursor-pointer rounded-full px-5 py-1.5 text-xs font-medium text-gray-400 hover:bg-gray-50 transition"
            >
              Register
            </button>
          </div>

          {/* ── FORM ── */}
          <div className="flex flex-col justify-between flex-1 px-10 pt-6 pb-10">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                Employee Directory
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Sign in with your company login
              </p>
              <p className="mt-3 text-xs text-gray-400 italic leading-relaxed">
                Your company&apos;s central hub for finding colleagues, exploring teams, and connecting with the people who make work happen.
              </p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    autoComplete="username"
                    placeholder="Enter username"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
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
                  <div className="flex justify-end mt-1.5">
                    <a href="/forgot-password" className="text-xs text-gray-400 hover:text-violet-600 transition">
                      Forgot password?
                    </a>
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
                  {loading ? "Signing in…" : "Submit"}
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

        {/* ── RIGHT: image spanning full height ── */}
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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
