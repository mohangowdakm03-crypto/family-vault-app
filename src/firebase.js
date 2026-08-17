import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
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
export const db = getFirestore(app, "default");
export const auth = getAuth(app);

// Authenticate anonymously immediately so we can read/write to Firestore securely
signInAnonymously(auth).catch((error) => {
  console.error("Anonymous auth failed:", error);
});
