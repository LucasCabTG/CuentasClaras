'use client';

import { useState, useEffect } from 'react';
import { Distributor } from '@/core/hooks/useDistributors';
import { updateDistributor } from '@/core/services/distributorService';

interface EditDistributorFormProps {
  distributor: Distributor;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditDistributorForm({ distributor, onClose, onSuccess }: EditDistributorFormProps) {
  const [formData, setFormData] = useState(distributor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(distributor);
  }, [distributor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { id, ...distributorData } = formData;
      await updateDistributor(id, distributorData);
      onSuccess();
      onClose();
    } catch (err) {
      setError('Error al actualizar el distribuidor.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-xl font-bold mb-6 text-gray-800">Editar Distribuidor</h3>
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre del Distribuidor</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input" />
      </div>
      <div className="mb-4">
        <label htmlFor="contactPerson" className="block text-gray-700 text-sm font-bold mb-2">Persona de Contacto</label>
        <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="input" />
      </div>
      <div className="mb-4">
        <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Teléfono</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="input" />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="input" />
      </div>
      <div className="mb-4">
        <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Dirección</label>
        <textarea name="address" value={formData.address} onChange={handleChange} className="input h-24" />
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300">
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
      <style jsx>{`
        .input {
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.07);
          appearance: none;
          border-radius: 0.375rem;
          border: 1px solid #d1d5db;
          width: 100%;
          padding: 0.5rem 0.75rem;
          color: #374151;
          line-height: 1.5;
        }
        .input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
          border-color: #3b82f6;
        }
      `}</style>
    </form>
  );
}
