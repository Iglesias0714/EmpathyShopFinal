import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, doc, updateDoc, Timestamp, getDoc, addDoc } from 'firebase/firestore';

// Definición del tipo Product
export interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  stock: number; // Asegúrate de que el stock esté definido
}

export interface Order {
  id: string;
  clientId: string;
  clientName?: string;
  productId: string;
  product?: Product;
  status: 'Confirmación de pago' | 'Pagado' | 'Entregado' | 'Cancelado por el cliente' | 'Cancelado por el administrador';
  createdAt: string; // Cambiar a string para consistencia
}

// Obtener pedidos desde Firestore con los nombres de los clientes y productos
export const getOrdersFromFirestore = async (): Promise<Order[]> => {
  try {
    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const productsSnapshot = await getDocs(collection(db, 'products'));

    // Mapear usuarios por su ID
    const users = usersSnapshot.docs.reduce((acc, userDoc) => {
      const userData = userDoc.data();
      acc[userDoc.id] = userData.username || 'Usuario desconocido';
      return acc;
    }, {} as Record<string, string>);

    // Mapear productos por su ID
    const products = productsSnapshot.docs.reduce((acc, productDoc) => {
      const productData = productDoc.data();
      acc[productDoc.id] = {
        id: productDoc.id,
        name: productData.name || 'Producto desconocido',
        description: productData.description || 'Sin descripción',
        image: productData.image || '/placeholder.png',
        stock: productData.stock || 0, // Asegura que el stock esté definido
      };
      return acc;
    }, {} as Record<string, Product>);

    return ordersSnapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt =
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString() // Convertir a string
          : new Date(data.createdAt).toISOString(); // Convertir a string

      return {
        id: doc.id,
        clientId: data.clientId,
        clientName: users[data.clientId] || 'Usuario desconocido',
        productId: data.productId,
        product: products[data.productId], // Asignar producto al pedido
        status: data.status,
        createdAt,
      };
    });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    throw error;
  }
};

// Actualizar el estado de un pedido y ajustar stock
export const updateOrderStatus = async (orderId: string, status: string, productId: string) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });

    // Ajustar el stock según el estado
    if (status === 'Pagado') {
      await adjustStock(productId, -1); // Disminuir stock en 1
    } else if (status === 'Cancelado por el cliente' || status === 'Cancelado por el administrador') {
      await adjustStock(productId, 1); // Aumentar stock en 1
    }
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    throw error;
  }
};

// Ajustar el stock de un producto
const adjustStock = async (productId: string, change: number) => {
  try {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      const productData = productSnap.data();
      const newStock = (productData.stock || 0) + change;
      await updateDoc(productRef, { stock: Math.max(newStock, 0) }); // Asegurar que el stock no sea negativo
    }
  } catch (error) {
    console.error('Error al ajustar el stock:', error);
    throw error;
  }
};

// Crear un nuevo pedido en Firestore
export const createOrder = async (orderData: {
  clientId: string;
  productId: string;
  status: 'Confirmación de pago' | 'Pagado' | 'Entregado';
  createdAt: string; // Cambiar a string para consistencia
}) => {
  try {
    const ordersCollection = collection(db, 'orders');
    const docRef = await addDoc(ordersCollection, orderData);
    console.log('Pedido creado con éxito con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    throw error;
  }
};
