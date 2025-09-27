'use client';

import AddPromotionForm from "@/features/promotions/components/AddPromotionForm";
import PromotionList from "@/features/promotions/components/PromotionList";

export default function PromotionsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Promociones</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AddPromotionForm />
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Promociones Activas</h3>
            <PromotionList />
          </div>
        </div>
      </div>
    </div>
  );
}
