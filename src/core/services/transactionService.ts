import { collection, writeBatch, doc, Timestamp, increment } from 'firebase/firestore';
import { db } from './firebase';
import { Transaction } from '../hooks/useTransactions';
import { CartItem } from '../types/CartItem';

export const createTransaction = async (
  cart: CartItem[], 
  paymentMethod: string, 
  businessId: string,
  customerId?: string | null,
  customerName?: string | null
) => {
  const batch = writeBatch(db);

  // 1. Create a new transaction document
  const transactionRef = doc(collection(db, 'transactions'));
  const total = cart.reduce((sum, item) => sum + item.salePrice * item.quantityInCart, 0);
  
  const baseTransactionData = {
    businessId,
    paymentMethod,
    total,
    items: cart.map(item => ({
      itemId: item.id,
      name: item.name,
      type: item.type,
      quantity: item.quantityInCart,
      salePrice: item.salePrice,
      ...(item.type === 'promotion' && { bundleItems: item.bundleItems })
    })),
    createdAt: Timestamp.now(),
  };

  const transactionData = {
    ...baseTransactionData,
    ...(customerId && { customerId }),
    ...(customerName && { customerName }),
  };

  batch.set(transactionRef, transactionData);

  // 2. Update the stock for each product
  for (const item of cart) {
    if (item.type === 'promotion' && item.bundleItems) {
      // If it's a promotion, decrement stock for each item in the bundle
      for (const bundleItem of item.bundleItems) {
        const productRef = doc(db, 'products', bundleItem.productId);
        const quantityToDecrement = bundleItem.quantity * item.quantityInCart;
        batch.update(productRef, { quantity: increment(-quantityToDecrement) });
      }
    } else if (item.type === 'product') {
      // If it's a single product, decrement its stock
      const productRef = doc(db, 'products', item.id);
      batch.update(productRef, { quantity: increment(-item.quantityInCart) });
    }
  }

  // 3. Commit the batch
  await batch.commit();
};

export const deleteTransaction = async (transaction: Transaction) => {
  const batch = writeBatch(db);

  // 1. Delete the transaction document
  const transactionRef = doc(db, 'transactions', transaction.id);
  batch.delete(transactionRef);

  // 2. Restore the stock for each product in the transaction
  for (const item of transaction.items) {
    if (item.type === 'promotion' && item.bundleItems) {
      // If it's a promotion, restore stock for each item in the bundle
      for (const bundleItem of item.bundleItems) {
        const productRef = doc(db, 'products', bundleItem.productId);
        const quantityToRestore = bundleItem.quantity * item.quantity; // item.quantity is the quantity of the bundle sold
        batch.update(productRef, { quantity: increment(quantityToRestore) });
      }
    } else if (item.type === 'product') {
      // If it's a single product, restore its stock
      const productRef = doc(db, 'products', item.itemId);
      batch.update(productRef, { quantity: increment(item.quantity) });
    }
  }

  // 3. Commit the batch
  await batch.commit();
};
