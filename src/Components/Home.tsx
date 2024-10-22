import React from 'react';
import ProductList from './ProductList';

const Home: React.FC = () => {
  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-4">Bienvenido a EmpathyShop</h2>
      <p className="text-center mb-8">Tu página pensada en la accesibilidad.</p>
      <ProductList />
    </>
  );
};

export default Home;
