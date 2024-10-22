import React from 'react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  return (
    <div className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-4 text-[#4a9c2d]">Carrito de Compras</h2>
      {cart.length === 0 ? (
        <p className="text-center text-gray-700">Tu carrito está vacío.</p>
      ) : (
        <div>
          <ul>
            {cart.map((product) => (
              <li key={product.id} className="flex justify-between items-center border-b py-2">
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-gray-600">${product.price.toFixed(2)}</p>
                </div>
                <button
                  className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                  onClick={() => removeFromCart(product.id)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          <button
            className="mt-4 bg-[#4a9c2d] text-white py-2 px-4 rounded hover:bg-[#3a7c22] transition-colors duration-300"
            onClick={clearCart}
          >
            Vaciar carrito
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
