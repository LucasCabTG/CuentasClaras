
'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/core/context/AuthContext';
import { updateCustomer, Customer } from '@/core/services/customerService';

interface EditCustomerFormProps {
  customer: Customer;
  onCustomerUpdated: () => void;
  onCancel: () => void;
}

export default function EditCustomerForm({ customer, onCustomerUpdated, onCancel }: EditCustomerFormProps) {
  const { user } = useAuthContext();
  const [name, setName] = useState(customer.name);
  const [email, setEmail] = useState(customer.email || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [address, setAddress] = useState(customer.address || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setName(customer.name);
    setEmail(customer.email || '');
    setPhone(customer.phone || '');
    setAddress(customer.address || '');
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!user) {
      setError('Debes iniciar sesión para editar un cliente.');
      return;
    }

    if (!name) {
      setError('El nombre es obligatorio.');
      return;
    }

    try {
      await updateCustomer(customer.id, { name, email, phone, address }, user.email || 'N/A', user.uid);
      setSuccess(`Cliente "${name}" actualizado con éxito.`);
      onCustomerUpdated();
    } catch (err) {
      console.error(err);
      setError('No se pudo actualizar el cliente. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Editar Cliente</h3>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4">{success}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="customerNameEdit" className="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
            <input
              id="customerNameEdit"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="customerEmailEdit" className="block text-sm font-medium text-gray-600 mb-1">Email (Opcional)</label>
            <input
              id="customerEmailEdit"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="customerPhoneEdit" className="block text-sm font-medium text-gray-600 mb-1">Teléfono (Opcional)</label>
            <input
              id="customerPhoneEdit"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="customerAddressEdit" className="block text-sm font-medium text-gray-600 mb-1">Dirección (Opcional)</label>
            <input
              id="customerAddressEdit"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button 
              type="button"
              onClick={onCancel}
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
