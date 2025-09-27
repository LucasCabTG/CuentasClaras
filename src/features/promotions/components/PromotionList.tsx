'use client';

import { useState } from 'react';
import { usePromotions, Promotion } from '@/core/hooks/usePromotions';
import { deletePromotion } from '@/core/services/promotionService';
import EditPromotionForm from './EditPromotionForm';

export default function PromotionList() {
  const { promotions, loading, error } = usePromotions();
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

  const handleDelete = async (promotionId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta promoción?')) {
      try {
        await deletePromotion(promotionId);
        // The list will update automatically thanks to onSnapshot
      } catch (err) {
        console.error('Error deleting promotion: ', err);
        alert('No se pudo eliminar la promoción.');
      }
    }
  };

  if (loading) {
    return <p className="text-gray-500">Cargando promociones...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (promotions.length === 0) {
    return <p className="text-gray-500">No has creado ninguna promoción.</p>;
  }

  return (
    <>
      <div className="space-y-4">
        {promotions.map(promo => (
          <div key={promo.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-800">{promo.name}</p>
                <p className="text-sm text-gray-500">{promo.description}</p>
              </div>
              <p className="font-bold text-lg text-blue-600">${promo.price.toFixed(2)}</p>
            </div>
            <div className="mt-4 border-t pt-2">
              <h4 className="font-semibold text-sm mb-2 text-gray-700">Incluye:</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600">
                {promo.bundleItems.map((item, index) => (
                  <li key={index}>{item.quantity}x {item.productName}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setEditingPromotion(promo)} className="text-blue-500 hover:text-blue-700 text-sm font-semibold">Editar</button>
              <button onClick={() => handleDelete(promo.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {editingPromotion && (
        <EditPromotionForm 
          promotion={editingPromotion} 
          onClose={() => setEditingPromotion(null)} 
        />
      )}
    </>
  );
}
