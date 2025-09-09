
// App logic: submit reserva to Firestore and admin button
import { auth, db, addDoc, collection, serverTimestamp, signInWithEmailAndPassword, onAuthStateChanged, signOut, query, orderBy, onSnapshot } from './firebase.js';

// Simple toast
function toast(msg, ok=true){
  let t = document.createElement('div');
  t.textContent = msg;
  t.style.position='fixed'; t.style.right='20px'; t.style.bottom='20px';
  t.style.padding='12px 16px'; t.style.borderRadius='8px'; t.style.boxShadow='0 2px 8px rgba(0,0,0,0.2)';
  t.style.background= ok? '#e6ffe6' : '#ffe6e6';
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 3000);
}

const form = document.getElementById('reservaForm');
if(form){
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    try{
      await addDoc(collection(db,'reservas'), {
        nombre: data.nombre||'',
        telefono: data.telefono||'',
        fecha: data.fecha||'',
        hora: data.hora||'',
        descripcion: data.descripcion||'',
        createdAt: serverTimestamp()
      });
      form.reset();
      toast('Reserva enviada ✅', true);
    }catch(err){
      console.error(err);
      toast('Error al enviar reserva', false);
    }
  });
}

// Admin button opens admin.html
const adminBtn = document.getElementById('adminBtn');
if(adminBtn) adminBtn.addEventListener('click', ()=> window.location.href = 'admin.html');
