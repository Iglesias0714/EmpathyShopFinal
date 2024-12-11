import React, { useEffect, useState } from 'react';
import { getOrdersFromFirestore, updateOrderStatus, Order } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const ordersData = await getOrdersFromFirestore();
        const enhancedOrders = ordersData.map((order) => ({
          ...order,
          clientName: order.clientId ? order.clientName : 'Usuario eliminado',
        }));
        setOrders(enhancedOrders);
      } catch (error) {
        console.error('Error al obtener pedidos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  const handleStatusChange = async (orderId: string, status: Order['status'], productId: string) => {
    try {
      await updateOrderStatus(orderId, status, productId);
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

  const handleAdminCancelOrder = async (orderId: string, productId: string) => {
    try {
      await updateOrderStatus(orderId, 'Cancelado por el administrador', productId);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: 'Cancelado por el administrador' }
            : order
        )
      );
      alert('Pedido cancelado exitosamente.');
    } catch (error) {
      console.error('Error al cancelar el pedido:', error);
      alert('Hubo un error al cancelar el pedido.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <h2 className="text-4xl font-bold text-center mb-6 text-green-700">Gestión de Pedidos</h2>
      {orders.length === 0 ? (
        <div className="flex-grow flex items-center justify-center bg-white rounded-lg shadow-md">
          <p className="text-2xl text-gray-500">No hay pedidos registrados.</p>
        </div>
      ) : (
        <div className="flex-grow overflow-hidden bg-white rounded-lg shadow-lg flex flex-col">
          <div className="overflow-x-auto flex-grow">
            <table className="w-full">
              <thead className="bg-green-600 text-white text-sm uppercase">
                <tr>
                  <th className="py-4 px-6 text-left">Producto</th>
                  <th className="py-4 px-6 text-left">Cliente</th>
                  <th className="py-4 px-6 text-center">Estado</th>
                  <th className="py-4 px-6 text-center">Fecha</th>
                  <th className="py-4 px-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {orders.map((order, index) => (
                  <tr
                    key={order.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        {order.product && (
                          <img
                            src={order.product.image}
                            alt={order.product.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-green-200"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-800 text-base">
                            {order.product ? order.product.name : 'Producto desconocido'}
                          </p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {order.product ? order.product.description : 'Sin descripción'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`font-medium text-base ${
                          order.clientId ? 'text-gray-800' : 'text-red-500'
                        }`}
                      >
                        {order.clientName}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-3 py-2 rounded-full text-sm ${
                          order.status === 'Entregado'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'Pagado'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'Cancelado por el cliente' ||
                              order.status === 'Cancelado por el administrador'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {order.status === 'Cancelado por el cliente' ||
                      order.status === 'Cancelado por el administrador' ? (
                        <p className="text-gray-500 text-sm">Sin acciones</p>
                      ) : (
                        <div>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as Order['status'], order.productId)
                            }
                            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                          >
                            <option value="Confirmación de pago">Confirmación de pago</option>
                            <option value="Pagado">Pagado</option>
                            <option value="Entregado">Entregado</option>
                          </select>
                          <button
                            onClick={() => handleAdminCancelOrder(order.id, order.productId)}
                            className="ml-4 bg-red-500 text-white py-2 px-4 rounded text-sm hover:bg-red-700 transition"
                          >
                            Cancelar Pedido
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
