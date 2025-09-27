
'use client';

import { useProducts } from '@/core/hooks/useProducts';
import { useDistributors } from '@/core/hooks/useDistributors';

const LOW_STOCK_THRESHOLD = 5;

export default function LowStockWarning() {
  const { products, loading: productsLoading } = useProducts();
  const { distributors, loading: distributorsLoading } = useDistributors();

  const lowStockProducts = products.filter(p => p.quantity <= LOW_STOCK_THRESHOLD);

  if (productsLoading || distributorsLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="font-bold text-lg text-gray-800 mb-2">Stock Bajo</h3>
        <p className="text-gray-600">Analizando stock...</p>
      </div>
    );
  }

  if (lowStockProducts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="font-bold text-lg text-green-600 mb-2">Stock en Orden</h3>
        <p className="text-gray-600">¡Excelente! Todos tus productos tienen buen nivel de stock.</p>
      </div>
    );
  }

  const getDistributorName = (distributorId: string | undefined) => {
    if (!distributorId) return 'No especificado';
    const distributor = distributors.find(d => d.id === distributorId);
    return distributor ? distributor.name : 'Distribuidor no encontrado';
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg shadow-md">
      <h3 className="font-bold text-lg text-yellow-800 mb-4">¡Atención! Productos con Stock Bajo</h3>
      <div className="space-y-3">
        {lowStockProducts.map(product => (
          <div key={product.id} className="p-3 bg-yellow-100 rounded-md">
            <p className="font-semibold text-yellow-900">{product.name}</p>
            <p className="text-sm text-yellow-800">
              Quedan solo <span className="font-bold">{product.quantity}</span> unidades.
            </p>
            <p className="text-sm text-yellow-800">
              Contactar al distribuidor: <span className="font-semibold">{getDistributorName(product.distributor)}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
