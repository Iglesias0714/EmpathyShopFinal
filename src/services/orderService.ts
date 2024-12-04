import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';

// Definición del tipo Product
export interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
}

// Definición del tipo Order
export interface Order {
  id: string;
  clientId: string;
  clientName?: string;
  productId: string;
  product?: Product; // Agregar producto al pedido
  status: 'Confirmación de pago' | 'Pagado' | 'Entregado';
  createdAt: string | Date;
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
      };
      return acc;
    }, {} as Record<string, Product>);

    return ordersSnapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt =
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate()
          : new Date(data.createdAt);

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

// Actualizar el estado de un pedido
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    throw error;
  }
};
