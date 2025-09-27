import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface FeedbackInput {
  subject: string;
  message: string;
  userEmail: string;
  businessId: string;
}

export const submitFeedback = (feedbackData: FeedbackInput) => {
  const feedbackCollection = collection(db, 'feedback');
  return addDoc(feedbackCollection, {
    ...feedbackData,
    createdAt: Timestamp.now(),
    status: 'new', // default status
  });
};
