# 🪷 ISKCON Tokyo Mataji Ashram — Booking System

> A full-stack room booking web application for the ISKCON Tokyo Mataji Ashram.  
> Built with React.js (frontend) + Firebase (backend — Phase 3).

---

## 📁 Project Structure

```
iskconAshram/
├── public/
│   ├── index.html
│   └── iskcon_rules.pdf          ← Upload your rules PDF here (Phase 1)
│
├── src/
│   ├── pages/
│   │   ├── BookingPage.jsx        ✅ Phase 1 — COMPLETE
│   │   ├── AdminDashboard.jsx     🔲 Phase 2 — In Progress
│   │   └── AdminBookingDetail.jsx 🔲 Phase 2 — In Progress
│   │
│   ├── components/                🔲 Phase 2+
│   │   ├── CalendarPicker.jsx
│   │   ├── BookingCard.jsx
│   │   └── LanguageToggle.jsx
│   │
│   ├── firebase/                  🔲 Phase 3
│   │   ├── config.js
│   │   └── bookingService.js
│   │
│   ├── i18n/                      🔲 Phase 4
│   │   ├── en.json
│   │   └── ja.json
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── functions/                     🔲 Phase 3
│   ├── sendConfirmationEmail.js
│   └── generatePDFReceipt.js
│
├── .env                           ← API keys go here (never commit this)
├── firestore.rules                🔲 Phase 3
├── package.json
└── README.md                      ← You are here
```

---

## ✅ Phase 1 — Guest Booking Page (COMPLETE)

**File:** `src/pages/BookingPage.jsx`

### What's built:

| Feature | Status |
|---|---|
| 4-step booking flow | ✅ |
| Date picker (check-in / check-out) | ✅ |
| Room selection (Room 1 — Vrindavan, Room 2 — Mayapur) | ✅ |
| Auto cost calculation (nights × ¥2,000) | ✅ |
| 50% deposit display + balance due on arrival | ✅ |
| Guest info form (name, age, gender, phone, email, address) | ✅ |
| Emergency contact fields (optional) | ✅ |
| Initiated devotee fields (spiritual name, guru's name) | ✅ |
| Purpose of visit (Seva / Darshan / Retreat) | ✅ |
| Requested by (Self / Organization / Other) | ✅ |
| Medical & special notes fields | ✅ |
| Full review & summary page | ✅ |
| PayPay deposit button (placeholder — live in Phase 4) | ✅ |
| Ashram rules modal (PDF placeholder — ready for upload) | ✅ |
| Form validation with error highlighting | ✅ |
| Success page with booking reference number | ✅ |
| English ↔ Japanese language toggle | ✅ |
| Official ISKCON Tokyo logo in navbar | ✅ |
| Fully responsive (mobile + tablet + desktop) | ✅ |

### Ashram rules PDF:
Place your `iskcon_rules.pdf` file inside the `/public` folder.  
The rules viewer modal will automatically load and embed it.

---

## 🔲 Phase 2 — Admin Panel (Next)

**Files to be created:**
- `src/pages/AdminDashboard.jsx`
- `src/pages/AdminBookingDetail.jsx`

**Planned features:**
- Login (Super Admin + Mataji Coordinator roles)
- Dashboard: Pending / Approved / Rejected / Checked-in / Checked-out counts
- Occupancy calendar view
- Per-booking detail: guest info, approve / reject / request more info
- Manual booking creation by admin
- Room blocking for maintenance / festivals
- Cancellation handling (full / partial / no refund decision)
- Mark as Checked-in / Checked-out / No-show

---

## 🔲 Phase 3 — Firebase Backend

**Planned setup:**
- Firebase Firestore (bookings, rooms, admin users)
- Firebase Authentication (admin login)
- Firebase Cloud Functions (email triggers, availability checks)
- Real-time room availability synced to booking calendar

---

## 🔲 Phase 4 — Integrations

| Integration | Purpose |
|---|---|
| PayPay API | Deposit payment (50% of total stay) |
| SendGrid | Email confirmations in EN + JA |
| Twilio / WATI | WhatsApp notifications |
| jsPDF | PDF receipt generation |

---

## 🚀 How to Run Locally (in Cursor or any terminal)

### Prerequisites
Make sure you have **Node.js** installed.  
Check by running: `node -v`  
If not installed, download from: https://nodejs.org

### Step 1 — Create a new Vite + React project

Open a terminal in Cursor (`Ctrl + `` ` ``) and run:

```bash
cd C:\Users\sujal\OneDrive\Desktop
npm create vite@latest iskconAshram -- --template react
cd iskconAshram
npm install
```

### Step 2 — Replace the default App file

Copy `BookingPage.jsx` into:
```
iskconAshram/src/pages/BookingPage.jsx
```

Then open `src/App.jsx` and replace its entire contents with:

```jsx
import BookingPage from './pages/BookingPage';

export default function App() {
  return <BookingPage />;
}
```

Also open `src/index.css` and delete everything inside it (clear the file completely).

### Step 3 — Create the pages folder

```bash
mkdir src/pages
```
Then move/place `BookingPage.jsx` inside `src/pages/`.

### Step 4 — Run the app

```bash
npm run dev
```

Open your browser at: **http://localhost:5173**

---

## 💰 Pricing Logic

| Parameter | Value |
|---|---|
| Rate per room per night | ¥2,000 |
| Deposit (paid via PayPay at booking) | 50% of total |
| Balance (paid on arrival — any method) | 50% of total |
| Maximum stay | 30 days |
| Number of rooms | 2 |

**Example:**
- 5-night stay → Total: ¥10,000
- Deposit due now (PayPay): ¥5,000
- Balance on arrival: ¥5,000

---

## 🌐 Languages Supported

| Language | Status |
|---|---|
| English | ✅ Full translation |
| Japanese (日本語) | ✅ Full translation |

Toggle available in the top navigation bar.

---

## 🔐 Admin Roles (Phase 2)

| Role | Permissions |
|---|---|
| Super Admin | Full control — approve, reject, block dates, edit rates, manage all bookings |
| Mataji Coordinator | View, approve, reject bookings — cannot change rates or block dates |

---

## 📬 Notification Flow (Phase 4)

| Event | Guest receives |
|---|---|
| Booking submitted | "Received, pending approval" email |
| Approved | Confirmation email + PDF receipt + WhatsApp |
| Rejected | Email with reason from admin |
| Cancellation requested | Acknowledgement email |
| Refund issued | Refund confirmation email |
| 1 day before arrival | Reminder email with ashram address & rules |

---

## 📞 Contact & Credits

**Project:** ISKCON Tokyo Mataji Ashram Booking System  
**Temple:** ISKCON Tokyo  
**Website language:** English + Japanese  
**Built with:** React.js, Vite, Firebase (Phase 3+)

---

> 🙏 Hare Krishna Hare Krishna · Krishna Krishna Hare Hare  
> Hare Rama Hare Rama · Rama Rama Hare Hare
