import admin from 'firebase-admin';

// Import JSON with assertion, compatible with ES Modules
import serviceAccount from '../firebase-credentials.json' with { type: 'json' };

// Inicializa la app de Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

const seedData = async () => {
  console.log('Iniciando el proceso de seeder...');

  // 1. Crear usuario administrador
  const adminEmail = 'admin@admin.com';
  const adminPassword = 'admin123';
  let adminUser;

  try {
    console.log(`Creando usuario: ${adminEmail}...`);
    adminUser = await auth.createUser({
      email: adminEmail,
      password: adminPassword,
      emailVerified: true,
    });
    console.log(`Usuario ${adminEmail} creado con UID: ${adminUser.uid}`);

    // 2. Asignar rol de administrador en Firestore
    const userDocRef = db.collection('users').doc(adminUser.uid);
    await userDocRef.set({
      email: adminEmail,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`Rol 'admin' asignado a ${adminEmail} en Firestore.`);

  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      console.log(`El usuario ${adminEmail} ya existe. Obteniendo su UID...`);
      adminUser = await auth.getUserByEmail(adminEmail);
      console.log(`UID obtenido: ${adminUser.uid}`);
    } else {
      console.error('Error creando el usuario:', error);
      return; // Detener si hay un error grave
    }
  }

  if (!adminUser) {
    console.error('No se pudo crear o encontrar el usuario administrador. Abortando.');
    return;
  }

  // 3. Añadir productos de ejemplo
  const products = [
    { id: 'prod-1', name: 'Laptop Pro', purchasePrice: 1200, salePrice: 1499.99, stock: 35, category: 'Electrónica', businessId: adminUser.uid },
    { id: 'prod-2', name: 'Mouse Inalámbrico', purchasePrice: 30, salePrice: 49.99, stock: 150, category: 'Accesorios', businessId: adminUser.uid },
    { id: 'prod-3', name: 'Teclado Mecánico RGB', purchasePrice: 90, salePrice: 129.99, stock: 75, category: 'Accesorios', businessId: adminUser.uid },
    { id: 'prod-4', name: 'Monitor 27" 4K', purchasePrice: 350, salePrice: 450.00, stock: 40, category: 'Monitores', businessId: adminUser.uid },
    { id: 'prod-5', name: 'Silla de Oficina Ergonómica', purchasePrice: 180, salePrice: 299.50, stock: 25, category: 'Mobiliario', businessId: adminUser.uid },
  ];

  console.log('Añadiendo productos de ejemplo a Firestore...');
  const batch = db.batch();
  products.forEach(product => {
    const docRef = db.collection('products').doc(product.id);
    batch.set(docRef, product);
  });

  await batch.commit();
  console.log(`${products.length} productos han sido añadidos.`);

  console.log('\n¡Seeder completado exitosamente!');
};

seedData().catch(console.error);
