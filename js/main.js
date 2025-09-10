document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile nav ---
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // --- Reveal on scroll ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // --- Tabs (Carta) ---
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      document.querySelectorAll('.tab').forEach(t => {
        if (t !== tab) t.setAttribute('aria-selected', 'false');
      });
    });
  });

  // --- Toast system ---
  function showToast({ title = 'Listo', description = '', duration = 4000 } = {}) {
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
  }

  // Exponer showToast globalmente
  window.showToast = showToast;

  // --- Data (easy to update) ---
  const events = [
    {
      title: 'Viernes de Sorteo y Trasnoche',
      desc: 'Noche con DJ, música y premios. ¡Participá desde Instagram!',
      img: 'assets/noche-viernes.jpg'
    },
    {
      title: 'Noche de Rock',
      desc: 'Música en vivo a partir de las 22:30 hs. Derecho a espectáculo.',
      img: 'assets/rock.jpg'
    },
    {
      title: 'Noche de Karaoke',
      desc: 'Vení a cantar, divertirte y compartir con amigos toda la noche.',
      img: 'assets/karaoke.jpg'
    }
  ];

  const drinks = [
    { name: 'Gin de Uva', desc: 'Nuestro cóctel insignia, fresco y único.', img: 'assets/gin-uva.jpg' },
    { name: 'Cervezas Artesanales', desc: 'Variedad local para todos los gustos.', img: 'assets/birra.jpg' },
    { name: 'Clásicos de Barra', desc: 'Negroni, Old Fashioned, Whisky Sour y más.', img: 'assets/negroni.jpg' },
    { name: 'Vino Tinto Malbec', desc: 'Selección de bodegas argentinas.', img: 'assets/vino.malbec.jpg' },
    { name: 'Agua Tónica Premium', desc: 'Ideal para combinar o sola.', img: 'assets/aguatonica.jpg' },
    { name: 'Limonada Artesanal', desc: 'Refrescante, con un toque de menta.', img: 'assets/limonada.jpg' }
  ];

  const cocktails = [
    { name: 'Mojito', desc: 'Refrescante con menta fresca y ron.', img: 'assets/mojito.jpg' },
    { name: 'Margarita', desc: 'Tequila, lima y un toque salado.', img: 'assets/margarita.jpg' },
    { name: 'Caipirinha', desc: 'Cachaça, lima y azúcar, puro Brasil.', img: 'assets/caipirinha.jpg' },
    { name: 'Daiquiri', desc: 'Ron, limón y un toque dulce.', img: 'assets/daiquiri.jpg' },
    { name: 'Piña Colada', desc: 'Cremosa, con ron y sabor tropical.', img: 'assets/piña-colada.jpg' },
    { name: 'Aperol Spritz', desc: 'Refrescante con prosecco y un toque cítrico.', img: 'assets/aperol.jpg' }
  ];

  const appetizers = [
    { name: 'Tabla de Quesos', desc: 'Selección de quesos artesanales con frutos secos.', img: 'assets/tabla-quesos.jpg' },
    { name: 'Pinchos Mixtos', desc: 'Variedad de carnes y vegetales asados.', img: 'assets/pinchos.jpg' },
    { name: 'Bruschettas', desc: 'Tostadas con tomate, albahaca y oliva.', img: 'assets/bruschettas.jpg' },
    { name: 'Empanadas Criollas', desc: 'Rellenas de carne cortada a cuchillo.', img: 'assets/emp-criollas.jpg' },
    { name: 'Bastones de Mozzarella', desc: 'Crujientes con salsa marinara.', img: 'assets/bastones.jpg' },
    { name: 'Nachos con Guacamole', desc: 'Tortillas crocantes con salsa fresca.', img: 'assets/nachos.jpg' }
  ];

  const dishes = [
    { name: 'Hamburguesa 1985', desc: 'Jugosa, perfecta para cualquier día.', img: 'assets/hamburguesa.jpg' },
    { name: 'Papas Rústicas', desc: 'Crocantes por fuera, suaves por dentro.', img: 'assets/papas.jpg' },
    { name: 'Milanesa con Puré', desc: 'Clásica milanesa con puré cremoso.', img: 'assets/mila-pure.jpg' },
    { name: 'Ensalada César', desc: 'Lechuga, crutones, parmesano y aderezo.', img: 'assets/ensalada-cesar.jpg' },
    { name: 'Pizza Artesanal', desc: 'Muzzarella, jamón y morrones.', img: 'assets/pizza-artesanal.jpg' },
    { name: 'Pollo a la Parrilla', desc: 'Jugoso con guarnición de vegetales.', img: 'assets/pollo.jpg' }
  ];

  const pastas = [
    { name: 'Ravioles de Ricota', desc: 'Rellenos caseros con salsa de tomate.', img: 'assets/ravioles-ricota.jpg' },
    { name: 'Fetuccini Alfredo', desc: 'Salsa cremosa con parmesano.', img: 'assets/fetuccini.jpg' },
    { name: 'Spaghetti Bolognesa', desc: 'Salsa de carne tradicional.', img: 'assets/spaghetti.jpg' },
    { name: 'Ñoquis de Papa', desc: 'Suaves con salsa rosa.', img: 'assets/noquis-papa.jpg' },
    { name: 'Lasagna Clásica', desc: 'Capas de pasta, carne y bechamel.', img: 'assets/lasagna.jpg' },
    { name: 'Canelones de Espinaca', desc: 'Rellenos con espinaca y ricota.', img: 'assets/canelones-espinaca.jpg' }
  ];

  // Render helpers
  function renderCards(list, targetId) {
    const target = document.getElementById(targetId);
    target.innerHTML = list.map(item => `
      <article class="card reveal">
        <img src="${item.img}" alt="${item.name || item.title}" loading="lazy" />
        <h3>${item.name || item.title}</h3>
        <p>${item.desc}</p>
      </article>
    `).join('');
    target.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  renderCards(events, 'events-list');
  renderCards(drinks, 'drinks-list');
  renderCards(cocktails, 'cocktails-list');
  renderCards(appetizers, 'appetizers-list');
  renderCards(dishes, 'dishes-list');
  renderCards(pastas, 'pastas-list');

  // --- Reservas form ---
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
