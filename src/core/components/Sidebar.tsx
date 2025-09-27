'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { name: 'Terminal de Venta', href: '/dashboard/pos', icon: '🛒' },
  { name: 'Stock', href: '/dashboard/stock', icon: '📦' },
  { name: 'Movimientos', href: '/dashboard/movements', icon: '📈' },
  { name: 'Estadísticas', href: '/dashboard/analytics', icon: '📊' },
  { name: 'Promociones', href: '/dashboard/promotions', icon: '🔥' },
  { name: 'Distribuidores', href: '/dashboard/distributors', icon: '🚚' },
  { name: 'Clientes', href: '/dashboard/customers', icon: '👥' },
  { name: 'Administración', href: '/dashboard/admin', icon: '⚙️' },
  { name: 'Sugerencias y Reportes', href: '/dashboard/help', icon: '📢' },
];

export default function Sidebar({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside
        className={`transform top-0 left-0 w-64 bg-gray-800 text-white fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
          <span className="font-bold text-xl">Cuentas Claras</span>
          <button onClick={toggleSidebar} className="md:hidden">
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="flex-grow p-4">
          <ul>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href} className="mb-2">
                  <Link
                    href={link.href}
                    onClick={toggleSidebar} // Close sidebar on link click on mobile
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}>
                    <span className="mr-3 text-xl">{link.icon}</span>
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
