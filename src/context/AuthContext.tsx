import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth, db } from '../../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  username: string | null;
  gender: string | null;
  role: 'administrador' | 'cliente' | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [role, setRole] = useState<'administrador' | 'cliente' | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();

            // Asignar automáticamente el rol según el correo del administrador
            const isAdmin = currentUser.email === 'luisiglebibi@gmail.com';
            const assignedRole = isAdmin ? 'administrador' : 'cliente';

            setUsername(userData.username || 'Usuario');
            setGender(userData.gender || null);
            setRole(assignedRole);

            console.log(`Usuario autenticado: ${userData.username}, Rol: ${assignedRole}`);
          } else {
            console.warn('No se encontró el documento del usuario en Firestore.');
            setUsername(null);
            setGender(null);
            setRole(null);
          }
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
        }
      } else {
        setUsername(null);
        setGender(null);
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUsername(null);
      setGender(null);
      setRole(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, username, gender, role, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
