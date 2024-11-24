import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image: string;
}

const ProductStats: React.FC = () => {
  const [categories, setCategories] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map((doc) => doc.data() as Product);

        // Contar productos por categoría
        const categoryCounts: { [key: string]: number } = {};
        productsList.forEach((product) => {
          if (product.category) {
            categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
          }
        });
        setCategories(categoryCounts);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8 text-indigo-800">Estadísticas de Productos</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Productos por Categoría</h3>
            <ul className="divide-y divide-gray-200">
              {Object.keys(categories).length > 0 ? (
                Object.entries(categories).map(([category, count]) => (
                  <li key={category} className="py-4 flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-700">{category}</span>
                    <span className="text-xl font-bold text-indigo-600">{count}</span>
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-600">No hay productos registrados.</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductStats;
