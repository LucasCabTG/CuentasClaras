'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTransactions } from '@/core/hooks/useTransactions';

interface PaymentMethodData {
  name: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

export default function PaymentMethodChart() {
  const { transactions, loading, error } = useTransactions();

  const paymentMethodData = useMemo(() => {
    if (!transactions) return [];

    const paymentCounts: { [key: string]: number } = {};

    transactions.forEach(tx => {
      if (!paymentCounts[tx.paymentMethod]) {
        paymentCounts[tx.paymentMethod] = 0;
      }
      paymentCounts[tx.paymentMethod]++;
    });

    return Object.keys(paymentCounts).map(method => ({
      name: method,
      value: paymentCounts[method],
    }));

  }, [transactions]);

  if (loading) {
    return <div className="h-80 flex items-center justify-center"><p>Cargando datos...</p></div>;
  }

  if (error) {
    return <div className="h-80 flex items-center justify-center"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-96">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Ventas por Método de Pago</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={paymentMethodData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {paymentMethodData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [value, 'Ventas']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
