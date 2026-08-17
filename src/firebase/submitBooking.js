// src/firebase/submitBooking.js
import { createBooking } from "./bookingService";

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

  // Save to Firestore collection
  const docId = await createBooking(payload);

  return docId;
}