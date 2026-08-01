import React, { useState, useEffect } from "react";
import {
  getAllBookings, approveBooking, rejectBooking,
  checkInBooking, checkOutBooking, markNoShow, createBooking
} from "../firebase/bookingService";
import { sendApprovalEmail, sendRejectionEmail } from "../firebase/emailService";
import { sendApprovalWhatsAppNotification, sendRejectionWhatsAppNotification } from "../firebase/whatsappService";
import { doc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { generateBookingPDF } from "../firebase/pdfService";

const SAFFRON = "#C4581A";
const GOLD    = "#D4A017";
const DEEP    = "#1a0a00";
const GREEN   = "#2e7d52";
const RED     = "#c0392b";

function sanitizeIdNumber(val) {
  return (val || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

const STATUS_COLORS = {
  pending:    { bg: "#fff8e6", border: "#f0c040", text: "#8a6010", label: "Pending" },
  waiting:    { bg: "#f3e5f5", border: "#ab47bc", text: "#6a1b9a", label: "Waiting List" },
  approved:   { bg: "#eafaf1", border: "#60c080", text: "#2e7d52", label: "Approved" },
  rejected:   { bg: "#fdf0f0", border: "#e08080", text: "#c0392b", label: "Rejected" },
  checkedin:  { bg: "#e8f4ff", border: "#6090e0", text: "#1a4a8a", label: "Checked In" },
  checkedout: { bg: "#f4f4f4", border: "#c0c0c0", text: "#606060", label: "Checked Out" },
  noshow:     { bg: "#f5f5f5", border: "#b0bec5", text: "#37474f", label: "No Show" },
};

function StatusBadge({ status }) {
  var s = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span style={{ background: s.bg, border: "1px solid " + s.border, color: s.text, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 500, display: "inline-block" }}>
      {s.label}
    </span>
  );
}

function SectionHead({ children }) {
  return (
    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 10, color: "#7a5c3a", paddingBottom: 6, borderBottom: "1px solid #f0e8d8" }}>
      {children}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14, borderBottom: "0.5px solid #f0e8d8" }}>
      <span style={{ color: "#7a5c3a", flexShrink: 0, paddingRight: 12 }}>{label}</span>
      <span style={{ fontWeight: 500, textAlign: "right" }}>{value || "—"}</span>
    </div>
  );
}

function BookingRow({ booking: b, onClick }) {
  let roomString = "";
  if (b.stay) {
    if (b.stay.room1_checked) roomString += "Vrindavan ";
    if (b.stay.room2_checked) roomString += "Mayapur ";
    if (b.stay.room3_checked) roomString += "J.Puri ";
    if (b.stay.room4_checked) roomString += "Dwarka";
    if (!roomString.trim()) roomString = b.stay.roomsCount ? `${b.stay.roomsCount} room(s)` : "—";
  }

  return (
    <div onClick={onClick} style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: 10, padding: "14px 18px", marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 160 }}>
        <div style={{ fontWeight: 600, fontSize: 16 }}>{b.guest && b.guest.full_name}</div>
        <div style={{ fontSize: 12, color: "#9a7a4a", marginTop: 2 }}>
          {b.id} · {b.stay && b.stay.checkin} → {b.stay && b.stay.checkout}
        </div>
      </div>
      <div style={{ fontSize: 13, color: "#7a5c3a" }}>
        {b.stay && b.stay.guestsCount} guest(s) · {roomString}
      </div>
      <div style={{ fontSize: 14, fontWeight: 500, color: SAFFRON }}>
        ¥{(b.total || 0).toLocaleString()}
      </div>
      <StatusBadge status={b.status} />
      <div style={{ color: "#9a7a4a", fontSize: 18 }}>›</div>
    </div>
  );
}

