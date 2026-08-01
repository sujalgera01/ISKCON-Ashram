// src/firebase/submitBooking.js
import { createBooking } from "./bookingService";
import { sendBookingReceivedEmail } from "./emailService";

export async function submitBooking({ stay, guest, coGuests, purpose, nights, total, deposit, balance, status, id }) {
  const payload = {
    id: id || undefined,
    stay: stay,
    guest: guest,
    coGuests: coGuests || [],
    purpose: purpose,
    nights: nights,
    total: total,
    deposit: deposit,
    balance: balance,
    status: status || "pending",
  };

  // 1. Save to Firestore collection
  const docId = await createBooking(payload);

  const savedBooking = { ...payload, id: docId || id };

  // 2. Trigger EmailJS dispatch asynchronously
  sendBookingReceivedEmail(savedBooking).catch(err => {
    console.error("❌ EmailJS Pending Email Error:", err);
  });

  return docId;
}