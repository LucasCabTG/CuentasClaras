export interface CartItem {
  id: string;
  name: string;
  type: 'product' | 'promotion';
  quantityInCart: number;
  salePrice: number;
  category?: string;
  quantity?: number; // stock
  bundleItems?: { productId: string; quantity: number }[];
  description?: string;
  purchasePrice?: number;
  distributor?: string;
  specialPrices?: string;
  businessId: string;
  allowedPaymentMethods?: string[];
  price?: number; // from promotion
}