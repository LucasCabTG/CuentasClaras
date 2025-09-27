'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '@/core/services/firebase';
import { useAuthContext } from '../context/AuthContext';

export interface Product {
  id: string;
  name: string;
  category: string;
  purchasePrice: number;
  salePrice: number;
  distributor: string;
  quantity: number;
  specialPrices: string;
  businessId: string;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export function useProducts(): ProductsState {
  const { user } = useAuthContext();
  const [productsState, setProductsState] = useState<ProductsState>({
    products: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!user) {
      setProductsState({ products: [], loading: false, error: 'Usuario no autenticado.' });
      return;
    }

    const q = query(collection(db, 'products'), where('businessId', '==', user.uid));

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const products: Product[] = [];
        querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          products.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProductsState({ products, loading: false, error: null });
      },
      (err) => {
        console.error(err);
        setProductsState({ products: [], loading: false, error: 'Error al cargar los productos.' });
      }
    );

    return () => unsubscribe();
  }, [user]);

  return productsState;
}
