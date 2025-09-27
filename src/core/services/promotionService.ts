import { collection, addDoc, updateDoc, deleteDoc, doc, DocumentData } from 'firebase/firestore';
import { db } from './firebase';

export interface BundleItem {
  productId: string;
  productName: string;
  quantity: number;
}

export interface PromotionInput {
  name: string;
  description: string;
  price: number;
  bundleItems: BundleItem[];
  businessId: string;
  allowedPaymentMethods: string[];
}

const promotionsCollection = collection(db, 'promotions');

export const addPromotion = (promotionData: Omit<PromotionInput, 'businessId'> & { businessId: string }) => {
  return addDoc(promotionsCollection, {
    ...promotionData,
    createdAt: new Date(),
  });
};

export const updatePromotion = (promotionId: string, promotionData: DocumentData) => {
  const promotionDoc = doc(db, 'promotions', promotionId);
  return updateDoc(promotionDoc, promotionData);
};

export const deletePromotion = (promotionId: string) => {
  const promotionDoc = doc(db, 'promotions', promotionId);
  return deleteDoc(promotionDoc);
};
