
'use client';

import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { logAction } from './auditService';

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const addCustomer = async (customerData: Omit<Customer, 'id'>, userEmail: string, profileName: string) => {
  const docRef = await addDoc(collection(db, 'customers'), customerData);
  await logAction({
    action: 'add_customer',
    userEmail,
    profileName,
    businessId: customerData.businessId,
    details: `Cliente agregado: ${customerData.name}`
  });
  return docRef.id;
};

export const updateCustomer = async (customerId: string, customerData: Partial<Customer>, userEmail: string, profileName: string, businessId: string) => {
  const customerRef = doc(db, 'customers', customerId);
  await updateDoc(customerRef, customerData);
  await logAction({
    action: 'update_customer',
    userEmail,
    profileName,
    businessId,
    details: `Cliente actualizado: ${customerData.name || ''} (ID: ${customerId})`
  });
};

export const deleteCustomer = async (customerId: string, userEmail: string, profileName: string, businessId: string) => {
  const customerRef = doc(db, 'customers', customerId);
  await deleteDoc(customerRef);
  await logAction({
    action: 'delete_customer',
    userEmail,
    profileName,
    businessId,
    details: `Cliente eliminado: ID ${customerId}`
  });
};

export const getCustomers = async (businessId: string): Promise<Customer[]> => {
  const q = query(collection(db, 'customers'), where('businessId', '==', businessId));
  const querySnapshot = await getDocs(q);
  const customers: Customer[] = [];
  querySnapshot.forEach((doc) => {
    customers.push({ id: doc.id, ...doc.data() } as Customer);
  });
  return customers;
};
