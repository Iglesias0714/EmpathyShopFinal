import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Contact from './Components/Contact';
import About from './Components/About';
import Cart from './Components/Cart';
import Login from './Components/login';
import Register from './Components/Register';
import Productos from './Components/Productos';
import AdminUsuarios from './Components/AdminUsuarios';
import AdminProductos from './Components/AdminProductos';
import Dashboard from './Components/Dashboard';
import { AuthProvider } from './context/AuthContext';
import ProductDetail from './Components/ProductDetail';
import ForgotPassword from './Components/ForgotPassword';
import AdminIndicators from './Components/AdminIndicators';
import AdminOrders from './Components/AdminOrders';
import ClientOrders from './Components/ClientOrders';

const App: React.FC = () => {
  // Define el valor de `amount` para el componente `Cart`
  const defaultAmount = 0;

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-[#f7fade]">
          {/* Cabecera */}
          <Header />

          {/* Contenido principal */}
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Página de inicio */}
              <Route
                path="/"
                element={
                  <div className="text-center">
                    <h2 className="text-5xl font-bold mb-8">Bienvenido a EmpathyShop</h2>
                    <p className="text-2xl">Tu página pensada en la accesibilidad.</p>
                  </div>
                }
              />

              {/* Rutas de las páginas principales */}
              <Route path="/productos" element={<Productos />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/mis-pedidos" element={<ClientOrders />} />
              <Route
                path="/cart"
                element={<Cart amount={defaultAmount} />} // Pasamos `amount` aquí
              />

              {/* Rutas de autenticación */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Rutas administrativas */}
              <Route path="/admin" element={<Dashboard />} /> {/* Panel principal del admin */}
              <Route path="/admin/usuarios" element={<AdminUsuarios />} />
              <Route path="/admin/productos" element={<AdminProductos />} />
              <Route path="/admin/indicadores" element={<AdminIndicators />} />
              <Route path="/admin/pedidos" element={<AdminOrders />} />


              {/* Ruta para el detalle de un producto */}
              <Route path="/producto/:id" element={<ProductDetail />} />
            </Routes>
          </main>

          {/* Pie de página */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
