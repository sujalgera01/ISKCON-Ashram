import React, { useState } from "react";
import { loginAdmin } from "../firebase/authService";

const SAFFRON = "#C4581A";
const GOLD    = "#D4A017";
const DEEP    = "#1a0a00";

export default function AdminLogin({ onLogin, onBack }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      var result = await loginAdmin(email, password);
      onLogin(result.role);
    } catch(err) {
      var code = err.code || "";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
        setError("Invalid email or password.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait a few minutes.");
      } else if (code === "auth/network-request-failed") {
        setError("Network error. Check your internet connection.");
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
    }
    setLoading(false);
  }

  return (
    <div style={{ fontFamily: "Georgia, serif", minHeight: "100vh", background: "linear-gradient(135deg,#1a0a00 0%,#3d1a00 60%,#1a0a00 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .al-input { font-size: 15px; background: #fff9f4; border: 1px solid #e0d4c0; border-radius: 8px; padding: 11px 14px; width: 100%; color: #1a0a00; outline: none; transition: border 0.2s; }
        .al-input:focus { border-color: #C4581A; background: #fff; }
        .al-input.err { border-color: #c0392b; }
        .al-label { font-size: 12px; letter-spacing: 0.08em; color: #c4a56a; text-transform: uppercase; display: block; margin-bottom: 5px; }
        .al-btn { background: #C4581A; color: #fff; border: none; border-radius: 8px; padding: 13px 28px; font-size: 16px; cursor: pointer; width: 100%; margin-top: 6px; transition: background 0.2s; }
        .al-btn:hover { background: #a8450e; }
        .al-btn:disabled { background: #8a6040; cursor: not-allowed; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ color: GOLD, fontSize: 13, letterSpacing: "0.2em", marginBottom: 14 }}>✦ HARE KRISHNA ✦</div>
          <div style={{ color: "#fff", fontWeight: 600, fontSize: 26, letterSpacing: "0.08em" }}>ISKCON TOKYO</div>
          <div style={{ color: GOLD, fontSize: 16, fontStyle: "italic", marginTop: 2 }}>Atithi Seva Niwas</div>
          <div style={{ color: "#7a5c3a", fontSize: 12, marginTop: 8, letterSpacing: "0.12em" }}>ADMIN PORTAL — Firebase Auth</div>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: DEEP, marginBottom: 6 }}>Sign In</h2>
          <p style={{ fontSize: 14, color: "#9a7a4a", marginBottom: 24 }}>
            Access restricted to authorised ashram staff only.
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label className="al-label">Email Address</label>
              <input
                className={"al-input" + (error ? " err" : "")}
                type="email"
                value={email}
                onChange={function(e) { setEmail(e.target.value); }}
                placeholder="admin@iskcontokyo.org"
                required
              />
            </div>

            <div style={{ marginBottom: 20, position: "relative" }}>
              <label className="al-label">Password</label>
              <input
                className={"al-input" + (error ? " err" : "")}
                type={showPass ? "text" : "password"}
                value={password}
                onChange={function(e) { setPassword(e.target.value); }}
                placeholder="Password"
                required
              />
              <button type="button" onClick={function() { setShowPass(function(s) { return !s; }); }}
                style={{ position: "absolute", right: 12, top: 30, background: "none", border: "none", cursor: "pointer", color: "#9a7a4a", fontSize: 13 }}>
                {showPass ? "Hide" : "Show"}
              </button>
            </div>

            {error && (
              <div style={{ background: "#fdf0f0", border: "1px solid #e0c0c0", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 14, color: "#c0392b" }}>
                ⚠️ {error}
              </div>
            )}

            <button className="al-btn" type="submit" disabled={loading}>
              {loading ? "Signing in via Firebase..." : "Sign In to Admin Panel"}
            </button>
          </form>

          <div style={{ marginTop: 20, padding: "12px 14px", background: "#f9f3eb", borderRadius: 8, fontSize: 12, color: "#9a7a4a", lineHeight: 1.6 }}>
            🔒 Secured by Firebase Authentication. Unauthorised access is prohibited.
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#7a5c3a", fontSize: 14, cursor: "pointer" }}>
            ← Back to Booking Page
          </button>
        </div>
      </div>
    </div>
  );
}