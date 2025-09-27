'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/core/hooks/useProducts';
import { updateProduct } from '@/core/services/productService';
import { useDistributors } from '@/core/hooks/useDistributors';

interface EditProductFormProps {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditProductForm({ product, onClose, onSuccess }: EditProductFormProps) {
  const [formData, setFormData] = useState(product);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { distributors } = useDistributors();

  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { id, ...productData } = formData;
      await updateProduct(id, productData);
      onSuccess();
      onClose();
    } catch (err) {
      setError('Error al actualizar el producto.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Wrapper div that was missing
    <div> 
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <h3 className="text-xl font-bold mb-6 text-gray-800 md:col-span-2">Editar Producto</h3>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 md:col-span-2">{error}</p>}
          
          {/* Column 1 */}
          <div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre del Producto</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input" />
            </div>
            <div className="mb-4">
              <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Categoría</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} className="input" />
            </div>
            <div className="mb-4">
              <label htmlFor="purchasePrice" className="block text-gray-700 text-sm font-bold mb-2">Precio de Compra</label>
              <input type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} required className="input" step="0.01" />
            </div>
            <div className="mb-4">
              <label htmlFor="salePrice" className="block text-gray-700 text-sm font-bold mb-2">Precio de Venta</label>
              <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} required className="input" step="0.01" />
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <div className="mb-4">
              <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">Cantidad</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required className="input" />
            </div>
            <div className="mb-4">
              <label htmlFor="distributor" className="block text-gray-700 text-sm font-bold mb-2">Distribuidor</label>
              <select name="distributor" value={formData.distributor} onChange={handleChange} className="input">
                <option value="">Sin distribuidor</option>
                {distributors.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="specialPrices" className="block text-gray-700 text-sm font-bold mb-2">Precios Especiales (Notas)</label>
              <textarea name="specialPrices" value={formData.specialPrices} onChange={handleChange} className="input h-24" />
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300">
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
    </div>
  );
}
