import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAzr06B8OxjadkTHp9lyL06xBrgu85hqIU",
  authDomain: "mahesh-portfolio-4c770.firebaseapp.com",
  projectId: "mahesh-portfolio-4c770",
  storageBucket: "mahesh-portfolio-4c770.firebasestorage.app",
  messagingSenderId: "224547787247",
  appId: "1:224547787247:web:7f21e757504a7a796fe61a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
