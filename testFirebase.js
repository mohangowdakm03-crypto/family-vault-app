import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDSNQYnf7w5r-sc_1RxdnpaFJ0P7wXpb04",
  authDomain: "family-vault-32e73.firebaseapp.com",
  projectId: "family-vault-32e73",
  storageBucket: "family-vault-32e73.firebasestorage.app",
  messagingSenderId: "913418545318",
  appId: "1:913418545318:web:a5c870d09cfe84a53c2c67"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function test() {
  try {
    const user = await signInAnonymously(auth);
    console.log("Auth success", user.user.uid);
    const docRef = doc(db, "vaults", "FAM-8842-KUTUMB");
    
    // Try to read
    const snap = await getDoc(docRef);
    console.log("Read success. Data exists:", snap.exists());
    if (snap.exists()) console.log(snap.data());
    
    process.exit(0);
  } catch (e) {
    console.error("Firebase error", e);
    process.exit(1);
  }
}

test();
