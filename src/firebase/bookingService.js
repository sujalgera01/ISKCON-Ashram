// src/firebase/bookingService.js
import {
  collection, addDoc, getDocs, doc,
  updateDoc, query, orderBy, serverTimestamp, getDoc
} from "firebase/firestore";
import { db } from "./config";

const COL = "bookings";

export async function createBooking(data) {
  // If id is specified in our incoming payload object properties, we leverage it as our explicit key token
  const ref = await addDoc(collection(db, COL), {
    ...data,
    submittedAt: new Date().toISOString().split("T")[0],
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// 5. User-Facing Cancellation Processing Pipeline
export async function cancelBookingPublic(referenceId) {
  const q = query(collection(db, COL));
  const snap = await getDocs(q);
  let matchedDocId = null;
  
  snap.forEach(d => {
    // Check if system data references unique token IDs accurately
    if (d.data().id === referenceId || d.id === referenceId) {
      matchedDocId = d.id;
    }
  });

  if (!matchedDocId) {
    throw new Error("The reference code ID string provided does not match any active ashram stays.");
  }

  // Update its status field value natively to flagged canceled rules state parameters
  await updateDoc(doc(db, COL, matchedDocId), {
    status: "rejected",
    rejectionReason: "Canceled directly by visitor through public gateway cancellation portal link tool.",
    updatedAt: serverTimestamp()
  });
}

export async function getAllBookings() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(function(d) {
    return Object.assign({ id: d.id }, d.data());
  });
}

export async function updateBookingStatus(id, updates) {
  await updateDoc(doc(db, COL, id), Object.assign({}, updates, {
    updatedAt: serverTimestamp(),
  }));
}

export async function approveBooking(id, approvedBy) {
  await updateBookingStatus(id, {
    status: "approved",
    approvedBy: approvedBy,
    approvedAt: new Date().toISOString().split("T")[0],
  });
}

export async function rejectBooking(id, reason) {
  await updateBookingStatus(id, {
    status: "rejected",
    rejectionReason: reason,
    rejectedAt: new Date().toISOString().split("T")[0],
  });
}

export async function checkInBooking(id) {
  await updateBookingStatus(id, {
    status: "checkedin",
    checkinAt: new Date().toISOString().split("T")[0],
  });
}

export async function checkOutBooking(id) {
  await updateBookingStatus(id, {
    status: "checkedout",
    checkoutAt: new Date().toISOString().split("T")[0],
  });
}

export async function markNoShow(id) {
  await updateBookingStatus(id, { status: "noshow" });
}