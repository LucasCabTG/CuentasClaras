'use client';

import { useState } from 'react';
import { auth } from '@/core/services/firebase';
import { addDistributor } from '@/core/services/distributorService';

export default function AddDistributorForm() {
  const [distributor, setDistributor] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDistributor({ ...distributor, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError('Debes iniciar sesión para agregar distribuidores.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await addDistributor({
        ...distributor,
        businessId: auth.currentUser.uid,
      });
      setSuccess(true);
      setDistributor({ name: '', contactPerson: '', phone: '', email: '', address: '' });
    } catch (err) {
      setError('Error al agregar el distribuidor.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
      <h3 className="text-xl font-bold mb-6 text-gray-800">Agregar Nuevo Distribuidor</h3>
      {success && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4">¡Distribuidor agregado con éxito!</p>}
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre del Distribuidor</label>
          <input type="text" name="name" value={distributor.name} onChange={handleChange} required className="input" />
        </div>
        <div className="mb-4">
          <label htmlFor="contactPerson" className="block text-gray-700 text-sm font-bold mb-2">Persona de Contacto</label>
          <input type="text" name="contactPerson" value={distributor.contactPerson} onChange={handleChange} className="input" />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Teléfono</label>
          <input type="text" name="phone" value={distributor.phone} onChange={handleChange} className="input" />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input type="email" name="email" value={distributor.email} onChange={handleChange} className="input" />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Dirección</label>
          <textarea name="address" value={distributor.address} onChange={handleChange} className="input h-24" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300">
          {loading ? 'Agregando...' : 'Agregar Distribuidor'}
        </button>
      </form>
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
    </div>
  );
}
