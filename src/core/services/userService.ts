import { collection, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const usersCollection = collection(db, 'users');

export const updateUserRole = (uid: string, role: string) => {
  const userDoc = doc(db, 'users', uid);
  return updateDoc(userDoc, { role });
};

// This function is for admins to see their users.
// We might not need a real-time hook for this, so a simple async function is fine for now.
export const getUsersForBusiness = async (businessId: string) => {
  const q = query(usersCollection, where('businessId', '==', businessId));
  const querySnapshot = await getDocs(q);
  const users: { id: string; [key: string]: unknown }[] = [];
  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() });
  });
  return users;
};
