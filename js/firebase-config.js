/* Firebase initialisation for project mindmantra-58b1a. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
export { collection, getDocs, query, orderBy, doc, setDoc, getDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyDlygXgKwyqZ-8hAQsdkBoW5aMbIX4WYvs",
  authDomain: "mindmantra-58b1a.firebaseapp.com",
  projectId: "mindmantra-58b1a",
  storageBucket: "mindmantra-58b1a.firebasestorage.app",
  messagingSenderId: "99710817568",
  appId: "1:99710817568:web:ce4d2510f6eeb04bd23345"
};
export const configured = !firebaseConfig.apiKey.startsWith("PASTE");
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
