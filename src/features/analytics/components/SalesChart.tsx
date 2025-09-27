'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTransactions } from '@/core/hooks/useTransactions';

interface DailySales {
  date: string;
  total: number;
}

export default function SalesChart() {
  const { transactions, loading, error } = useTransactions();

  const salesData = useMemo((): DailySales[] => {
    if (!transactions) return [];

    const dailySales: { [key: string]: number } = {};

    transactions.forEach(tx => {
      const date = new Date(tx.createdAt.seconds * 1000).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      if (!dailySales[date]) {
        dailySales[date] = 0;
      }
      dailySales[date] += tx.total;
    });

    return Object.keys(dailySales)
      .map(date => ({ date, total: dailySales[date] }))
      .sort((a, b) => new Date(a.date.split('/').reverse().join('-')).getTime() - new Date(b.date.split('/').reverse().join('-')).getTime());

  }, [transactions]);

  if (loading) {
    return <div className="h-80 flex items-center justify-center"><p>Cargando datos del gráfico...</p></div>;
  }

  if (error) {
    return <div className="h-80 flex items-center justify-center"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-96">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Ventas a lo largo del tiempo</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={-20} textAnchor="end" height={50} />
          <YAxis />
          <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total']} />
          <Legend />
          <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} name="Ventas Diarias" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
