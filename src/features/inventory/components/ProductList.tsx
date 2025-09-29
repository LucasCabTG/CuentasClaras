'use client';

import { useState } from 'react';
import { useProducts, Product } from '@/core/hooks/useProducts';
import { deleteProduct } from '@/core/services/productService';
import { logAction } from '@/core/services/auditService';
import { useAuthContext } from '@/core/context/AuthContext';
import Modal from '@/core/components/Modal';
import EditProductForm from './EditProductForm';

export default function ProductList() {
  const { user, activeProfile } = useAuthContext();
  const { products, loading, error } = useProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const handleDelete = async (productId: string, productName: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el producto "${productName}"?`)) {
      try {
        await deleteProduct(productId);
        if (user && activeProfile) {
          await logAction({ 
            action: 'delete_product', 
            userEmail: user.email || 'N/A', 
            profileName: activeProfile.name,
            businessId: user.uid, 
            details: `Producto eliminado: ${productName} (ID: ${productId})` 
          });
        }
        setFeedback({ type: 'success', message: 'Producto eliminado con éxito.' });
      } catch (err) {
        setFeedback({ type: 'error', message: 'Error al eliminar el producto.' });
        console.error(err);
      }
    }
  };

  const handleEditSuccess = () => {
    setFeedback({ type: 'success', message: 'Producto actualizado con éxito.' });
  }

  if (loading) {
    return <p className="text-gray-600">Cargando productos...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="overflow-x-auto">
      {feedback && (
        <div className={`p-3 rounded-md mb-4 text-sm ${
          feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {feedback.message}
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-gray-600">No hay productos en tu inventario. ¡Agrega uno para comenzar!</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Nombre</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Categoría</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Precio Venta</th>
              <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Cantidad</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-4">{product.name}</td>
                <td className="py-3 px-4">{product.category}</td>
                <td className="py-3 px-4">${(product.salePrice ?? 0).toFixed(2)}</td>
                <td className="py-3 px-4 text-center">{product.quantity}</td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setEditingProduct(product)}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id, product.name)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal isOpen={!!editingProduct} onClose={() => setEditingProduct(null)}>
        {editingProduct && (
          <EditProductForm 
            product={editingProduct} 
            onClose={() => setEditingProduct(null)} 
            onSuccess={handleEditSuccess}
          />
        )}
      </Modal>
    </div>
  );
}
