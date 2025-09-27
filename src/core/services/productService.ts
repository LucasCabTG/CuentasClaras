import { collection, addDoc, deleteDoc, doc, updateDoc, DocumentData } from 'firebase/firestore';
import { db } from './firebase';

// Define the structure of a product without its ID, as this is what we're sending to Firestore
export interface ProductInput {
  name: string;
  category: string;
  purchasePrice: number;
  salePrice: number;
  distributor: string;
  quantity: number;
  specialPrices: string;
  businessId: string;
}

const productsCollection = collection(db, 'products');

// Function to add a product
export const addProduct = (productData: Omit<ProductInput, 'businessId'> & { businessId: string }) => {
  return addDoc(productsCollection, {
    ...productData,
    createdAt: new Date(),
  });
};

// Function to update a product
export const updateProduct = (productId: string, productData: DocumentData) => {
  const productDoc = doc(db, 'products', productId);
  return updateDoc(productDoc, productData);
};

// Function to delete a product
export const deleteProduct = (productId: string) => {
  const productDoc = doc(db, 'products', productId);
  return deleteDoc(productDoc);
};
