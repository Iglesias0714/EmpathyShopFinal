import React, { useEffect, useState } from 'react';
import { getOrdersFromFirestore, updateOrderStatus, Order } from '../services/orderService';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getOrdersFromFirestore();
        setOrders(ordersData);
      } catch (error) {
        console.error('Error al obtener pedidos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      alert('Estado actualizado con éxito.');
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Hubo un error al actualizar el estado.');
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Cargando pedidos...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Gestión de Pedidos</h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No hay pedidos registrados.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300 rounded-md shadow-md">
          <thead>
            <tr className="bg-green-100 text-left text-gray-700">
              <th className="px-4 py-2 border border-gray-300">Producto</th>
              <th className="px-4 py-2 border border-gray-300">Cliente</th>
              <th className="px-4 py-2 border border-gray-300">Estado</th>
              <th className="px-4 py-2 border border-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-gray-100`}
              >
                <td className="px-4 py-4 border border-gray-300 flex items-center space-x-4">
                  {order.product ? (
                    <>
                      <img
                        src={order.product.image}
                        alt={order.product.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-700">{order.product.name}</p>
                        <p className="text-sm text-gray-500">{order.product.description}</p>
                      </div>
                    </>
                  ) : (
                    <div>
                      <p className="font-semibold text-gray-700">Producto desconocido</p>
                      <p className="text-sm text-gray-500">Sin descripción</p>
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 border border-gray-300">
                  {order.clientName || 'Cliente desconocido'}
                </td>
                <td className="px-4 py-4 border border-gray-300">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
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
                <td className="px-4 py-4 border border-gray-300">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value as Order['status'])
                    }
                    className="border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-green-300"
                  >
                    <option value="Confirmación de pago">Confirmación de pago</option>
                    <option value="Pagado">Pagado</option>
                    <option value="Entregado">Entregado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders;
