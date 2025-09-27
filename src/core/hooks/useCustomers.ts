
'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '@/core/services/firebase';
import { useAuthContext } from '../context/AuthContext';
import { Customer } from '../services/customerService';

interface CustomersState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

export function useCustomers(): CustomersState {
  const { user } = useAuthContext();
  const [customersState, setCustomersState] = useState<CustomersState>({
    customers: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!user) {
      setCustomersState({ customers: [], loading: false, error: 'Usuario no autenticado.' });
      return;
    }

    const q = query(
      collection(db, 'customers'), 
      where('businessId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const customers: Customer[] = [];
        querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          customers.push({ id: doc.id, ...doc.data() } as Customer);
        });
        setCustomersState({ customers, loading: false, error: null });
      },
      (err) => {
        console.error(err);
        setCustomersState({ customers: [], loading: false, error: 'Error al cargar los clientes.' });
      }
    );

    return () => unsubscribe();
  }, [user]);

  return customersState;
}
