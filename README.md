# Rico Encanto - Backend

Backend para el sistema de gestión de la pastelería Rico Encanto.

## 🚀 Tecnologías

- Node.js v20+
- Express.js
- JWT para autenticación
- Base de datos en memoria (desarrollo)

## 📦 Instalación

```bash
npm install
```

## 🔧 Configuración

Crear archivo `.env` con las siguientes variables:

```
PORT=5000
JWT_SECRET=tu_clave_secreta_jwt
NODE_ENV=development
```

## ▶️ Ejecución

Desarrollo (con auto-reload):
```bash
npm run dev
```

Producción:
```bash
npm start
```

## 🔐 Credenciales de prueba

- Email: `admin@ricoencanto.com`
- Password: `admin123`

## 📚 Endpoints

### Autenticación
- POST `/api/auth/login` - Iniciar sesión
- GET `/api/auth/verify` - Verificar token

### Productos
- GET `/api/products` - Listar productos
- GET `/api/products/:id` - Obtener producto
- POST `/api/products` - Crear producto
- PUT `/api/products/:id` - Actualizar producto
- DELETE `/api/products/:id` - Eliminar producto

### Ventas
- GET `/api/sales` - Listar ventas
- GET `/api/sales/:id` - Obtener venta
- POST `/api/sales` - Crear venta
- PUT `/api/sales/:id` - Actualizar venta
- DELETE `/api/sales/:id` - Eliminar venta

### Clientes
- GET `/api/clients` - Listar clientes
- GET `/api/clients/:id` - Obtener cliente
- POST `/api/clients` - Crear cliente
- PUT `/api/clients/:id` - Actualizar cliente
- DELETE `/api/clients/:id` - Eliminar cliente

### Dashboard
- GET `/api/dashboard/stats` - Estadísticas generales
- GET `/api/dashboard/reports` - Reportes y analíticas

## 📝 Notas

- Todos los endpoints (excepto `/api/auth/login`) requieren autenticación mediante JWT
- El token debe enviarse en el header: `Authorization: Bearer <token>`
- La base de datos es en memoria, los datos se reinician al reiniciar el servidor
- Para producción, implementar una base de datos persistente (MongoDB, PostgreSQL, etc.)
