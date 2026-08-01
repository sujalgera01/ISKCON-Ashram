// src/firebase/whatsappService.js

const ACCOUNT_SID  = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
const AUTH_TOKEN   = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
const FROM_NUMBER  = import.meta.env.VITE_TWILIO_WHATSAPP_FROM;
const ADMIN_NUMBER = import.meta.env.VITE_ADMIN_WHATSAPP;
const TWILIO_FUNCTION_URL = import.meta.env.VITE_TWILIO_FUNCTION_URL; // Optional Serverless Proxy URL

// Core dispatch function
async function sendWhatsApp(to, body) {
  if (!to || (!ACCOUNT_SID && !TWILIO_FUNCTION_URL)) {
    console.warn("⚠️ WhatsApp dispatch skipped: Missing recipient number or Twilio config.");
    return;
  }

  let recipient = to.trim();
  if (!recipient.startsWith("whatsapp:")) {
    if (!recipient.startsWith("+")) recipient = "+" + recipient;
    recipient = `whatsapp:${recipient}`;
  }

  // 1. If you deployed a Twilio Serverless Function / Cloud Function
  if (TWILIO_FUNCTION_URL) {
    try {
      const response = await fetch(TWILIO_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: recipient, body: body }),
      });
      return await response.json();
    } catch (err) {
      console.error("❌ WhatsApp Serverless Function Error:", err);
      return;
    }
  }

  // 2. Direct API fallback for local sandbox testing
  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`;
    const encoded = btoa(`${ACCOUNT_SID}:${AUTH_TOKEN}`);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${encoded}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ From: FROM_NUMBER, To: recipient, Body: body }),
    });
    const resData = await response.json();
    console.log("📲 WhatsApp Dispatch Response:", resData);
    return resData;
  } catch (err) {
    console.error("❌ Direct Twilio WhatsApp Dispatch Error:", err);
  }
}

// ── 1. Notify Admin of New Booking Request ──
export async function notifyAdminNewBooking(booking) {
  if (!ADMIN_NUMBER) return;
  const msg =
    `🪷 NEW BOOKING REQUEST\n` +
    `Ref: ${booking.id || "—"}\n` +
    `Guest: ${booking.guest?.full_name || "Devotee"}\n` +
    `Dates: ${booking.stay?.checkin || "—"} → ${booking.stay?.checkout || "—"}\n` +
    `Guests: ${booking.stay?.guestsCount || 1} | Purpose: ${booking.purpose?.type || "seva"}\n` +
    `Amount: ¥${(booking.total || 0).toLocaleString()}\n` +
    `Please review in the admin panel.`;
  return sendWhatsApp(ADMIN_NUMBER, msg);
}

// ── 2. Notify Guest of Approval ──
export async function notifyGuestApproved(booking) {
  if (!booking?.guest?.phone) return;
  const msg =
    `🙏 Hare Krishna, ${booking.guest.full_name || "Devotee"}!\n\n` +
    `Your booking at ISKCON Tokyo Mataji Ashram has been APPROVED ✅\n\n` +
    `📋 Ref: ${booking.id || "—"}\n` +
    `📅 Check-in: ${booking.stay?.checkin || "—"}\n` +
    `📅 Check-out: ${booking.stay?.checkout || "—"}\n` +
    `💴 Total due on arrival (Cash): ¥${(booking.total || 0).toLocaleString()}\n\n` +
    `📍 Address: ISKCON Tokyo, 2-11-1 Shinkawa, Mitaka, Tokyo\n\n` +
    `Hare Krishna 🌸`;
  return sendWhatsApp(booking.guest.phone, msg);
}

// ── 3. Notify Guest of Rejection ──
export async function notifyGuestRejected(booking, reason) {
  if (!booking?.guest?.phone) return;
  const msg =
    `🙏 Hare Krishna, ${booking.guest.full_name || "Devotee"}.\n\n` +
    `We regret to inform you that your booking request (Ref: ${booking.id || "—"}) ` +
    `could not be approved at this time.\n\n` +
    `Reason: ${reason || "Requested dates or rooms are unavailable."}\n\n` +
    `Please feel free to submit a new request for different dates.\n` +
    `Hare Krishna 🌸`;
  return sendWhatsApp(booking.guest.phone, msg);
}

// ── 4. Arrival Reminder ──
export async function sendArrivalReminder(booking) {
  if (!booking?.guest?.phone) return;
  const msg =
    `🙏 Hare Krishna, ${booking.guest.full_name || "Devotee"}!\n\n` +
    `A gentle reminder that your stay at ISKCON Tokyo Mataji Ashram ` +
    `begins TOMORROW (${booking.stay?.checkin || "—"}) 🌸\n\n` +
    `💴 Balance due on arrival: ¥${(booking.total || 0).toLocaleString()}\n` +
    `📍 ISKCON Tokyo, 2-11-1 Shinkawa, Mitaka, Tokyo\n\n` +
    `Wake-up Arati: 4:30 AM 🪷\n` +
    `Hare Krishna!`;
  return sendWhatsApp(booking.guest.phone, msg);
}

// ── EXPORT ALIASES (Connects submitBooking.js & AdminDashboard.jsx) ──
export async function sendNewBookingWhatsAppNotifications(booking) {
  return notifyAdminNewBooking(booking);
}

export async function sendApprovalWhatsAppNotification(booking) {
  return notifyGuestApproved(booking);
}

export async function sendRejectionWhatsAppNotification(booking, reason) {
  return notifyGuestRejected(booking, reason);
}