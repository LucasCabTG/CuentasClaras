'use client';

import UserList from "@/features/admin/components/UserList";
import AuditLogList from "@/features/admin/components/AuditLogList";
import withAuth from "@/core/components/withAuth";

function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel de Administración</h1>
      <UserList />
      <AuditLogList />
    </div>
  );
}

export default withAuth(AdminPage, ['admin']);
