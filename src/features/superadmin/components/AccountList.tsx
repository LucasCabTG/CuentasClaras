'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/core/context/AuthContext';
import { getAllUsers, updateUserProfileLimit } from '@/core/services/userService';

interface UserAccount {
  id: string;
  email: string;
  role: string;
  profileLimit: number;
}

export default function AccountList({ refreshTrigger }: { refreshTrigger: number }) {
  const { user } = useAuthContext(); // For getting the token
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [editingLimit, setEditingLimit] = useState<{ [uid: string]: number }>({});

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const users = await getAllUsers();
      // Exclude the current superadmin from the list
      setAccounts(users.filter(u => u.id !== user?.uid) as UserAccount[]);
    } catch (error) {
      console.error('Failed to fetch accounts', error);
      setFeedback({ type: 'error', message: 'No se pudieron cargar las cuentas.' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchAccounts();
  }, [user, fetchAccounts, refreshTrigger]);

  const handleSaveLimit = async (uid: string) => {
    const newLimit = editingLimit[uid];
    if (typeof newLimit !== 'number') return;
    try {
      await updateUserProfileLimit(uid, newLimit);
      await fetchAccounts(); // Refresh list
      setFeedback({ type: 'success', message: 'Límite actualizado.' });
    } catch (error) {
      setFeedback({ type: 'error', message: 'No se pudo actualizar el límite.' });
    }
  };

  const handleDelete = async (uidToDelete: string) => {
    if (!window.confirm("¿Estás seguro? Esta acción es irreversible y borrará el acceso del usuario.")) return;
    if (!user) return;

    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/superadmin/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
        body: JSON.stringify({ uidToDelete }),
      });
      if (!response.ok) throw new Error((await response.json()).message);
      setFeedback({ type: 'success', message: 'Cuenta eliminada con éxito.' });
      await fetchAccounts();
    } catch (error: any) {
      setFeedback({ type: 'error', message: error.message });
    }
  };

  const handleResetPassword = async (uidToUpdate: string) => {
    const newPassword = prompt("Introduce la nueva contraseña provisional para este usuario:");
    if (!newPassword || newPassword.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (!user) return;

    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/superadmin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
        body: JSON.stringify({ uidToUpdate, newPassword }),
      });
      if (!response.ok) throw new Error((await response.json()).message);
      setFeedback({ type: 'success', message: 'Contraseña actualizada con éxito.' });
    } catch (error: any) {
      setFeedback({ type: 'error', message: error.message });
    }
  };

  if (loading) return <p>Cargando cuentas...</p>;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full mt-8">
      <h3 className="text-xl font-bold mb-6 text-gray-800">Cuentas de Negocio Existentes</h3>
      {feedback && <p className={`p-3 rounded-md my-4 text-sm ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{feedback.message}</p>}
      <div className="space-y-4">
        {accounts.map((acc) => (
          <div key={acc.id} className="flex flex-wrap items-center justify-between p-4 border rounded-lg gap-4">
            <div>
              <p className="font-semibold">{acc.email}</p>
              <p className="text-sm text-gray-600">Rol: {acc.role}</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Límite Perfiles:</label>
              <input 
                type="number"
                value={editingLimit[acc.id] ?? acc.profileLimit}
                onChange={(e) => setEditingLimit({ ...editingLimit, [acc.id]: Number(e.target.value) })}
                className="input w-24"
              />
              <button 
                onClick={() => handleSaveLimit(acc.id)}
                disabled={editingLimit[acc.id] === acc.profileLimit || editingLimit[acc.id] === undefined}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:bg-gray-300"
              >
                Guardar
              </button>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => handleResetPassword(acc.id)} className="text-sm text-yellow-600 hover:text-yellow-800">Resetear Pass</button>
                <button onClick={() => handleDelete(acc.id)} className="text-sm text-red-600 hover:text-red-800">Borrar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
