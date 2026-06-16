// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLadvl5zxTwpDGadstWM7MD1lQGjhbkZs",
  authDomain: "gs-granites-and-tiles.firebaseapp.com",
  projectId: "gs-granites-and-tiles",
  storageBucket: "gs-granites-and-tiles.firebasestorage.app",
  messagingSenderId: "137141060985",
  appId: "1:137141060985:web:3a9e06c3bf25d165c95ba8",
  measurementId: "G-H00LVFSNKD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize analytics only in a browser environment to prevent server-side render issues
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Initialize key Firebase products
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
