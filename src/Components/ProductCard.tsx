import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-[#4a9c2d] font-bold text-lg mb-4">${product.price.toFixed(2)}</p>
        <button
          className="w-full bg-[#f0c869] text-[#333] py-2 px-4 rounded hover:bg-[#e8b84d] transition-colors duration-300"
          onClick={() => addToCart(product)}
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
