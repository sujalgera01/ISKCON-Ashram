// src/firebase/availabilityService.js
import { getDocs, collection, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "./config";

// ── 1. Fetch Maintenance Blocked Dates ──
export async function getBlockedDates() {
  try {
    const snap = await getDocs(collection(db, "blocked_dates"));
    return snap.docs.map(d => d.id); // Returns array of "YYYY-MM-DD" strings
  } catch (err) {
    console.error("Error fetching blocked dates:", err);
    return [];
  }
}

// ── 2. Add Maintenance Block ──
export async function addBlockedDate(dateStr) {
  if (!dateStr) return;
  await setDoc(doc(db, "blocked_dates", dateStr), {
    blockedAt: new Date().toISOString(),
    reason: "Maintenance"
  });
}

// ── 3. Remove Maintenance Block ──
export async function removeBlockedDate(dateStr) {
  if (!dateStr) return;
  await deleteDoc(doc(db, "blocked_dates", dateStr));
}

// ── 4. Check Dates Fully Unavailable Across All Rooms (2 Rooms System) ──
export async function getUnavailableDates(startDate, endDate) {
  const snap = await getDocs(collection(db, "bookings"));
  const active = snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(b => b.status === "approved" || b.status === "checkedin" || b.status === "pending");

  const unavailable = new Set();

  let cur = new Date(startDate);
  const end = new Date(endDate);

  while (cur <= end) {
    const dateStr = cur.toISOString().split("T")[0];

    let roomsFull = 0;
    ["room1", "room2"].forEach(roomId => {
      const occupants = active.filter(b =>
        b.stay &&
        b.stay.checkin <= dateStr &&
        b.stay.checkout > dateStr &&
        b.stay[roomId + "_checked"] === true
      );

      const spotsUsed = occupants.reduce((sum, b) => {
        const totalGuests = parseInt(b.stay.guestsCount, 10) || 1;
        const roomsBooked = (b.stay.room1_checked ? 1 : 0) + (b.stay.room2_checked ? 1 : 0);
        return sum + Math.ceil(totalGuests / (roomsBooked || 1));
      }, 0);

      if (spotsUsed >= 2) roomsFull++;
    });

    if (roomsFull >= 2) unavailable.add(dateStr);

    cur.setDate(cur.getDate() + 1);
  }

  return unavailable;
}

// ── 5. Room Availability Per Room (2 Rooms System) ──
export async function getRoomAvailability(checkin, checkout) {
  if (!checkin || !checkout || checkin >= checkout) return {};

  const snap = await getDocs(collection(db, "bookings"));
  const active = snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(b => b.status === "approved" || b.status === "checkedin" || b.status === "pending");

  const result = {};

  ["room1", "room2"].forEach(roomId => {
    let minSpots = 2;
    let cur = new Date(checkin);
    const end = new Date(checkout);

    while (cur < end) {
      const dateStr = cur.toISOString().split("T")[0];
      const occupants = active.filter(b =>
        b.stay &&
        b.stay.checkin <= dateStr &&
        b.stay.checkout > dateStr &&
        b.stay[roomId + "_checked"] === true
      );

      const spotsUsed = occupants.reduce((sum, b) => {
        const totalGuests = parseInt(b.stay.guestsCount, 10) || 1;
        const roomsBooked = (b.stay.room1_checked ? 1 : 0) + (b.stay.room2_checked ? 1 : 0);
        return sum + Math.ceil(totalGuests / (roomsBooked || 1));
      }, 0);

      const spotsLeft = Math.max(0, 2 - spotsUsed);
      if (spotsLeft < minSpots) minSpots = spotsLeft;
      cur.setDate(cur.getDate() + 1);
    }

    result[roomId] = minSpots;
  });

  return result;
}