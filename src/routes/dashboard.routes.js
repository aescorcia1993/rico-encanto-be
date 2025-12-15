import express from 'express';
import { sales, products, clients } from '../data/db.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Obtener estadísticas del dashboard
router.get('/stats', authenticateToken, (req, res) => {
  try {
    // Ventas del día (asumiendo fecha actual)
    const today = new Date().toISOString().split('T')[0];
    const todaySales = sales.filter(s => s.fecha === today && s.estado === 'Completada');
    const ventasDelDia = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    
    // Productos con stock bajo (menos de 10)
    const productosStockBajo = products.filter(p => p.stock < 10).length;
    
    // Total de clientes
    const totalClientes = clients.length;
    
    // Ventas recientes
    const ventasRecientes = sales
      .slice()
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, 5)
      .map(sale => {
        const productosInfo = sale.productos.map(p => {
          const product = products.find(prod => prod.id === p.productoId);
          return {
            ...p,
            nombre: product ? product.nombre : 'Desconocido'
          };
        });
        
        return {
          ...sale,
          productosInfo
        };
      });
    
    res.json({
      ventasDelDia,
      productosStockBajo,
      totalClientes,
      ventasRecientes
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// Obtener datos para reportes
router.get('/reports', authenticateToken, (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    
    let filteredSales = [...sales];
    
    if (startDate && endDate) {
      filteredSales = filteredSales.filter(s => 
        s.fecha >= startDate && s.fecha <= endDate
      );
    }
    
    const report = {
      totalVentas: filteredSales.filter(s => s.estado === 'Completada').length,
      ingresos: filteredSales
        .filter(s => s.estado === 'Completada')
        .reduce((sum, sale) => sum + sale.total, 0),
      productosMasVendidos: getTopProducts(filteredSales),
      ventasPorEstado: getVentasPorEstado(filteredSales),
      ventasPorDia: getVentasPorDia(filteredSales)
    };
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Error al generar reporte' });
  }
});

// Funciones auxiliares
function getTopProducts(salesData) {
  const productCount = {};
  
  salesData.forEach(sale => {
    if (sale.estado === 'Completada') {
      sale.productos.forEach(p => {
        const product = products.find(prod => prod.id === p.productoId);
        const nombre = product ? product.nombre : 'Desconocido';
        
        if (!productCount[nombre]) {
          productCount[nombre] = 0;
        }
        productCount[nombre] += p.cantidad;
      });
    }
  });
  
  return Object.entries(productCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }));
}

function getVentasPorEstado(salesData) {
  const estados = {};
  
  salesData.forEach(sale => {
    if (!estados[sale.estado]) {
      estados[sale.estado] = 0;
    }
    estados[sale.estado]++;
  });
  
  return estados;
}

function getVentasPorDia(salesData) {
  const ventasPorDia = {};
  
  salesData.forEach(sale => {
    if (sale.estado === 'Completada') {
      if (!ventasPorDia[sale.fecha]) {
        ventasPorDia[sale.fecha] = 0;
      }
      ventasPorDia[sale.fecha] += sale.total;
    }
  });
  
  return ventasPorDia;
}

export default router;
