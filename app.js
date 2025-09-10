import { db, addDoc, collection, serverTimestamp } from './firebase.js';

// Importar showToast desde main.js (asumiendo que está disponible globalmente)
const showToast = window.showToast || function({ title = 'Listo', description = '', duration = 4000 } = {}) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast reveal visible';
  toast.innerHTML = `
    <div>
      <p class="toast__title">${title}</p>
      <p class="toast__desc">${description}</p>
    </div>
    <button class="toast__close" aria-label="Cerrar notificación">&times;</button>
  `;
  container.appendChild(toast);

  const timer = setTimeout(() => toast.remove(), duration);
  toast.querySelector('.toast__close').addEventListener('click', () => {
    clearTimeout(timer);
    toast.remove();
  });
};

const form = document.getElementById('reservaForm');
const formMessage = document.getElementById('form-message');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener valores del formulario
    const nombre = form.nombre.value.trim();
    const telefono = form.telefono.value.trim();
    const fecha = form.fecha.value;
    const hora = form.hora.value;
    const tipo = form.tipo.value;
    const personas = parseInt(form.personas.value, 10);

    // Validar todos los campos
    let isValid = true;
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
      const errorElement = document.getElementById(`${input.id}-error`);
      if (!input.checkValidity()) {
        errorElement.hidden = false;
        isValid = false;
      } else {
        errorElement.hidden = true;
      }
    });

    // Validación adicional para el teléfono
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(telefono)) {
      document.getElementById('telefono-error').hidden = false;
      isValid = false;
    }

    // Validación para el número de personas
    if (isNaN(personas) || personas < 1 || personas > 20) {
      document.getElementById('personas-error').hidden = false;
      isValid = false;
    }

    if (!isValid) {
      formMessage.hidden = false;
      formMessage.textContent = 'Por favor, corrige los errores en el formulario.';
      formMessage.style.color = 'red';
      showToast({ title: 'Error', description: 'Completa todos los campos correctamente.', duration: 5000 });
      return;
    }

    try {
      // Guardar la reserva en Firestore
      await addDoc(collection(db, 'reservas'), {
        nombre,
        telefono,
        fecha,
        hora,
        tipo,
        personas,
        createdAt: serverTimestamp()
      });

      // Mostrar mensaje de éxito
      const msg = `¡Reserva confirmada para ${nombre} (${telefono}) el ${new Date(fecha).toLocaleDateString()} a las ${hora} para ${personas} persona(s)!`;
      formMessage.hidden = false;
      formMessage.textContent = '¡Reserva enviada con éxito!';
      formMessage.style.color = 'green';
      showToast({ title: 'Reserva confirmada', description: msg, duration: 7000 });

      // Reiniciar el formulario
      form.reset();
    } catch (err) {
      console.error('Error al guardar la reserva:', err);
      let errorMessage = 'Ocurrió un error al guardar la reserva. Intenta de nuevo.';
      if (err.code === 'permission-denied') {
        errorMessage = 'No tienes permisos para guardar la reserva. Contacta al administrador.';
      } else if (err.code === 'unavailable') {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      }
      formMessage.hidden = false;
      formMessage.textContent = errorMessage;
      formMessage.style.color = 'red';
      showToast({ title: 'Error', description: errorMessage, duration: 5000 });
    }
  });
}

// Admin button opens admin.html
const adminBtn = document.getElementById('adminBtn');
if (adminBtn) {
  adminBtn.addEventListener('click', () => window.location.href = 'admin.html');
}
