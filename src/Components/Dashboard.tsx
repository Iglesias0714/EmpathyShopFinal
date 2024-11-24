import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Users, Package } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8 text-indigo-800">Panel de Administrador</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/admin/usuarios"
            className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition duration-300 ease-in-out"
          >
            <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700">Gestionar Usuarios</h3>
          </Link>
          <Link
            to="/admin/productos"
            className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition duration-300 ease-in-out"
          >
            <Package className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700">Gestionar Productos</h3>
          </Link>
          <Link
            to="/admin/productos/estadisticas"
            className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition duration-300 ease-in-out"
          >
            <BarChart2 className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700">Estadísticas de Productos</h3>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
