'use client';

import AddProductForm from "@/features/inventory/components/AddProductForm";
import ProductList from "@/features/inventory/components/ProductList";

export default function StockPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Stock</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AddProductForm />
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Listado de Productos</h3>
            <ProductList />
          </div>
        </div>
      </div>
    </div>
  );
}