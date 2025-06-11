// Importar funciones desde Firebase CDN v11.9.1
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { get, child } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Objeto de configuración usando variables de entorno de Vite (prefijo: VITE_)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Inicializar la app de Firebase
const app = initializeApp(firebaseConfig);

// Obtener referencia a la base de datos en tiempo real
const database = getDatabase(app);

// (Por ahora, no se exportan funciones)

// Función para guardar un voto
async function saveVote(productID) {
  try {
    // Referencia a la colección "votes"
    const votesRef = ref(database, 'votes');

    // Crear una nueva entrada para el voto
    const newVoteRef = push(votesRef);

    // Datos a guardar: productID y fecha
    await set(newVoteRef, {
      productID: productID,
      date: new Date().toISOString()
    });

    // Si todo va bien, devuelve mensaje de éxito
    return { success: true, message: 'Voto guardado correctamente.' };

  } catch (error) {
    // En caso de error
    return { success: false, message: 'Error al guardar el voto.', error };
  }
}

async function getVotes() {
  try {
    const dbRef = ref(database); // Referencia raíz
    const snapshot = await get(child(dbRef, 'votes')); // Lectura de "votes"

    if (snapshot.exists()) {
      return { success: true, data: snapshot.val() };
    } else {
      return { success: true, data: null, message: 'No hay votos registrados.' };
    }
  } catch (error) {
    return { success: false, message: 'Error al obtener los votos.', error };
  }
}
export { saveVote, getVotes };
