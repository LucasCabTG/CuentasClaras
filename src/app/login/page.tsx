'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/core/context/AuthContext';
import LoginForm from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if user is already logged in
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Optional: Show a loading state while checking auth
  if (loading || user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <LoginForm />
    </main>
  );
}
