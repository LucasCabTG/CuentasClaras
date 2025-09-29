'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/core/context/AuthContext';
import { getUsersForBusiness, updateUserRole } from '@/core/services/userService';
import { logAction } from '@/core/services/auditService';

interface UserData {
  id: string;
  email: string;
  role: string;
}

export default function UserList() {
  const { user, activeProfile } = useAuthContext();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user?.uid) {
      getUsersForBusiness(user.uid)
        .then(setUsers)
        .catch(() => setError('No se pudieron cargar los usuarios.'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleRoleChange = (uid: string, role: string) => {
    setEditingRole({ ...editingRole, [uid]: role });
  };

  const handleSaveRole = async (uid: string) => {
    const newRole = editingRole[uid];
    if (!newRole || !user || !activeProfile) return;

    const targetUser = users.find(u => u.id === uid);
    if (!targetUser) return;

    try {
      await updateUserRole(uid, newRole);
      await logAction({
        action: 'change_role',
        userEmail: user.email || 'N/A',
        profileName: activeProfile.name,
        businessId: user.uid,
        details: `Rol de ${targetUser.email} cambiado a ${newRole}`
      });
      // Refresh list after update
      getUsersForBusiness(user.uid).then(setUsers);
    } catch (err) {
      console.error(err);
      alert('Error al actualizar el rol.');
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-6 text-gray-800">Gestión de Usuarios</h3>
      <div className="space-y-4">
        {users.map((u) => (
          <div key={u.id} className="flex flex-wrap items-center justify-between p-4 border rounded-lg">
            <div className="flex-1 min-w-[200px]">
              <p className="font-semibold">{u.email}</p>
              <p className="text-sm text-gray-600">Rol actual: {u.role}</p>
            </div>
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <select 
                value={editingRole[u.id] || u.role}
                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                className="input"
                disabled={u.id === user?.uid} // Can't change your own role
              >
                <option value="admin">Admin</option>
                <option value="vendedor">Vendedor</option>
              </select>
              <button 
                onClick={() => handleSaveRole(u.id)}
                disabled={u.id === user?.uid || !editingRole[u.id] || editingRole[u.id] === u.role}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:bg-gray-300"
              >
                Guardar
              </button>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .input { box-shadow: inset 0 1px 2px rgba(0,0,0,0.07); border-radius: 0.375rem; border: 1px solid #d1d5db; padding: 0.5rem 0.75rem; }
      `}</style>
    </div>
  );
}
