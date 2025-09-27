'use client';

import { useAuthContext } from '@/core/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ComponentType } from 'react';

export default function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRoles: string[]
) {
  const WithAuthComponent = (props: P) => {
    const { user, role, loading } = useAuthContext();
    const router = useRouter();

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <p>Cargando...</p>
        </div>
      );
    }

    if (!user || !role || !allowedRoles.includes(role)) {
      return (
        <div className="flex flex-col justify-center items-center h-screen text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-700 mb-6">No tienes permiso para ver esta página.</p>
          <button onClick={() => router.back()} className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
            Volver
          </button>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
}
