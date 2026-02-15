import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  onAuthStateChanged,
  User
} from "firebase/auth";

import type {
  AuthUser,
  IAuthService,
  EmailPasswordCredentials,
  PhoneCredentials
} from "./auth-interface";

// 🔴 ค่าจาก Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyA5S9KHwRXBwCJjRedA_5beiQ8VD3-_EDE",
  authDomain: "lab06-10695.firebaseapp.com",
  projectId: "lab06-10695",
  storageBucket: "lab06-10695.firebasestorage.app",
  messagingSenderId: "1029169777589",
  appId: "1:1029169777589:web:17046540ece3b9ece527fc",
  measurementId: "G-BNEVENBCS4"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * 🔹 แปลง Firebase User → AuthUser ของระบบเรา
 * (จุดนี้คือหัวใจของ Lab7)
 */
function mapUser(u: User): AuthUser {
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoUrl: u.photoURL,

    // ✅ เพิ่ม field นี้เพื่อให้หน้า Tab ใช้ได้
    providerId: u.providerData[0]?.providerId
  } as AuthUser; // cast เพื่อให้ตรงกับ interface
}

// 🔹 Phone Auth State
let confirmationResult: ConfirmationResult | null = null;
let verifier: RecaptchaVerifier | null = null;

function getRecaptcha(containerId: string) {
  if (!verifier) {
    verifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
    });
  }
  return verifier;
}

// 🔹 Auth Service ที่ App ใช้งาน
export class FirebaseWebAuthService implements IAuthService {

  async getCurrentUser() {
    return auth.currentUser ? mapUser(auth.currentUser) : null;
  }

  async loginWithEmailPassword(creds: EmailPasswordCredentials) {
    const r = await signInWithEmailAndPassword(auth, creds.email, creds.password);
    return mapUser(r.user);
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const r = await signInWithPopup(auth, provider);
    return mapUser(r.user);
  }

  async logout() {
    await signOut(auth);
  }

  async startPhoneLogin(creds: PhoneCredentials) {
    const appVerifier = getRecaptcha("recaptcha-container");
    confirmationResult = await signInWithPhoneNumber(
      auth,
      creds.phoneNumberE164,
      appVerifier
    );
    return { verificationId: confirmationResult.verificationId };
  }

  async confirmPhoneCode(payload: { verificationId: string; verificationCode: string }) {
    if (!confirmationResult) throw new Error("No confirmation");
    const r = await confirmationResult.confirm(payload.verificationCode);
    return mapUser(r.user);
  }
}

// 🔹 ใช้ฟังสถานะ Login (Session Persistence)
export function observeAuthState(callback: (user: AuthUser | null) => void) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(mapUser(user));
    } else {
      callback(null);
    }
  });
}
