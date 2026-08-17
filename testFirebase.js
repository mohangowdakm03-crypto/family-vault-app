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
const db = getFirestore(app, "default");
const auth = getAuth(app);

async function test() {
  try {
    const user = await signInAnonymously(auth);
    console.log("Auth success", user.user.uid);
    const docRef = doc(db, "vaults", "FAM-8842-KUTUMB");
    
    // Try to write
    console.log("Writing to 'default' database...");
    await setDoc(docRef, { test: true });
    console.log("Write success!");
    process.exit(0);
  } catch (e) {
    console.error("Firebase error", e);
    process.exit(1);
  }
}
test();
