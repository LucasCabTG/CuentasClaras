'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '@/core/services/firebase';
import { useAuthContext } from '@/core/context/AuthContext';
import { BundleItem } from '../services/promotionService';

export interface Promotion {
  id: string;
  name: string;
  description: string;
  price: number;
  bundleItems: BundleItem[];
  businessId: string;
  allowedPaymentMethods?: string[];
}

interface PromotionsState {
  promotions: Promotion[];
  loading: boolean;
  error: string | null;
}

export function usePromotions(): PromotionsState {
  const { user } = useAuthContext();
  const [promotionsState, setPromotionsState] = useState<PromotionsState>({
    promotions: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!user) {
      setPromotionsState({ promotions: [], loading: false, error: 'Usuario no autenticado.' });
      return;
    }

    const q = query(collection(db, 'promotions'), where('businessId', '==', user.uid));

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const promotions: Promotion[] = [];
        querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          promotions.push({ id: doc.id, ...doc.data() } as Promotion);
        });
        setPromotionsState({ promotions, loading: false, error: null });
      },
      (err) => {
        console.error(err);
        setPromotionsState({ promotions: [], loading: false, error: 'Error al cargar las promociones.' });
      }
    );

    return () => unsubscribe();
  }, [user]);

  return promotionsState;
}
