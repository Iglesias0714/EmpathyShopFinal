import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { Product } from '../types';

// Función para agregar un producto a Firestore
export const addProductToFirestore = async (productData: Omit<Product, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      stock: productData.stock || 0, // Asigna un stock inicial si no se proporciona
    });
    console.log('Producto agregado con éxito a Firestore con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al agregar el producto:', error instanceof Error ? error.message : error);
    throw error;
  }
};

// Función para obtener todos los productos de Firestore
export const getProductsFromFirestore = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]; // Asegura que el tipo de datos sea Product[]
    return products;
  } catch (error) {
    console.error('Error al obtener los productos:', error instanceof Error ? error.message : error);
    throw error;
  }
};

// Obtiene un producto por su ID desde Firestore
export const getProductByIdFromFirestore = async (id: string): Promise<Product | null> => {
  try {
    const productRef = doc(db, 'products', id); // Obtiene la referencia al documento
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      return { id: productSnap.id, ...productSnap.data() } as Product; // Retorna los datos del producto
    } else {
      console.warn(`No se encontró el producto con ID: ${id}`);
      return null;
    }
  } catch (error) {
    console.error('Error al obtener el producto por ID:', error);
    throw error;
  }
};

// Función para actualizar un producto en Firestore
export const updateProductInFirestore = async (
  productId: string,
  updatedData: Partial<Omit<Product, 'id'>>
) => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, updatedData);
    console.log('Producto actualizado con éxito:', productId);
  } catch (error) {
    console.error('Error al actualizar el producto:', error instanceof Error ? error.message : error);
    throw error;
  }
};

// Función para actualizar el stock de un producto
export const updateProductStock = async (productId: string, newStock: number) => {
  if (newStock < 0) {
    throw new Error('El stock no puede ser negativo.');
  }

  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, { stock: newStock });
    console.log('Stock del producto actualizado con éxito:', productId);
  } catch (error) {
    console.error('Error al actualizar el stock del producto:', error instanceof Error ? error.message : error);
    throw error;
  }
};

// Función para eliminar un producto de Firestore
export const deleteProductFromFirestore = async (productId: string) => {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
    console.log('Producto eliminado con éxito:', productId);
  } catch (error) {
    console.error('Error al eliminar el producto:', error instanceof Error ? error.message : error);
    throw error;
  }
};

// Función para obtener el conteo de productos por categoría
export const getProductsByCategory = async (): Promise<Record<string, number>> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const categoryCount: Record<string, number> = {};

    querySnapshot.docs.forEach((doc) => {
      const data = doc.data() as Product;
      if (data.category) {
        categoryCount[data.category] = (categoryCount[data.category] || 0) + 1;
      }
    });

    return categoryCount;
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error instanceof Error ? error.message : error);
    throw error;
  }
};

// Función para contar el total de productos disponibles
export const getTotalAvailableProducts = async (): Promise<number> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const totalAvailable = querySnapshot.docs.filter((doc) => {
      const data = doc.data() as Product;
      return data.stock > 0; // Contar solo productos con stock > 0
    }).length;

    return totalAvailable;
  } catch (error) {
    console.error('Error al contar productos disponibles:', error instanceof Error ? error.message : error);
    throw error;
  }
};
