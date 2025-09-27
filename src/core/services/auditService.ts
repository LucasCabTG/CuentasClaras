import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface AuditLogInput {
  action: string;
  userEmail: string;
  details: string;
  businessId: string;
}

export const logAction = (logData: AuditLogInput) => {
  const auditLogCollection = collection(db, 'audit_logs');
  return addDoc(auditLogCollection, {
    ...logData,
    createdAt: Timestamp.now(),
  });
};
