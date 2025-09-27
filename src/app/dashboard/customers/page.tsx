// src/app/dashboard/customers/page.tsx
import CustomerList from '@/features/customers/components/CustomerList';

export default function CustomersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestión de Clientes</h1>
      <CustomerList />
    </div>
  );
}
