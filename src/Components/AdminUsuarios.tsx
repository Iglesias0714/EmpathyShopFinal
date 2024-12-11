import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { Trash2, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Importar el contexto de autenticación

interface User {
  id: string;
  email: string;
  username: string;
  gender: string;
  phone: string;
  createdAt?: Timestamp;
}

const AdminUsuarios: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ totalUsers: 0, totalMen: 0, totalWomen: 0 });

  const { user } = useAuth(); // Obtener el estado de usuario desde el contexto
  const navigate = useNavigate(); // Hook para redirigir

  useEffect(() => {
    // Redirigir al login si el usuario no está autenticado
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            email: data.email || 'No disponible',
            username: data.username || 'Sin Nombre',
            gender: data.gender || 'No especificado',
            phone: data.phone || 'No disponible',
            createdAt: data.createdAt,
          } as User; // Asegurar el tipo User
        });
        setUsers(usersList);

        // Calcular totales
        const totalUsers = usersList.length;
        const totalMen = usersList.filter((user) => user.gender.toLowerCase() === 'hombre').length;
        const totalWomen = usersList.filter((user) => user.gender.toLowerCase() === 'mujer').length;

        setTotals({ totalUsers, totalMen, totalWomen });
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, navigate]); // Escuchar cambios en el usuario o la navegación

  const handleDelete = async (userId: string) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setUsers(users.filter((user) => user.id !== userId));

        // Recalcular totales después de eliminar
        const updatedUsers = users.filter((user) => user.id !== userId);
        const totalUsers = updatedUsers.length;
        const totalMen = updatedUsers.filter((user) => user.gender.toLowerCase() === 'hombre').length;
        const totalWomen = updatedUsers.filter((user) => user.gender.toLowerCase() === 'mujer').length;

        setTotals({ totalUsers, totalMen, totalWomen });

        alert('Usuario eliminado con éxito.');
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Hubo un error al intentar eliminar el usuario.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8 text-indigo-800 flex items-center justify-center">
          <Users className="w-10 h-10 mr-4" />
          Gestionar Usuarios
        </h2>

        {/* Totales */}
        <div className="bg-white shadow-xl rounded-lg p-6 mb-6 flex justify-around">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-indigo-700">{totals.totalUsers}</h3>
            <p className="text-gray-600">Total de Usuarios</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-green-700">{totals.totalMen}</h3>
            <p className="text-gray-600">Hombres Registrados</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-pink-700">{totals.totalWomen}</h3>
            <p className="text-gray-600">Mujeres Registradas</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : users.length > 0 ? (
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Correo</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Sexo</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Teléfono</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Fecha de Creación</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                      <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.createdAt
                          ? new Date(user.createdAt.toDate()).toLocaleDateString()
                          : 'No Disponible'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-lg p-8 text-center">
            <p className="text-xl text-gray-600">No se encontraron usuarios registrados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsuarios;
