'use client';

import { useState } from 'react';
import { useAuthContext } from '@/core/context/AuthContext';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

export default function ChangePasswordForm() {
  const { user } = useAuthContext();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    if (!user || !user.email) {
      setFeedback({ type: 'error', message: 'Usuario no encontrado.' });
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'Las contraseñas nuevas no coinciden.' });
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
        setFeedback({ type: 'error', message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
        setLoading(false);
        return;
    }

    try {
      // 1. Re-authenticate the user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // 2. If re-authentication is successful, update the password
      await updatePassword(user, newPassword);

      setFeedback({ type: 'success', message: '¡Contraseña actualizada con éxito!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        setFeedback({ type: 'error', message: 'La contraseña actual es incorrecta.' });
      } else {
        setFeedback({ type: 'error', message: 'Ocurrió un error al cambiar la contraseña.' });
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mt-6">
      <h3 className="text-xl font-bold mb-6 text-gray-800">Cambiar mi Contraseña</h3>
      {feedback && <p className={`p-3 rounded-md mb-4 text-sm ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{feedback.message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña Actual</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="input w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="input w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="input w-full" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300">
          {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
        </button>
      </form>
    </div>
  );
}
