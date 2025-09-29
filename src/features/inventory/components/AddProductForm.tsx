'use client';

import { useState } from 'react';
import { auth } from '@/core/services/firebase';
import { addProduct } from '@/core/services/productService';
import { useDistributors } from '@/core/hooks/useDistributors';

export default function AddProductForm() {
  const [product, setProduct] = useState({
    name: '',
    category: '',
    purchasePrice: 0,
    salePrice: 0,
    distributor: '',
    quantity: 0,
    specialPrices: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { distributors } = useDistributors();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setProduct({
      ...product,
      [name]: isNumber ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.name.trim() || product.salePrice <= 0 || product.quantity <= 0) {
      setError('Por favor, completa todos los campos obligatorios: Nombre, Precio de Venta y Cantidad deben ser mayores a 0.');
      return;
    }

    if (!auth.currentUser) {
      setError('Debes iniciar sesión para agregar productos.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await addProduct({
        ...product,
        businessId: auth.currentUser.uid,
      });
      setSuccess(true);
      // Reset form
      setProduct({
        name: '',
        category: '',
        purchasePrice: 0,
        salePrice: 0,
        distributor: '',
        quantity: 0,
        specialPrices: '',
      });
    } catch (err) {
      setError('Error al agregar el producto.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
      <h3 className="text-xl font-bold mb-6 text-gray-800">Agregar Nuevo Producto</h3>
      {success && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4">¡Producto agregado con éxito!</p>}
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre del Producto</label>
            <input type="text" name="name" value={product.name} onChange={handleChange} required className="input text-gray-900" />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Categoría</label>
            <input type="text" name="category" value={product.category} onChange={handleChange} className="input" />
          </div>
          <div className="mb-4">
            <label htmlFor="purchasePrice" className="block text-gray-700 text-sm font-bold mb-2">Precio de Compra</label>
            <input type="number" name="purchasePrice" value={product.purchasePrice} onChange={handleChange} onFocus={(e) => e.target.select()} required className="input" step="0.01" />
          </div>
          <div className="mb-4">
            <label htmlFor="salePrice" className="block text-gray-700 text-sm font-bold mb-2">Precio de Venta</label>
            <input type="number" name="salePrice" value={product.salePrice} onChange={handleChange} onFocus={(e) => e.target.select()} required className="input" step="0.01" />
          </div>
        </div>

        {/* Column 2 */}
        <div>
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">Cantidad</label>
            <input type="number" name="quantity" value={product.quantity} onChange={handleChange} onFocus={(e) => e.target.select()} required className="input" />
          </div>
          <div className="mb-4">
            <label htmlFor="distributor" className="block text-gray-700 text-sm font-bold mb-2">Distribuidor</label>
            <select name="distributor" value={product.distributor} onChange={handleChange} className="input">
              <option value="">Sin distribuidor</option>
              {distributors.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="specialPrices" className="block text-gray-700 text-sm font-bold mb-2">Precios Especiales (Notas)</label>
            <textarea name="specialPrices" value={product.specialPrices} onChange={handleChange} className="input h-24" />
          </div>
        </div>

        <div className="md:col-span-2">
          <button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300">
            {loading ? 'Agregando...' : 'Agregar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}
