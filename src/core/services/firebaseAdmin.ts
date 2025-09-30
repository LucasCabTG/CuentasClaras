
import * as admin from 'firebase-admin';

// This function ensures that Firebase Admin is initialized only once.
export const initAdmin = async () => {
  if (admin.apps.length > 0) {
    return {
      adminAuth: admin.auth(),
      adminDb: admin.firestore(),
    };
  }

  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // The private key needs to be parsed correctly from the env variable
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });

  return {
    adminAuth: admin.auth(),
    adminDb: admin.firestore(),
  };
};
