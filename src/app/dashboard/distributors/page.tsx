'use client';

import AddDistributorForm from "@/features/distributors/components/AddDistributorForm";
import DistributorList from "@/features/distributors/components/DistributorList";

export default function DistributorsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Distribuidores</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AddDistributorForm />
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Listado de Distribuidores</h3>
            <DistributorList />
          </div>
        </div>
      </div>
    </div>
  );
}