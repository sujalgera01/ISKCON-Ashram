# 🪷 ISKCON Tokyo Atithi Seva Niwas — Booking Portal

> Full-stack room booking web application for **ISKCON Tokyo Atithi Seva Niwas**.  
> Built with **React.js (Vite)**, **Firebase (Firestore & Hosting)**, **EmailJS**.

🔗 **Official Portal:** [https://iskconjapan-atithi.com](https://iskconjapan-atithi.com)

---

## 📁 Project Structure
```
iskconAshram/
├── public/
│   ├── iskcon_rules.pdf          ← Official Ashram Code of Conduct & Rules PDF
│   └── favicon.ico
│
├── src/
│   ├── pages/
│   │   ├── BookingPage.jsx       ← 4-Step Guest Booking & Self-Cancellation Portal
│   │   └── AdminDashboard.jsx    ← Admin Management Portal
│   │
│   ├── components/
│   │   ├── ContactPage.jsx       ← Temple Info, Timings & Google Maps
│   │   └── ProtectedRoute.jsx    ← Firebase Auth Route Guard
│   │
│   ├── firebase/
│   │   ├── config.js             ← Firebase App Initialization
│   │   ├── bookingService.js     ← Firestore Service Handlers
│   │   ├── submitBooking.js      ← Client Booking Pipeline
│   │   ├── availabilityService.js← Date Availability Services
│   │   ├── emailService.js       ← EmailJS Dispatch Service
│   │   └── whatsappService.js    ← Admin Alert Dispatcher (to be implement soon)
│   │
│   ├── App.jsx                   ← App Routing
│   └── main.jsx
│
├── .env.local                    ← Environment Variables (Excluded from Git)
├── .gitignore                    ← Git Exclusion Rules
├── firestore.rules               ← Cloud Firestore Security Rules
├── firebase.json                 ← Firebase Hosting Configuration
├── package.json
└── README.md                     ← Project Documentation
```

---
---

## ✅ Implemented Features

### Guest Portal (`src/pages/BookingPage.jsx`)

| Feature | Status |
|---|---|
| 4-step responsive booking flow | ✅ Complete |
| 3-Month booking window validation | ✅ Complete |
| 2-Room ashram allocation (Mataji 201 / Prabhuji 202) | ✅ Complete |
| Dynamic live spot badges (`2 left`, `1 left`, `Full`) | ✅ Complete |
| Capacity enforcement (Max 2 adults per room) | ✅ Complete |
| Auto cost calculation (Seva ¥2,000 / Darshan & Retreat ¥7,000) | ✅ Complete |
| Guest info form + Co-guest multi-profile collection | ✅ Complete |
| ID document photo upload handling | ✅ Complete |
| Initiated devotee verification (Spiritual name & Guru) | ✅ Complete |
| Prasadam preference & special requests handling | ✅ Complete |
| Self-service booking cancellation via reference ID | ✅ Complete |
| Ashram rules PDF integration | ✅ Complete |
| Form sanitization & validation error handling | ✅ Complete |
| Dedicated responsive Contact & Location page | ✅ Complete |
| English ↔ Japanese bilingual language toggle | ✅ Complete |
| Mobile-first responsive UI scaling | ✅ Complete |

### Administrative Portal (`src/pages/AdminDashboard.jsx`)

| Feature | Status |
|---|---|
| Firebase Authentication security guard | ✅ Complete |
| Status workflow (Pending / Approved / Checked-in / Checked-out / Rejected / No-show) | ✅ Complete |
| Maintenance & festival date blackout management | ✅ Complete |
| Real-time occupancy & live inventory tracking | ✅ Complete |

### Integrations

| Service | Purpose | Status |
|---|---|---|
| **Firebase Firestore** | NoSQL cloud database for stays and availability | ✅ Active |
| **Firebase Hosting** | Production CDN hosting on custom domain | ✅ Active |
| **EmailJS** | Submission confirmations & approval emails | ✅ Active |

---

## 🌐 Languages Supported

| Language | Status |
|---|---|
| English | ✅ Full translation |
| Japanese (日本語) | ✅ Full translation |

Toggle available in the top navigation bar.

---

## 🔐 Admin Roles 

| Role | Permissions |
|---|---|
| Super Admin | Full control — approve, reject, block dates, edit rates, manage all bookings |
| Mataji Coordinator | View, approve, reject bookings — cannot change rates or block dates |

---

## 📬 Notification Flow (Phase 4)

[Devotee Submits Request]
        │
        ├──► (EmailJS) ──► Devotee receives "Pending Confirmation" Email

[Admin Approves Request in Portal]
        │
        └──► (EmailJS) ──► Devotee receives "Booking Approved" Email + Receipt Details


---

## 📞 Contact & Credits

**Project:** ISKCON Tokyo Atithi Seva Niwas   
**Temple:** ISKCON Tokyo  
**Website language:** English + Japanese  
**Built with:** React.js, Vite, Firebase (Phase 3+)

---

> 🙏 Hare Krishna Hare Krishna · Krishna Krishna Hare Hare  
> Hare Rama Hare Rama · Rama Rama Hare Hare
