import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import MercadoPagoButton from './MercadoPagoButton';

interface CartProps {
  amount?: number; // Agregamos `amount` como una propiedad opcional
}

const Cart: React.FC<CartProps> = ({ amount = 0 }) => {
  const { user } = useAuth(); // Información del usuario autenticado
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([]);
  const [total, setTotal] = useState(amount); // Usamos `amount` como valor inicial para `total`
  const [isLoading, setIsLoading] = useState(true); // Estado para mostrar el proceso de carga

  useEffect(() => {
    if (user) {
      try {
        const cartKey = `cart_${user.uid}`; // Clave específica para cada usuario
        const storedCart = JSON.parse(localStorage.getItem(cartKey) || '[]') as {
          product: Product;
          quantity: number;
        }[];

        setCartItems(storedCart);

        // Calcular el total del carrito
        const cartTotal = storedCart.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0
        );
        setTotal(cartTotal);
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
      } finally {
        setIsLoading(false); // Terminar el proceso de carga
      }
    } else {
      setIsLoading(false); // Si no hay usuario, terminar el proceso de carga
    }
  }, [user]);

  const handleRemoveItem = (index: number) => {
    if (!user) return;
    const cartKey = `cart_${user.uid}`;
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    // Recalcular el total
    const newTotal = updatedCart.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    setTotal(newTotal);
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
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="mt-4 text-red-500 font-bold hover:text-red-700 transition-colors duration-200"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md mt-6">
                <p className="text-yellow-800">
                  <strong className="font-semibold">Nota:</strong> Por favor, asegúrate de ingresar correctamente el monto total al
                  realizar tu pago. Pagos incompletos no serán procesados.
                </p>
              </div>
              <div className="text-right mt-6">
                <h2 className="text-2xl font-bold text-indigo-800">
                  Total: <span className="text-indigo-600">${total.toFixed(2)}</span>
                </h2>
              </div>
              <div className="mt-6 flex justify-center">
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

