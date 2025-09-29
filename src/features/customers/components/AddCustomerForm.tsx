'use client';

import { useState } from 'react';
import { useAuthContext } from '@/core/context/AuthContext';
import { addCustomer } from '@/core/services/customerService';

interface AddCustomerFormProps {
  onCustomerAdded: (customerId: string) => void;
}

export default function AddCustomerForm({ onCustomerAdded }: AddCustomerFormProps) {
  const { user, activeProfile } = useAuthContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user || !activeProfile) {
      setError('Debes iniciar sesión y seleccionar un perfil para agregar un cliente.');
      return;
    }

    if (!name) {
      setError('El nombre es obligatorio.');
      return;
    }

    try {
      const newCustomerId = await addCustomer({ 
        businessId: user.uid, 
        name, 
        email, 
        phone, 
        address 
      }, user.email || 'N/A', activeProfile.name);
      
      onCustomerAdded(newCustomerId);
    } catch (err) {
      console.error(err);
      setError('No se pudo agregar el cliente. Inténtalo de nuevo.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg w-full">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Agregar Nuevo Cliente</h3>
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
      
      <div className="mb-4">
        <label htmlFor="customerName" className="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
        <input
          id="customerName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-600 mb-1">Email (Opcional)</label>
        <input
          id="customerEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-600 mb-1">Teléfono (Opcional)</label>
        <input
          id="customerPhone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-600 mb-1">Dirección (Opcional)</label>
        <input
          id="customerAddress"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="input"
        />
      </div>

      <button 
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Agregar Cliente
      </button>
    </form>
  );
}