import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCKsjeGtSUEI_umn_MPMzqbES2T-NUt_Vs", // Reemplaza con la clave correcta desde Firebase Console
  authDomain: "bar1985-d34ea.firebaseapp.com",
  projectId: "bar1985-d34ea",
  storageBucket: "bar1985-d34ea.appspot.com",
  messagingSenderId: "1010372504350",
  appId: "1:1010372504350:web:5b7a4f88bb6a52d270b70f",
  measurementId: "G-1TEEFS4FL2"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, signInWithEmailAndPassword, signOut, onAuthStateChanged, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp };
