import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Panel de Administración</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/usuarios"
          className="bg-[#4a9c2d] text-white p-6 rounded-lg shadow-lg text-center hover:bg-[#3a7c22] transition"
        >
          <h2 className="text-2xl font-bold">Gestionar Usuarios</h2>
          <p className="mt-2 text-sm">Ver, eliminar o gestionar cuentas de usuarios registrados.</p>
        </Link>
        <Link
          to="/admin/productos"
          className="bg-[#4a9c2d] text-white p-6 rounded-lg shadow-lg text-center hover:bg-[#3a7c22] transition"
        >
          <h2 className="text-2xl font-bold">Administrar Productos</h2>
          <p className="mt-2 text-sm">Agregar, editar o eliminar productos disponibles.</p>
        </Link>
        {/* Puedes agregar más enlaces aquí si tienes más funcionalidades */}
        <Link
          to="/"
          className="bg-gray-700 text-white p-6 rounded-lg shadow-lg text-center hover:bg-gray-900 transition"
        >
          <h2 className="text-2xl font-bold">Volver al Inicio</h2>
          <p className="mt-2 text-sm">Regresar a la página principal.</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
