import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface AuditLogInput {
  action: string;
  userEmail: string;
  profileName: string; // Nombre
  businessId: string;
  details?: string;
}

export const logAction = (logData: AuditLogInput) => {
  const auditLogsCollection = collection(db, 'auditLogs');
  return addDoc(auditLogsCollection, {
    ...logData,
    timestamp: Timestamp.now(),
  });
};
