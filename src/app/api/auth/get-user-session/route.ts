
import { NextResponse } from 'next/server';
import { initAdmin } from '@/core/services/firebaseAdmin';

export async function GET(request: Request) {
  console.log('[/api/get-user-session] - Request received.');
  try {
    console.log('[/api/get-user-session] - Initializing Firebase Admin...');
    const { adminAuth, adminDb } = await initAdmin();
    console.log('[/api/get-user-session] - Firebase Admin initialized.');
    
    const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      console.error('[/api/get-user-session] - Error: No token provided.');
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    console.log('[/api/get-user-session] - Verifying ID token...');
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    console.log('[/api/get-user-session] - Token verified for UID:', decodedToken.uid);

    console.log('[/api/get-user-session] - Fetching user document from Firestore...');
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      console.warn('[/api/get-user-session] - User document not found, returning default role.');
      return NextResponse.json({ 
        email: decodedToken.email, 
        role: 'admin', 
        uid: decodedToken.uid 
      });
    }

    const userData = userDoc.data();
    console.log('[/api/get-user-session] - User document found, returning data:', userData);
    return NextResponse.json({
      email: userData?.email,
      role: userData?.role,
      uid: decodedToken.uid,
      profileLimit: userData?.profileLimit,
    });

  } catch (error) {
    console.error('[/api/get-user-session] - CRITICAL: An error occurred:', error);
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
}
