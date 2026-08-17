import emailjs from "@emailjs/browser";

const SVC        = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_iio1qyh";
const PUB        = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "P34AvpeTkJyxAUAT2";
const T_APPROVED = import.meta.env.VITE_EMAILJS_TEMPLATE_APPROVED || "template_wbczorb";
const T_REJECTED = import.meta.env.VITE_EMAILJS_TEMPLATE_REJECTED || "template_09bofl9";
const T_PENDING  = import.meta.env.VITE_EMAILJS_TEMPLATE_PENDING || "template_byckzsx";

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

// ── 1. NEW: Booking pending submission acknowledgement ──
export async function sendPendingEmail(booking) {
  if (!booking?.guest?.email) {
    console.warn("⚠️ Cannot send pending email: Missing guest email.");
    return;
  }

  let roomList = "";
  if (booking.stay) {
    if (booking.stay.room1_checked) roomList += "Vrindavan ";
    if (booking.stay.room2_checked) roomList += "Mayapur ";
    if (booking.stay.room3_checked) roomList += "Jagannath Puri ";
    if (booking.stay.room4_checked) roomList += "Dwarka";
  }

  const params = {
    full_name:      booking.guest.full_name || "Devotee",
    to_email:       booking.guest.email,
    booking_ref:    booking.id || "—",
    checkin:        booking.stay?.checkin || "—",
    checkout:       booking.stay?.checkout || "—",
    nights:         String(booking.nights || 1),
    guests:         String(booking.stay?.guestsCount || 1),
    rooms:          roomList.trim() || "Assigned on arrival",
    purpose:        purposeLabel(booking.purpose?.type),
    total_amount:   "¥" + (booking.total || 0).toLocaleString(),
    ashram_address: "ISKCON Tokyo, 1-28-15 Funabori, Edogawa-ku, Tokyo 134-0091",
  };

  return send(T_PENDING, params);
}

// ── Booking approved ──
export async function sendApprovalEmail(booking) {
  if (!booking?.guest?.email) {
    console.warn("⚠️ Cannot send approval email: Missing guest email.");
    return;
  }

  let roomList = "";
  if (booking.stay) {
    if (booking.stay.room1_checked) roomList += "Mataji Ashram (201) ";
    if (booking.stay.room2_checked) roomList += "Prabhuji Ashram (202) ";
  }

  const params = {
    full_name:      booking.guest.full_name || "Devotee",
    to_email:       booking.guest.email,
    booking_ref:    booking.id || "—",
    checkin:        booking.stay?.checkin || "—",
    checkout:       booking.stay?.checkout || "—",
    nights:         String(booking.nights || 1),
    guests:         String(booking.stay?.guestsCount || 1),
    rooms:          roomList.trim() || "Assigned on arrival",
    purpose:        purposeLabel(booking.purpose?.type),
    total_amount:   "¥" + (booking.total || 0).toLocaleString(),
    ashram_address: "ISKCON Tokyo, 1-28-15 Funabori, Edogawa-ku, Tokyo 134-0091",
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