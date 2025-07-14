import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // ✅ Add this

const firebaseConfig = {
  apiKey: "AIzaSyAwlyxhkGTl3YxRc_vU7b-Da0rkBAyP7Yw",
  authDomain: "repmate-6f3d1.firebaseapp.com",
  projectId: "repmate-6f3d1",
  storageBucket: "repmate-6f3d1.firebasestorage.app",
  messagingSenderId: "990195963276",
  appId: "1:990195963276:web:f76f64cb6f59c75347b2a9",
  measurementId: "G-RHZB9N5BZ4",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // ✅ Initialize Firestore

export { db }; // ✅ Export Firestore instance
