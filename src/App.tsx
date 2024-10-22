import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import ProductList from './Components/ProductList';
import Contact from './Components/Contact';
import About from './Components/About';
import Cart from './Components/Cart';
import Login from './Components/login';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#f7fade]">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <h2 className="text-3xl font-bold text-center mb-4">Bienvenido a EmpathyShop</h2>
                  <p className="text-center mb-8">Tu página pensada en la accesibilidad.</p>
                  <ProductList />
                </>
              }
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
