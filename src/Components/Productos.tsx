import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductsFromFirestore } from '../services/productService';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';

const Productos: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const fetchProducts = async () => {
    try {
      const productsFromDB = await getProductsFromFirestore();
      setProducts(productsFromDB as Product[]);
      setFilteredProducts(productsFromDB as Product[]);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === 'Todos') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((product) => product.category === category));
    }
  };

  const handleProductClick = (id: string) => {
    navigate(`/producto/${id}`);
  };

  const categories = ['Todos', 'movilidad', 'auditivos', 'salud y rehabilitación', 'productos para la vista'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-12">Nuestros Productos</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Barra lateral de categorías */}
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <h3 className="text-xl font-semibold bg-indigo-600 text-white py-4 px-6">Categorías</h3>
              <div className="p-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleFilter(category)}
                    className={`block w-full text-left px-4 py-3 rounded-md mb-2 transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-indigo-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-800 hover:bg-indigo-100'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Sección principal de productos */}
          <main className="lg:w-3/4">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-xl text-gray-600">No hay productos disponibles en esta categoría.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className={`bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      product.stock === 0 ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="h-48 bg-gray-100 flex justify-center items-center p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-indigo-800 mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-2xl font-bold text-indigo-600">${product.price}</p>
                        <p className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Productos;