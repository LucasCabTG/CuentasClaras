'use client';

import { useAuditLogs } from '@/core/hooks/useAuditLogs';

export default function AuditLogList() {
  const { logs, loading, error } = useAuditLogs();

  if (loading) {
    return <p>Cargando registros de auditoría...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md mt-8">
      <h3 className="text-xl font-bold mb-6 text-gray-800">Registros de Auditoría</h3>
      {logs.length === 0 ? (
        <p className="text-gray-600">No hay registros de auditoría.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="text-left py-3 px-4 uppercase font-semibold">Fecha</th>
                <th className="text-left py-3 px-4 uppercase font-semibold">Usuario</th>
                <th className="text-left py-3 px-4 uppercase font-semibold">Acción</th>
                <th className="text-left py-3 px-4 uppercase font-semibold">Detalles</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {logs.map(log => (
                <tr key={log.id} className="border-b">
                  <td className="py-3 px-4">{new Date(log.createdAt.seconds * 1000).toLocaleString()}</td>
                  <td className="py-3 px-4">{log.userEmail}</td>
                  <td className="py-3 px-4">{log.action}</td>
                  <td className="py-3 px-4">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
