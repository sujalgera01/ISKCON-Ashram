import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import { logoutAdmin } from "./firebase/authService";
import BookingPage from "./pages/BookingPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const ROLE_MAP = {
  "admin@iskcontokyo.com":       "superadmin",
  "coordinator@iskcontokyo.com": "coordinator",
};

function isAdminHash() {
  return window.location.hash.includes("admin-iskcon");
}

export default function App() {
  const [page, setPage] = useState(isAdminHash() ? "adminLogin" : "booking");
  const [adminRole, setAdminRole] = useState(null);
  const [checking, setChecking] = useState(true);

  // 1. Synchronize Firebase Auth with App state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && isAdminHash()) {
        const role = ROLE_MAP[user.email?.toLowerCase()] || "coordinator";
        setAdminRole(role);
        setPage("admin");
      } else if (!user && isAdminHash()) {
        // If not authenticated but on the admin hash, show AdminLogin
        setAdminRole(null);
        setPage("adminLogin");
      } else if (!isAdminHash()) {
        setAdminRole(null);
        setPage("booking");
      }
      setChecking(false);
    });
    return unsub;
  }, []);

  // 2. Synchronize manual hash changes in URL bar
  useEffect(() => {
    function onHashChange() {
      if (isAdminHash()) {
        if (!auth.currentUser) {
          setPage("adminLogin");
        } else {
          setPage("admin");
        }
      } else {
        setPage("booking");
      }
    }

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  async function handleAdminLogin(role) {
    setAdminRole(role);
    setPage("admin");
  }

  async function handleAdminLogout() {
    try {
      await logoutAdmin();
    } catch (e) {
      console.warn(e);
    }
    setAdminRole(null);
    setPage("adminLogin");
    window.location.hash = "#/admin-iskcon";
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
        onBack={() => {
          window.location.hash = "";
          setPage("booking");
        }}
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