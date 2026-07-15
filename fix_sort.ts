import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzr06B8OxjadkTHp9lyL06xBrgu85hqIU",
  authDomain: "mahesh-portfolio-4c770.firebaseapp.com",
  projectId: "mahesh-portfolio-4c770",
  storageBucket: "mahesh-portfolio-4c770.firebasestorage.app",
  messagingSenderId: "224547787247",
  appId: "1:224547787247:web:7f21e757504a7a796fe61a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fix() {
  try {
    const querySnapshot = await getDocs(collection(db, 'projects'));
    console.log(`Found ${querySnapshot.size} projects. Updating missing sortOrder...`);
    
    let updated = 0;
    for (const document of querySnapshot.docs) {
      const data = document.data();
      if (data.sortOrder === undefined) {
        await updateDoc(doc(db, 'projects', document.id), {
          sortOrder: 99
        });
        updated++;
        console.log(`Updated project: ${data.title}`);
      }
    }
    console.log(`Successfully updated ${updated} projects.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

fix();
