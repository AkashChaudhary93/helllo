// src/app/login/page.js
"use client";

import { useState, useEffect } from "react"; // <--- Import useEffect
import { useRouter } from "next/navigation";
import "./login.css";

const API_URL = "https://edu-live-bcakend.vercel.app/teacher/login";

export default function LoginPage() {
  const router = useRouter();

  const [registrationId, setRegistrationId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- NEW: AUTO-LOGIN CHECK ---
  useEffect(() => {
    // Check if user is already logged in
    const storedData = localStorage.getItem("teacherData");
    
    if (storedData) {
      // If data exists, redirect immediately to dashboard
      router.push("/teacher/dashboard");
    }
  }, [router]);
  // -----------------------------

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regId: registrationId, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Save data and redirect
      localStorage.setItem("teacherData", JSON.stringify(data));
      // alert("✅ Login successful"); // Optional
      router.push("/teacher/dashboard");
      
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // If we are checking login status, you might want to return null to avoid flash
  // But for now, we render the form, and the redirect happens fast.

  return (
    <main className="login-page">
      <div className="login-grid-bg"></div>
      <div className="login-gradient-orb"></div>

      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-header">
          <div className="login-logo-circle">T</div>
          <h1 className="login-title">Teacher Portal</h1>
          <p className="login-subtitle">Access your classroom dashboard</p>
        </div>

        <div className="login-body">
          <div className="login-input-group">
            <label className="login-label">Registration ID</label>
            <div className="login-input-wrapper">
              <input
                required
                type="text"
                value={registrationId}
                onChange={(e) => setRegistrationId(e.target.value)}
                className="login-input"
                placeholder="e.g. 882190"
              />
            </div>
          </div>

          <div className="login-input-group">
            <label className="login-label">Password</label>
            <div className="login-input-wrapper">
              <input
                required
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="login-toggle"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                )}
              </button>
            </div>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? <span className="loader"></span> : "Sign In"}
          </button>

          <div className="login-footer">
            <p>Protected by Education Live Systems</p>
          </div>
        </div>
      </form>
    </main>
  );
}