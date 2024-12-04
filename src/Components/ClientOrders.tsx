import React, { useEffect, useState } from 'react';
import { getOrdersFromFirestore, Order } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { getProductByIdFromFirestore } from '../services/productService'; // Asegúrate de que este servicio existe para obtener el producto.

const ClientOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Record<string, any>>({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getOrdersFromFirestore();
        const clientOrders = ordersData.filter((order) => order.clientId === user?.uid);
        setOrders(clientOrders);

        // Cargar datos de productos relacionados con los pedidos
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
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Seguimiento de tus Pedidos</h2>
      {orders.length === 0 ? (
        <p className="text-lg text-center text-gray-600">No tienes pedidos registrados.</p>
      ) : (
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
                      <p className="text-sm text-gray-500">{product?.description || 'Sin descripción'}</p>
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
      )}
    </div>
  );
};

export default ClientOrders;
