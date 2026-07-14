// src/firebase/whatsappService.js
// Uses Twilio WhatsApp API via a simple Firebase Cloud Function proxy
// (Direct Twilio calls from browser would expose your credentials)

// ── HOW TO SET UP ──
// 1. Sign up at https://www.twilio.com/try-twilio
// 2. Get your Account SID + Auth Token from Console Dashboard
// 3. Go to Messaging → Try it out → Send a WhatsApp message
// 4. Join sandbox: send "join <your-word>" to +1 415 523 8886 on WhatsApp
// 5. Add to .env:
//    VITE_TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxx
//    VITE_TWILIO_AUTH_TOKEN=your_auth_token
//    VITE_TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
//    VITE_ADMIN_WHATSAPP=whatsapp:+819000000000   ← ashram coordinator's number

// ── NOTE ──
// For production, Twilio calls should go through a Firebase Cloud Function
// so credentials are never exposed in the browser.
// For now this sends via a CORS proxy for development testing.

const ACCOUNT_SID  = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
const AUTH_TOKEN   = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
const FROM_NUMBER  = import.meta.env.VITE_TWILIO_WHATSAPP_FROM;
const ADMIN_NUMBER = import.meta.env.VITE_ADMIN_WHATSAPP;

async function sendWhatsApp(to, body) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`;
  const encoded = btoa(`${ACCOUNT_SID}:${AUTH_TOKEN}`);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${encoded}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ From: FROM_NUMBER, To: to, Body: body }),
  });
  return response.json();
}

// ── Notify admin of new booking ──
export async function notifyAdminNewBooking(booking) {
  const msg =
    `🪷 NEW BOOKING REQUEST\n` +
    `Ref: ${booking.id}\n` +
    `Guest: ${booking.guest.full_name}\n` +
    `Dates: ${booking.stay.checkin} → ${booking.stay.checkout}\n` +
    `Guests: ${booking.stay.guestsCount} | Purpose: ${booking.purpose.type}\n` +
    `Amount: ¥${booking.total.toLocaleString()} | Deposit: ¥${booking.deposit.toLocaleString()}\n` +
    `Please review in admin panel.`;
  return sendWhatsApp(ADMIN_NUMBER, msg);
}

// ── Notify guest of approval ──
export async function notifyGuestApproved(booking) {
  if (!booking.guest.phone) return;
  const guestWA = `whatsapp:${booking.guest.phone.replace(/\s/g, "")}`;
  const msg =
    `🙏 Hare Krishna, ${booking.guest.full_name}!\n\n` +
    `Your booking at ISKCON Tokyo Mataji Ashram has been APPROVED ✅\n\n` +
    `📋 Ref: ${booking.id}\n` +
    `📅 Check-in: ${booking.stay.checkin}\n` +
    `📅 Check-out: ${booking.stay.checkout}\n` +
    `💴 Balance due on arrival: ¥${booking.balance.toLocaleString()}\n\n` +
    `📍 Address: ISKCON Tokyo, 2-11-1 Shinkawa, Mitaka, Tokyo\n\n` +
    `Hare Krishna 🌸`;
  return sendWhatsApp(guestWA, msg);
}

// ── Notify guest of rejection ──
export async function notifyGuestRejected(booking, reason) {
  if (!booking.guest.phone) return;
  const guestWA = `whatsapp:${booking.guest.phone.replace(/\s/g, "")}`;
  const msg =
    `🙏 Hare Krishna, ${booking.guest.full_name}.\n\n` +
    `We regret to inform you that your booking request (Ref: ${booking.id}) ` +
    `could not be approved at this time.\n\n` +
    `Reason: ${reason}\n\n` +
    `Please feel free to submit a new request for different dates.\n` +
    `Hare Krishna 🌸`;
  return sendWhatsApp(guestWA, msg);
}

// ── Arrival reminder (call this 1 day before checkin) ──
export async function sendArrivalReminder(booking) {
  if (!booking.guest.phone) return;
  const guestWA = `whatsapp:${booking.guest.phone.replace(/\s/g, "")}`;
  const msg =
    `🙏 Hare Krishna, ${booking.guest.full_name}!\n\n` +
    `A gentle reminder that your stay at ISKCON Tokyo Mataji Ashram ` +
    `begins TOMORROW (${booking.stay.checkin}) 🌸\n\n` +
    `💴 Balance due on arrival: ¥${booking.balance.toLocaleString()}\n` +
    `📍 ISKCON Tokyo, 2-11-1 Shinkawa, Mitaka, Tokyo\n\n` +
    `Wake-up Arati: 4:30 AM 🪷\n` +
    `Hare Krishna!`;
  return sendWhatsApp(guestWA, msg);
}