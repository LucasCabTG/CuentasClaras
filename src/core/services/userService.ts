import { collection, doc, updateDoc, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from './firebase';

const usersCollection = collection(db, 'users');

export const updateUserRole = (uid: string, role: string) => {
  const userDoc = doc(db, 'users', uid);
  return updateDoc(userDoc, { role });
};

// For Super Admin: Update the profile limit for a user
export const updateUserProfileLimit = (uid: string, newLimit: number) => {
  const userDoc = doc(db, 'users', uid);
  return updateDoc(userDoc, { profileLimit: newLimit });
};

interface UserData {
  id: string;
  email: string;
  role: string;
  profileLimit?: number;
}

// For Super Admin: Get all user accounts
export const getAllUsers = async (): Promise<UserData[]> => {
  const querySnapshot = await getDocs(usersCollection);
  const users: UserData[] = [];
  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() } as UserData);
  });
  return users;
};

// This function is for admins to see their users.
// We might not need a real-time hook for this, so a simple async function is fine for now.
export const getUsersForBusiness = async (businessId: string): Promise<UserData[]> => {
  const q = query(usersCollection, where('businessId', '==', businessId));
  const querySnapshot = await getDocs(q);
  const users: UserData[] = [];
  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() } as UserData);
  });
  return users;
};
