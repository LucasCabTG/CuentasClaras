'use client';

import LowStockWarning from '@/features/dashboard/components/LowStockWarning';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard Principal</h1>
      <p className="text-gray-600 mb-8">¡Bienvenido a tu panel de gestión!</p>
      
      <div className="grid grid-cols-1 gap-8">
        <LowStockWarning />
        {/* Aquí irán las estadísticas y otros componentes del dashboard */}
      </div>
    </div>
  );
}