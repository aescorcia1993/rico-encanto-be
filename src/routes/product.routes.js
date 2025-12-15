import express from 'express';
import { products, generateId } from '../data/db.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Obtener todos los productos
router.get('/', authenticateToken, (req, res) => {
  const { search } = req.query;
  
  let filteredProducts = [...products];
  
  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.nombre.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json(filteredProducts);
});

// Obtener un producto por ID
router.get('/:id', authenticateToken, (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  
  res.json(product);
});

// Crear nuevo producto
router.post('/', authenticateToken, (req, res) => {
  const { nombre, stock, precio, estado } = req.body;
  
  if (!nombre || stock === undefined || !precio) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  
  const newProduct = {
    id: generateId(products),
    nombre,
    stock: parseInt(stock),
    precio: parseFloat(precio),
    estado: estado || (parseInt(stock) > 10 ? 'Disponible' : 'Agotado')
  };
  
  products.unshift(newProduct); // Agregar al inicio del array
  res.status(201).json(newProduct);
});

// Actualizar producto
router.put('/:id', authenticateToken, (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  
  const { nombre, stock, precio, estado } = req.body;
  
  products[productIndex] = {
    ...products[productIndex],
    nombre: nombre || products[productIndex].nombre,
    stock: stock !== undefined ? parseInt(stock) : products[productIndex].stock,
    precio: precio !== undefined ? parseFloat(precio) : products[productIndex].precio,
    estado: estado || products[productIndex].estado
  };
  
  res.json(products[productIndex]);
});

// Eliminar producto
router.delete('/:id', authenticateToken, (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  
  products.splice(productIndex, 1);
  res.json({ message: 'Producto eliminado exitosamente' });
});

export default router;
