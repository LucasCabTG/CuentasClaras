
import * as admin from 'firebase-admin';

// This function ensures that Firebase Admin is initialized only once.
export const initAdmin = async () => {
  if (admin.apps.length > 0) {
    return {
      adminAuth: admin.auth(),
      adminDb: admin.firestore(),
    };
  }

  // Check if we are in a production environment (like Vercel, Cloud Run, etc.)
  if (process.env.NODE_ENV === 'production') {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } else {
    // For local development, use the service account details from .env.local
    console.log('--- DEBUG FIREBASE ADMIN --- ');
    console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
    console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
    console.log('Private Key exists:', !!process.env.FIREBASE_PRIVATE_KEY);
    console.log('-------------------------- ');

    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // The private key needs to be parsed correctly from the env variable
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccountInfo),
    });
  }

  return {
    adminAuth: admin.auth(),
    adminDb: admin.firestore(),
  };
};
