import React, { useState, useEffect } from 'react';
import {
  getProductsFromFirestore,
  updateProductInFirestore,
  deleteProductFromFirestore,
  addProductToFirestore,
} from '../services/productService';
import { Product } from '../types';
import { PlusCircle, Edit, Trash2, X, Save } from 'lucide-react';

const AdminProductos: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Product>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    stock: 0,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsFromDB = await getProductsFromFirestore();
      setProducts(productsFromDB as Product[]);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setIsEditing(product.id);
    setEditData({ ...product });
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditData({});
  };

  const handleSaveEdit = async () => {
    if (isEditing) {
      if (
        !editData.name ||
        !editData.price ||
        !editData.category ||
        !editData.description ||
        editData.stock === undefined
      ) {
        alert('Por favor, completa todos los campos antes de guardar.');
        return;
      }
      try {
        await updateProductInFirestore(isEditing, editData as Product);
        alert('Producto editado con éxito');
        setIsEditing(null);
        setEditData({});
        fetchProducts();
      } catch (error) {
        console.error('Error al editar el producto:', error);
        alert('Hubo un error al editar el producto.');
      }
    }
  };

  const handleDelete = async (productId: string) => {
    const confirmDelete = window.confirm('¿Seguro que desea eliminar este producto?');
    if (confirmDelete) {
      try {
        await deleteProductFromFirestore(productId);
        alert('Producto eliminado con éxito');
        fetchProducts();
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        alert('Hubo un error al eliminar el producto.');
      }
    }
  };

  const handleAddProduct = async () => {
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.category ||
      !newProduct.description ||
      newProduct.stock === undefined
    ) {
      alert('Por favor, completa todos los campos para agregar el producto.');
      return;
    }
    try {
      await addProductToFirestore(newProduct as Product);
      alert('Producto agregado con éxito');
      setNewProduct({ name: '', description: '', price: 0, image: '', category: '', stock: 0 });
      setShowAddForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      alert('Hubo un error al agregar el producto.');
    }
  };

  const renderForm = (
    data: Partial<Product>,
    setData: React.Dispatch<React.SetStateAction<Partial<Product>>>,
    isNewProduct: boolean = false
  ) => (
    <>
      <input
        type="text"
        value={data.name || ''}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        className="w-full p-2 border rounded mb-2"
        placeholder="Nombre del producto"
      />
      <textarea
        value={data.description || ''}
        onChange={(e) => setData({ ...data, description: e.target.value })}
        className="w-full p-2 border rounded mb-2"
        placeholder="Descripción del producto"
      />
      <input
        type="number"
        value={data.price || 0}
        onChange={(e) => setData({ ...data, price: Number(e.target.value) })}
        className="w-full p-2 border rounded mb-2"
        placeholder="Precio"
      />
      <input
        type="number"
        value={data.stock || 0}
        onChange={(e) => setData({ ...data, stock: Number(e.target.value) })}
        className="w-full p-2 border rounded mb-2"
        placeholder="Cantidad en stock"
      />
      <input
        type="text"
        value={data.image || ''}
        onChange={(e) => setData({ ...data, image: e.target.value })}
        className="w-full p-2 border rounded mb-2"
        placeholder="URL de la imagen"
      />
      <select
        value={data.category || ''}
        onChange={(e) => setData({ ...data, category: e.target.value })}
        className="w-full p-2 border rounded mb-2 appearance-none bg-white"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.5rem center',
          backgroundSize: '1.5em 1.5em',
        }}
      >
        <option value="">Seleccionar Categoría</option>
        <option value="movilidad">Movilidad</option>
        <option value="auditivos">Auditivos</option>
        <option value="salud y rehabilitación">Salud y Rehabilitación</option>
        <option value="productos para la vista">Productos para la Vista</option>
      </select>
      {isNewProduct ? (
        <button
          onClick={handleAddProduct}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition flex items-center justify-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Guardar Producto
        </button>
      ) : (
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSaveEdit}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </button>
          <button
            onClick={handleCancelEdit}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition flex items-center"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8 text-indigo-800">Administrar Productos</h2>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="mb-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md flex items-center justify-center"
        >
          {showAddForm ? <X className="w-5 h-5 mr-2" /> : <PlusCircle className="w-5 h-5 mr-2" />}
          {showAddForm ? 'Cerrar Formulario' : 'Agregar Producto'}
        </button>

        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-2xl font-bold mb-4 text-indigo-800">Nuevo Producto</h3>
            {renderForm(newProduct, setNewProduct, true)}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
              >
                {isEditing === product.id ? (
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-4 text-indigo-800">Editar Producto</h3>
                    {renderForm(editData, setEditData)}
                  </div>
                ) : (
                  <>
                    <div className="w-full h-64 bg-gray-100 flex justify-center items-center overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-indigo-800">{product.name}</h3>
                      <p className="text-gray-600 mb-4">{product.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-2xl font-bold text-green-600">${product.price}</p>
                        <p className="text-sm font-semibold text-indigo-600">Stock: {product.stock}</p>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">Categoría: {product.category}</p>
                      <div className="flex justify-between">
                        <button
                          onClick={() => handleEdit(product)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductos;