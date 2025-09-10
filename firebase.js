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
  deleteDoc, 
  doc, 
  getDocs, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD0dfRMXPv35Qpe54P3xezjt4OAACM9Flc",
  authDomain: "peluqueriambs.firebaseapp.com",
  projectId: "peluqueriambs",
  storageBucket: "peluqueriambs.appspot.com",
  messagingSenderId: "67130614111",
  appId: "1:67130614111:web:3e84f8b2e352b9fa59c6b4"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, signInWithEmailAndPassword, signOut, onAuthStateChanged, collection, addDoc, deleteDoc, doc, getDocs, serverTimestamp };
