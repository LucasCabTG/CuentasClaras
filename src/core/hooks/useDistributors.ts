'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '@/core/services/firebase';
import { useAuthContext } from '../context/AuthContext';

export interface Distributor {
  id: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  businessId: string;
}

interface DistributorsState {
  distributors: Distributor[];
  loading: boolean;
  error: string | null;
}

export function useDistributors(): DistributorsState {
  const { user } = useAuthContext();
  const [distributorsState, setDistributorsState] = useState<DistributorsState>({
    distributors: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!user) {
      setDistributorsState({ distributors: [], loading: false, error: 'Usuario no autenticado.' });
      return;
    }

    const q = query(collection(db, 'distributors'), where('businessId', '==', user.uid));

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const distributors: Distributor[] = [];
        querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          distributors.push({ id: doc.id, ...doc.data() } as Distributor);
        });
        setDistributorsState({ distributors, loading: false, error: null });
      },
      (err) => {
        console.error(err);
        setDistributorsState({ distributors: [], loading: false, error: 'Error al cargar los distribuidores.' });
      }
    );

    return () => unsubscribe();
  }, [user]);

  return distributorsState;
}
