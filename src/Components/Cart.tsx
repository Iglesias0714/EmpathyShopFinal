import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import { updateProductStock } from '../services/productService';
import MercadoPagoButton from './MercadoPagoButton';

interface CartProps {
  amount: number; // Aseguramos que esta propiedad es requerida
}

const Cart: React.FC<CartProps> = ({ amount }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([]);
  const [total, setTotal] = useState(amount);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      try {
        const cartKey = `cart_${user.uid}`;
        const storedCart = JSON.parse(localStorage.getItem(cartKey) || '[]') as {
          product: Product;
          quantity: number;
        }[];

        setCartItems(storedCart);

        const cartTotal = storedCart.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0
        );
        setTotal(cartTotal);
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleSimulatePurchase = async () => {
    if (!user) return;

    try {
      for (const item of cartItems) {
        await createOrder({
          clientId: user.uid,
          productId: item.product.id,
          status: 'Confirmación de pago',
          createdAt: new Date().toISOString(),
        });

        const newStock = item.product.stock - item.quantity;
        await updateProductStock(item.product.id, newStock);
      }

      alert('Compra simulada exitosamente.');

      const cartKey = `cart_${user.uid}`;
      localStorage.removeItem(cartKey);
      setCartItems([]);
      setTotal(0);
    } catch (error) {
      console.error('Error al simular compra:', error);
      alert('Hubo un error al simular la compra.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-indigo-500 h-12 w-12 mb-4"></div>
          <div className="text-xl font-semibold text-indigo-700">Cargando carrito...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden p-8">
            <h1 className="text-3xl font-bold text-indigo-800 mb-6">Carrito de Compras</h1>
            <p className="text-lg text-center text-gray-600">
              Por favor inicia sesión para ver tu carrito.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden p-8">
          <h1 className="text-3xl font-bold text-indigo-800 mb-6">Carrito de Compras</h1>
          {cartItems.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="border border-indigo-100 p-4 rounded-lg shadow-md bg-white">
                    <div className="w-full h-48 bg-gray-100 flex justify-center items-center overflow-hidden rounded-lg">
                      <img
                        src={item.product.image || '/placeholder.png'}
                        alt={item.product.name || 'Producto'}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <h3 className="text-xl font-bold mt-4 text-indigo-800">{item.product.name || 'Producto'}</h3>
                    <p className="text-gray-600">{item.product.description || 'Sin descripción'}</p>
                    <p className="text-indigo-600 font-bold text-lg">${item.product.price}</p>
                    <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="text-right mt-6">
                <h2 className="text-2xl font-bold text-indigo-800">
                  Total: <span className="text-indigo-600">${total.toFixed(2)}</span>
                </h2>
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={handleSimulatePurchase}
                  className="bg-yellow-500 text-white py-2 px-4 rounded text-sm hover:bg-yellow-600 transition"
                >
                  Simular Compra
                </button>
                <MercadoPagoButton
                  amount={total}
                  label="Proceder a la Compra"
                  onClick={() => console.log('Redirigiendo al pago con Mercado Pago')}
                />
              </div>
            </div>
          ) : (
            <p className="text-lg text-center text-gray-600">Tu carrito está vacío.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
