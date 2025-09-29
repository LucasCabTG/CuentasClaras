
import { NextResponse } from 'next/server';
import { initAdmin } from '@/core/services/firebaseAdmin';

export async function POST(request: Request) {
  const { adminAuth, adminDb } = await initAdmin();
  
  // 1. Verify the request is from a superadmin
  const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
  if (!idToken) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const requesterUid = decodedToken.uid;

    const userDoc = await adminDb.collection('users').doc(requesterUid).get();
    if (!userDoc.exists || userDoc.data()?.role !== 'superadmin') {
      return NextResponse.json({ message: 'Forbidden: User is not a superadmin' }, { status: 403 });
    }

    // 2. Get data for the new account
    const { email, password, profileLimit } = await request.json();
    if (!email || !password || profileLimit === undefined) {
      return NextResponse.json({ message: 'Missing required fields: email, password, profileLimit' }, { status: 400 });
    }

    // 3. Create the new user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      emailVerified: true, // Or false, depending on desired flow
    });

    // 4. Create the user document in Firestore
    await adminDb.collection('users').doc(userRecord.uid).set({
      email: userRecord.email,
      role: 'admin', // New accounts are standard admins
      profileLimit: Number(profileLimit),
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'Account created successfully', uid: userRecord.uid }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating account:', error);
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
    }
    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json({ message: 'Token expired, please log in again' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
