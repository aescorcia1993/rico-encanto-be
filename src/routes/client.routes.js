import express from 'express';
import { clients, generateId } from '../data/db.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Obtener todos los clientes
router.get('/', authenticateToken, (req, res) => {
  const { search } = req.query;
  
  let filteredClients = [...clients];
  
  if (search) {
    filteredClients = filteredClients.filter(c => 
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json(filteredClients);
});

// Obtener un cliente por ID
router.get('/:id', authenticateToken, (req, res) => {
  const client = clients.find(c => c.id === parseInt(req.params.id));
  
  if (!client) {
    return res.status(404).json({ error: 'Cliente no encontrado' });
  }
  
  res.json(client);
});

// Crear nuevo cliente
router.post('/', authenticateToken, (req, res) => {
  const { nombre, email, telefono } = req.body;
  
  if (!nombre || !email) {
    return res.status(400).json({ error: 'Nombre y email son requeridos' });
  }
  
  // Verificar si el email ya existe
  const existingClient = clients.find(c => c.email === email);
  if (existingClient) {
    return res.status(400).json({ error: 'El email ya está registrado' });
  }
  
  const newClient = {
    id: generateId(clients),
    nombre,
    email,
    telefono: telefono || '',
    fechaRegistro: new Date().toISOString().split('T')[0]
  };
  
  clients.unshift(newClient); // Agregar al inicio del array
  res.status(201).json(newClient);
});

// Actualizar cliente
router.put('/:id', authenticateToken, (req, res) => {
  const clientIndex = clients.findIndex(c => c.id === parseInt(req.params.id));
  
  if (clientIndex === -1) {
    return res.status(404).json({ error: 'Cliente no encontrado' });
  }
  
  const { nombre, email, telefono } = req.body;
  
  // Si se cambia el email, verificar que no exista
  if (email && email !== clients[clientIndex].email) {
    const existingClient = clients.find(c => c.email === email);
    if (existingClient) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
  }
  
  clients[clientIndex] = {
    ...clients[clientIndex],
    nombre: nombre || clients[clientIndex].nombre,
    email: email || clients[clientIndex].email,
    telefono: telefono !== undefined ? telefono : clients[clientIndex].telefono
  };
  
  res.json(clients[clientIndex]);
});

// Eliminar cliente
router.delete('/:id', authenticateToken, (req, res) => {
  const clientIndex = clients.findIndex(c => c.id === parseInt(req.params.id));
  
  if (clientIndex === -1) {
    return res.status(404).json({ error: 'Cliente no encontrado' });
  }
  
  clients.splice(clientIndex, 1);
  res.json({ message: 'Cliente eliminado exitosamente' });
});

export default router;
