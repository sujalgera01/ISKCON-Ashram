// src/firebase/submitBooking.js
import { createBooking } from "./bookingService";
import { sendBookingReceivedEmail } from "./emailService";
import { sendNewBookingWhatsAppNotifications } from "./whatsappService";

export async function submitBooking({ stay, guest, coGuests, purpose, nights, total, deposit, balance, status, id }) {
  // Cleanly map all state keys so Firestore saves them
  const payload = {
    id: id || undefined, // Preserves custom ISK-XXXXXX reference if generated
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

  // Attach final ID to payload object for notification templates
  const savedBooking = { ...payload, id: docId || id };

  // 2. Trigger Email & WhatsApp notifications asynchronously
  sendBookingReceivedEmail(savedBooking).catch(err => {
    console.error("❌ EmailJS Pending Email Error:", err);
  });

  sendNewBookingWhatsAppNotifications(savedBooking).catch(err => {
    console.error("❌ WhatsApp Dispatch Error:", err);
  });

  return docId;
}