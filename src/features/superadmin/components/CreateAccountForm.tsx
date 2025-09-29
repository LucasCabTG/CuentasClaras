'use client';

import { useState } from 'react';
import { useAuthContext } from '@/core/context/AuthContext';

export default function CreateAccountForm({ onAccountCreated }: { onAccountCreated: () => void }) {
  const { user } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileLimit, setProfileLimit] = useState(5);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    if (!user) {
      setFeedback({ type: 'error', message: 'Superadmin not authenticated.' });
      setLoading(false);
      return;
    }

    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/superadmin/create-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ email, password, profileLimit }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create account');
      }

      setFeedback({ type: 'success', message: `Cuenta para ${email} creada con éxito.` });
      setEmail('');
      setPassword('');
      onAccountCreated(); // Refresh the list in the parent component
    } catch (error: any) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
      <h3 className="text-xl font-bold mb-6 text-gray-800">Crear Nueva Cuenta de Negocio</h3>
      {feedback && <p className={`p-3 rounded-md mb-4 text-sm ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{feedback.message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email del nuevo admin</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña Provisional</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Límite de Perfiles/Vendedores</label>
          <input type="number" value={profileLimit} onChange={(e) => setProfileLimit(Number(e.target.value))} required className="input w-full" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300">
          {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>
      </form>
    </div>
  );
}
