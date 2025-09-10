// main.js
import { db, addDoc, collection, serverTimestamp } from './firebase.js';

function toast(msg, ok = true) {
  let t = document.createElement('div');
  t.textContent = msg;
  t.className = `toast ${ok ? 'success' : 'error'}`;
  t.setAttribute('role', 'alert');
  document.getElementById('toast-container').appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

const form = document.getElementById('reservaForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formMessage = document.getElementById('form-message');
    const data = Object.fromEntries(new FormData(form).entries());

    // Validación
    if (!data.nombre || !data.telefono || !data.fecha || !data.hora || !data.personas) {
      if (formMessage) {
        formMessage.hidden = false;
        formMessage.textContent = 'Por favor, completa todos los campos.';
        formMessage.style.color = 'red';
      }
      toast('Por favor, completa todos los campos.', false);
      return;
    }

    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(data.telefono)) {
      if (formMessage) {
        formMessage.hidden = false;
        formMessage.textContent = 'Por favor, introduce un número de teléfono válido.';
        formMessage.style.color = 'red';
      }
      toast('Por favor, introduce un número de teléfono válido.', false);
      return;
    }

    const numPersonas = parseInt(data.personas, 10);
    if (isNaN(numPersonas) || numPersonas < 1 || numPersonas > 20) {
      if (formMessage) {
        formMessage.hidden = false;
        formMessage.textContent = 'Por favor, selecciona entre 1 y 20 personas.';
        formMessage.style.color = 'red';
      }
      toast('Por favor, selecciona entre 1 y 20 personas.', false);
      return;
    }

    try {
      await addDoc(collection(db, 'reservas'), {
        nombre: data.nombre || '',
        telefono: data.telefono || '',
        fecha: data.fecha || '',
        hora: data.hora || '',
        tipo: data.tipo || 'Cena',
        personas: numPersonas,
        createdAt: serverTimestamp()
      });
      form.reset();
      if (formMessage) {
        formMessage.hidden = false;
        formMessage.textContent = '¡Reserva enviada con éxito!';
        formMessage.style.color = 'green';
      }
      toast('Reserva enviada ✅', true);
    } catch (err) {
      console.error('Error al enviar reserva:', err);
      let errorMessage = 'Error al enviar reserva';
      if (err.code === 'permission-denied') {
        errorMessage = 'No tienes permisos para guardar la reserva.';
      } else if (err.code === 'unavailable') {
        errorMessage = 'No se pudo conectar con el servidor.';
      }
      if (formMessage) {
        formMessage.hidden = false;
        formMessage.textContent = errorMessage;
        formMessage.style.color = 'red';
      }
      toast(errorMessage, false);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const fechaInput = document.getElementById('fecha');
  if (fechaInput) {
    const today = new Date().toISOString().split('T')[0];
    fechaInput.setAttribute('min', today);
  }

  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
