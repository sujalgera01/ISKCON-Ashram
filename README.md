# ISKCON Tokyo Atithi Seva Niwas

Booking website for the ISKCON Tokyo ashram. Guests can request rooms, provide stay and guest details, and manage eligible cancellations. Administrators review requests and manage bookings and blocked dates.

Website: [iskconjapan-atithi.com](https://iskconjapan-atithi.com)

## Tech stack

- React and Vite
- Firebase Authentication and Firestore
- Firebase Hosting
- EmailJS

## Run locally

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Vite prints the local URL when the development server starts.

## Build

```bash
npm run build
npm run preview
```

## Deploy

After authenticating with Firebase CLI and selecting the configured Firebase project:

```bash
npm run build
firebase deploy --only hosting
```
