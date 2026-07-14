import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import { logoutAdmin } from "./firebase/authService";
import BookingPage from "./pages/BookingPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";


const ROLE_MAP = {
  "admin@iskcontokyo.org":       "superadmin",
  "coordinator@iskcontokyo.org": "coordinator",
};

function getHash() {
  return window.location.hash === "#/admin-iskcon";
}

export default function App() {
  const [page,      setPage]      = useState(getHash() ? "adminLogin" : "booking");
  const [adminRole, setAdminRole] = useState(null);
  const [checking,  setChecking]  = useState(true);

  // Listen to Firebase auth state — if already logged in, go straight to dashboard
  useEffect(function() {
    var unsub = onAuthStateChanged(auth, function(user) {
      if (user && getHash()) {
        var role = ROLE_MAP[user.email] || "coordinator";
        setAdminRole(role);
        setPage("admin");
      }
      setChecking(false);
    });
    return unsub;
  }, []);

  // Listen for hash changes
  useEffect(function() {
    function onHash() {
      if (getHash() && page !== "admin") setPage("adminLogin");
      else if (!getHash()) setPage("booking");
    }
    window.addEventListener("hashchange", onHash);
    return function() { window.removeEventListener("hashchange", onHash); };
  }, [page]);

  async function handleAdminLogin(role) {
    setAdminRole(role);
    setPage("admin");
  }

  async function handleAdminLogout() {
    try { await logoutAdmin(); } catch(e) { console.warn(e); }
    setAdminRole(null);
    setPage("booking");
    window.location.hash = "";
  }

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", background: "#1a0a00", display: "flex", alignItems: "center", justifyContent: "center", color: "#D4A017", fontFamily: "Georgia, serif", fontSize: 18 }}>
        🪷 Loading...
      </div>
    );
  }

  if (page === "adminLogin") {
    return (
      <AdminLogin
        onLogin={handleAdminLogin}
        onBack={function() { window.location.hash = ""; setPage("booking"); }}
      />
    );
  }

  if (page === "admin") {
    return (
      <AdminDashboard
        role={adminRole}
        onLogout={handleAdminLogout}
      />
    );
  }

  return <BookingPage />;
}