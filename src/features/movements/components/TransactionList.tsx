'use client';

import { useState } from 'react';
import { useTransactions, Transaction } from '@/core/hooks/useTransactions';
import { deleteTransaction } from '@/core/services/transactionService';
import { useAuthContext } from '@/core/context/AuthContext';
import { logAction } from '@/core/services/auditService';

export default function TransactionList() {
  const { user, activeProfile } = useAuthContext();
  const { transactions, loading, error } = useTransactions();
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const handleDelete = async (transaction: Transaction) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar esta transacción? Esta acción devolverá los productos al stock.`)) {
      try {
        await deleteTransaction(transaction);
        if (user && activeProfile) {
          await logAction({
            action: 'delete_transaction',
            userEmail: user.email || 'N/A',
            profileName: activeProfile.name,
            businessId: user.uid,
            details: `Transacción eliminada: ID ${transaction.id}, Total: ${transaction.total.toFixed(2)}`
          });
        }
        setFeedback({ type: 'success', message: 'Transacción eliminada y stock restaurado.' });
      } catch (err) {
        setFeedback({ type: 'error', message: 'Error al eliminar la transacción.' });
        console.error(err);
      }
    }
  };

  if (loading) {
    return <p className="text-gray-600">Cargando movimientos...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-4">
      {feedback && (
        <div className={`p-3 rounded-md mb-4 text-sm ${
          feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {feedback.message}
        </div>
      )}
      {transactions.length === 0 ? (
        <p className="text-gray-600">No se han realizado movimientos todavía.</p>
      ) : (
        transactions.map(tx => (
          <div key={tx.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-800">Venta - {new Date(tx.createdAt.seconds * 1000).toLocaleString()}</p>
                <p className="text-sm text-gray-600">Cliente: {tx.customerName || 'Consumidor Final'}</p>
                <p className="text-sm text-gray-600">ID: {tx.id}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-green-600">${tx.total.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Método: {tx.paymentMethod}</p>
              </div>
            </div>
            <div className="mt-4 border-t pt-2">
              <h4 className="font-semibold text-sm mb-2">Items:</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600">
                {tx.items.map((item, index) => (
                  <li key={index}>{item.quantity}x {item.name} - ${item.salePrice.toFixed(2)} c/u</li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => handleDelete(tx)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Eliminar</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
