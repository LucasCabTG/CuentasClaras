'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/core/context/AuthContext';
import { db } from '@/core/services/firebase';
import { collection, doc, addDoc, getDocs, deleteDoc, query, orderBy } from 'firebase/firestore';
import * as bcrypt from 'bcryptjs';

interface Profile {
  id: string;
  name: string;
}

export default function ProfileManager() {
  const { user } = useAuthContext();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfilePin, setNewProfilePin] = useState('');
  const [loading, setLoading] = useState(true); // Start with loading true
  const [formLoading, setFormLoading] = useState(false); // Separate loading for form submission
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const fetchProfiles = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const profilesCollectionRef = collection(db, 'users', user.uid, 'profiles');
      const q = query(profilesCollectionRef, orderBy('name'));
      const querySnapshot = await getDocs(q);
      const profilesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Profile));
      setProfiles(profilesData);
    } catch (error) {
      console.error("Error fetching profiles: ", error);
      setFeedback({ type: 'error', message: 'No se pudieron cargar los perfiles.' });
    } finally {
      setLoading(false);
    }
  }, [user]); // Dependency is now the stable 'user' object

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleAddProfile = async () => {
    if (!newProfileName.trim() || newProfilePin.length !== 6 || !/^\d+$/.test(newProfilePin)) {
      setFeedback({ type: 'error', message: 'El nombre no puede estar vacío y el PIN debe ser de 6 dígitos numéricos.' });
      return;
    }
    if (!user) return;

    setFormLoading(true);
    setFeedback(null);

    try {
      const salt = await bcrypt.genSalt(10);
      const pinHash = await bcrypt.hash(newProfilePin, salt);
      
      const profilesCollectionRef = collection(db, 'users', user.uid, 'profiles');
      await addDoc(profilesCollectionRef, {
        name: newProfileName.trim(),
        pinHash: pinHash,
      });

      setNewProfileName('');
      setNewProfilePin('');
      setFeedback({ type: 'success', message: 'Perfil agregado con éxito.' });
      await fetchProfiles(); // Refresh the list
    } catch (error) { 
      console.error("Error adding profile: ", error);
      setFeedback({ type: 'error', message: 'Error al agregar el perfil.' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (!user) return;
    if (window.confirm("¿Estás seguro de que quieres eliminar este perfil?")) {
      setLoading(true); // Use main loading for list updates
      try {
        const profileDocRef = doc(db, 'users', user.uid, 'profiles', profileId);
        await deleteDoc(profileDocRef);
        setFeedback({ type: 'success', message: 'Perfil eliminado con éxito.' });
        await fetchProfiles(); // Refresh the list
      } catch (error) {
        console.error("Error deleting profile: ", error);
        setFeedback({ type: 'error', message: 'Error al eliminar el perfil.' });
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mt-6">
      <h3 className="text-xl font-bold mb-6 text-gray-800">Gestionar Perfiles de Vendedor (PIN)</h3>
      
      {feedback && <p className={`p-3 rounded-md mb-4 text-sm ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{feedback.message}</p>}

      <div className="mb-6 border-b pb-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-700">Añadir Nuevo Perfil</h4>
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <input 
            type="text"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            placeholder="Nombre del vendedor"
            className="input flex-grow"
            disabled={formLoading}
          />
          <input 
            type="password"
            value={newProfilePin}
            onChange={(e) => setNewProfilePin(e.target.value)}
            placeholder="PIN de 6 dígitos"
            maxLength={6}
            className="input md:w-48"
            disabled={formLoading}
          />
          <button onClick={handleAddProfile} className="btn-primary whitespace-nowrap" disabled={formLoading}>
            {formLoading ? 'Añadiendo...' : 'Añadir Perfil'}
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-4 text-gray-700">Perfiles Existentes</h4>
        {loading ? (
          <p className="text-gray-500">Cargando perfiles...</p>
        ) : profiles.length === 0 ? (
          <p className="text-gray-500">No hay perfiles de vendedor. Añade uno para empezar.</p>
        ) : (
          <ul className="space-y-3">
            {profiles.map(profile => (
              <li key={profile.id} className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                <span className="font-medium text-gray-800">{profile.name}</span>
                <button onClick={() => handleDeleteProfile(profile.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold" disabled={loading || formLoading}>Eliminar</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <style jsx>{`
        .input { box-shadow: inset 0 1px 2px rgba(0,0,0,0.07); appearance: none; border-radius: 0.375rem; border: 1px solid #d1d5db; width: 100%; padding: 0.5rem 0.75rem; color: #374151; line-height: 1.5; }
        .btn-primary { background-color: #3b82f6; color: white; font-weight: bold; padding: 0.5rem 1rem; border-radius: 0.375rem; }
        .btn-primary:hover { background-color: #2563eb; }
        .btn-primary:disabled { background-color: #93c5fd; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
