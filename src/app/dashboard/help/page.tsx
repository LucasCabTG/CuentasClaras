'use client';

import FeedbackForm from "@/features/help/components/FeedbackForm";

export default function HelpPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Ayuda y Soporte</h1>
      <p className="text-gray-600 mb-6">¿Tienes alguna sugerencia para una nueva funcionalidad o encontraste un error? Déjanos un mensaje.</p>
      <div className="flex justify-center">
        <FeedbackForm />
      </div>
    </div>
  );
}
