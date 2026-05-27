"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

const CREDENTIALS = { username: "admin", password: "admin123" };

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("hub_admin") === "1") {
      router.replace("/admin");
    }
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (
        username === CREDENTIALS.username &&
        password === CREDENTIALS.password
      ) {
        localStorage.setItem("hub_admin", "1");
        router.push("/admin");
      } else {
        setError("Invalid username or password.");
        setLoading(false);
      }
    }, 600);
  }

  const inputCls =
    "w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl px-4 py-3 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/60 transition-all";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, #1e1b4b 0%, #0a0f1e 40%, #030712 100%)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 800px 600px at 50% 20%, rgba(99,102,241,0.3) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div
          className="rounded-3xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-xl p-8 shadow-2xl"
          style={{
            boxShadow:
              "0 0 0 1px rgba(99,102,241,0.1), 0 32px 64px -16px rgba(0,0,0,0.8), 0 0 60px -20px rgba(99,102,241,0.2)",
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center relative"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)",
              }}
            >
              <Zap size={26} className="text-white drop-shadow-lg" />
              <div
                className="absolute inset-0 rounded-2xl blur-lg opacity-60"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                }}
              />
            </div>
            <div className="text-center">
              <h1 className="font-extrabold text-white text-xl tracking-tight">
                Admin Panel
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 font-medium tracking-wider uppercase">
                Central Automation Hub
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-900/30 border border-red-700/40 text-red-400 text-xs px-3 py-2.5 rounded-xl">
                <AlertCircle size={13} />
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 tracking-wide">
                USERNAME
              </label>
              <input
                className={inputCls}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 tracking-wide">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  className={inputCls + " pr-11"}
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? "#4338ca"
                  : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: loading
                  ? "none"
                  : "0 0 24px rgba(99,102,241,0.4), 0 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={14} />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bottom hint */}
        <p className="text-center text-[11px] text-slate-700 mt-4">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}
