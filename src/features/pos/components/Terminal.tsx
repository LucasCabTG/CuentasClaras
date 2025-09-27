'use client';

import { useState, useMemo, useEffect } from 'react';
import { useProducts, Product } from '@/core/hooks/useProducts';
import { usePromotions, Promotion } from '@/core/hooks/usePromotions';
import { useCustomers } from '@/core/hooks/useCustomers';
import { useAuthContext } from '@/core/context/AuthContext';
import { createTransaction } from '@/core/services/transactionService';
import Cart from './Cart';



import AddCustomerForm from '@/features/customers/components/AddCustomerForm';
import Modal from '@/core/components/Modal';


import PromotionSuggestionToast from './PromotionSuggestionToast';

interface CartItem extends Omit<Product, 'id'> {
  id: string; // Can be product or promotion id
  type: 'product' | 'promotion';
  quantityInCart: number;
  bundleItems?: { productId: string; quantity: number }[];
}

type SearchResult = (Product & { type: 'product' }) | (Promotion & { type: 'promotion' });

const ALL_PAYMENT_METHODS = ['Efectivo', 'Tarjeta', 'Débito', 'QR', 'Transferencia'];

export default function Terminal() {
  const { user } = useAuthContext();
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { promotions, loading: promotionsLoading, error: promotionsError } = usePromotions();
  const { customers } = useCustomers();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [isCompletingPurchase, setIsCompletingPurchase] = useState(false);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [suggestedPromotions, setSuggestedPromotions] = useState<Promotion[]>([]);
  const [showPromotionToast, setShowPromotionToast] = useState(false);
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<string[]>(['Efectivo', 'Tarjeta', 'Débito', 'QR', 'Transferencia']);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return [];
    return customers.filter(c => 
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      (c.phone && c.phone.includes(customerSearch)) ||
      (c.email && c.email.toLowerCase().includes(customerSearch.toLowerCase()))
    );
  }, [customers, customerSearch]);

  useEffect(() => {
    const promotionsInCart = cart.filter(item => item.type === 'promotion') as (CartItem & Promotion)[];
    
    if (promotionsInCart.length > 0) {
      const allowedMethods = promotionsInCart.map(promo => promo.allowedPaymentMethods || ALL_PAYMENT_METHODS);
      const intersection = allowedMethods.reduce((acc, methods) => acc.filter(method => methods.includes(method)));
      
      setAvailablePaymentMethods(intersection);

      if (!intersection.includes(paymentMethod)) {
        setPaymentMethod(intersection[0] || '');
      }
    } else {
      setAvailablePaymentMethods(ALL_PAYMENT_METHODS);
    }
  }, [cart, paymentMethod]);

  useEffect(() => {
    const findApplicablePromotions = () => {
      const applicablePromos: Promotion[] = [];
      for (const promo of promotions) {
        if (!promo.bundleItems || promo.bundleItems.length === 0) continue;

        const cartProducts = cart.filter(item => item.type === 'product');
        let canApply = true;
        for (const bundleItem of promo.bundleItems) {
          const cartItem = cartProducts.find(p => p.id === bundleItem.productId);
          if (!cartItem || cartItem.quantityInCart < bundleItem.quantity) {
            canApply = false;
            break;
          }
        }

        if (canApply) {
          applicablePromos.push(promo);
        }
      }

      if (JSON.stringify(applicablePromos) !== JSON.stringify(suggestedPromotions)) {
        setSuggestedPromotions(applicablePromos);
        if (applicablePromos.length > 0) {
          setShowPromotionToast(true);
        }
      }
    };

    findApplicablePromotions();
  }, [cart, promotions, suggestedPromotions]);

  const handleCustomerAdded = (newCustomerId: string) => {
    setSelectedCustomer(newCustomerId);
    setShowAddCustomerModal(false);
  };

  const applyPromotion = (promotion: Promotion) => {
    if (!promotion.bundleItems) return;

    let newCart = [...cart];

    for (const bundleItem of promotion.bundleItems) {
      const cartItem = newCart.find(item => item.id === bundleItem.productId);
      if (cartItem) {
        const newQuantity = cartItem.quantityInCart - bundleItem.quantity;
        if (newQuantity > 0) {
          newCart = newCart.map(item => item.id === bundleItem.productId ? { ...item, quantityInCart: newQuantity } : item);
        }
        else {
          newCart = newCart.filter(item => item.id !== bundleItem.productId);
        }
      }
    }

    const promoInCart = newCart.find(item => item.id === promotion.id);
    if (promoInCart) {
      newCart = newCart.map(item => item.id === promotion.id ? { ...item, quantityInCart: item.quantityInCart + 1 } : item);
    }
    else {
      newCart.push({ 
        ...promotion, 
        type: 'promotion', 
        quantityInCart: 1, 
        salePrice: promotion.price 
      });
    }

    setCart(newCart);
    setShowPromotionToast(false);
  };

  const dismissPromotionToast = () => {
    setShowPromotionToast(false);
  };

  const searchableItems: SearchResult[] = useMemo(() => {
    const productItems: SearchResult[] = products.map(p => ({ ...p, type: 'product' }));
    const promotionItems: SearchResult[] = promotions.map(p => ({ ...p, type: 'promotion' }));
    return [...productItems, ...promotionItems];
  }, [products, promotions]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return [];
    return searchableItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchableItems, searchTerm]);

  const addToCart = (item: SearchResult) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return currentCart.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantityInCart: cartItem.quantityInCart + 1 } 
            : cartItem
        );
      } else {
        const cartItem: CartItem = {
          ...item,
          id: item.id,
          salePrice: item.type === 'promotion' ? item.price : item.salePrice,
          quantityInCart: 1,
        };
        return [...currentCart, cartItem];
      }
    });
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
    } else {
      setCart(cart.map(item => item.id === itemId ? { ...item, quantityInCart: newQuantity } : item));
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const handleCustomerSelected = (customerId: string | null) => {
    setSelectedCustomer(customerId);
    setCustomerSearch(''); // Clear search on selection
  };

  const handleCompletePurchase = async () => {
    if (!user || cart.length === 0) return;

    setIsCompletingPurchase(true);
    setFeedback(null);
    setShowPromotionToast(false); // Hide toast on purchase
    try {
      const customer = customers.find(c => c.id === selectedCustomer);
      await createTransaction(
        cart, 
        paymentMethod, 
        user.uid,
        selectedCustomer,
        customer ? customer.name : 'Consumidor Final'
      );
      setCart([]);
      setSearchTerm('');
      setSelectedCustomer(null);
      setCustomerSearch('');
      setFeedback({ type: 'success', message: '¡Venta completada con éxito!' });
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Hubo un error al procesar la venta.' });
    } finally {
      setIsCompletingPurchase(false);
    }
  }

  const isLoading = productsLoading || promotionsLoading;

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-10rem)]">
      {showPromotionToast && suggestedPromotions.length > 0 && (
        <PromotionSuggestionToast 
          promotions={suggestedPromotions}
          onApplyPromotion={applyPromotion}
          onDismiss={dismissPromotionToast}
        />
      )}

      {/* Product Selection Area */}
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Terminal de Venta</h2>
        {feedback && (
          <div className={`p-3 rounded-md mb-4 text-sm ${
            feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {feedback.message}
          </div>
        )}
        <div className="mb-4">
          <input 
            type="text"
            placeholder="Buscar producto o promoción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>
        <div className="overflow-y-auto flex-grow">
          {isLoading && <p>Cargando...</p>}
          {productsError && <p className="text-red-500">{productsError}</p>}
          {promotionsError && <p className="text-red-500">{promotionsError}</p>}
          {searchTerm && filteredItems.length > 0 && (
            <ul className="divide-y divide-gray-200">
              {filteredItems.map(item => (
                <li 
                  key={item.id} 
                  onClick={() => addToCart(item)}
                  className="p-4 bg-white hover:bg-gray-200 cursor-pointer flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{item.name} {item.type === 'promotion' && '🔥'}</p>
                    <p className="text-sm text-gray-600">{item.type === 'product' ? item.category : 'Promoción'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">${item.type === 'promotion' ? item.price.toFixed(2) : item.salePrice.toFixed(2)}</p>
                    {item.type === 'product' && <p className={`text-sm ${item.quantity > 0 ? 'text-gray-600' : 'text-red-500'}`}>Stock: {item.quantity}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {searchTerm && !isLoading && filteredItems.length === 0 && (
            <p className="text-gray-600 p-4">No se encontraron resultados.</p>
          )}
        </div>
      </div>

      {/* Cart Area */}
      <div className="lg:col-span-1">
        <Cart 
          cart={cart} 
          paymentMethod={paymentMethod}
          customers={customers}
          filteredCustomers={filteredCustomers}
          selectedCustomer={selectedCustomer}
          customerSearch={customerSearch}
          availablePaymentMethods={availablePaymentMethods}
          onUpdateQuantity={handleUpdateQuantity} 
          onRemoveItem={handleRemoveItem}
          onPaymentMethodChange={setPaymentMethod}
          onCustomerChange={handleCustomerSelected}
          onCustomerSearchChange={setCustomerSearch}
          onAddNewCustomer={() => setShowAddCustomerModal(true)}
          onCompletePurchase={handleCompletePurchase}
          isCompletingPurchase={isCompletingPurchase}
        />
      </div>

      <Modal isOpen={showAddCustomerModal} onClose={() => setShowAddCustomerModal(false)}>
        <AddCustomerForm onCustomerAdded={handleCustomerAdded} />
      </Modal>
    </div>
  );
}
