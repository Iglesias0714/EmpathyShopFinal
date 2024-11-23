import React, { useState } from 'react';
import { addProductToFirestore } from '../services/productService';
import { Product } from '../types';

interface ProductFormProps {
  userId: string | undefined; // ID del usuario autenticado
}

const ProductForm: React.FC<ProductFormProps> = ({ userId }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>(''); // Acepta tanto número como cadena vacía
  const [image, setImage] = useState('');
  const [category, setCategory] = useState<Product['category']>('movilidad');
  const [loading, setLoading] = useState(false); // Indicador de carga

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert('No se encontró el ID del usuario. Intenta iniciar sesión nuevamente.');
      return;
    }

    if (!name || !description || !price || !category) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    try {
      setLoading(true); // Activar indicador de carga

      // Agregar el producto a Firestore
      await addProductToFirestore({
        name,
        description,
        price: Number(price), // Asegurar que el precio sea un número
        image,
        category,
      });

      alert('Producto agregado con éxito.');
      
      // Restablecer los campos del formulario
      setName('');
      setDescription('');
      setPrice('');
      setImage('');
      setCategory('movilidad');
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      alert('Hubo un error al agregar el producto. Intenta de nuevo.');
    } finally {
      setLoading(false); // Desactivar indicador de carga
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold text-gray-800">Agregar Nuevo Producto</h2>

      <input
        type="text"
        placeholder="Nombre del producto"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Precio"
        value={price}
        onChange={(e) => setPrice(e.target.valueAsNumber)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="URL de la imagen"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as Product['category'])}
        className="w-full p-2 border rounded"
        required
      >
        <option value="movilidad">Movilidad</option>
        <option value="auditivos">Auditivos</option>
        <option value="salud y rehabilitación">Salud y Rehabilitación</option>
        <option value="productos para la vista">Productos para la Vista</option>
      </select>
      <button
        type="submit"
        className={`px-4 py-2 text-white rounded ${
          loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
        }`}
        disabled={loading}
      >
        {loading ? 'Agregando...' : 'Agregar Producto'}
      </button>
    </form>
  );
};

export default ProductForm;
