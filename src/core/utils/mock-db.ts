// src/core/utils/mock-db.ts

// Define interfaces for our data models for type safety
export interface User {
  id: string;
  email: string;
  password_hash: string; // In a real app, this would be a proper hash
  name: string;
  role: 'admin' | 'employee';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export interface Distributor {
    id: string;
    name: string;
    contact: string;
    phone: string;
}

// In-memory data stores. Using 'let' so they can be modified during runtime.

export let users: User[] = [
  {
    id: 'user-1',
    email: 'admin@admin.com',
    password_hash: 'admin', // For mock purposes, we use the plain password.
    name: 'Admin',
    role: 'admin',
  },
];

export let products: Product[] = [
  { id: 'prod-1', name: 'Laptop Pro', price: 1499.99, stock: 35, category: 'Electrónica' },
  { id: 'prod-2', name: 'Mouse Inalámbrico', price: 49.99, stock: 150, category: 'Accesorios' },
  { id: 'prod-3', name: 'Teclado Mecánico RGB', price: 129.99, stock: 75, category: 'Accesorios' },
  { id: 'prod-4', name: 'Monitor 27" 4K', price: 450.00, stock: 40, category: 'Monitores' },
  { id: 'prod-5', name: 'Silla de Oficina Ergonómica', price: 299.50, stock: 25, category: 'Mobiliario' },
];

export let distributors: Distributor[] = [
    { id: 'dist-1', name: 'ElectroTech Mayorista', contact: 'Juan Perez', phone: '123-456-7890' },
    { id: 'dist-2', name: 'Suministros de Oficina Express', contact: 'Ana Gomez', phone: '098-765-4321' },
];
