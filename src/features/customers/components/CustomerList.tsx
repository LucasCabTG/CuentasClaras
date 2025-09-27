'use client';

import { useState } from 'react';
import { useCustomers } from '@/core/hooks/useCustomers';
import { useAuthContext } from '@/core/context/AuthContext';
import { deleteCustomer, Customer } from '@/core/services/customerService';
import AddCustomerForm from './AddCustomerForm';
import EditCustomerForm from './EditCustomerForm';

export default function CustomerList() {
  const { user } = useAuthContext();
  const { customers, loading, error } = useCustomers();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const handleCustomerAdded = () => {
    setShowAddForm(false);
    setFeedback({ type: 'success', message: 'Cliente agregado con éxito.' });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleCustomerUpdated = () => {
    setEditingCustomer(null);
    setFeedback({ type: 'success', message: 'Cliente actualizado con éxito.' });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = async (customerId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        if (!user) throw new Error('Usuario no autenticado');
        await deleteCustomer(customerId, user.email || 'N/A', user.uid);
        setFeedback({ type: 'success', message: 'Cliente eliminado con éxito.' });
        setTimeout(() => setFeedback(null), 3000);
      } catch (err) {
        console.error(err);
        setFeedback({ type: 'error', message: 'No se pudo eliminar el cliente.' });
        setTimeout(() => setFeedback(null), 3000);
      }
    }
  };

  if (loading) {
    return <p className="text-gray-600">Cargando clientes...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Lista de Clientes</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          {showAddForm ? 'Cancelar' : 'Agregar Cliente'}
        </button>
      </div>

      {feedback && (
        <div className={`p-3 rounded-md mb-4 text-sm ${
          feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {feedback.message}
        </div>
      )}

      {showAddForm && <AddCustomerForm onCustomerAdded={handleCustomerAdded} />}

      {editingCustomer && (
        <EditCustomerForm 
          customer={editingCustomer} 
          onCustomerUpdated={handleCustomerUpdated} 
          onCancel={() => setEditingCustomer(null)}
        />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.length > 0 ? customers.map(customer => (
              <tr key={customer.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phone || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.address || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => setEditingCustomer(customer)} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                  <button onClick={() => handleDelete(customer.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No hay clientes registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}