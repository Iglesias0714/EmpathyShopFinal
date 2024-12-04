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
// Función para contar el total de usuarios
export const getTotalUsers = async (): Promise<number> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.size; // Tamaño de la colección
  } catch (error) {
    console.error('Error al contar usuarios:', error instanceof Error ? error.message : error);
    throw error;
  }
};

// Función para contar usuarios por género
export const getUsersByGender = async (): Promise<{ male: number; female: number }> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    let male = 0;
    let female = 0;

    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.gender === 'male') {
        male++;
      } else if (data.gender === 'female') {
        female++;
      }
    });

    return { male, female };
  } catch (error) {
    console.error('Error al contar usuarios por género:', error instanceof Error ? error.message : error);
    throw error;
  }
};
