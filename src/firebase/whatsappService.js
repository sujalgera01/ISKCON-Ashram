// src/firebase/whatsappService.js

const ADMIN_PHONE = import.meta.env.VITE_ADMIN_WHATSAPP_PHONE || "+8190XXXXXXXX"; 
const ADMIN_APIKEY = import.meta.env.VITE_ADMIN_CALLMEBOT_APIKEY || "YOUR_CALLMEBOT_API_KEY";

/**
 * Sends a WhatsApp alert to the Admin via CallMeBot API
 */
async function sendWhatsAppToAdmin(messageText) {
  if (!ADMIN_PHONE || !ADMIN_APIKEY || ADMIN_APIKEY === "YOUR_CALLMEBOT_API_KEY") {
    console.warn("⚠️ WhatsApp dispatch skipped: Missing admin phone or CallMeBot API key.");
    return;
  }

  const cleanPhone = ADMIN_PHONE.replace(/\D/g, "");
  const encodedText = encodeURIComponent(messageText);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodedText}&apikey=${ADMIN_APIKEY}`;

  try {
    await fetch(url, { method: "GET", mode: "no-cors" });
    console.log("📲 WhatsApp alert sent to Admin.");
  } catch (err) {
    console.error("❌ WhatsApp dispatch error:", err);
  }
}

// ── 1. Alert Admin: New Booking Request ──
export async function notifyAdminNewBooking(booking) {
  const stay = booking.stay || {};
  const guest = booking.guest || {};
  const purpose = booking.purpose || {};
  const totalAmount = (booking.total || 0).toLocaleString();

  const msg = 
`🛕 *NEW BOOKING REQUEST*
─────────────────────
*Ref:* ${booking.id || "—"}
*Guest:* ${guest.full_name || "Devotee"}
*Phone:* ${guest.phone || "—"}
*Email:* ${guest.email || "—"}

*Dates:* ${stay.checkin || "—"} → ${stay.checkout || "—"}
*Guests:* ${stay.guestsCount || 1} Devotee(s)
*Purpose:* ${(purpose.type || "seva").toUpperCase()}
*Total Amount:* ¥${totalAmount}
─────────────────────
👉 Review & Action in Admin Panel:
https://iskconjapan-atithi.com/admin`;

  return sendWhatsAppToAdmin(msg);
}

// ── 2. Alert Admin: Booking Cancellation ──
export async function notifyAdminCancellation(bookingRef, details = {}) {
  const msg = 
`⚠️ *BOOKING CANCELLATION*
─────────────────────
*Ref Code:* ${bookingRef}
*Guest:* ${details.guestName || "Devotee"}
*Dates:* ${details.dates || "Scheduled Stay"}

The reservation has been canceled by the user. The occupied room spots have been released back to availability.
─────────────────────
👉 Open Admin Panel:
https://iskconjapan-atithi.com/admin`;

  return sendWhatsAppToAdmin(msg);
}