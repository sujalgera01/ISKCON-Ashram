// src/firebase/pdfService.js
import { jsPDF } from "jspdf";

function purposeLabel(type) {
  if (type === "seva")    return "Temple Seva (¥2,000/person/night)";
  if (type === "darshan") return "Pilgrimage / Darshan (¥7,000/room/night)";
  return "Spiritual Retreat (¥7,000/room/night)";
}

export function generateBookingPDF(booking) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;

  const SAFFRON  = [196, 88, 26];
  const GOLD     = [212, 160, 23];
  const DEEP     = [26, 10, 0];
  const LIGHT_BG = [253, 248, 242];
  const LINE_CLR = [224, 212, 192];

  doc.setFillColor(...LIGHT_BG);
  doc.rect(0, 0, W, 297, "F");

  doc.setFillColor(...DEEP);
  doc.rect(0, 0, W, 38, "F");

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(1.2);
  doc.line(0, 38, W, 38);

  doc.setTextColor(...GOLD);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("ISKCON TOKYO", W / 2, 14, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(196, 165, 106);
  doc.text("Mataji Ashram — Booking Confirmation", W / 2, 22, { align: "center" });

  doc.setFontSize(9);
  doc.setTextColor(154, 122, 74);
  doc.text("✦ HARE KRISHNA ✦", W / 2, 30, { align: "center" });

  doc.setFillColor(253, 240, 228);
  doc.setDrawColor(...SAFFRON);
  doc.setLineWidth(0.5);
  doc.roundedRect(14, 44, W - 28, 18, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...SAFFRON);
  doc.text("BOOKING REFERENCE", 20, 51);

  doc.setFontSize(16);
  doc.setTextColor(...DEEP);
  doc.text(booking.id || "ISK-XXXXXX", 20, 58);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(122, 92, 58);
  doc.text(`Submitted: ${booking.submittedAt || "—"}    Status: ${(booking.status || "pending").toUpperCase()}`, W - 20, 58, { align: "right" });

  let y = 72;

  function sectionHeader(title) {
    // If y gets near the bottom of page, inject an internal split
    if (y > 240) { doc.addPage(); y = 20; doc.setFillColor(...LIGHT_BG); doc.rect(0, 0, W, 297, "F"); }
    doc.setFillColor(253, 243, 235);
    doc.rect(14, y - 4, W - 28, 8, "F");
    doc.setDrawColor(...LINE_CLR);
    doc.setLineWidth(0.3);
    doc.line(14, y + 4, W - 14, y + 4);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...SAFFRON);
    doc.text(title, 18, y + 1);
    y += 10;
  }

  function row(label, value) {
    if (y > 265) { doc.addPage(); y = 20; doc.setFillColor(...LIGHT_BG); doc.rect(0, 0, W, 297, "F"); }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(122, 92, 58);
    doc.text(label, 20, y);
    doc.setTextColor(...DEEP);
    doc.text(String(value || "—"), 95, y);
    doc.setDrawColor(...LINE_CLR);
    doc.setLineWidth(0.2);
    doc.line(14, y + 2, W - 14, y + 2);
    y += 8;
  }

  // ── Stay Details ──
  sectionHeader("🗓  STAY DETAILS");
  row("Check-in Date & Time",  `${booking.stay?.checkin} @ ${booking.stay?.checkin_time || "15:00"}`);
  row("Check-out Date & Time", `${booking.stay?.checkout} @ ${booking.stay?.checkout_time || "11:00"}`);
  row("Duration",       `${booking.nights} night(s)`);
  row("Total Guests",   `${booking.stay?.guestsCount} devotee(s)`);
  row("Rooms Booked",   `${booking.stay?.room1_checked ? "Room 1 (Vrindavan) " : ""}${booking.stay?.room2_checked ? "Room 2 (Mayapur)" : ""}`);
  row("Daily Prasadam Intake", (booking.purpose?.prasadam || "yes").toUpperCase());

  y += 4;

  // ── Payment ──
  sectionHeader("💴  PAYMENT SUMMARY");
  row("Total Billing Invoiced", `¥${(booking.total || 0).toLocaleString()}`);
  row("Full Advance Paid (100%)", `¥${(booking.deposit || 0).toLocaleString()}`);
  row("Balance Outstanding", "¥0 (Fully Paid)");

  y += 4;

  // ── Guest Profiles ──
  sectionHeader("👤  PRIMARY GUEST DETAILS");
  row("Full Name",       booking.guest?.full_name);
  row("Email",           booking.guest?.email);
  row("Passport Document", booking.guest?.id_filename || "Attached");
  row("First Visit",     booking.guest?.first_visit === "yes" ? "Yes" : "No");
  row("Initiation State", booking.guest?.initiated === "yes" ? `Yes — ${booking.guest?.spiritual_name}` : "No");

  // Dynamically append co-guests list directly to PDF stream output if verified
  if (booking.coGuests && booking.coGuests.length > 0) {
    y += 4;
    sectionHeader("👥  CO-GUESTS PROFILE MODULES");
    booking.coGuests.forEach((g, i) => {
      row(`Guest #${i + 2} Name`, `${g.full_name} (${g.age} yrs - ${g.gender})`);
      row(`Guest #${i + 2} ID File`, g.id_filename || "Verified Uploaded");
    });
  }

  y += 8;

  // ── Ashram Rules Box ──
  if (y > 220) { doc.addPage(); y = 20; doc.setFillColor(...LIGHT_BG); doc.rect(0, 0, W, 297, "F"); }
  doc.setFillColor(249, 243, 235);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.4);
  doc.roundedRect(14, y, W - 28, 28, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...DEEP);
  doc.text("Important Reminders & Refund Terms", 20, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(74, 48, 32);
  const reminders = [
    "• This payment is completely non-refundable except to a localized Japanese bank route.",
    "• Balance payment parameter registers as completely settled via advance PayPay invoice.",
    "• Wake-up Arati at 4:30 AM — attendance encouraged daily.",
    "• Silence hours: 10:00 PM – 4:30 AM. Modest traditional attire mandatory.",
  ];
  reminders.forEach((r, i) => doc.text(r, 20, y + 13 + i * 5));

  // Footer Setup
  doc.setFillColor(...DEEP);
  doc.rect(0, 277, W, 20, "F");
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.8);
  doc.line(0, 277, W, 277);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...GOLD);
  doc.text("HARE KRISHNA HARE KRISHNA · KRISHNA KRISHNA HARE HARE · HARE RAMA HARE RAMA · RAMA RAMA HARE HARE", W / 2, 284, { align: "center" });
  
  doc.save(`ISKCON_Booking_${booking.id || "Receipt"}.pdf`);
}