import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../../firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  gender: string;
  phone: string;
}

export const registerUser = async ({ username, email, password, gender, phone }: RegisterData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Asignar rol de "cliente" por defecto
    const role = email === "luisiglebibi@gmail.com" ? "administrador" : "cliente";

    // Guardar datos adicionales en Firestore
    await setDoc(doc(db, 'users', user.uid), {
      username,
      email,
      role, // Asegura que siempre se asigna un rol
      gender,
      phone,
      createdAt: new Date().toISOString(),
    });

    console.log(`Usuario ${email} registrado con éxito. Rol asignado: ${role}`);
    return user;
  } catch (error: any) {
    console.error('Error al registrar usuario:', error.message);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Este correo electrónico ya está en uso. Por favor, usa otro.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('La contraseña es demasiado débil. Por favor, usa una más segura.');
    } else {
      throw new Error('Error al registrar el usuario. Intenta de nuevo.');
    }
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log(`Inicio de sesión exitoso para: ${email}`);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error al iniciar sesión:', error.message);
    if (error.code === 'auth/user-not-found') {
      throw new Error('Usuario no encontrado. Verifica tu correo electrónico o regístrate.');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Contraseña incorrecta. Inténtalo de nuevo.');
    } else {
      throw new Error('Error al iniciar sesión. Intenta de nuevo.');
    }
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('Sesión cerrada exitosamente.');
  } catch (error: any) {
    console.error('Error al cerrar sesión:', error.message);
    throw new Error('Hubo un problema al cerrar la sesión. Intenta de nuevo.');
  }
};
