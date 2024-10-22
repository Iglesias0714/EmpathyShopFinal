import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-[#4a9c2d] text-white w-full">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.png" alt="EmpathyShop Logo" className="w-20 h-20 mr-4" />
          <h1 className="text-2xl font-bold">EmpathyShop</h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:underline">Inicio</Link></li>
            <li><Link to="/products" className="hover:underline">Productos</Link></li>
            <li><Link to="/about" className="hover:underline">Acerca de</Link></li>
            <li><Link to="/contact" className="hover:underline">Contacto</Link></li>
            <li><Link to="/cart" className="hover:underline">Carrito</Link></li>
            <li><Link to="/login" className="hover:underline">Iniciar Sesión</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
