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
export async function cancelBookingPublic(referenceId, verificationEmail) {
  const cleanRef = (referenceId || "").trim().toUpperCase();
  const cleanEmail = (verificationEmail || "").trim().toLowerCase();

  if (!cleanRef || !cleanEmail) {
    throw new Error("Both Booking Reference and registered Email Address are required.");
  }

  // 1. Locate the document
  const docRef = await resolveDocRef(cleanRef);
  const snap = await getDoc(docRef);

  // 2. Reject if booking does not exist
  if (!snap.exists()) {
    throw new Error("No booking found with this reference code. Please verify your details.");
  }

  const bookingData = snap.data();

  // 3. Reject if already cancelled or completed
  if (bookingData.status === "cancelled") {
    throw new Error("This booking has already been cancelled.");
  }
  if (bookingData.status === "rejected") {
    throw new Error("This booking was rejected and cannot be cancelled.");
  }
  if (bookingData.status === "checkedin") {
    throw new Error("A stay cannot be cancelled after check-in. Please contact the ashram coordinator.");
  }
  if (bookingData.status === "checkedout" || bookingData.status === "noshow") {
    throw new Error("Cannot cancel a completed stay.");
  }

  // 4. Verify email ownership match
  const registeredEmail = (bookingData.guest?.email || "").trim().toLowerCase();
  if (registeredEmail !== cleanEmail) {
    throw new Error("The email address provided does not match the record for this reference code.");
  }

  // 5. Mark the booking cancelled so it is distinct from an admin rejection.
  await setDoc(docRef, {
    status: "cancelled",
    cancellationReason: "Canceled directly by visitor via verified self-cancellation gateway.",
    updatedAt: serverTimestamp()
  }, { merge: true });

  return {
    guestName: bookingData.guest?.full_name || "Devotee",
    dates: bookingData.stay ? `${bookingData.stay.checkin} → ${bookingData.stay.checkout}` : "Stay Dates"
  };
}