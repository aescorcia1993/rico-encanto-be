// Base de datos en memoria para desarrollo
// En producción, reemplazar con una base de datos real (MongoDB, PostgreSQL, etc.)

import bcrypt from 'bcryptjs';

// Usuarios (hashed password: "admin123")
export const users = [
  {
    id: 1,
    email: 'admin@ricoencanto.com',
    password: '$2a$10$Hjh4D13Y6T2VjoIBCawwr.iNEPvT7xMQNxG2mmTh2YO/Y7SbVMq2m', // admin123
    name: 'Administrador'
  }
];

// Productos
export const products = [
  {
    id: 1,
    nombre: 'Chocolate',
    stock: 25,
    precio: 5000,
    estado: 'Disponible'
  },
  {
    id: 2,
    nombre: 'Queso con bocadillo',
    stock: 150,
    precio: 5000,
    estado: 'Disponible'
  },
  {
    id: 3,
    nombre: 'Maracuya',
    stock: 50,
    precio: 5000,
    estado: 'Disponible'
  },
  {
    id: 4,
    nombre: 'Frutos rojos',
    stock: 5,
    precio: 5000,
    estado: 'Agotado'
  },
  {
    id: 5,
    nombre: 'Gelatina mosaico',
    stock: 80,
    precio: 3000,
    estado: 'Disponible'
  },
  {
    id: 6,
    nombre: 'Chocorramo',
    stock: 30,
    precio: 5000,
    estado: 'Disponible'
  }
];

// Ventas
export const sales = [
  {
    id: 12345,
    cliente: 'Sofía Ramírez',
    clienteId: 1,
    fecha: '2025-10-26',
    productos: [
      { productoId: 1, cantidad: 2, precioUnitario: 5000 }
    ],
    total: 55000,
    estado: 'Completada'
  },
  {
    id: 12346,
    cliente: 'Diego Fernández',
    clienteId: 2,
    fecha: '2025-10-27',
    productos: [
      { productoId: 3, cantidad: 1, precioUnitario: 5000 }
    ],
    total: 3000,
    estado: 'Pendiente'
  },
  {
    id: 12347,
    cliente: 'Isabella Torres',
    clienteId: 3,
    fecha: '2025-10-28',
    productos: [
      { productoId: 2, cantidad: 10, precioUnitario: 5000 },
      { productoId: 3, cantidad: 5, precioUnitario: 5000 }
    ],
    total: 30000,
    estado: 'Completada'
  },
  {
    id: 12348,
    cliente: 'Mateo Vargas',
    clienteId: 4,
    fecha: '2025-10-29',
    productos: [
      { productoId: 5, cantidad: 8, precioUnitario: 3000 }
    ],
    total: 45000,
    estado: 'Cancelada'
  },
  {
    id: 12349,
    cliente: 'Camila López',
    clienteId: 5,
    fecha: '2025-10-30',
    productos: [
      { productoId: 6, cantidad: 1, precioUnitario: 5000 }
    ],
    total: 60000,
    estado: 'Pendiente'
  }
];

// Clientes
export const clients = [
  { id: 1, nombre: 'Sofía Ramírez', email: 'sofia@email.com', telefono: '3001234567', fechaRegistro: '2025-01-15' },
  { id: 2, nombre: 'Diego Fernández', email: 'diego@email.com', telefono: '3009876543', fechaRegistro: '2025-02-20' },
  { id: 3, nombre: 'Isabella Torres', email: 'isabella@email.com', telefono: '3005556677', fechaRegistro: '2025-03-10' },
  { id: 4, nombre: 'Mateo Vargas', email: 'mateo@email.com', telefono: '3007778899', fechaRegistro: '2025-04-05' },
  { id: 5, nombre: 'Camila López', email: 'camila@email.com', telefono: '3002223344', fechaRegistro: '2025-05-12' }
];

// Función helper para generar IDs
export const generateId = (array) => {
  return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
};
