'use client';

import { useState } from 'react';
import withAuth from "@/core/components/withAuth";
import CreateAccountForm from '@/features/superadmin/components/CreateAccountForm';
import AccountList from '@/features/superadmin/components/AccountList';

function SuperAdminPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAccountCreation = () => {
    setRefreshTrigger(prev => prev + 1); // Increment to trigger a refresh in the list
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel de Super Administrador</h1>
      <CreateAccountForm onAccountCreated={handleAccountCreation} />
      <AccountList refreshTrigger={refreshTrigger} />
    </div>
  );
}

// Proteger la página para que solo el rol 'superadmin' pueda acceder.
export default withAuth(SuperAdminPage, ['superadmin']);
