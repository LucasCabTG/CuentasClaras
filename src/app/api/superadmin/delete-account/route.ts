
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

    // 2. Get the UID of the account to delete
    const { uidToDelete } = await request.json();
    if (!uidToDelete) {
      return NextResponse.json({ message: 'UID to delete is required' }, { status: 400 });
    }

    if (uidToDelete === decodedToken.uid) {
        return NextResponse.json({ message: 'Cannot delete your own account' }, { status: 400 });
    }

    // 3. Delete the user from Firebase Auth
    await adminAuth.deleteUser(uidToDelete);

    // 4. Delete the user document from Firestore
    await adminDb.collection('users').doc(uidToDelete).delete();

    // Note: This does not delete associated data like products, customers, etc.
    // That would require a more complex solution like a Cloud Function.

    return NextResponse.json({ message: 'Account deleted successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('Error deleting account:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
