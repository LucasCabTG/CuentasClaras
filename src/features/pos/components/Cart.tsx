'use client';

import { Product } from "@/core/hooks/useProducts";
import { Customer } from "@/core/services/customerService";

interface CartItem extends Product {
  quantityInCart: number;
}

interface CartProps {
  cart: CartItem[];
  paymentMethod: string;
  customers: Customer[];
  filteredCustomers: Customer[];
  selectedCustomer: string | null;
  customerSearch: string;
  availablePaymentMethods: string[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onPaymentMethodChange: (method: string) => void;
  onCustomerChange: (customerId: string | null) => void;
  onCustomerSearchChange: (value: string) => void;
  onAddNewCustomer: () => void;
  onCompletePurchase: () => void;
  isCompletingPurchase: boolean;
}

export default function Cart({ 
  cart, 
  paymentMethod, 
  customers, 
  filteredCustomers,
  selectedCustomer, 
  customerSearch,
  availablePaymentMethods,
  onUpdateQuantity, 
  onRemoveItem, 
  onPaymentMethodChange, 
  onCustomerChange, 
  onCustomerSearchChange,
  onAddNewCustomer,
  onCompletePurchase, 
  isCompletingPurchase 
}: CartProps) {
  const total = cart.reduce((sum, item) => sum + item.salePrice * item.quantityInCart, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Carrito</h3>
      {cart.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-600">El carrito está vacío.</p>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto -mr-3 pr-3">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center mb-4">
              <div>
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-600">${item.salePrice.toFixed(2)}</p>
              </div>
              <div className="flex items-center">
                <button onClick={() => onUpdateQuantity(item.id, item.quantityInCart - 1)} className="h-8 w-8 bg-gray-200 rounded-full text-lg font-bold">-</button>
                <span className="px-4 font-semibold">{item.quantityInCart}</span>
                <button onClick={() => onUpdateQuantity(item.id, item.quantityInCart + 1)} className="h-8 w-8 bg-gray-200 rounded-full text-lg font-bold">+</button>
                <button onClick={() => onRemoveItem(item.id)} className="ml-4 text-red-500 hover:text-red-700 font-bold">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="customer" className="block text-gray-700 text-sm font-bold">Asignar Cliente (Opcional)</label>
                    <button onClick={onAddNewCustomer} className="text-blue-600 hover:text-blue-800 text-sm font-semibold">+ Nuevo</button>
                  </div>
        
                  {selectedCustomer ? (
                    <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                      <p className="text-gray-800 font-semibold">{customers.find(c => c.id === selectedCustomer)?.name}</p>
                      <button onClick={() => onCustomerChange(null)} className="text-red-500 hover:text-red-700 font-bold text-lg">&times;</button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input 
                        type="text"
                        value={customerSearch}
                        onChange={(e) => onCustomerSearchChange(e.target.value)}
                        placeholder="Buscar por nombre, email o teléfono..."
                        className="input w-full"
                        disabled={cart.length === 0}
                      />
                      {customerSearch && filteredCustomers.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
                          {filteredCustomers.map(customer => (
                            <li 
                              key={customer.id} 
                              onClick={() => onCustomerChange(customer.id)}
                              className="p-2 bg-white hover:bg-gray-200 cursor-pointer text-gray-800"
                            >
                              {customer.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
        
                <div className="mb-4">
                  <label htmlFor="paymentMethod" className="block text-gray-700 text-sm font-bold mb-2">Método de Pago</label>          <select 
            id="paymentMethod" 
            value={paymentMethod}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            className="input w-full"
            disabled={cart.length === 0 || availablePaymentMethods.length === 0}
          >
            {availablePaymentMethods.length === 0 && cart.length > 0 ? (
              <option>No hay métodos de pago compatibles</option>
            ) : (
              availablePaymentMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))
            )}
          </select>
        </div>
        <div className="flex justify-between items-center font-bold text-xl mb-4 text-gray-900">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button 
          onClick={onCompletePurchase}
          disabled={cart.length === 0 || isCompletingPurchase}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-green-300 disabled:cursor-not-allowed"
        >
          {isCompletingPurchase ? 'Procesando...' : 'Finalizar Compra'}
        </button>
      </div>
       <style jsx>{`
        .input {
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.07);
          appearance: none;
          border-radius: 0.375rem;
          border: 1px solid #d1d5db;
          width: 100%;
          padding: 0.5rem 0.75rem;
          color: #374151;
          line-height: 1.5;
          background-color: white;
        }
        .input:disabled {
          background-color: #f3f4f6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
