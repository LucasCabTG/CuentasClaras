'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTransactions } from '@/core/hooks/useTransactions';

interface ProductSales {
  name: string;
  quantity: number;
}

export default function TopProductsChart() {
  const { transactions, loading, error } = useTransactions();

  const productSalesData = useMemo(() => {
    if (!transactions) return [];

    const productSales: { [key: string]: ProductSales } = {};

    transactions.forEach(tx => {
      tx.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { name: item.name, quantity: 0 };
        }
        productSales[item.productId].quantity += item.quantity;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10); // Top 10 products

  }, [transactions]);

  if (loading) {
    return <div className="h-80 flex items-center justify-center"><p>Cargando datos...</p></div>;
  }

  if (error) {
    return <div className="h-80 flex items-center justify-center"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-96">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Productos Más Vendidos</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={productSalesData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={120} />
          <Tooltip formatter={(value: number) => [value, 'Unidades']} />
          <Legend />
          <Bar dataKey="quantity" fill="#8884d8" name="Unidades Vendidas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
