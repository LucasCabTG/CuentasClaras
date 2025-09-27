'use client';

import TransactionList from "@/features/movements/components/TransactionList";

export default function MovementsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Historial de Movimientos</h1>
      <TransactionList />
    </div>
  );
}
