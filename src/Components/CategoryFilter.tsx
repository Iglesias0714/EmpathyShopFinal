import React from 'react';

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <div className="flex flex-col space-y-2 mb-4">
      <button
        className={`px-4 py-2 rounded ${selectedCategory === '' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => setSelectedCategory('')}
      >
        Todos
      </button>
      <button
        className={`px-4 py-2 rounded ${selectedCategory === 'movilidad' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => setSelectedCategory('movilidad')}
      >
        Movilidad
      </button>
      <button
        className={`px-4 py-2 rounded ${selectedCategory === 'auditivos' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => setSelectedCategory('auditivos')}
      >
        Auditivos
      </button>
      <button
        className={`px-4 py-2 rounded ${
          selectedCategory === 'salud' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
        onClick={() => setSelectedCategory('salud')}
      >
        Salud y Rehabilitación
      </button>
      <button
        className={`px-4 py-2 rounded ${
          selectedCategory === 'productos para la vista' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
        onClick={() => setSelectedCategory('productos para la vista')}
      >
        Productos para la Vista
      </button>
    </div>
  );
};

export default CategoryFilter;
