import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminIndicators: React.FC = () => {
  const [productsByCategory, setProductsByCategory] = useState<{ name: string; count: number }[]>([]);
  const [clientsGender, setClientsGender] = useState<{ name: string; count: number }[]>([]);
  const [transactionsByCategory, setTransactionsByCategory] = useState<{ name: string; count: number }[]>([]);
  const [mostSoldProducts, setMostSoldProducts] = useState<{ name: string; count: number }[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirige al login si no hay usuario autenticado
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch products
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const products = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as any[];
        setTotalProducts(products.length);

        const categoryCount: { [key: string]: number } = {};
        products.forEach((product) => {
          categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
        });
        setProductsByCategory(
          Object.entries(categoryCount).map(([name, count]) => ({ name, count }))
        );

        // Fetch clients
        const clientsSnapshot = await getDocs(collection(db, 'users'));
        const clients = clientsSnapshot.docs.map((doc) => doc.data());
        setTotalClients(clients.length);

        const genderCount = { Hombres: 0, Mujeres: 0 };
        clients.forEach((client: any) => {
          if (client.gender?.toLowerCase() === 'hombre') genderCount.Hombres++;
          if (client.gender?.toLowerCase() === 'mujer') genderCount.Mujeres++;
        });
        setClientsGender([
          { name: 'Hombres', count: genderCount.Hombres },
          { name: 'Mujeres', count: genderCount.Mujeres },
        ]);

        // Fetch orders
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const orders = ordersSnapshot.docs.map((doc) => doc.data());
        setTotalTransactions(orders.length);

        const categoryTransactions: { [key: string]: number } = {};
        const productTransactions: { [key: string]: number } = {};

        orders.forEach((order: any) => {
          const product = products.find((p) => p.id === order.productId);
          if (product) {
            categoryTransactions[product.category] =
              (categoryTransactions[product.category] || 0) + 1;
            productTransactions[product.name] =
              (productTransactions[product.name] || 0) + 1;
          }
        });

        setTransactionsByCategory(
          Object.entries(categoryTransactions).map(([name, count]) => ({ name, count }))
        );

        setMostSoldProducts(
          Object.entries(productTransactions)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded shadow-md">
          <p className="font-bold">{`${label} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-indigo-800">
          Indicadores del Sistema
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Productos por Categoría */}
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Productos por Categoría</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={productsByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" barSize={20}>
                  {productsByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-center text-gray-600 mt-4">
              Total de Productos Disponibles: <span className="font-bold">{totalProducts}</span>
            </p>
          </div>

          {/* Clientes por Género */}
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Clientes por Género</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={clientsGender}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label
                >
                  {clientsGender.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-gray-600 mt-4">
              Total de Clientes Registrados: <span className="font-bold">{totalClients}</span>
            </p>
          </div>

          {/* Transacciones por Categoría */}
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Transacciones por Categoría
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={transactionsByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" barSize={20}>
                  {transactionsByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-center text-gray-600 mt-4">
              Total de Transacciones: <span className="font-bold">{totalTransactions}</span>
            </p>
          </div>

          {/* Productos Más Vendidos */}
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Productos Más Comprados
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mostSoldProducts.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" barSize={20}>
                  {mostSoldProducts.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminIndicators;
