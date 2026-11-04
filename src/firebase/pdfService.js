import { jsPDF } from "jspdf";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 18;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const COLORS = {
  saffron: [196, 88, 26],
  gold: [212, 160, 23],
  deep: [42, 28, 18],
  muted: [112, 96, 80],
  line: [231, 222, 209],
  light: [250, 247, 242],
  white: [255, 255, 255],
};

function displayValue(value, fallback = "Not provided") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

function formatStatus(status) {
  return displayValue(status, "pending")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, character => character.toUpperCase());
}

function formatDate(value) {
  return displayValue(value);
}

function formatGender(value) {
  if (value === "female" || value === "Female" || value === "女性") return "Female";
  if (value === "male" || value === "Male" || value === "男性") return "Male";
  return displayValue(value);
}

function formatPurpose(type) {
  if (type === "seva") return "Temple Seva";
  if (type === "darshan") return "Pilgrimage / Darshan";
  if (type === "retreat") return "Spiritual Retreat";
  return displayValue(type);
}

function formatSubmittedDate(booking) {
  if (booking.createdAt?.toDate) {
    return booking.createdAt.toDate().toLocaleDateString("en-CA");
  }
  return formatDate(booking.submittedAt);
}

export function generateBookingPDF(booking) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = 0;

  function drawPageHeader() {
    doc.setFillColor(...COLORS.deep);
    doc.rect(0, 0, PAGE_WIDTH, 30, "F");
    doc.setFillColor(...COLORS.gold);
    doc.rect(0, 30, PAGE_WIDTH, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(...COLORS.gold);
    doc.text("ISKCON TOKYO", MARGIN, 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.white);
    doc.text("ATITHI SEVA NIWAS", MARGIN, 19);
    doc.text("BOOKING SUMMARY", PAGE_WIDTH - MARGIN, 19, { align: "right" });
  }

  function addPage() {
    doc.addPage();
    drawPageHeader();
    y = 40;
  }

  function ensureSpace(height) {
    if (y + height > PAGE_HEIGHT - 20) addPage();
  }

  function addSection(title) {
    ensureSpace(14);
    doc.setFillColor(...COLORS.light);
    doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 9, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.saffron);
    doc.text(title.toUpperCase(), MARGIN + 4, y + 6);
    y += 13;
  }

  function addRow(label, value) {
    const labelWidth = 52;
    const valueX = MARGIN + 57;
    const valueWidth = PAGE_WIDTH - MARGIN - valueX;
    const labelLines = doc.splitTextToSize(displayValue(label), labelWidth);
    const valueLines = doc.splitTextToSize(displayValue(value), valueWidth);
    const rowHeight = Math.max(labelLines.length, valueLines.length) * 4.4 + 3;

    ensureSpace(rowHeight);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.muted);
    doc.text(labelLines, MARGIN + 2, y + 3);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.deep);
    doc.text(valueLines, valueX, y + 3);

    y += rowHeight;
    doc.setDrawColor(...COLORS.line);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  }

  drawPageHeader();
  y = 39;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text("BOOKING REFERENCE", MARGIN + 2, y);
  doc.setFontSize(15);
  doc.setTextColor(...COLORS.deep);
  doc.text(displayValue(booking.id, "Not assigned"), MARGIN + 2, y + 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text("STATUS", PAGE_WIDTH - MARGIN - 2, y, { align: "right" });
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.saffron);
  doc.text(formatStatus(booking.status), PAGE_WIDTH - MARGIN - 2, y + 8, { align: "right" });
  y += 17;

  addSection("Stay details");
  addRow("Submitted", formatSubmittedDate(booking));
  addRow("Check-in", `${formatDate(booking.stay?.checkin)} at ${displayValue(booking.stay?.checkin_time, "15:00")}`);
  addRow("Check-out", `${formatDate(booking.stay?.checkout)} at ${displayValue(booking.stay?.checkout_time, "11:00")}`);
  addRow("Length of stay", `${displayValue(booking.nights, "0")} night(s)`);
  addRow("Guests", `${displayValue(booking.stay?.guestsCount, "1")} guest(s)`);

  const rooms = [
    booking.stay?.room1_checked ? "Mataji Ashram (201)" : null,
    booking.stay?.room2_checked ? "Prabhuji Ashram (202)" : null,
  ].filter(Boolean);
  addRow("Rooms", rooms.length ? rooms.join(", ") : "Not assigned");
  addRow("Purpose", formatPurpose(booking.purpose?.type));
  addRow("Prasadam", booking.purpose?.prasadam === "no" ? "Not requested" : "Requested");

  y += 5;
  addSection("Suggested donation");
  addRow("Total amount", `JPY ${(Number(booking.total) || 0).toLocaleString("en-US")}`);
  addRow("Payment method", "Cash on arrival at the ashram");
  addRow("Payment status", "No online payment recorded");

  y += 5;
  addSection("Primary guest");
  addRow("Name", booking.guest?.full_name);
  addRow("Email", booking.guest?.email);
  addRow("Phone", booking.guest?.phone);
  addRow("Gender", formatGender(booking.guest?.gender));

  if (booking.coGuests?.length) {
    y += 5;
    addSection(`Additional guests (${booking.coGuests.length})`);
    booking.coGuests.forEach((guest, index) => {
      addRow(
        `Guest ${index + 2}`,
        [guest.full_name, guest.age ? `${guest.age} years old` : null, formatGender(guest.gender)]
          .filter(Boolean)
          .join(" / ")
      );
    });
  }

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(...COLORS.line);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, PAGE_HEIGHT - 14, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.text("ISKCON Tokyo Atithi Seva Niwas", MARGIN, PAGE_HEIGHT - 8);
    doc.text(`Page ${page} of ${pageCount}`, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 8, { align: "right" });
  }

  const safeReference = String(booking.id || "booking").replace(/[^a-zA-Z0-9_-]/g, "_");
  doc.save(`ISKCON_Booking_${safeReference}.pdf`);
}
