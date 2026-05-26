"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getUser } from "@/lib/idb-users";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "employee123";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
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
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100 transition"
                  />
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

              {/* Social login */}
              <p className="mt-5 text-center text-xs text-gray-400">Or from:</p>
              <div className="mt-3 flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Apple
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
              </div>
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
        </div>
      </div>
    </div>
  );
}
