'use client';

import { useState } from 'react';
import { useAuthContext } from '@/core/context/AuthContext';
import { submitFeedback } from '@/core/services/helpService';

export default function FeedbackForm() {
  const { user } = useAuthContext();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setFeedback({ type: 'error', message: 'Debes iniciar sesión para enviar un mensaje.' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      await submitFeedback({
        subject,
        message,
        userEmail: user.email || 'No disponible',
        businessId: user.uid,
      });
      setFeedback({ type: 'success', message: '¡Gracias! Tu mensaje ha sido enviado.' });
      setSubject('');
      setMessage('');
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error al enviar el mensaje. Inténtalo de nuevo.' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
      <h3 className="text-xl font-bold mb-6 text-gray-800">Enviar un Mensaje</h3>
      {feedback && (
        <div className={`p-3 rounded-md mb-4 text-sm ${
          feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {feedback.message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">Asunto</label>
          <input 
            type="text" 
            name="subject" 
            id="subject"
            value={subject} 
            onChange={(e) => setSubject(e.target.value)} 
            required 
            className="input" 
            placeholder="Ej: Sugerencia para el TPV"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Mensaje</label>
          <textarea 
            name="message" 
            id="message"
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            required 
            className="input h-32" 
            placeholder="Describe tu sugerencia o el error que encontraste..."
          />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300">
          {loading ? 'Enviando...' : 'Enviar Mensaje'}
        </button>
      </form>
    </div>
  );
}
