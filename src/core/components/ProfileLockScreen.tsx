'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/core/context/AuthContext';
import { db } from '@/core/services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import * as bcrypt from 'bcryptjs';

// This interface needs to include the pinHash for comparison
interface Profile {
  id: string;
  name: string;
  pinHash: string;
}

interface ProfileLockScreenProps {
  onUnlock: (profile: { id: string; name: string }) => void; // Callback on success
}

export default function ProfileLockScreen({ onUnlock }: ProfileLockScreenProps) {
  const { user } = useAuthContext();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const profilesCollectionRef = collection(db, 'users', user.uid, 'profiles');
        const q = query(profilesCollectionRef, orderBy('name'));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          // If no profiles, unlock immediately with the main user's identity
          onUnlock({ id: user.uid, name: user.email || 'Admin' });
        } else {
          const profilesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Profile));
          setProfiles(profilesData);
        }
      } catch (err) {
        setError('No se pudieron cargar los perfiles de usuario.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [user, onUnlock]);

  const handlePinSubmit = async () => {
    if (!pin || !selectedProfileId) {
      setError('Por favor, selecciona un perfil e introduce el PIN.');
      return;
    }

    setLoading(true);
    setError(null);

    const selectedProfile = profiles.find(p => p.id === selectedProfileId);
    if (!selectedProfile) {
      setError('Perfil no encontrado.');
      setLoading(false);
      return;
    }

    const isPinCorrect = await bcrypt.compare(pin, selectedProfile.pinHash);

    if (isPinCorrect) {
      onUnlock({ id: selectedProfile.id, name: selectedProfile.name });
    } else {
      setError('PIN incorrecto. Inténtalo de nuevo.');
      setPin(''); // Clear PIN input
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">¿Quién está vendiendo?</h2>
        <p className="text-center text-gray-600 mb-6">Selecciona tu perfil para continuar.</p>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}

        <div className="space-y-3 mb-6">
          {profiles.map(profile => (
            <button 
              key={profile.id} 
              onClick={() => setSelectedProfileId(profile.id)}
              className={`w-full p-4 rounded-md text-lg font-semibold border-2 transition-all ${
                selectedProfileId === profile.id 
                  ? 'bg-blue-500 text-white border-blue-600' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-200'
              }`}>
              {profile.name}
            </button>
          ))}
        </div>

        {selectedProfileId && (
          <div className="flex flex-col items-center gap-4">
            <input 
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={6}
              placeholder="Introduce tu PIN de 6 dígitos"
              className="input text-center text-2xl tracking-widest w-full max-w-xs"
              autoFocus
            />
            <button onClick={handlePinSubmit} disabled={loading} className="w-full max-w-xs btn-primary py-3">
              {loading ? 'Verificando...' : 'Desbloquear'}
            </button>
          </div>
        )}
      </div>
      <style jsx>{`
        .input { box-shadow: inset 0 1px 2px rgba(0,0,0,0.07); appearance: none; border-radius: 0.375rem; border: 1px solid #d1d5db; padding: 0.5rem 0.75rem; color: #374151; line-height: 1.5; }
        .btn-primary { background-color: #3b82f6; color: white; font-weight: bold; padding: 0.5rem 1rem; border-radius: 0.375rem; }
        .btn-primary:hover { background-color: #2563eb; }
        .btn-primary:disabled { background-color: #93c5fd; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
