import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, Info, Phone, Package, List } from 'lucide-react';

const Header: React.FC = () => {
  const { user, username, role, logout } = useAuth();

  return (
    <header className="bg-[#4a9c2d] text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and name */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <img src="/logo.png" alt="EmpathyShop Logo" className="w-12 h-12 rounded-full shadow-md" />
            <h1 className="text-2xl font-bold tracking-tight">EmpathyShop</h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6 items-center">
              <li>
                <Link
                  to="/productos"
                  className="hover:text-[#d9f99d] transition-colors flex items-center space-x-1"
                >
                  <Package size={18} />
                  <span>Productos</span>
                </Link>
              </li>
              {role !== 'administrador' && (
                <>
                  <li>
                    <Link
                      to="/cart"
                      className="hover:text-[#d9f99d] transition-colors flex items-center space-x-1"
                    >
                      <ShoppingCart size={18} />
                      <span>Carrito</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/mis-pedidos"
                      className="hover:text-[#d9f99d] transition-colors flex items-center space-x-1"
                    >
                      <List size={18} />
                      <span>Mis Pedidos</span>
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link
                  to="/contact"
                  className="hover:text-[#d9f99d] transition-colors flex items-center space-x-1"
                >
                  <Phone size={18} />
                  <span>Contacto</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-[#d9f99d] transition-colors flex items-center space-x-1"
                >
                  <Info size={18} />
                  <span>Acerca de</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm font-medium hidden md:inline-block">
                Hola, <span className="font-bold">{username || user.email}</span>
              </span>
            )}
            {role === 'administrador' && (
              <Link
                to="/admin"
                className="bg-white text-[#4a9c2d] px-4 py-2 rounded-full text-sm font-bold hover:bg-[#d9f99d] transition-colors shadow-md"
              >
                Panel de Administración
              </Link>
            )}
            {user ? (
              <button
                onClick={logout}
                className="text-white hover:text-red-200 transition-colors focus:outline-none flex items-center space-x-1"
              >
                <LogOut size={18} />
                <span className="hidden md:inline">Cerrar sesión</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="text-white hover:text-[#d9f99d] transition-colors flex items-center space-x-1"
              >
                <User size={18} />
                <span className="hidden md:inline">Iniciar Sesión</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
