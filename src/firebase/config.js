import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDF6sOONPbQnL8TKjh0_JSypyT8eem_uhc",
  authDomain: "iskcon-ashram-booking.firebaseapp.com",
  projectId: "iskcon-ashram-booking",
  storageBucket: "iskcon-ashram-booking.firebasestorage.app",
  messagingSenderId: "635009404374",
  appId: "1:635009404374:web:f53c6919fab35a9456e877"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;