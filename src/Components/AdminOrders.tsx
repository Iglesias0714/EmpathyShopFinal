import React, { useEffect, useState } from 'react';
import { getOrdersFromFirestore, Order } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getProductByIdFromFirestore } from '../services/productService';

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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-indigo-600 text-white text-sm uppercase">
                  <tr>
                    <th className="py-4 px-6 text-left">Producto</th>
                    <th className="py-4 px-6 text-center">Estado</th>
                    <th className="py-4 px-6 text-center">Fecha</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {orders.map((order, index) => {
                    const product = products[order.productId];
                    return (
                      <tr
                        key={order.id}
                        className={`border-b border-gray-200 hover:bg-gray-50 ${
                          index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-4">
                            {product?.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-800 text-base">
                                {product?.name || 'Producto desconocido'}
                              </p>
                              <p className="text-sm text-gray-500 truncate max-w-xs">
                                {product?.description || 'Sin descripción'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span
                            className={`px-3 py-2 rounded-full text-sm ${
                              order.status === 'Entregado'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'Pagado'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-lg text-center text-gray-600">No tienes pedidos registrados.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientOrders;
