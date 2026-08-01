// src/firebase/emailService.js
import emailjs from "@emailjs/browser";

const SVC        = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PUB        = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const T_PENDING  = import.meta.env.VITE_EMAILJS_TEMPLATE_PENDING;
const T_APPROVED = import.meta.env.VITE_EMAILJS_TEMPLATE_APPROVED;
const T_REJECTED = import.meta.env.VITE_EMAILJS_TEMPLATE_REJECTED;

function purposeLabel(type) {
  if (type === "seva")    return "Temple Seva";
  if (type === "darshan") return "Pilgrimage / Darshan";
  return "Spiritual Retreat";
}

// ── Debug helper — logs env vars to confirm they loaded ──
export function debugEmailConfig() {
  console.log("🔍 EmailJS Config Check:");
  console.log("  SERVICE_ID :", SVC || "❌ MISSING");
  console.log("  PUBLIC_KEY :", PUB ? `${PUB.slice(0, 6)}...` : "❌ MISSING");
  console.log("  T_PENDING  :", T_PENDING || "❌ MISSING");
  console.log("  T_APPROVED :", T_APPROVED || "❌ MISSING");
  console.log("  T_REJECTED :", T_REJECTED || "❌ MISSING");
}

async function send(templateId, params) {
  if (!SVC || !PUB || !templateId) {
    const errorMsg = `EmailJS config missing. SVC=${SVC ? "OK" : "MISSING"} PUB=${PUB ? "OK" : "MISSING"} TPL=${templateId ? "OK" : "MISSING"}`;
    console.error("❌ EmailJS Error:", errorMsg);
    throw new Error(errorMsg);
  }

  try {
    console.log(`📤 Sending Email via EmailJS [Template: ${templateId}] to: ${params.to_email}...`);
    const response = await emailjs.send(SVC, templateId, params, PUB);
    console.log("✅ EmailJS Dispatch Success:", response.status, response.text);
    return response;
  } catch (err) {
    console.error("❌ EmailJS API Dispatch Error:", err);
    throw err;
  }
}

// ── Booking received (pending) ──
export async function sendBookingReceivedEmail(booking) {
  if (!booking?.guest?.email) {
    console.warn("⚠️ Cannot send booking received email: Missing guest email.");
    return;
  }

  const params = {
    to_name:    booking.guest.full_name || "Devotee",
    to_email:   booking.guest.email,
    booking_id: booking.id || "—",
    checkin:    booking.stay?.checkin || "—",
    checkout:   booking.stay?.checkout || "—",
    nights:     String(booking.nights || 1),
    guests:     String(booking.stay?.guestsCount || 1),
    purpose:    purposeLabel(booking.purpose?.type),
    total:      "¥" + (booking.total || 0).toLocaleString(),
    deposit:    "¥" + (booking.deposit || 0).toLocaleString(),
    balance:    "¥" + (booking.balance || 0).toLocaleString(),
    message:    "Your booking request has been received and is pending ashram coordinator approval.",
  };

  return send(T_PENDING, params);
}

// ── Booking approved ──
export async function sendApprovalEmail(booking) {
  if (!booking?.guest?.email) {
    console.warn("⚠️ Cannot send approval email: Missing guest email.");
    return;
  }

  const params = {
    to_name:        booking.guest.full_name || "Devotee",
    to_email:       booking.guest.email,
    booking_id:     booking.id || "—",
    checkin:        booking.stay?.checkin || "—",
    checkout:       booking.stay?.checkout || "—",
    nights:         String(booking.nights || 1),
    guests:         String(booking.stay?.guestsCount || 1),
    purpose:        purposeLabel(booking.purpose?.type),
    total:          "¥" + (booking.total || 0).toLocaleString(),
    balance:        "¥" + (booking.balance || 0).toLocaleString(),
    ashram_address: "ISKCON Tokyo, 2-11-1 Shinkawa, Mitaka, Tokyo 181-0004",
    message:        "Your booking has been approved. We look forward to welcoming you.",
  };

  return send(T_APPROVED, params);
}

// ── Booking rejected ──
export async function sendRejectionEmail(booking, reason) {
  if (!T_REJECTED) {
    console.warn("⚠️ No rejection template configured (VITE_EMAILJS_TEMPLATE_REJECTED) — skipping rejection email.");
    return;
  }

  if (!booking?.guest?.email) {
    console.warn("⚠️ Cannot send rejection email: Missing guest email.");
    return;
  }

  const params = {
    to_name:    booking.guest.full_name || "Devotee",
    to_email:   booking.guest.email,
    booking_id: booking.id || "—",
    reason:     reason || "Requested dates or rooms are currently unavailable.",
    message:    "We regret that your booking could not be approved at this time.",
  };

  return send(T_REJECTED, params);
}