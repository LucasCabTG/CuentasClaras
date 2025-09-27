import { collection, addDoc, updateDoc, deleteDoc, doc, DocumentData } from 'firebase/firestore';
import { db } from './firebase';

export interface DistributorInput {
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  businessId: string;
}

const distributorsCollection = collection(db, 'distributors');

export const addDistributor = (distributorData: Omit<DistributorInput, 'businessId'> & { businessId: string }) => {
  return addDoc(distributorsCollection, {
    ...distributorData,
    createdAt: new Date(),
  });
};

export const updateDistributor = (distributorId: string, distributorData: DocumentData) => {
  const distributorDoc = doc(db, 'distributors', distributorId);
  return updateDoc(distributorDoc, distributorData);
};

export const deleteDistributor = (distributorId: string) => {
  const distributorDoc = doc(db, 'distributors', distributorId);
  return deleteDoc(distributorDoc);
};
