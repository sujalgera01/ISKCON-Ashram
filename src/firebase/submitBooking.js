// src/firebase/submitBooking.js
import { createBooking } from "./bookingService";

export async function submitBooking({ stay, guest, coGuests, purpose, nights, total, deposit, balance, status }) {
  // Cleanly map all modern state keys so Firestore saves them instantly
  const payload = {
    stay: stay,
    guest: guest,
    coGuests: coGuests || [], // Ensures dynamic array passes perfectly
    purpose: purpose,
    nights: nights,
    total: total,
    deposit: deposit,
    balance: balance,
    status: status || "pending",
  };

  // Save to Firestore collection
  const docId = await createBooking(payload);
  return docId;
}