
import { NextResponse } from 'next/server';
import { initAdmin } from '@/core/services/firebaseAdmin';

export async function POST(request: Request) {
  const { adminAuth, adminDb } = await initAdmin();
  
  // 1. Verify the request is from a superadmin
  const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
  if (!idToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const requesterDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    if (!requesterDoc.exists || requesterDoc.data()?.role !== 'superadmin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // 2. Get the UID and new password
    const { uidToUpdate, newPassword } = await request.json();
    if (!uidToUpdate || !newPassword) {
      return NextResponse.json({ message: 'UID and new password are required' }, { status: 400 });
    }

    // 3. Update the user's password in Firebase Auth
    await adminAuth.updateUser(uidToUpdate, {
      password: newPassword,
    });

    return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
