import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBI5P4HiwnMBZhQh5V2KOn-0_21-qRkDdc",
  authDomain: "fitness-rpg-pencoedtre.firebaseapp.com",
  projectId: "fitness-rpg-pencoedtre",
  storageBucket: "fitness-rpg-pencoedtre.firebasestorage.app",
  messagingSenderId: "255197443274",
  appId: "1:255197443274:web:212a893767d6f55f25f033",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
