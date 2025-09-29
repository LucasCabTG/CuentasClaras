'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/core/context/AuthContext';
import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if user is logged in
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  // While loading, you can show a spinner or null
  if (loading || user) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
            <p>Cargando...</p>
        </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Cuentas Claras
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
