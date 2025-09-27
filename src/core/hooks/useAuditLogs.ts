'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, DocumentData, QueryDocumentSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/core/services/firebase';
import { useAuthContext } from '@/core/context/AuthContext';

export interface AuditLog {
  id: string;
  action: string;
  userEmail: string;
  details: string;
  businessId: string;
  createdAt: Timestamp; // Firestore Timestamp
}

interface AuditLogsState {
  logs: AuditLog[];
  loading: boolean;
  error: string | null;
}

export function useAuditLogs(): AuditLogsState {
  const { user } = useAuthContext();
  const [logsState, setLogsState] = useState<AuditLogsState>({
    logs: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!user) {
      setLogsState({ logs: [], loading: false, error: 'Usuario no autenticado.' });
      return;
    }

    const q = query(
      collection(db, 'audit_logs'), 
      where('businessId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const logs: AuditLog[] = [];
        querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          logs.push({ id: doc.id, ...doc.data() } as AuditLog);
        });
        setLogsState({ logs, loading: false, error: null });
      },
      (err) => {
        console.error(err);
        setLogsState({ logs: [], loading: false, error: 'Error al cargar los registros de auditoría.' });
      }
    );

    return () => unsubscribe();
  }, [user]);

  return logsState;
}
