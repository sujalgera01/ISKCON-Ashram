// src/firebase/bookingService.js
import {
  collection, addDoc, getDocs, doc,
  updateDoc, query, orderBy, serverTimestamp, getDoc, setDoc
} from "firebase/firestore";
import { db } from "./config";

const COL = "bookings";

export async function createBooking(data) {
  // Use the incoming ISK-XXXXXX id, or generate one if missing
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

export async function approveBooking(id, approvedBy = "Admin") {
  const docRef = doc(db, COL, id);
  await setDoc(docRef, {
    status: "approved",
    approvedAt: new Date().toISOString().split("T")[0],
    approvedBy: approvedBy,
  }, { merge: true });
}

export async function rejectBooking(id, reason = "") {
  const docRef = doc(db, COL, id);
  await setDoc(docRef, {
    status: "rejected",
    rejectionReason: reason,
    rejectedAt: new Date().toISOString().split("T")[0],
  }, { merge: true });
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