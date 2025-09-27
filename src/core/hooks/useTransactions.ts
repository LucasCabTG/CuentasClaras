'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, DocumentData, QueryDocumentSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/core/services/firebase';
import { useAuthContext } from '../context/AuthContext';

interface TransactionItem {
  itemId: string;
  name: string;
  type: 'product' | 'promotion';
  quantity: number;
  salePrice: number;
  bundleItems?: { productId: string; quantity: number }[];
}

export interface Transaction {
  id: string;
  businessId: string;
  paymentMethod: string;
  total: number;
  items: TransactionItem[];
  createdAt: Timestamp; // Firestore Timestamp
  customerId?: string;
  customerName?: string;
}

interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

export function useTransactions(): TransactionsState {
  const { user } = useAuthContext();
  const [transactionsState, setTransactionsState] = useState<TransactionsState>({
    transactions: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!user) {
      setTransactionsState({ transactions: [], loading: false, error: 'Usuario no autenticado.' });
      return;
    }

    const q = query(
      collection(db, 'transactions'), 
      where('businessId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const transactions: Transaction[] = [];
        querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          transactions.push({ id: doc.id, ...doc.data() } as Transaction);
        });
        setTransactionsState({ transactions, loading: false, error: null });
      },
      (err) => {
        console.error(err);
        setTransactionsState({ transactions: [], loading: false, error: 'Error al cargar las transacciones.' });
      }
    );

    return () => unsubscribe();
  }, [user]);

  return transactionsState;
}
