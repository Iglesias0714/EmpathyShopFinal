import React, { useEffect, useState } from 'react';
import { getOrdersFromFirestore, Order } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getProductByIdFromFirestore } from '../services/productService'; // Asegúrate de que este servicio existe para obtener el producto.

const ClientOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Record<string, any>>({});
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchOrders = async () => {
      try {
        const ordersData = await getOrdersFromFirestore();
        const clientOrders = ordersData.filter((order) => order.clientId === user?.uid);
        setOrders(clientOrders);

        const productPromises = clientOrders.map(async (order) => {
          const product = await getProductByIdFromFirestore(order.productId);
          return { id: order.productId, data: product };
        });
        const productResults = await Promise.all(productPromises);
        const productMap: Record<string, any> = {};
        productResults.forEach(({ id, data }) => {
          productMap[id] = data;
        });
        setProducts(productMap);
      } catch (error) {
        console.error('Error al obtener pedidos:', error);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden p-8">
            <h1 className="text-3xl font-bold text-indigo-800 mb-6">Mis Pedidos</h1>
            <p className="text-lg text-center text-gray-600">
              Por favor inicia sesión para ver tus pedidos.
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
          <h1 className="text-3xl font-bold text-indigo-800 mb-6">Mis Pedidos</h1>
          {orders.length > 0 ? (
            <table className="table-auto w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Producto</th>
                  <th className="px-4 py-2 text-left">Estado</th>
                  <th className="px-4 py-2 text-left">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const product = products[order.productId];
                  return (
                    <tr key={order.id} className="border-b">
                      <td className="px-4 py-2 flex items-center space-x-4">
                        {product?.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded shadow-md"
                          />
                        )}
                        <div>
                          <p className="font-bold">{product?.name || 'Producto desconocido'}</p>
                          <p className="text-sm text-gray-500">
                            {product?.description || 'Sin descripción'}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-white ${
                            order.status === 'Pagado'
                              ? 'bg-green-500'
                              : order.status === 'Entregado'
                              ? 'bg-blue-500'
                              : 'bg-yellow-500'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-lg text-center text-gray-600">No tienes pedidos registrados.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientOrders;
