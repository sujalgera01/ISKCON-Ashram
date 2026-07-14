// src/firebase/emailService.js
import emailjs from "@emailjs/browser";

const SVC          = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PUB          = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const T_PENDING    = import.meta.env.VITE_EMAILJS_TEMPLATE_PENDING;
const T_APPROVED   = import.meta.env.VITE_EMAILJS_TEMPLATE_APPROVED;
const T_REJECTED   = import.meta.env.VITE_EMAILJS_TEMPLATE_REJECTED;

function purposeLabel(type) {
  if (type === "seva")    return "Temple Seva";
  if (type === "darshan") return "Pilgrimage / Darshan";
  return "Spiritual Retreat";
}

// ── debug helper — logs all env vars so we can confirm they loaded ──
export function debugEmailConfig() {
  console.log("EmailJS config check:");
  console.log("  SERVICE_ID :", SVC);
  console.log("  PUBLIC_KEY :", PUB ? PUB.slice(0,6) + "..." : "MISSING");
  console.log("  T_PENDING  :", T_PENDING);
  console.log("  T_APPROVED :", T_APPROVED);
  console.log("  T_REJECTED :", T_REJECTED);
}

async function send(templateId, params) {
  if (!SVC || !PUB || !templateId) {
    throw new Error(
      "EmailJS config missing. SVC=" + SVC + " PUB=" + (PUB ? "ok" : "MISSING") + " TPL=" + templateId
    );
  }
  // emailjs.send(serviceId, templateId, params, publicKey)
  return emailjs.send(SVC, templateId, params, PUB);
}

// ── Booking received (pending) ──
export async function sendBookingReceivedEmail(booking) {
  var params = {
    to_name:    booking.guest.full_name,
    to_email:   booking.guest.email,
    booking_id: booking.id || "—",
    checkin:    booking.stay.checkin,
    checkout:   booking.stay.checkout,
    nights:     String(booking.nights),
    guests:     String(booking.stay.guestsCount),
    purpose:    purposeLabel(booking.purpose.type),
    total:      "¥" + (booking.total || 0).toLocaleString(),
    deposit:    "¥" + (booking.deposit || 0).toLocaleString(),
    balance:    "¥" + (booking.balance || 0).toLocaleString(),
    message:    "Your booking request has been received and is pending ashram coordinator approval.",
  };
  return send(T_PENDING, params);
}

// ── Booking approved ──
export async function sendApprovalEmail(booking) {
  var params = {
    to_name:        booking.guest.full_name,
    to_email:       booking.guest.email,
    booking_id:     booking.id || "—",
    checkin:        booking.stay.checkin,
    checkout:       booking.stay.checkout,
    nights:         String(booking.nights),
    guests:         String(booking.stay.guestsCount),
    purpose:        purposeLabel(booking.purpose.type),
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
    console.warn("No rejection template configured — skipping rejection email.");
    return;
  }
  var params = {
    to_name:    booking.guest.full_name,
    to_email:   booking.guest.email,
    booking_id: booking.id || "—",
    reason:     reason,
    message:    "We regret that your booking could not be approved at this time.",
  };
  return send(T_REJECTED, params);
}