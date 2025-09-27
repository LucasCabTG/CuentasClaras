'use client';

import SalesChart from "@/features/analytics/components/SalesChart";
import TopProductsChart from "@/features/analytics/components/TopProductsChart";
import PaymentMethodChart from "@/features/analytics/components/PaymentMethodChart";

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Estadísticas del Negocio</h1>
      <div className="grid grid-cols-1 gap-8">
        <SalesChart />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <TopProductsChart />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <PaymentMethodChart />
          </div>
        </div>
      </div>
    </div>
  );
}
