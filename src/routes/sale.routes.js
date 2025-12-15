import express from 'express';
import { sales, products, generateId } from '../data/db.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Obtener todas las ventas
router.get('/', authenticateToken, (req, res) => {
  const { search, estado } = req.query;
  
  let filteredSales = [...sales];
  
  if (search) {
    filteredSales = filteredSales.filter(s => 
      s.cliente.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toString().includes(search)
    );
  }
  
  if (estado) {
    filteredSales = filteredSales.filter(s => s.estado === estado);
  }
  
  res.json(filteredSales);
});

// Obtener una venta por ID
router.get('/:id', authenticateToken, (req, res) => {
  const sale = sales.find(s => s.id === parseInt(req.params.id));
  
  if (!sale) {
    return res.status(404).json({ error: 'Venta no encontrada' });
  }
  
  res.json(sale);
});

// Crear nueva venta
router.post('/', authenticateToken, (req, res) => {
  const { cliente, clienteId, productos: productosVenta, estado } = req.body;
  
  if (!cliente || !productosVenta || productosVenta.length === 0) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  
  // Calcular total y verificar stock
  let total = 0;
  for (const item of productosVenta) {
    const product = products.find(p => p.id === item.productoId);
    if (!product) {
      return res.status(400).json({ error: `Producto ${item.productoId} no encontrado` });
    }
    if (product.stock < item.cantidad) {
      return res.status(400).json({ 
        error: `Stock insuficiente para ${product.nombre}. Disponible: ${product.stock}` 
      });
    }
    total += item.cantidad * item.precioUnitario;
  }
  
  const newSale = {
    id: generateId(sales),
    cliente,
    clienteId: clienteId || null,
    fecha: new Date().toISOString().split('T')[0],
    productos: productosVenta,
    total,
    estado: estado || 'Pendiente'
  };
  
  // Actualizar stock si la venta está completada
  if (newSale.estado === 'Completada') {
    for (const item of productosVenta) {
      const productIndex = products.findIndex(p => p.id === item.productoId);
      products[productIndex].stock -= item.cantidad;
      
      // Actualizar estado del producto
      if (products[productIndex].stock <= 5) {
        products[productIndex].estado = 'Agotado';
      }
    }
  }
  
  sales.unshift(newSale); // Agregar al inicio del array
  res.status(201).json(newSale);
});

// Actualizar venta
router.put('/:id', authenticateToken, (req, res) => {
  const saleIndex = sales.findIndex(s => s.id === parseInt(req.params.id));
  
  if (saleIndex === -1) {
    return res.status(404).json({ error: 'Venta no encontrada' });
  }
  
  const { estado } = req.body;
  const oldEstado = sales[saleIndex].estado;
  
  sales[saleIndex] = {
    ...sales[saleIndex],
    ...req.body
  };
  
  // Si cambió de Pendiente a Completada, actualizar stock
  if (oldEstado !== 'Completada' && estado === 'Completada') {
    for (const item of sales[saleIndex].productos) {
      const productIndex = products.findIndex(p => p.id === item.productoId);
      if (productIndex !== -1) {
        products[productIndex].stock -= item.cantidad;
        
        if (products[productIndex].stock <= 5) {
          products[productIndex].estado = 'Agotado';
        }
      }
    }
  }
  
  res.json(sales[saleIndex]);
});

// Eliminar venta
router.delete('/:id', authenticateToken, (req, res) => {
  const saleIndex = sales.findIndex(s => s.id === parseInt(req.params.id));
  
  if (saleIndex === -1) {
    return res.status(404).json({ error: 'Venta no encontrada' });
  }
  
  sales.splice(saleIndex, 1);
  res.json({ message: 'Venta eliminada exitosamente' });
});

export default router;
