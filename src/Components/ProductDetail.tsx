import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductByIdFromFirestore } from '../services/productService';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import MercadoPagoButton from './MercadoPagoButton';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const productData = await getProductByIdFromFirestore(id);
          setProduct(productData);
        } catch (error) {
          console.error('Error al obtener los detalles del producto:', error);
        }
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      alert('Por favor inicia sesión para añadir productos al carrito.');
      return;
    }

    const cartKey = `cart_${user.uid}`;
    const cartItems = JSON.parse(localStorage.getItem(cartKey) || '[]') as {
      product: Product;
      quantity: number;
    }[];

    const existingProductIndex = cartItems.findIndex((item) => item.product.id === product?.id);

    if (existingProductIndex !== -1) {
      cartItems[existingProductIndex].quantity += 1;
    } else {
      cartItems.push({ product: product as Product, quantity: 1 });
    }

    localStorage.setItem(cartKey, JSON.stringify(cartItems));
    alert('Producto añadido al carrito.');
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-indigo-500 h-12 w-12 mb-4"></div>
          <div className="text-xl font-semibold text-indigo-700">Cargando detalles del producto...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2">
              <div className="h-96 bg-gray-100 flex items-center justify-center p-8">
                <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain rounded-lg shadow-md" />
              </div>
            </div>
            <div className="w-full lg:w-1/2 p-8">
              <h1 className="text-3xl font-bold text-indigo-800 mb-4">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-6">{product.description}</p>
              <div className="flex items-center justify-between mb-6">
                <p className="text-3xl font-bold text-indigo-600">${product.price}</p>
                <p className={`text-sm font-semibold px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                </p>
              </div>
              <p className="text-md text-gray-600 mb-4">
                Categoría: <span className="font-semibold text-indigo-600">{product.category}</span>
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
                <p className="text-yellow-800">
                  <strong className="font-semibold">Nota:</strong> Por favor, asegúrate de ingresar correctamente el monto al realizar tu pago. Pagos incompletos no serán procesados.
                </p>
              </div>
              {product.stock > 0 && (
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-grow px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg shadow-lg hover:from-indigo-600 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
                  >
                    Añadir al Carrito
                  </button>
                  <MercadoPagoButton
                    amount={product.price} // Asegúrate de que `product.price` sea un número
                    label="Comprar ahora"
                    onClick={() => console.log('Redirigiendo al pago de:', product.name)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
