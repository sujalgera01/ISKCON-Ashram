// src/firebase/bookingService.js
import {
  collection, getDocs, doc,
  query, orderBy, serverTimestamp, getDoc, setDoc, where
} from "firebase/firestore";
import { db } from "./config";
import { notifyAdminCancellation } from "./whatsappService"; // 👈 Add this import

const COL = "bookings";

// ── 1. Helper to resolve true Firestore Document Reference ID ──
async function resolveDocRef(id) {
  const directRef = doc(db, COL, id);
  const directSnap = await getDoc(directRef);
  if (directSnap.exists()) return directRef;

  const q = query(collection(db, COL), where("id", "==", id));
  const snap = await getDocs(q);
  if (!snap.empty) {
    return doc(db, COL, snap.docs[0].id);
  }

  return directRef;
}

// ── 2. Create Booking ──
export async function createBooking(data) {
  const bookingId = data.id || ("ISK-" + Math.random().toString(36).substring(2, 8).toUpperCase());
  const docRef = doc(db, COL, bookingId);

  await setDoc(docRef, {
    ...data,
    id: bookingId,
    submittedAt: new Date().toISOString().split("T")[0],
    createdAt: serverTimestamp(),
  });

  return bookingId;
}

// ── 3. Get All Bookings ──
export async function getAllBookings() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(function(d) {
    return Object.assign({ id: d.id }, d.data());
  });
}

// ── 4. Admin Status Actions ──
export async function approveBooking(id, approvedBy = "Admin") {
  const docRef = await resolveDocRef(id);
  await setDoc(docRef, {
    status: "approved",
    approvedAt: new Date().toISOString().split("T")[0],
    approvedBy: approvedBy,
  }, { merge: true });
}

export async function rejectBooking(id, reason = "") {
  const docRef = await resolveDocRef(id);
  await setDoc(docRef, {
    status: "rejected",
    rejectionReason: reason,
    rejectedAt: new Date().toISOString().split("T")[0],
  }, { merge: true });
}

export async function checkInBooking(id) {
  const docRef = await resolveDocRef(id);
  await setDoc(docRef, {
    status: "checkedin",
    checkinAt: new Date().toISOString().split("T")[0],
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function checkOutBooking(id) {
  const docRef = await resolveDocRef(id);
  await setDoc(docRef, {
    status: "checkedout",
    checkoutAt: new Date().toISOString().split("T")[0],
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function markNoShow(id) {
  const docRef = await resolveDocRef(id);
  await setDoc(docRef, { 
    status: "noshow",
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

// ── 5. Public Gateway Guest Cancellation ──
export async function cancelBookingPublic(referenceId) {
  const docRef = await resolveDocRef(referenceId);
  const snap = await getDoc(docRef);
  const bookingData = snap.exists() ? snap.data() : {};

  await setDoc(docRef, {
    status: "rejected",
    rejectionReason: "Canceled directly by visitor through public gateway cancellation portal link tool.",
    updatedAt: serverTimestamp()
  }, { merge: true });

  // 🔔 Send cancellation alert to Admin via WhatsApp
  notifyAdminCancellation(referenceId, {
    guestName: bookingData.guest?.full_name || "Devotee",
    dates: bookingData.stay ? `${bookingData.stay.checkin} → ${bookingData.stay.checkout}` : "Selected Dates"
  }).catch(err => console.warn("Cancellation alert failed:", err));
}