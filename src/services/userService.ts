import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

// Tipo para representar un usuario
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date | string;
}

const userCollection = collection(db, 'users');
const adminEmail = 'luisiglebibi@gmail.com'; // Correo del administrador

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

// Función para obtener los usuarios, excluyendo al administrador
export const getUsers = async (): Promise<User[]> => {
  try {
    const userSnapshot = await getDocs(userCollection);
    const userList = userSnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<User, 'id'>), // Forzamos el tipo de los datos obtenidos
      }))
      .filter((user) => user.email !== adminEmail); // Excluir al administrador
    return userList;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    throw error;
  }
};

// Función para eliminar un usuario de Firestore
export const deleteUserFromFirestore = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);

    // Eliminar el usuario
    await deleteDoc(userRef);

    console.log(`Usuario con ID ${userId} eliminado con éxito.`);

    // Actualizar los pedidos relacionados
    await removeUserFromOrders(userId);
  } catch (error) {
    console.error('Error al eliminar el usuario: ', error);
    throw error;
  }
};

// Función para actualizar los pedidos relacionados con un usuario eliminado
const removeUserFromOrders = async (userId: string) => {
  try {
    const ordersCollection = collection(db, 'orders');
    const q = query(ordersCollection, where('clientId', '==', userId));
    const ordersSnapshot = await getDocs(q);

    const updates = ordersSnapshot.docs.map(async (orderDoc) => {
      const orderRef = doc(db, 'orders', orderDoc.id);
      await updateDoc(orderRef, { clientName: 'Usuario eliminado', clientId: null });
    });

    await Promise.all(updates);
    console.log(`Pedidos asociados al usuario ${userId} han sido actualizados.`);
  } catch (error) {
    console.error('Error al actualizar los pedidos después de eliminar un usuario:', error);
    throw error;
  }
};

// Función para contar el total de usuarios excluyendo al administrador
export const getTotalUsers = async (): Promise<number> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const totalUsers = querySnapshot.docs.filter(
      (doc) => (doc.data() as User).email !== adminEmail
    ).length; // Excluir al administrador
    return totalUsers;
  } catch (error) {
    console.error(
      'Error al contar usuarios:',
      error instanceof Error ? error.message : error
    );
    throw error;
  }
};

// Función para contar usuarios por género excluyendo al administrador
export const getUsersByGender = async (): Promise<{ male: number; female: number }> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    let male = 0;
    let female = 0;

    // Iterar por los documentos y contar usuarios según el género
    querySnapshot.docs.forEach((doc) => {
      const data = doc.data(); // Obtener los datos del documento
      if (typeof data.gender === 'string') {
        if (data.gender.toLowerCase() === 'male') {
          male++;
        } else if (data.gender.toLowerCase() === 'female') {
          female++;
        }
      }
    });

    return { male, female };
  } catch (error) {
    console.error(
      'Error al contar usuarios por género:',
      error instanceof Error ? error.message : error
    );
    throw error;
  }
};

