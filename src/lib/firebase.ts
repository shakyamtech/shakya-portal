import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyADe52Ppu9O5rQ9HXFec96JEbx94elBxOU",
  authDomain: "khataplus-f13b1.firebaseapp.com",
  projectId: "khataplus-f13b1",
  storageBucket: "khataplus-f13b1.firebasestorage.app",
  messagingSenderId: "1012861495605",
  appId: "1:1012861495605:web:52aa4026034935458e847c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
