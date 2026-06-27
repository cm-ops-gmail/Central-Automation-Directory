"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

const VIEWER_PASSWORD = "ops2026";

export default function ViewerLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      localStorage.getItem("hub_viewer") === "1" ||
      localStorage.getItem("hub_admin") === "1"
    ) {
      router.replace("/");
    }
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (password === VIEWER_PASSWORD) {
        localStorage.setItem("hub_viewer", "1");
        router.push("/");
      } else {
        setError("Incorrect password. Please try again.");
        setLoading(false);
      }
    }, 500);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background:
          "radial-gradient(ellipse at 50% 30%, #1e1b4b 0%, #0a0f1e 40%, #030712 100%)",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          pointerEvents: "none",
          position: "fixed",
          inset: 0,
          opacity: 0.2,
          background:
            "radial-gradient(ellipse 800px 600px at 50% 20%, rgba(99,102,241,0.3) 0%, transparent 70%)",
        }}
      />

      <div style={{ position: "relative", width: "100%", maxWidth: "360px" }}>
        {/* Card */}
        <div
          style={{
            borderRadius: "24px",
            border: "1px solid rgba(99,102,241,0.25)",
            backgroundColor: "rgba(15,23,42,0.9)",
            backdropFilter: "blur(20px)",
            padding: "40px 32px",
            boxShadow:
              "0 0 0 1px rgba(99,102,241,0.1), 0 32px 64px -16px rgba(0,0,0,0.8), 0 0 60px -20px rgba(99,102,241,0.2)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)",
                boxShadow: "0 0 24px rgba(99,102,241,0.5)",
              }}
            >
              <Lock size={24} color="white" />
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  color: "white",
                  fontWeight: 800,
                  fontSize: "20px",
                  letterSpacing: "-0.5px",
                }}
              >
                Central Automation Hub
              </div>
              <div
                style={{
                  color: "#64748b",
                  fontSize: "12px",
                  marginTop: "4px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Enter password to access
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Error */}
            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "rgba(127,29,29,0.3)",
                  border: "1px solid rgba(185,28,28,0.4)",
                  color: "#f87171",
                  fontSize: "12px",
                  padding: "10px 12px",
                  borderRadius: "12px",
                }}
              >
                <AlertCircle size={13} />
                {error}
              </div>
            )}

            {/* Password */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#64748b",
                  marginBottom: "8px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter access password"
                  required
                  autoFocus
                  style={{
                    width: "100%",
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    color: "#e2e8f0",
                    fontSize: "14px",
                    borderRadius: "12px",
                    padding: "12px 44px 12px 16px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(99,102,241,0.6)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#334155";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#64748b",
                    cursor: "pointer",
                    padding: "2px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "13px",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "14px",
                color: "white",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                background: loading
                  ? "#4338ca"
                  : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: loading
                  ? "none"
                  : "0 0 24px rgba(99,102,241,0.4), 0 4px 12px rgba(0,0,0,0.3)",
                transition: "all 0.2s",
                marginTop: "4px",
              }}
            >
              {loading ? (
                <>
                  <svg
                    style={{ animation: "spin 1s linear infinite" }}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      opacity={0.25}
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      opacity={0.75}
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Verifying...
                </>
              ) : (
                "Access Dashboard"
              )}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: "11px",
            color: "#1e293b",
            marginTop: "16px",
          }}
        >
          Authorized personnel only
        </p>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: #334155; }
      `}</style>
    </div>
  );
}
