// Importar SDKs de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCKsjeGtSUEI_umn_MPMzqbES2T-NUt_Vs",
  authDomain: "bar1985-d34ea.firebaseapp.com",
  projectId: "bar1985-d34ea",
  storageBucket: "bar1985-d34ea.appspot.com",
  messagingSenderId: "1010372504350",
  appId: "1:1010372504350:web:5b7a4f88bb6a52d270b70f",
  measurementId: "G-1TEEFS4FL2"
};

// Inicializar la app
const app = initializeApp(firebaseConfig);

// Inicializar autenticación y base de datos
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Iniciar sesión para panel de administración
 */
export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Cerrar sesión
 */
export const logoutAdmin = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Escuchar cambios de autenticación
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Obtener todas las reservas desde Firestore
 */
export const getReservas = async () => {
  try {
    const reservasQuery = query(collection(db, "reservas"), orderBy("fecha", "asc"));
    const querySnapshot = await getDocs(reservasQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error al cargar reservas:", error);
    throw error;
  }
};

/**
 * Eliminar una reserva por ID
 */
export const eliminarReserva = async (id) => {
  try {
    await deleteDoc(doc(db, "reservas", id));
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar reserva:", error);
    return { success: false, error: error.message };
  }
};

export { auth, db, collection, addDoc, serverTimestamp };
