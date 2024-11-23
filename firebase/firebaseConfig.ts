// Importar las funciones necesarias del SDK de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; // Importar Firebase Storage

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC6qgptwHD8OeWn090ehS-t2r9dZQLUUiM",
  authDomain: "empathyshop-5749f.firebaseapp.com",
  projectId: "empathyshop-5749f",
  storageBucket: "empathyshop-5749f.appspot.com",
  messagingSenderId: "849308039313",
  appId: "1:849308039313:web:052138c02e5b833a27e730",
  measurementId: "G-HY5J8CH7XG"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializar Firestore (Base de datos), Auth (Autenticación) y Storage
const db = getFirestore(app);    // Firestore
const auth = getAuth(app);       // Autenticación
const storage = getStorage(app); // Storage para cargar archivos

// Exportar las instancias
export { db, auth, storage, analytics };
