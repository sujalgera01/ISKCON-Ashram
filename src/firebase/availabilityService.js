// src/firebase/availabilityService.js
// Checks which dates are fully booked across all 4 rooms
// A date is "unavailable" only when ALL 4 rooms are occupied (approved or checkedin)

import { getDocs, collection } from "firebase/firestore";
import { db } from "./config";

// Returns a Set of date strings ("YYYY-MM-DD") that are fully unavailable
export async function getUnavailableDates(startDate, endDate) {
  const snap = await getDocs(collection(db, "bookings"));
  const active = snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(b => b.status === "approved" || b.status === "checkedin" || b.status === "pending");

  const unavailable = new Set();

  // Check each date in the range
  let cur = new Date(startDate);
  const end = new Date(endDate);

  while (cur <= end) {
    const dateStr = cur.toISOString().split("T")[0];

    // For each room, count how many active bookings cover this date
    let roomsFull = 0;
    ["room1", "room2", "room3", "room4"].forEach(roomId => {
      const occupants = active.filter(b =>
        b.stay &&
        b.stay.checkin <= dateStr &&
        b.stay.checkout > dateStr &&
        b.stay[roomId + "_checked"] === true
      );
      // Each room holds max 2 guests; if spots are used up, room is full
      const spotsUsed = occupants.reduce((sum, b) => {
        const totalGuests = parseInt(b.stay.guestsCount, 10) || 1;
        const roomsBooked = ["room1","room2","room3","room4"].filter(r => b.stay[r + "_checked"]).length;
        return sum + Math.ceil(totalGuests / (roomsBooked || 1));
      }, 0);
      if (spotsUsed >= 2) roomsFull++;
    });

    // Only mark unavailable if ALL 4 rooms are full
    if (roomsFull >= 4) unavailable.add(dateStr);

    cur.setDate(cur.getDate() + 1);
  }

  return unavailable;
}

// Returns availability status for a specific room on a date range
// Used by the room cards in BookingPage to show "X spots left"
export async function getRoomAvailability(checkin, checkout) {
  if (!checkin || !checkout || checkin >= checkout) return {};

  const snap = await getDocs(collection(db, "bookings"));
  const active = snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(b => b.status === "approved" || b.status === "checkedin" || b.status === "pending");

  const result = {};

  ["room1", "room2", "room3", "room4"].forEach(roomId => {
    let minSpots = 2; // start with full capacity
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
        const roomsBooked = ["room1","room2","room3","room4"].filter(r => b.stay[r + "_checked"]).length;
        return sum + Math.ceil(totalGuests / (roomsBooked || 1));
      }, 0);
      const spotsLeft = Math.max(0, 2 - spotsUsed);
      if (spotsLeft < minSpots) minSpots = spotsLeft;
      cur.setDate(cur.getDate() + 1);
    }

    result[roomId] = minSpots; // 0 = full, 1 = one spot left, 2 = fully available
  });

  return result; // e.g. { room1: 0, room2: 2, room3: 1, room4: 2 }
}