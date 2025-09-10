import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore, collection, addDoc, doc, deleteDoc, query, orderBy, onSnapshot, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyCKsjeGtSUEI_umn_MPMzqbES2T-NUt_Vs",
  authDomain: "bar1985-d34ea.firebaseapp.com",
  projectId: "bar1985-d34ea",
  storageBucket: "bar1985-d34ea.firebasestorage.app",
  messagingSenderId: "1010372504350",
  appId: "1:1010372504350:web:5b7a4f88bb6a52d270b70f",
  measurementId: "G-1TEEFS4FL2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signInWithEmailAndPassword, onAuthStateChanged, signOut, collection, addDoc, doc, deleteDoc, query, orderBy, onSnapshot, serverTimestamp };
