'use client';

import { useAuthContext } from "@/core/context/AuthContext";
import withAuth from "@/core/components/withAuth";
import UserList from "@/features/admin/components/UserList";
import ProfileManager from "@/features/admin/components/ProfileManager";
import AuditLogList from "@/features/admin/components/AuditLogList";
import ChangePasswordForm from "@/features/auth/components/ChangePasswordForm";

function AdminPage() {
  const { role } = useAuthContext();
  const isAdmin = role === 'admin' || role === 'superadmin';

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel de Configuración</h1>
      
      {/* This form is visible to all roles */}
      <ChangePasswordForm />

      {/* These components are only visible to admins */}
      {isAdmin && (
        <>
          <UserList />
          <ProfileManager />
          <AuditLogList />
        </>
      )}
    </div>
  );
}

// Allow vendors to access this page to change their password
export default withAuth(AdminPage, ['admin', 'superadmin', 'vendedor']);
