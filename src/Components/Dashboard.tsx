import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Package, PieChart, ClipboardList } from 'lucide-react'; // Agregamos ClipboardList para representar el icono del pedido

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8 text-indigo-800">Panel de Administrador</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Enlace para gestionar usuarios */}
          <Link
            to="/admin/usuarios"
            className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition duration-300 ease-in-out"
          >
            <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700">Gestionar Usuarios</h3>
          </Link>

          {/* Enlace para gestionar productos */}
          <Link
            to="/admin/productos"
            className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition duration-300 ease-in-out"
          >
            <Package className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700">Gestionar Productos</h3>
          </Link>

          {/* Enlace para ver indicadores generales */}
          <Link
            to="/admin/indicadores"
            className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition duration-300 ease-in-out"
          >
            <PieChart className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700">Indicadores Generales</h3>
          </Link>

          {/* Nuevo enlace para gestionar pedidos */}
          <Link
            to="/admin/pedidos"
            className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition duration-300 ease-in-out"
          >
            <ClipboardList className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700">Gestionar Pedidos</h3>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
