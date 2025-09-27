'use client';

import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/core/context/AuthContext';
import { auth } from '@/core/services/firebase';

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { user } = useAuthContext();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <header className="bg-white shadow-md h-16 flex justify-between items-center px-6">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="md:hidden mr-4">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        <h1 className="text-xl font-semibold">Cuentas Claras</h1>
      </div>
      <div className="flex items-center">
        {user && <span className="text-gray-600 mr-4 hidden md:block">{user.email}</span>}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}
