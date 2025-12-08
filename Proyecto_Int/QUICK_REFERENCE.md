# 🚀 REFERENCIA RÁPIDA - Carrito y Pagos

## ⚡ Inicio Rápido

### Para Users/Clientes
```
1. Ir a /catalogo-productos
2. Click "Agregar al Carrito" en cualquier producto
3. Ir a /carrito (icono 🛒 en navbar)
4. Modificar cantidades si es necesario
5. Click "Proceder al Pago"
6. Seleccionar método: 💳 Tarjeta | 📱 QR | 🏦 Transferencia
7. Click "Confirmar Pago"
8. Ver factura en /factura/{id}
9. Click "Descargar PDF" para imprimir
```

### Para Developers
```
# Importar servicio
import { carritoService } from '../services/carritoService'

# Crear/obtener carrito
const carrito = await carritoService.obtenerOCrearCarrito(ci_cliente)

# Agregar producto
await carritoService.agregarProducto(id_carrito, id_producto, cantidad, precio)

# Procesar pago
const id_factura = await carritoService.crearFactura(id_carrito, ci_cliente, metodo_pago)
```

## 📍 Rutas Principales

| Ruta | Componente | Descripción |
|------|-----------|------------|
| `/catalogo-productos` | CatalogoProductos | Ver y comprar productos |
| `/carrito` | Carrito | Ver/gestionar carrito |
| `/factura/:id_factura` | Factura | Ver comprobante |

## 🗂️ Estructura de BD

### Tabla: carrito
```sql
id_carrito (INT, PK)
ci_cliente (VARCHAR, FK) -- Usuario actual
fecha_creacion (TIMESTAMP)
estado (VARCHAR) -- 'activo' | 'completado'
total (DECIMAL) -- Actualizado dinámicamente
```

### Tabla: detalle_carrito
```sql
id_detalle_carrito (INT, PK)
id_carrito (INT, FK)
id_producto (INT, FK)
cantidad (INT) -- 1+
precio_unitario (DECIMAL) -- Del producto
subtotal (DECIMAL) -- cantidad * precio
```

### Tabla: factura
```sql
id_factura (INT, PK)
fecha_emision (DATE)
ci_cliente (VARCHAR, FK)
fecha_caducidad (DATE) -- 30 días después
metodo_pago (VARCHAR) -- 'tarjeta'|'qr'|'transferencia'
total_factura (DECIMAL)
estado_factura (VARCHAR) -- 'pagada'
```

### Tabla: detalle_factura
```sql
id_detallefactura (INT, PK)
id_factura (INT, FK)
id_producto (INT, FK)
cantidad (INT)
precio_unitario (DECIMAL)
subtotal (DECIMAL)
fecha (DATE)
tipo (VARCHAR) -- 'producto' | 'servicio'
```

## 🔧 Métodos del Servicio

### carritoService

```javascript
// Crear/obtener carrito
obtenerOCrearCarrito(ci_cliente) → Promise<Object>

// Items
obtenerItems(id_carrito) → Promise<Array>
agregarProducto(id_carrito, id_producto, cantidad, precio) → Promise<Object>
actualizarCantidad(id_detalle_carrito, cantidad, precio) → Promise<Object>
eliminarItem(id_detalle_carrito) → Promise<void>

// Manejo carrito
vaciarCarrito(id_carrito) → Promise<void>
actualizarTotal(id_carrito) → Promise<number>
obtenerCarritoCompleto(ci_cliente) → Promise<Object>

// Facturas
crearFactura(id_carrito, ci_cliente, metodo_pago) → Promise<number>
obtenerFactura(id_factura) → Promise<Object>
obtenerDetallesFactura(id_factura) → Promise<Array>
obtenerFacturasCliente(ci_cliente) → Promise<Array>
```

## 💻 Componentes

### Carrito.jsx
```jsx
// Props: Ninguno (usa contexto)
// Estados:
- carrito: {id, ci_cliente, total, estado}
- detalles: [{id_detalle, id_producto, cantidad, ...}]
- cliente: {ci, nombre, correo, ...}
- showPagoModal: boolean
- metodoPago: 'tarjeta'|'qr'|'transferencia'

// Eventos:
- Agregar cantidad (+)
- Quitar cantidad (-)
- Eliminar item (🗑️)
- Vaciar carrito
- Proceder al pago
- Confirmar pago
```

### Factura.jsx
```jsx
// Props:
- id_factura (de URL params)

// Estados:
- factura: {id, fecha, total, metodo, ...}
- detalles: [{item_id, producto, cantidad, precio, ...}]
- cliente: {ci, nombre, correo, ...}
- loading: boolean

// Funciones:
- descargarPDF() → abre print
```

### CatalogoProductos.jsx (modificado)
```jsx
// Función nueva:
- handleAgregarAlCarrito(producto) → agrega a carrito

// Valida:
- Usuario autenticado
- Producto existe
- Precio válido
- Carrito existe (crea si no)
```

