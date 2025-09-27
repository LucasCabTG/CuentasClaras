'use client';

import { useState } from 'react';
import { useProducts } from '@/core/hooks/useProducts';
import { addPromotion, BundleItem } from '@/core/services/promotionService';
import { useAuthContext } from '@/core/context/AuthContext';

const AVAILABLE_PAYMENT_METHODS = ['Efectivo', 'Tarjeta', 'Débito', 'QR', 'Transferencia'];

export default function AddPromotionForm() {
  const { user } = useAuthContext();
  const { products } = useProducts();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [bundleItems, setBundleItems] = useState<BundleItem[]>([]);
  const [allowedPaymentMethods, setAllowedPaymentMethods] = useState<string[]>(AVAILABLE_PAYMENT_METHODS);
  
  const [selectedProductId, setSelectedProductId] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePaymentMethodChange = (method: string) => {
    setAllowedPaymentMethods(prev => 
      prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]
    );
  };

  const handleSelectAllPaymentMethods = (select: boolean) => {
    setAllowedPaymentMethods(select ? AVAILABLE_PAYMENT_METHODS : []);
  };

  const handleAddItem = () => {
    if (!selectedProductId || itemQuantity <= 0) return;
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    // Check if item is already in the bundle
    const existingItem = bundleItems.find(item => item.productId === product.id);
    if (existingItem) {
      // Update quantity if already present
      setBundleItems(bundleItems.map(item => 
        item.productId === product.id ? { ...item, quantity: item.quantity + itemQuantity } : item
      ));
    } else {
      // Add new item to bundle
      setBundleItems([...bundleItems, { productId: product.id, productName: product.name, quantity: itemQuantity }]);
    }
    setSelectedProductId('');
    setItemQuantity(1);
  };

  const handleRemoveItem = (productId: string) => {
    setBundleItems(bundleItems.filter(item => item.productId !== productId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || bundleItems.length === 0 || !name || price <= 0) {
      setError('Por favor, completa el nombre, precio y agrega al menos un producto al combo.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await addPromotion({
        name,
        description,
        price,
        bundleItems,
        allowedPaymentMethods,
        businessId: user.uid,
      });
      setSuccess(true);
      // Reset form
      setName('');
      setDescription('');
      setPrice(0);
      setBundleItems([]);
      setAllowedPaymentMethods(AVAILABLE_PAYMENT_METHODS);
    } catch (err) {
      setError('Error al crear la promoción.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
      <h3 className="text-xl font-bold mb-6 text-gray-800">Crear Nueva Promoción (Combo)</h3>
      {success && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4">¡Promoción creada con éxito!</p>}
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
      
      {/* Add Item to Bundle Section */}
      <div className="border-b pb-6 mb-6">
        <h4 className="font-semibold text-lg mb-2">Armar Combo</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Producto</label>
            <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className="input">
              <option value="">Seleccionar producto...</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Cantidad</label>
            <input type="number" value={itemQuantity} onChange={(e) => setItemQuantity(Number(e.target.value))} min="1" className="input" />
          </div>
        </div>
        <button type="button" onClick={handleAddItem} className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded w-full">
          Agregar Producto al Combo
        </button>
      </div>

      {/* Bundle Items Preview */}
      {bundleItems.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-lg mb-2">Productos en el Combo</h4>
          <ul className="list-disc pl-5 space-y-2">
            {bundleItems.map(item => (
              <li key={item.productId} className="flex justify-between items-center">
                <span>{item.quantity}x {item.productName}</span>
                <button onClick={() => handleRemoveItem(item.productId)} className="text-red-500 text-sm font-bold">Quitar</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Promotion Details Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Nombre de la Promoción</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Descripción (Opcional)</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="input" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Precio Final del Combo</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required min="0.01" step="0.01" className="input" />
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
            <h4 className="font-semibold text-lg mb-2">Medios de Pago Permitidos</h4>
            <div className="flex items-center mb-2">
                <input 
                    type="checkbox" 
                    id="select-all" 
                    checked={allowedPaymentMethods.length === AVAILABLE_PAYMENT_METHODS.length}
                    onChange={(e) => handleSelectAllPaymentMethods(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="select-all" className="ml-2 text-sm text-gray-600">Seleccionar Todos</label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AVAILABLE_PAYMENT_METHODS.map(method => (
                    <div key={method} className="flex items-center">
                        <input 
                            type="checkbox" 
                            id={`payment-${method}`}
                            value={method}
                            checked={allowedPaymentMethods.includes(method)}
                            onChange={() => handlePaymentMethodChange(method)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`payment-${method}`} className="ml-2 text-sm text-gray-600">{method}</label>
                    </div>
                ))}
            </div>
        </div>

        <button type="submit" disabled={loading || bundleItems.length === 0} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300">
          {loading ? 'Creando...' : 'Crear Promoción'}
        </button>
      </form>
      <style jsx>{`
        .input { box-shadow: inset 0 1px 2px rgba(0,0,0,0.07); appearance: none; border-radius: 0.375rem; border: 1px solid #d1d5db; width: 100%; padding: 0.5rem 0.75rem; color: #374151; line-height: 1.5; }
        .input:focus { outline: none; box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5); border-color: #3b82f6; }
      `}</style>
    </div>
  );
}
