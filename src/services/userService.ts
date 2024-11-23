import { collection, addDoc, getDocs } from 'firebase/firestore'; // Eliminé 'query' y 'where'
import { db } from '../../firebase/firebaseConfig';

const userCollection = collection(db, 'users');

// Función para agregar un usuario
export const addUser = async (name: string, email: string, role: string) => {
  try {
    await addDoc(userCollection, {
      name,
      email,
      role, // Puede ser 'cliente' o 'vendedor'
      createdAt: new Date(),
    });
    console.log('Usuario añadido con éxito.');
  } catch (error) {
    console.error('Error al añadir el usuario: ', error);
  }
};

// Función para obtener los usuarios
export const getUsers = async () => {
  try {
    const userSnapshot = await getDocs(userCollection);
    const userList = userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return userList;
  } catch (error) {
    console.error('Error al obtener los usuarios: ', error);
    throw error;
  }
};
