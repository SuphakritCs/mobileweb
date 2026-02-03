import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyA5S9KHwRXBwCJjRedA_5beiQ8VD3-_EDE",
  authDomain: "lab06-10695.firebaseapp.com",
  projectId: "lab06-10695",
  storageBucket: "lab06-10695.firebasestorage.app",
  messagingSenderId: "1029169777589",
  appId: "1:1029169777589:web:17046540ece3b9ece527fc",
  measurementId: "G-BNEVENBCS4"
};

const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);