// admin.js
import { 
  auth, db, signInWithEmailAndPassword, onAuthStateChanged, signOut, 
  collection, query, orderBy, onSnapshot, doc, deleteDoc 
} from './firebase.js';

// Configura el UID del admin
const ADMIN_UID = 'YqhSLbtSjHdkj4pfjrfinMZMxut1';

// Elementos del DOM
const loginArea = document.getElementById('loginArea');
const adminArea = document.getElementById('adminArea');
const userEmailSpan = document.getElementById('userEmail');
const tblBody = document.querySelector('#tblReservas tbody');
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const filterName = document.getElementById('filterName');
const filterDate = document.getElementById('filterDate');
const confirmModal = document.getElementById('confirmModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const homeBtn = document.getElementById('homeBtn');

let deleteDocId = null;
let unsubscribeSnapshot = null;

// -----------------------
// Toast notification
// -----------------------
function showToast(msg, isSuccess = true) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.className = `toast ${isSuccess ? 'success' : 'error'}`;
  toast.setAttribute('role', 'alert');
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// -----------------------
// Login
// -----------------------
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  emailError.textContent = '';
  passwordError.textContent = '';

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email) { 
    emailError.textContent = 'El correo es requerido'; 
    return; 
  }
  if (!/\S+@\S+\.\S+/.test(email)) { 
    emailError.textContent = 'Correo inválido'; 
    return; 
  }
  if (!password) { 
    passwordError.textContent = 'Contraseña requerida'; 
    return; 
  }

  loginBtn.disabled = true;
  loginBtn.textContent = 'Cargando...';

  try {
    await signInWithEmailAndPassword(auth, email, password);
    showToast('Ingreso exitoso', true);
  } catch (err) {
    console.error(err);
    let msg = 'Error al iniciar sesión';
    if (err.code === 'auth/wrong-password') msg = 'Contraseña incorrecta';
    else if (err.code === 'auth/user-not-found') msg = 'Usuario no encontrado';
    showToast(msg, false);
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Ingresar';
  }
});

// -----------------------
// Logout
// -----------------------
document.getElementById('logoutBtn').addEventListener('click', async () => {
  try {
    await signOut(auth);
    showToast('Sesión cerrada', true);
  } catch (err) {
    console.error(err);
    showToast('Error al cerrar sesión', false);
  }
});

// -----------------------
// Redirigir al inicio
// -----------------------
homeBtn.addEventListener('click', () => window.location.href = './index.html');

// -----------------------
// Populate table
// -----------------------
function populateTable(snap) {
  tblBody.innerHTML = '';
  let visibleCount = 0;
  snap.forEach((docItem) => {
    const r = docItem.data();
    if (shouldDisplayRow(r)) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(r.nombre || '')}</td>
        <td>${escapeHtml(r.telefono || '')}</td>
        <td>${escapeHtml(r.fecha || '')}</td>
        <td>${escapeHtml(r.hora || '')}</td>
        <td>${escapeHtml(r.tipo || '')}</td>
        <td><button class="action-btn" data-id="${docItem.id}" aria-label="Eliminar reserva">Eliminar</button></td>
      `;
      tblBody.appendChild(tr);
      visibleCount++;
    }
  });

  if (visibleCount === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="6" style="text-align: center; padding: 2rem; color: var(--muted);">No hay reservas que coincidan con el filtro.</td>';
    tblBody.appendChild(tr);
  }

  // Botones de eliminar
  document.querySelectorAll('.action-btn').forEach(btn => {
    // Remover listeners previos para evitar duplicados
    btn.replaceWith(btn.cloneNode(true));
  });

  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteDocId = btn.dataset.id;
      confirmModal.style.display = 'flex';
      confirmModal.setAttribute('aria-hidden', 'false');
      confirmDeleteBtn.focus();
    });
  });
}

// -----------------------
// Filtrado
// -----------------------
function shouldDisplayRow(data) {
  const nameFilter = filterName.value.trim().toLowerCase();
  const dateFilter = filterDate.value;
  const matchesName = !nameFilter || (data.nombre || '').toLowerCase().includes(nameFilter);
  const matchesDate = !dateFilter || (data.fecha || '') === dateFilter;
  return matchesName && matchesDate;
}

filterName.addEventListener('input', debounce(fetchAndPopulate, 300));
filterDate.addEventListener('change', fetchAndPopulate);

function fetchAndPopulate() {
  // Unsubscribe previous snapshot if exists
  if (unsubscribeSnapshot) {
    unsubscribeSnapshot();
    unsubscribeSnapshot = null;
  }

  const q = query(collection(db, 'reservas'), orderBy('createdAt', 'desc'));
  unsubscribeSnapshot = onSnapshot(q, snap => populateTable(snap), err => {
    console.error(err);
    showToast('Error al cargar reservas', false);
  });
}

// -----------------------
// Debounce utility
// -----------------------
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// -----------------------
// Modal eliminar
// -----------------------
confirmDeleteBtn.addEventListener('click', async () => {
  if (deleteDocId) {
    try {
      await deleteDoc(doc(db, 'reservas', deleteDocId));
      showToast('Reserva eliminada', true);
    } catch (err) {
      console.error(err);
      showToast('Error al eliminar reserva', false);
    }
    deleteDocId = null;
    confirmModal.style.display = 'none';
    confirmModal.setAttribute('aria-hidden', 'true');
  }
});

cancelDeleteBtn.addEventListener('click', () => {
  deleteDocId = null;
  confirmModal.style.display = 'none';
  confirmModal.setAttribute('aria-hidden', 'true');
});

confirmModal.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    deleteDocId = null;
    confirmModal.style.display = 'none';
    confirmModal.setAttribute('aria-hidden', 'true');
  }
});

// Click outside modal to close
confirmModal.addEventListener('click', (e) => {
  if (e.target === confirmModal) {
    deleteDocId = null;
    confirmModal.style.display = 'none';
    confirmModal.setAttribute('aria-hidden', 'true');
  }
});

// -----------------------
// Observador de auth
// -----------------------
onAuthStateChanged(auth, (user) => {
  if (user && user.uid === ADMIN_UID) {
    loginArea.style.display = 'none';
    adminArea.style.display = 'block';
    userEmailSpan.textContent = user.email || 'Usuario';

    // Fetch initial data
    fetchAndPopulate();
  } else {
    // Cleanup
    if (unsubscribeSnapshot) {
      unsubscribeSnapshot();
      unsubscribeSnapshot = null;
    }
    loginArea.style.display = 'block';
    adminArea.style.display = 'none';
    confirmModal.style.display = 'none';
    deleteDocId = null;
    tblBody.innerHTML = '';
  }
});

// -----------------------
// Función para escapar HTML
// -----------------------
function escapeHtml(str) {
  if (str == null) return '';
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[c]);
}