function OccupancyCalendar({ bookings, blockedDates }) {
  var today = new Date();
  var days = Array.from({ length: 60 }, function(_, i) {
    var d = new Date(today);
    d.setDate(today.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  function getStatus(date, roomId) {
    if (blockedDates.includes(date)) return "blocked";
    
    var occupied = bookings.some(function(b) {
      return b.stay && b.stay.checkin <= date && b.stay.checkout > date &&
        (b.status === "approved" || b.status === "checkedin") &&
        b.stay[roomId + "_checked"] === true;
    });

    return occupied ? "occupied" : "free";
  }

  var colors = { free: "#d4f0d4", occupied: "#f0c0c0", blocked: "#e0e0e0" };
  var labels = { free: "Free", occupied: "Occupied", blocked: "Blocked" };
  var todayStr = today.toISOString().split("T")[0];

  return (
    <div>
      <div style={{ display: "flex", gap: 14, marginBottom: 16, fontSize: 13 }}>
        {["free", "occupied", "blocked"].map(function(k) {
          return (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: colors[k] }} />
              <span style={{ color: "#7a5c3a" }}>{labels[k]}</span>
            </div>
          );
        })}
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12 }}>
          <thead>
            <tr>
              {["Date", "R1 — Vrindavan", "R2 — Mayapur", "R3 — J.Puri", "R4 — Dwarka"].map(function(h) {
                return <th key={h} style={{ padding: "6px 10px", color: "#7a5c3a", textAlign: "left", fontWeight: 500 }}>{h}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {days.map(function(date) {
              var isToday = date === todayStr;
              return (
                <tr key={date} style={{ background: isToday ? "#fff8f0" : "transparent" }}>
                  <td style={{ padding: "5px 10px", borderBottom: "0.5px solid #f0e8d8", fontWeight: isToday ? 600 : 400, color: isToday ? SAFFRON : DEEP }}>
                    {date}{isToday ? " ← today" : ""}
                  </td>
                  {["room1", "room2", "room3", "room4"].map(id => {
                    var st = getStatus(date, id);
                    return (
                      <td key={id} style={{ padding: "5px 10px", borderBottom: "0.5px solid #f0e8d8" }}>
                        <span style={{ background: colors[st], borderRadius: 4, padding: "2px 8px", fontSize: 11 }}>{labels[st]}</span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminDashboard({ role, onLogout }) {
  const [bookings, setBookings]         = useState([]);
  const [blacklist, setBlacklist]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [view, setView]                 = useState("dashboard");
  const [selectedId, setSelectedId]     = useState(null);
  const [filter, setFilter]             = useState("all");
  const [rejectModal, setRejectModal]   = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [infoModal, setInfoModal]       = useState(false);
  const [infoMsg, setInfoMsg]           = useState("");
  const [blockedDates, setBlockedDates] = useState([]);
  const [blockDate, setBlockDate]       = useState("");
  const [blEmail, setBlEmail]           = useState("");
  const [blIdNum, setBlIdNum]           = useState("");
  
  const [manualForm, setManualForm]     = useState({ name: "", email: "", phone: "", id_number: "", checkin: "", checkin_time: "15:00", checkout: "", checkout_time: "11:00", guests: "1", purpose: "seva", notes: "" });
  const [toast, setToast]               = useState({ msg: "", type: "success" });

  const ROOMS_CATALOG = [
    { id: "room1", name: "Room 1 — Vrindavan" },
    { id: "room2", name: "Room 2 — Mayapur" },
    { id: "room3", name: "Room 3 — Jagannath Puri" },
    { id: "room4", name: "Room 4 — Dwarka" }
  ];

  var isSuperAdmin = role === "superadmin";
  var selected = bookings.find(function(b) { return b.id === selectedId; });

  async function loadData() {
    setLoading(true);
    try {
      var data = await getAllBookings();
      data.sort((x, y) => (x.submittedAt || "").localeCompare(y.submittedAt || ""));
      setBookings(data);
      
      const bSnap = await getDocs(collection(db, "blacklist"));
      setBlacklist(bSnap.docs.map(d => d.data()));
    } catch(err) { showToast(err.message, "error"); }
    setLoading(false);
  }

  useEffect(function() { loadData(); }, []);

  function showToast(msg, type) {
    setToast({ msg: msg, type: type || "success" });
    setTimeout(function() { setToast({ msg: "", type: "success" }); }, 4000);
  }

  function isUserBlacklisted(b) {
    if (!b || !b.guest) return false;
    const email = (b.guest.email || "").trim().toLowerCase();
    const idNum = (b.guest.id_number || "").trim().toLowerCase();
    return blacklist.some(x => {
      const bEmail = (x.email || "").trim().toLowerCase();
      const bId = (x.id_number || "").trim().toLowerCase();
      return (bEmail && bEmail === email) || (bId && bId === idNum);
    });
  }

  // --- IMMEDIATE STATE UPDATE ON APPROVAL ---
  async function handleApprove(id) {
    const targetBooking = bookings.find(b => b.id === id);
    try {
      await approveBooking(id, isSuperAdmin ? "Super Admin" : "Coordinator");
      
      // 1. Immediately update state locally so UI updates right now
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "approved" } : b));
      
      showToast("Stay approved! Status updated to Approved.");

      // 2. Send Email & WhatsApp in the background
      if (targetBooking) {
        sendApprovalEmail(targetBooking).catch(err => console.error("Email dispatch failed:", err));
        sendApprovalWhatsAppNotification(targetBooking).catch(err => console.error("WhatsApp dispatch failed:", err));
      }

      // 3. Re-fetch from database to ensure complete sync
      loadData();
    } catch(err) { 
      showToast(err.message, "error"); 
    }
  }

  // --- IMMEDIATE STATE UPDATE ON REJECTION ---
  async function handleReject(id) {
    const targetBooking = bookings.find(b => b.id === id);
    const reason = rejectReason || "Requested dates or rooms are currently unavailable.";
    try {
      await rejectBooking(id, reason);
      
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "rejected" } : b));
      setRejectModal(false); 
      setRejectReason(""); 
      showToast("Booking rejected.");

      if (targetBooking) {
        sendRejectionEmail(targetBooking, reason).catch(err => console.error("Email rejection dispatch failed:", err));
        sendRejectionWhatsAppNotification(targetBooking, reason).catch(err => console.error("WhatsApp rejection dispatch failed:", err));
      }

      loadData();
    } catch(err) { showToast(err.message, "error"); }
  }

  // --- IMMEDIATE STATE UPDATE ON CHECKIN ---
  async function handleCheckin(id) {
    try { 
      await checkInBooking(id); 
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "checkedin" } : b));
      showToast("Guest checked in."); 
      loadData(); 
    } catch(err) { showToast(err.message, "error"); }
  }

  // --- IMMEDIATE STATE UPDATE ON CHECKOUT ---
  async function handleCheckout(id) {
    try { 
      await checkOutBooking(id); 
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "checkedout" } : b));
      showToast("Guest checked out."); 
      loadData(); 
    } catch(err) { showToast(err.message, "error"); }
  }

  // --- IMMEDIATE STATE UPDATE ON NO SHOW ---
  async function handleNoShow(id) {
    try { 
      await markNoShow(id); 
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "noshow" } : b));
      showToast("Marked as No Show."); 
      loadData(); 
    } catch(err) { showToast(err.message, "error"); }
  }

  async function addPersonToBlacklist() {
    if (!blEmail.trim() && !blIdNum.trim()) return;
    try {
      const docKey = blEmail.trim().toLowerCase() || blIdNum.trim().toLowerCase();
      await setDoc(doc(db, "blacklist", docKey), { 
        email: blEmail.trim().toLowerCase(), 
        id_number: sanitizeIdNumber(blIdNum) 
      });
      setBlEmail(""); setBlIdNum(""); 
      await loadData();
      showToast("Committed profile to security blacklist.");
    } catch(e) { showToast(e.message, "error"); }
  }

  async function handleManualBooking() {
    var f = manualForm;
    if (!f.name || !f.email || !f.checkin || !f.checkout) {
      showToast("Please fill all required fields.", "error"); return;
    }
    try {
      var nights = Math.round((new Date(f.checkout) - new Date(f.checkin)) / 86400000);
      var guests = parseInt(f.guests, 10);
      
      var data = {
        stay: { 
          checkin: f.checkin, checkin_time: f.checkin_time, 
          checkout: f.checkout, checkout_time: f.checkout_time, 
          guestsCount: f.guests,
          room1_checked: guests >= 1, room2_checked: guests > 2, room3_checked: guests > 4, room4_checked: guests > 6
        },
        guest: { full_name: f.name, email: f.email.toLowerCase(), phone: f.phone, id_number: sanitizeIdNumber(f.id_number) || "—", id_filename: "Manual Backoffice Log Entry", country: "—", city: "—", address: "—", age: "—", gender: "—", first_visit: "—", initiated: "—" },
        coGuests: [],
        purpose: { type: f.purpose, prasadam: "yes", requested_by: "organization", recommender_name: f.notes, recommender_contact: "", medical: "", special: f.notes },
        nights: nights, total: f.purpose === "seva" ? (nights * 2000 * guests) : (nights * 7000 * (guests > 2 ? 2 : 1)), deposit: 0, balance: 0,
        isManual: true, status: "approved",
        approvedAt: new Date().toISOString().split("T")[0], approvedBy: "Admin (Manual Entry)",
      };
      
      await createBooking(data);
      setManualForm({ name: "", email: "", phone: "", id_number: "", checkin: f.checkin, checkin_time: "15:00", checkout: f.checkout, checkout_time: "11:00", guests: "1", purpose: "seva", notes: "" });
      await loadData(); 
      showToast("Manual booking entry pushed live."); 
      setView("list");
    } catch(err) { showToast(err.message, "error"); }
  }

  var counts = {
    all:        bookings.length,
    pending:    bookings.filter(b => b.status === "pending").length,
    waiting:    bookings.filter(b => b.status === "waiting").length,
    approved:   bookings.filter(b => b.status === "approved").length,
    checkedin:  bookings.filter(b => b.status === "checkedin").length,
    rejected:   bookings.filter(b => b.status === "rejected").length,
    checkedout: bookings.filter(b => b.status === "checkedout").length,
  };

  var filtered  = filter === "all" ? bookings : bookings.filter(b => b.status === filter);
  var todayStr  = new Date().toISOString().split("T")[0];
  var todayArr  = bookings.filter(b => b.stay && b.stay.checkin === todayStr && b.status === "approved");
  var todayDep  = bookings.filter(b => b.stay && b.stay.checkout === todayStr && b.status === "checkedin");

  var css = [
    "* { box-sizing: border-box; margin: 0; padding: 0; }",
    "body { background: #f5f0e8; }",
    ".ad-input { font-size: 14px; background: #fff; border: 1px solid #e0d4c0; border-radius: 6px; padding: 8px 12px; width: 100%; color: #1a0a00; outline: none; }",
    ".ad-input:focus { border-color: #C4581A; }",
    ".ad-label { font-size: 12px; letter-spacing: 0.06em; color: #7a5c3a; text-transform: uppercase; display: block; margin-bottom: 4px; }",
    ".ad-field { margin-bottom: 12px; }",
    ".btn-approve { background: #2e7d52; color: #fff; border: none; border-radius: 7px; padding: 9px 18px; font-size: 14px; cursor: pointer; }",
    ".btn-approve:hover { background: #245f3e; }",
    ".btn-reject { background: #c0392b; color: #fff; border: none; border-radius: 7px; padding: 9px 18px; font-size: 14px; cursor: pointer; }",
    ".btn-reject:hover { background: #a02020; }",
    ".btn-action { background: #fff; color: #C4581A; border: 1.5px solid #C4581A; border-radius: 7px; padding: 8px 16px; font-size: 14px; cursor: pointer; }",
    ".btn-action:hover { background: #fdf0e4; }",
    ".btn-primary { background: #C4581A; color: #fff; border: none; border-radius: 7px; padding: 9px 20px; font-size: 14px; cursor: pointer; }",
    ".btn-primary:hover { background: #a8450e; }",
    ".btn-pdf { background: #1a4a8a; color: #fff; border: none; border-radius: 7px; padding: 9px 16px; font-size: 14px; cursor: pointer; }",
    ".nav-tab { background: none; border: none; padding: 10px 18px; font-size: 14px; cursor: pointer; border-bottom: 2px solid transparent; color: #9a7a4a; }",
    ".nav-tab.active { color: #C4581A; border-bottom-color: #C4581A; font-weight: 500; }",
    ".stat-card { background: #fff; border-radius: 12px; padding: 18px 20px; border: 1px solid #e8ddd0; cursor: pointer; }",
    ".stat-card:hover { border-color: #C4581A; }",
    ".modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }",
    ".modal { background: #fff; border-radius: 14px; padding: 28px; max-width: 480px; width: 100%; }",
  ].join(" ");

  return (
    <div style={{ fontFamily: "Georgia, serif", minHeight: "100vh", background: "#f5f0e8", color: DEEP }}>
      <style>{css}</style>

      {/* TOP NAVIGATION HEADER */}
      <div style={{ background: DEEP, borderBottom: "3px solid " + GOLD, padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 60 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22 }}>🪷</span>
          <div>
            <div style={{ color: GOLD, fontWeight: 600, fontSize: 15, letterSpacing: "0.08em" }}>ISKCON TOKYO — ADMIN</div>
            <div style={{ color: "#c4a56a", fontSize: 11 }}>{isSuperAdmin ? "👑 SUPER ADMIN" : "🌸 MATAJI COORDINATOR"}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={loadData} style={{ background: "none", border: "1px solid #5a3a10", color: "#c4a56a", fontSize: 12, cursor: "pointer", padding: "4px 10px", borderRadius: 6 }}>🔄 Refresh</button>
          <span style={{ color: "#7a5c3a", fontSize: 13 }}>{todayStr}</span>
          <button onClick={onLogout} style={{ background: "none", border: "1px solid #7a5c3a", color: "#c4a56a", fontSize: 13, cursor: "pointer", padding: "4px 14px", borderRadius: 6 }}>Sign Out</button>
        </div>
      </div>

      {/* SYSTEM CONTROLLER TABS */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e0d4c0", padding: "0 24px", display: "flex", gap: 4, overflowX: "auto" }}>
        {[
          { id: "dashboard", label: "📊 Dashboard" },
          { id: "list",      label: "📋 All Applications" },
          { id: "calendar",  label: "🗓️ Occupancy Matrix" },
          { id: "blacklist", label: "🚫 Blacklist Policy" },
        ].concat(isSuperAdmin ? [{ id: "manual", label: "✏️ Manual Override" }, { id: "block", label: "🔒 Block Dates" }] : [])
        .map(tab => (
          <button key={tab.id} className={"nav-tab" + (view === tab.id ? " active" : "")} onClick={() => setView(tab.id)}>{tab.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 20px 60px" }}>
        {loading && <div style={{ textAlign: "center", padding: 40 }}>🪷 Syncing Firestore Log Layers...</div>}

        {/* VIEW A: DASHBOARD PANEL */}
        {!loading && view === "dashboard" && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 14 }}>Dashboard Summary</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
              {[
                { label: "Pending", value: counts.pending, icon: "⏳", color: "#8a6010", status: "pending" },
                { label: "Waiting List", value: counts.waiting, icon: "💜", color: "#6a1b9a", status: "waiting" },
                { label: "Approved Stays", value: counts.approved, icon: "✅", color: GREEN, status: "approved" },
                { label: "Checked In", value: counts.checkedin, icon: "🛎️", color: "#1a4a8a", status: "checkedin" },
              ].map(c => (
                <div key={c.label} className="stat-card" onClick={() => { setFilter(c.status); setView("list"); }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{c.icon}</div>
                  <div style={{ fontSize: 26, fontWeight: 600, color: c.color }}>{c.value}</div>
                  <div style={{ fontSize: 13, color: "#9a7a4a" }}>{c.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div style={{ background: "#eafaf1", border: "1px solid #60c080", borderRadius: 12, padding: "16px 18px" }}>
                <div style={{ fontWeight: 600, fontSize: 16, color: GREEN, marginBottom: 10 }}>🛎️ Today Arrivals ({todayArr.length})</div>
                {todayArr.length === 0 ? <div style={{ fontSize: 14, color: "#9a7a4a" }}>No arrivals today.</div> : todayArr.map(b => <div key={b.id} style={{ fontSize: 14, padding: "3px 0" }}><strong>{b.guest?.full_name}</strong> — {b.stay?.guestsCount} devotee(s)</div>)}
              </div>
              <div style={{ background: "#fff8e6", border: "1px solid #f0c040", borderRadius: 12, padding: "16px 18px" }}>
                <div style={{ fontWeight: 600, fontSize: 16, color: "#8a6010", marginBottom: 10 }}>👋 Today Departures ({todayDep.length})</div>
                {todayDep.length === 0 ? <div style={{ fontSize: 14, color: "#9a7a4a" }}>No departures today.</div> : todayDep.map(b => <div key={b.id} style={{ fontSize: 14, padding: "3px 0" }}><strong>{b.guest?.full_name}</strong> — Ref: {b.id}</div>)}
              </div>
            </div>

            {counts.pending > 0 && (
              <div style={{ marginTop: 20 }}>
                <h3 style={{ fontSize: 16, color: SAFFRON, marginBottom: 10 }}>⏳ Waiting Applications (First-Come, First-Served)</h3>
                {bookings.filter(b => b.status === "pending").map(b => (
                  <div key={b.id} onClick={() => { setSelectedId(b.id); setView("detail"); }} style={{ background: isUserBlacklisted(b) ? "#fff0f0" : "#fff", border: isUserBlacklisted(b) ? "1px solid " + RED : "1px solid #e8ddd0", padding: 14, borderRadius: 10, cursor: "pointer", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div><strong>{b.guest?.full_name}</strong> {isUserBlacklisted(b) && <span style={{ background: RED, color: "#fff", fontSize: 11, padding: "2px 6px", borderRadius: 4, marginLeft: 8 }}>⚠️ BLACKLIST MATCH</span>}<div style={{ fontSize: 12, color: "#9a7a4a", marginTop: 2 }}>ID: {b.id} · Filed: {b.submittedAt}</div></div>
                    <StatusBadge status={b.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW B: QUEUE LISTING SCREEN */}
        {!loading && view === "list" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
              <h2 style={{ fontSize: 22, fontWeight: 600 }}>All Registrations</h2>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["all","pending","waiting","approved","checkedin","rejected","checkedout"].map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? SAFFRON : "#fff", color: filter === f ? "#fff" : "#7a5c3a", border: "1px solid " + (filter === f ? SAFFRON : "#e0d4c0"), borderRadius: 20, padding: "5px 14px", fontSize: 13, cursor: "pointer", textTransform: "capitalize" }}>
                    {f === "all" ? `All (${counts.all})` : `${STATUS_COLORS[f]?.label || f} (${counts[f] || 0})`}
                  </button>
                ))}
              </div>
            </div>
            {filtered.length === 0 ? <div style={{ textAlign: "center", color: "#9a7a4a", padding: 30 }}>No applications found.</div> : filtered.map(b => <BookingRow key={b.id} booking={b} onClick={() => { setSelectedId(b.id); setView("detail"); }} />)}
          </div>
        )}

        {/* VIEW C: FULL DETAIL VIEW */}
        {!loading && view === "detail" && selected && (
          <div style={{ background: "#fff", padding: 24, borderRadius: 12, border: "1px solid #e8ddd0" }}>
            <button onClick={() => setView("list")} style={{ background: "none", border: "none", color: SAFFRON, cursor: "pointer", fontSize: 14, marginBottom: 14 }}>← Back to List</button>
            
            {isUserBlacklisted(selected) && (
              <div style={{ background: "#fdf0f0", border: "2px solid " + RED, color: RED, padding: 14, borderRadius: 8, fontWeight: 600, marginBottom: 16 }}>
                ⚠️ BLACKLIST MATCH ALIGNMENT DETECTED: Passport ID or email matched security blacklist parameters.
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <div><h2>{selected.guest?.full_name}</h2><span style={{ fontSize: 13, color: "#9a7a4a" }}>System Reference Token: <strong>{selected.id}</strong></span></div>
              <StatusBadge status={selected.status} />
            </div>

            {/* DYNAMIC ACTION BUTTONS ACCORDING TO BOOKING STATUS */}
            <div style={{ display: "flex", gap: 10, marginBlock: 16, flexWrap: "wrap" }}>
              {(selected.status === "pending" || selected.status === "waiting") && (
                <>
                  <button className="btn-approve" onClick={() => handleApprove(selected.id)}>✅ Approve Request</button>
                  <button className="btn-reject" onClick={() => setRejectModal(true)}>❌ Reject Request</button>
                  <button className="btn-action" onClick={() => setInfoModal(true)}>📧 Request Info</button>
                </>
              )}
              {selected.status === "approved" && (
                <>
                  <button className="btn-approve" style={{ background: "#1a4a8a" }} onClick={() => handleCheckin(selected.id)}>🛎️ Check In</button>
                  <button className="btn-action" onClick={() => handleNoShow(selected.id)}>⚠️ No Show</button>
                </>
              )}
              {selected.status === "checkedin" && <button className="btn-primary" onClick={() => handleCheckout(selected.id)}>👋 Check Out</button>}
              <button className="btn-pdf" onClick={() => generateBookingPDF(selected)}>📄 Download Receipt PDF</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <SectionHead>Stay Elements</SectionHead>
                <DetailRow label="Check-in Block" value={selected.stay?.checkin + " @ " + (selected.stay?.checkin_time || "15:00")} />
                <DetailRow label="Check-out Block" value={selected.stay?.checkout + " @ " + (selected.stay?.checkout_time || "11:00")} />
                <DetailRow label="Nights Counter" value={selected.nights} />
                <DetailRow label="Daily Meals Prasadam" value={(selected.purpose?.prasadam || "yes").toUpperCase()} />
                <DetailRow label="Total Billing (Cash)" value={"¥" + (selected.total || 0).toLocaleString()} />
              </div>
              <div>
                <SectionHead>Rooms Block Map Grid</SectionHead>
                {ROOMS_CATALOG.map(rm => <DetailRow key={rm.id} label={rm.name} value={selected.stay?.[rm.id + "_checked"] ? "BLOCKED 🔒" : "FREE"} />)}
              </div>
            </div>

            <div style={{ marginTop: 16, background: "#fcfaf6", padding: 12, borderRadius: 8, border: "1px dashed #e0d4c0" }}>
              <div style={{ fontSize: 14 }}>Passport / Document ID Number: <strong>{selected.guest?.id_number || "—"}</strong></div>
              <div style={{ fontSize: 14, marginTop: 4 }}>Audit Upload Asset Link: <span style={{ color: GREEN, textDecoration: "underline", cursor: "pointer", fontWeight: 500 }} onClick={() => alert(`Simulating Secure Storage Stream Transfer for item:\n${selected.guest?.id_filename}`)}>📄 {selected.guest?.id_filename || "passport_photo.jpg"}</span></div>
            </div>

            {selected.coGuests && selected.coGuests.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <SectionHead>Co-devotees Dynamic Array Submissions ({selected.coGuests.length})</SectionHead>
                {selected.coGuests.map((g, idx) => (
                  <div key={idx} style={{ padding: "8px 0", borderBottom: "0.5px dashed #ebdcb9", fontSize: 14 }}>
                    👤 Guest #{idx+2}: <strong>{g.full_name}</strong> ({g.age} yrs · {g.gender}) | ID Num: <strong>{g.id_number}</strong><br/>
                    <span style={{ fontSize: 12, color: GREEN, textDecoration: "underline", cursor: "pointer" }} onClick={() => alert(`Opening Co-Guest ID asset photo link context: ${g.id_filename}`)}>📎 Photo Upload Reference: {g.id_filename}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW D: 60-DAY OCCUPANCY MATRIX */}
        {!loading && view === "calendar" && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Room Occupancy Matrix</h2>
            <p style={{ fontSize: 14, color: "#9a7a4a", marginBottom: 20 }}>60-day live inventory overview across all 4 ashram segments</p>
            <OccupancyCalendar bookings={bookings} blockedDates={blockedDates} />
          </div>
        )}

        {/* VIEW E: MANUAL OVERRIDE */}
        {!loading && view === "manual" && isSuperAdmin && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>Manual Override Entry</h2>
            <p style={{ fontSize: 14, color: "#9a7a4a", marginBottom: 20 }}>Manually overwrite grid dates. Pushes straight to Firestore.</p>
            <div style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: 14, padding: "24px 22px", maxWidth: 560 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="ad-field" style={{ gridColumn: "1 / -1" }}><label className="ad-label">Guest Full Name *</label><input className="ad-input" type="text" value={manualForm.name} onChange={e => setManualForm(Object.assign({}, manualForm, { name: e.target.value }))} /></div>
                <div className="ad-field"><label className="ad-label">Email Address *</label><input className="ad-input" type="email" value={manualForm.email} onChange={e => setManualForm(Object.assign({}, manualForm, { email: e.target.value }))} /></div>
                <div className="ad-field"><label className="ad-label">Phone Number</label><input className="ad-input" type="tel" value={manualForm.phone} onChange={e => setManualForm(Object.assign({}, manualForm, { phone: e.target.value }))} /></div>
                <div className="ad-field" style={{ gridColumn: "1 / -1" }}><label className="ad-label">Passport / ID Card Number</label><input className="ad-input" type="text" value={manualForm.id_number} onChange={e => setManualForm(Object.assign({}, manualForm, { id_number: sanitizeIdNumber(e.target.value) }))} /></div>
                <div className="ad-field"><label className="ad-label">Check-in Date *</label><input className="ad-input" type="date" value={manualForm.checkin} onChange={e => setManualForm(Object.assign({}, manualForm, { checkin: e.target.value }))} /></div>
                <div className="ad-field"><label className="ad-label">Check-in Time</label><select className="ad-input" value={manualForm.checkin_time} onChange={e => setManualForm(Object.assign({}, manualForm, { checkin_time: e.target.value }))}>{["13:00","14:00","15:00","16:00","17:00"].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div className="ad-field"><label className="ad-label">Check-out Date *</label><input className="ad-input" type="date" value={manualForm.checkout} onChange={e => setManualForm(Object.assign({}, manualForm, { checkout: e.target.value }))} /></div>
                <div className="ad-field"><label className="ad-label">Check-out Time</label><select className="ad-input" value={manualForm.checkout_time} onChange={e => setManualForm(Object.assign({}, manualForm, { checkout_time: e.target.value }))}>{["09:00","10:00","11:00","12:00"].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div className="ad-field"><label className="ad-label">Guests Counter</label><select className="ad-input" value={manualForm.guests} onChange={e => setManualForm(Object.assign({}, manualForm, { guests: e.target.value }))}>{[1,2,3,4,5,6,7,8].map(n => <option key={n} value={String(n)}>{n} Devotee(s)</option>)}</select></div>
                <div className="ad-field"><label className="ad-label">Purpose Context</label><select className="ad-input" value={manualForm.purpose} onChange={e => setManualForm(Object.assign({}, manualForm, { purpose: e.target.value }))}><option value="seva">Temple Seva (¥2,000/person)</option><option value="darshan">Pilgrimage / Darshan (¥7,000/room)</option></select></div>
                <div className="ad-field" style={{ gridColumn: "1 / -1" }}><label className="ad-label">Admin Notes</label><textarea className="ad-input" rows={2} value={manualForm.notes} onChange={e => setManualForm(Object.assign({}, manualForm, { notes: e.target.value }))} /></div>
              </div>
              <button className="btn-primary" onClick={handleManualBooking} style={{ marginTop: 8, width: "100%" }}>Push Manual Entry straight to Firestore</button>
            </div>
          </div>
        )}

        {/* VIEW F: BLOCK DATES */}
        {!loading && view === "block" && isSuperAdmin && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>Block Grid Maintenance Dates</h2>
            <p style={{ fontSize: 14, color: "#9a7a4a", marginBottom: 20 }}>Completely lock down all 4 rooms for festivals or systems cleanup blocks.</p>
            <div style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: 14, padding: "24px 22px", maxWidth: 440 }}>
              <div className="ad-field"><label className="ad-label">Choose Target Lockdown Date</label><input className="ad-input" type="date" value={blockDate} onChange={e => setBlockDate(e.target.value)} /></div>
              <button className="btn-primary" onClick={() => { if(!blockDate)return; if(blockedDates.includes(blockDate))return; setBlockedDates(blockedDates.concat([blockDate])); setBlockDate(""); showToast(blockDate + " locked down."); }}>Commit Global Block</button>
              {blockedDates.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <SectionHead>Active Locked-Out System Parameters</SectionHead>
                  {blockedDates.map(d => (
                    <div key={d} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#fdf0f0", border: "1px solid #e0c0c0", borderRadius: 8, marginBottom: 6, fontSize: 14 }}>
                      <span>🔒 Global Block: <strong>{d}</strong></span>
                      <button onClick={() => { setBlockedDates(blockedDates.filter(x => x !== d)); showToast(d + " unblocked."); }} style={{ background: "none", border: "none", color: RED, cursor: "pointer", fontSize: 16 }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW G: BLACKLIST MANAGER */}
        {!loading && view === "blacklist" && (
          <div>
            <h2 style={{ fontSize: 20, marginBottom: 14 }}>Blacklist Database Flags</h2>
            <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e8ddd0", maxWidth: 460, marginBottom: 20 }}>
              <div style={{ marginBottom: 10 }}><label className="ad-label">Flag by Email Address</label><input className="ad-input" value={blEmail} onChange={e => setBlEmail(e.target.value)} placeholder="devotee@example.com" /></div>
              <div style={{ marginBottom: 14 }}><label className="ad-label">Flag by Passport / ID Card Number</label><input className="ad-input" value={blIdNum} onChange={e => setBlIdNum(sanitizeIdNumber(e.target.value))} placeholder="Passport String Code ID" /></div>
              <button className="btn-primary" onClick={addPersonToBlacklist}>Commit Banning Query Settings</button>
            </div>
            <h3 style={{ fontSize: 15, marginBottom: 8, color: "#7a5c3a" }}>Active Monitored Banned Entities</h3>
            {blacklist.map((x, i) => (
              <div key={i} style={{ background: "#fff3f3", padding: "10px 14px", borderRadius: 8, border: "1px solid #e0c0c0", marginBottom: 6, fontSize: 14, display: "flex", justifyContent: "space-between" }}>
                <span>🚫 Email: <strong>{x.email || "—"}</strong> | ID Doc Num: <strong>{x.id_number || "—"}</strong></span>
                <button style={{ background: "none", border: "none", color: RED, cursor: "pointer", fontWeight: 600 }} onClick={async () => { await deleteDoc(doc(db, "blacklist", x.email || x.id_number)); await loadData(); showToast("Wiped security flag."); }}>Wipe</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REJECTION MODAL */}
      {rejectModal && (
        <div className="modal-bg">
          <div className="modal">
            <h3 style={{ fontSize: 18, color: RED, marginBottom: 8 }}>Rejection Reason</h3>
            <textarea className="ad-input" rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="State reason..." style={{ marginBottom: 12 }} />
            <div style={{ display: "flex", gap: 10 }}><button className="btn-reject" onClick={() => handleReject(selectedId)}>Confirm Rejection</button><button className="btn-approve" style={{ background: "#999" }} onClick={() => setRejectModal(false)}>Cancel</button></div>
          </div>
        </div>
      )}

      {/* INFO MODAL */}
      {infoModal && (
        <div className="modal-bg">
          <div className="modal">
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Enquire Guest Information</h3>
            <textarea className="ad-input" rows={3} value={infoMsg} onChange={e => setInfoMsg(e.target.value)} style={{ marginBottom: 12 }} />
            <div style={{ display: "flex", gap: 10 }}><button className="btn-primary" onClick={() => { showToast("Message dispatched."); setInfoModal(false); setInfoMsg(""); }}>Dispatch</button><button className="btn-action" onClick={() => setInfoModal(false)}>Cancel</button></div>
          </div>
        </div>
      )}

      {/* TOAST SYSTEM */}
      {toast.msg && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: toast.type === "error" ? RED : DEEP, color: "#fff", padding: "12px 24px", borderRadius: 10, fontSize: 15, boxShadow: "0 4px 20px rgba(0,0,0,0.3)", zIndex: 2000, border: "1px solid " + GOLD }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}