'use client';

import { useRef } from 'react';
import { Promotion } from '@/core/hooks/usePromotions';
import { useDraggable } from '@/core/hooks/useDraggable';

interface PromotionSuggestionToastProps {
  promotions: Promotion[];
  onApplyPromotion: (promotion: Promotion) => void;
  onDismiss: () => void;
}

export default function PromotionSuggestionToast({ promotions, onApplyPromotion, onDismiss }: PromotionSuggestionToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);
  useDraggable(toastRef as React.RefObject<HTMLElement>);

  if (promotions.length === 0) {
    return null;
  }

  return (
    <div ref={toastRef} className="absolute top-4 right-4 w-full max-w-sm p-2 z-50 cursor-move">
      <div className="bg-gray-800 text-white rounded-lg shadow-xl p-4">
        <div data-drag-handle className="flex justify-between items-center mb-3">
          <h4 className="font-bold text-md">¡Promociones detectadas!</h4>
          <button onClick={onDismiss} className="text-gray-400 hover:text-white font-bold text-2xl cursor-pointer">&times;</button>
        </div>
        <div className="flex flex-col gap-2">
          {promotions.map(promo => (
            <div key={promo.id} className="bg-gray-700 rounded-md p-2 flex justify-between items-center">
              <div className='mr-4'>
                <p className="font-semibold text-sm">{promo.name} - <span className="font-bold text-green-400">${promo.price.toFixed(2)}</span></p>
              </div>
              <button
                onClick={() => onApplyPromotion(promo)}
                className="bg-blue-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-blue-700 transition-colors text-xs whitespace-nowrap cursor-pointer"
              >
                Aplicar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}