## 🎨 Estilos Principales

### Carrito.css
```css
.carrito-page {} .................... Contenedor principal
.carrito-container {} .............. Grid dos columnas
.carrito-items {} .................. Lista de items
.carrito-item {} ................... Card de producto
.carrito-resumen {} ................ Panel lateral
.modal-overlay {} .................. Fondo modal
.modal-content {} .................. Modal pago
.metodos-pago {} ................... Radio buttons
.pago-form {} ...................... Formulario
```

### Factura.css
```css
.factura-page {} ................... Contenedor principal
.factura-container {} .............. Card factura
.factura-header {} ................. Encabezado
.factura-info {} ................... Información cliente
.items-table {} .................... Tabla items
.factura-resumen {} ................ Totales
@media print {} .................... Estilos impresión
```

## 🔑 Variables de Entorno

```
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

## 🔄 Flujo de Datos

```
Usuario agrega producto
    ↓
CatalogoProductos.handleAgregarAlCarrito()
    ↓
carritoService.obtenerOCrearCarrito()
    ├─ Si existe carrito activo: devuelve
    └─ Si no existe: crea uno
    ↓
carritoService.agregarProducto()
    ├─ Si producto existe: actualizarCantidad()
    └─ Si nuevo: insert en detalle_carrito
    ↓
carritoService.actualizarTotal()
    ├─ suma subtotales de todos items
    └─ update en carrito
    ↓
BD actualizada ✅
```

## ⚠️ Errores Comunes

### "Usuario no autenticado"
```javascript
// Solución:
navigate('/iniciar-sesion')
```

### "No se encuentra cliente"
```javascript
// Verificar:
const { data: cliente } = await supabase
  .from('cliente')
  .select('*')
  .eq('user_id', user.id)
  .single()
```

### "Carrito vacío"
```javascript
// Verificar:
if (!carrito || detalles.length === 0) {
  // Mostrar mensaje vacío
}
```

### "Factura no carga"
```javascript
// Verificar URL:
/factura/123 ✅
/factura ❌
```

## 🚀 Performance Tips

- ✅ useCallback para funciones
- ✅ Select solo campos necesarios
- ✅ Índices en FK de BD
- ✅ Lazy load imágenes
- ✅ Caché de items

## 🔐 Seguridad

- ✅ Validar usuario autenticado
- ✅ Validar ci_cliente = usuario actual
- ✅ RLS policies en BD
- ✅ Sanitizar inputs
- ✅ Validar precios en backend

## 📊 Queries Útiles

### Ver carrito activo de usuario
```sql
SELECT * FROM carrito 
WHERE ci_cliente = '{ci}' 
AND estado = 'activo';
```

### Ver items en carrito
```sql
SELECT dc.*, p.nombre_producto, p.precio
FROM detalle_carrito dc
JOIN producto p ON dc.id_producto = p.id_producto
WHERE dc.id_carrito = {id};
```

### Ver facturas pagadas
```sql
SELECT * FROM factura 
WHERE estado_factura = 'pagada'
ORDER BY fecha_emision DESC;
```

### Ver ingresos totales
```sql
SELECT SUM(total_factura) as ingresos
FROM factura
WHERE estado_factura = 'pagada';
```

## 🎯 Casos de Uso Comunes

### Agregar producto
```javascript
const { data: { user } } = await supabase.auth.getUser()
const cliente = await getCliente(user.id)
const carrito = await carritoService.obtenerOCrearCarrito(cliente.ci_cliente)
await carritoService.agregarProducto(carrito.id_carrito, producto.id, 1, producto.precio)
```

### Pagar
```javascript
const id_factura = await carritoService.crearFactura(
  carrito.id_carrito,
  cliente.ci_cliente,
  'tarjeta' // o 'qr' o 'transferencia'
)
navigate(`/factura/${id_factura}`)
```

### Ver compras anteriores
```javascript
const facturas = await carritoService.obtenerFacturasCliente(ci_cliente)
facturas.forEach(factura => {
  console.log(`Factura #${factura.id_factura}: Bs. ${factura.total_factura}`)
})
```

## 📱 Responsive Breakpoints

- 📱 Mobile: < 768px
- 📱 Tablet: 768px - 1024px
- 🖥️ Desktop: > 1024px

```css
@media (max-width: 768px) {
  .carrito-container {
    grid-template-columns: 1fr; /* Una columna */
  }
}
```

## 🎓 Para Aprender Más

1. Lee **CART_PAYMENT_GUIDE.md** - Guía técnica
2. Lee **SHOPPING_CART_IMPLEMENTATION.md** - Cambios realizados
3. Lee **TESTING_GUIDE.md** - Cómo probar
4. Inspecciona código con DevTools (F12)
5. Revisa Supabase Dashboard para ver datos

---

**Última actualización:** Diciembre 2024
**Versión:** 1.0.0
**Categoría:** Referencia Rápida
