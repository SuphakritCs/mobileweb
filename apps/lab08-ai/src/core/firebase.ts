// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWo08j8l8bk2OHCZLBjEZhOAbP6iAR1q0",
  authDomain: "fir-3ef99.firebaseapp.com",
  projectId: "fir-3ef99",
  storageBucket: "fir-3ef99.firebasestorage.app",
  messagingSenderId: "219655676933",
  appId: "1:219655676933:web:49ac3d4de06d73c1e4e86c",
  measurementId: "G-L7QVPX1NGQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
