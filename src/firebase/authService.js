import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./config";

const ROLE_MAP = {
  "admin@iskcontokyo.com":       "superadmin",
  "coordinator@iskcontokyo.com": "coordinator",
};

export async function loginAdmin(email, password) {
  const trimmed = email.trim().toLowerCase();
  const role = ROLE_MAP[trimmed];
  if (!role) throw new Error("This email is not authorised for admin access.");
  const cred = await signInWithEmailAndPassword(auth, trimmed, password);
  return { user: cred.user, role: role };
}

export async function logoutAdmin() {
  await signOut(auth);
}