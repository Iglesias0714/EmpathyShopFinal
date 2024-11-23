import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Manejar redirección al detalle del producto
  const handleViewDetails = () => {
    navigate(`/producto/${product.id}`);
  };

  // Manejar añadir al carrito
  const handleAddToCart = () => {
    if (!user) {
      alert('Por favor inicia sesión para añadir productos al carrito.');
      return;
    }

    const cartKey = `cart_${user.uid}`;
    const storedCart = JSON.parse(localStorage.getItem(cartKey) || '[]') as {
      product: Product;
      quantity: number;
    }[];

    const existingProductIndex = storedCart.findIndex((item) => item.product.id === product.id);

    if (existingProductIndex !== -1) {
      // Incrementar la cantidad si ya está en el carrito
      storedCart[existingProductIndex].quantity += 1;
    } else {
      // Añadir producto nuevo al carrito
      storedCart.push({ product, quantity: 1 });
    }

    localStorage.setItem(cartKey, JSON.stringify(storedCart));
    alert('Producto añadido al carrito.');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div
        onClick={handleViewDetails}
        className="cursor-pointer w-full h-48 bg-gray-100 flex justify-center items-center overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-[#4a9c2d] font-bold text-lg mb-4">${product.price.toFixed(2)}</p>
        <button
          className="w-full bg-[#f0c869] text-[#333] py-2 px-4 rounded hover:bg-[#e8b84d] transition-colors duration-300"
          onClick={handleAddToCart}
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
