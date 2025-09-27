'use client';

import { useState } from 'react';
import { useDistributors, Distributor } from '@/core/hooks/useDistributors';
import { deleteDistributor } from '@/core/services/distributorService';
import Modal from '@/core/components/Modal';
import EditDistributorForm from './EditDistributorForm';

export default function DistributorList() {
  const { distributors, loading, error } = useDistributors();
  const [editingDistributor, setEditingDistributor] = useState<Distributor | null>(null);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const handleDelete = async (distributorId: string, distributorName: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar a "${distributorName}"?`)) {
      try {
        await deleteDistributor(distributorId);
        setFeedback({ type: 'success', message: 'Distribuidor eliminado con éxito.' });
      } catch (err) {
        setFeedback({ type: 'error', message: 'Error al eliminar el distribuidor.' });
        console.error(err);
      }
    }
  };

  const handleEditSuccess = () => {
    setFeedback({ type: 'success', message: 'Distribuidor actualizado con éxito.' });
  }

  if (loading) {
    return <p className="text-gray-600">Cargando distribuidores...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="overflow-x-auto">
      {feedback && (
        <div className={`p-3 rounded-md mb-4 text-sm ${
          feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {feedback.message}
        </div>
      )}
      {distributors.length === 0 ? (
        <p className="text-gray-500">No hay distribuidores. ¡Agrega uno para comenzar!</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Nombre</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Contacto</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Teléfono</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {distributors.map((d) => (
              <tr key={d.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-4">{d.name}</td>
                <td className="py-3 px-4">{d.contactPerson}</td>
                <td className="py-3 px-4">{d.phone}</td>
                <td className="py-3 px-4">{d.email}</td>
                <td className="py-3 px-4">
                  <button 
                    onClick={() => setEditingDistributor(d)}
                    className="text-blue-500 hover:text-blue-700 text-sm mr-2"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(d.id, d.name)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal isOpen={!!editingDistributor} onClose={() => setEditingDistributor(null)}>
        {editingDistributor && (
          <EditDistributorForm 
            distributor={editingDistributor} 
            onClose={() => setEditingDistributor(null)} 
            onSuccess={handleEditSuccess}
          />
        )}
      </Modal>
    </div>
  );
}
