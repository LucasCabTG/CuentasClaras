'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/core/context/AuthContext';

// Helper components for icons
const TerminalIcon = ({ className }: { className: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>;
const InventoryIcon = ({ className }: { className: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;
const MovementsIcon = ({ className }: { className: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const CustomersIcon = ({ className }: { className: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const DistributorsIcon = ({ className }: { className: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /></svg>;
const PromotionsIcon = ({ className }: { className: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>;
const AnalyticsIcon = ({ className }: { className: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>;
const AdminIcon = ({ className }: { className: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const SuperAdminIcon = ({ className }: { className: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1.25l2.25 2.25L12 5.75 9.75 3.5 12 1.25zm0 17.5l2.25 2.25L12 23.25l-2.25-2.25L12 18.75zM3.5 9.75L1.25 12l2.25 2.25L5.75 12 3.5 9.75zm17.5 0L18.75 12l2.25 2.25L23.25 12l-2.25-2.25zM12 7.75c-2.347 0-4.25 1.903-4.25 4.25s1.903 4.25 4.25 4.25 4.25-1.903 4.25-4.25S14.347 7.75 12 7.75z" /></svg>;
const HelpIcon = ({ className }: { className: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const links = [
  { name: 'POS', href: '/dashboard/pos', icon: TerminalIcon, roles: ['admin', 'vendedor'] },
  { name: 'Stock', href: '/dashboard/stock', icon: InventoryIcon, roles: ['admin', 'vendedor'] },
  { name: 'Movimientos', href: '/dashboard/movements', icon: MovementsIcon, roles: ['admin', 'vendedor'] },
  { name: 'Clientes', href: '/dashboard/customers', icon: CustomersIcon, roles: ['admin', 'vendedor'] },
  { name: 'Distribuidores', href: '/dashboard/distributors', icon: DistributorsIcon, roles: ['admin', 'vendedor'] },
  { name: 'Promociones', href: '/dashboard/promotions', icon: PromotionsIcon, roles: ['admin', 'vendedor'] },
  { name: 'Analytics', href: '/dashboard/analytics', icon: AnalyticsIcon, roles: ['admin'] },
  { name: 'Admin', href: '/dashboard/admin', icon: AdminIcon, roles: ['admin'] },
  { name: 'Super Admin', href: '/dashboard/superadmin', icon: SuperAdminIcon, roles: ['superadmin'] }, // New Link
  { name: 'Ayuda', href: '/dashboard/help', icon: HelpIcon, roles: ['admin', 'vendedor'] },
];

export default function Sidebar({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) {
  const pathname = usePathname();
  const { role } = useAuthContext();

  const userLinks = links.filter(link => link.roles.includes(role || ''));

  return (
    <aside className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-30`}>
      <Link href="/dashboard" className="text-white text-2xl font-semibold text-center block px-4">
        Cuentas Claras
      </Link>

      <nav>
        {userLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={toggleSidebar} // Close sidebar on link click on mobile
              className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                isActive 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}>
              <link.icon className="w-6 h-6" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}