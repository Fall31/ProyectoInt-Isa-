# Sistema de Carrito y Pagos - VetCare

## Descripción General

El sistema de carrito y pagos permite que los clientes compren productos a través de la plataforma VetCare. El flujo completo incluye:

1. **Agregar productos al carrito** desde el catálogo
2. **Gestionar el carrito** (modificar cantidades, eliminar items)
3. **Procesar pago** con 3 métodos diferentes
4. **Generar factura** automática
5. **Descargar/Imprimir** comprobante

## Arquitectura

### Base de Datos

#### Tabla: `carrito`
```sql
- id_carrito (INT, PK)
- ci_cliente (VARCHAR, FK)
- fecha_creacion (TIMESTAMP)
- estado (VARCHAR): 'activo' | 'completado'
- total (DECIMAL)
```

#### Tabla: `detalle_carrito`
```sql
- id_detalle_carrito (INT, PK)
- id_carrito (INT, FK)
- id_producto (INT, FK)
- cantidad (INT)
- precio_unitario (DECIMAL)
- subtotal (DECIMAL)
```

#### Tabla: `factura`
```sql
- id_factura (INT, PK)
- fecha_emision (DATE)
- ci_cliente (VARCHAR, FK)
- fecha_caducidad (DATE)
- metodo_pago (VARCHAR): 'tarjeta' | 'qr' | 'transferencia'
- total_factura (DECIMAL)
- estado_factura (VARCHAR): 'pagada' | 'pendiente' | 'cancelada'
```

#### Tabla: `detalle_factura`
```sql
- id_detallefactura (INT, PK)
- id_factura (INT, FK)
- id_producto (INT, FK)
- id_servicio (INT, FK, NULLABLE)
- ci_personal (VARCHAR, FK, NULLABLE)
- id_descuento (INT, FK, NULLABLE)
- cantidad (INT)
- precio_unitario (DECIMAL)
- subtotal (DECIMAL)
- fecha (DATE)
- tipo (VARCHAR): 'producto' | 'servicio'
```

## Frontend - Componentes

### Carrito.jsx
**Ubicación:** `frontend/src/pages/Carrito.jsx`

**Funcionalidades:**
- Cargar carrito activo del cliente
- Mostrar lista de productos en el carrito
- Modificar cantidades
- Eliminar items
- Vaciar carrito completo
- Modal de selección de método de pago
- Procesar pago y crear factura

**Props:** Ninguna (usa contexto de autenticación)

**Estados Principales:**
- `carrito` - Información del carrito activo
- `detalles` - Items en el carrito
- `cliente` - Datos del cliente autenticado
- `showPagoModal` - Mostrar/ocultar modal de pago
- `metodoPago` - Método de pago seleccionado

**Funciones Clave:**
- `cargarCarrito()` - Obtiene carrito y items de la BD
- `eliminarDelCarrito(id)` - Elimina un item del carrito
- `actualizarCantidad(id, cantidad)` - Cambia la cantidad de un item
- `actualizarTotalCarrito()` - Recalcula el total
- `vaciarCarrito()` - Limpia todos los items
- `procesarPago()` - Crea factura y completad el pedido

### Factura.jsx
**Ubicación:** `frontend/src/pages/Factura.jsx`

**Funcionalidades:**
- Mostrar detalles de la factura
- Listar todos los items comprados
- Mostrar información del cliente
- Mostrar método de pago
- Descargar/Imprimir como PDF (usa print)

**Props:**
- `id_factura` (param URL) - ID de la factura a mostrar

**Funciones Clave:**
- `cargarFactura()` - Obtiene datos de factura y detalles
- `descargarPDF()` - Abre diálogo de impresión

### CatalogoProductos.jsx
**Ubicación:** `frontend/src/pages/CatalogoProductos.jsx`

**Cambios Realizados:**
- Integración con Supabase en lugar de supabaseServices
- Botón "Agregar al Carrito" funcional
- Lógica de crear/actualizar carrito automáticamente

**Función Clave:**
- `handleAgregarAlCarrito(producto)` - Agrega producto al carrito o actualiza cantidad

## Flujo de Pago

### 1. Agregar Producto al Carrito
```javascript
// En CatalogoProductos.jsx
- Usuario hace click en "Agregar al Carrito"
- Se obtiene el usuario autenticado
- Se busca carrito activo del cliente
- Si no existe, se crea uno
- Se verifica si producto ya está en carrito
- Se agrega o actualiza cantidad
- Se recalcula el total del carrito
```

### 2. Ver y Gestionar Carrito
```javascript
// En Carrito.jsx
- Usuario navega a /carrito
- Se carga el carrito activo
- Se muestran todos los items con imágenes
- Usuario puede:
  * Cambiar cantidades
  * Eliminar items
  * Vaciar carrito completo
```

### 3. Procesar Pago
```javascript
// En Carrito.jsx
- Usuario hace click en "Proceder al Pago"
- Se abre modal de selección de método
- Usuario elige: Tarjeta, QR o Transferencia
- Se hace click en "Confirmar Pago"
- Sistema crea:
  * Factura con datos del cliente
  * detalle_factura con items del carrito
  * Marca carrito como completado
- Se redirige a /factura/{id_factura}
```

### 4. Ver Factura
```javascript
// En Factura.jsx
- Se carga factura con todos sus detalles
- Se muestran items comprados
- Usuario puede descargar/imprimir PDF
- Usuario puede volver al carrito o dashboard
```

## Métodos de Pago (Simulados)

Actualmente los métodos de pago son simulados. En producción requeriría:

### 💳 Tarjeta de Crédito/Débito
- Campos: Número de tarjeta, nombre, MM/AA, CVV
- Debería integrar con gateway de pagos (Stripe, PayPal, etc.)

### 📱 Pago por QR
- Debería generar código QR con información de pago
- Integrar con billetera digital del banco

### 🏦 Transferencia Bancaria
- Mostrar detalles bancarios de la empresa
- Generar comprobante automático

## Estilos CSS

### Carrito.css
- Layout grid para lista de productos
- Resumen sticky del lado derecho
- Modal de pago con flexbox responsive
- Animaciones al agregar/eliminar items

### Factura.css
- Diseño profesional tipo factura
- Estilos para impresión (@media print)
- Tabla responsiva
- Gradiente en header

## Rutas

```javascript
// En App.jsx
<Route path="/carrito" element={<Carrito />} />
<Route path="/factura/:id_factura" element={<Factura />} />
```

## Seguridad

- ✅ Autenticación requerida (redirige a login si no está autenticado)
- ✅ Solo el dueño del carrito puede acceder
- ✅ RLS policies en Supabase protegen datos
- ⚠️ Pagos son simulados - NO usar en producción sin integración real

## Mejoras Futuras

1. **Descuentos y Cupones** - Agregar campo de descuento en factura
2. **Historial de Compras** - Página para ver todas las facturas del cliente
3. **Métodos de Pago Reales** - Integrar Stripe, PayPal, etc.
4. **Notificaciones** - Email con comprobante de compra
5. **Carrito Persistente** - LocalStorage de respaldo
6. **Recomendaciones** - "Productos relacionados" en carrito
7. **Envíos** - Cálculo de costo de envío
8. **Devoluciones** - Sistema de reembolsos

## Testing

### Flujo de Prueba Completo
```
1. Registrarse / Iniciar sesión
2. Ir a /catalogo-productos
3. Buscar un producto
4. Click en "Agregar al Carrito"
5. Ir a /carrito
6. Modificar cantidades o eliminar items
7. Click en "Proceder al Pago"
8. Seleccionar método de pago
9. Click "Confirmar Pago"
10. Verificar factura en /factura/{id}
11. Descargar/Imprimir PDF
```

## Troubleshooting

### Problema: "No se encuentra carrito"
**Solución:** Asegúrate de estar autenticado. Verifica que cliente existe en BD con user_id correcto.

### Problema: "Producto no agregado al carrito"
**Solución:** Verifica que la tabla `producto` existe y tiene datos. Revisa console para errores.

### Problema: "Factura no carga"
**Solución:** Verifica que el `id_factura` es correcto. Revisa que los datos existan en BD.

### Problema: "Print no abre"
**Solución:** Algunos navegadores pueden bloquear print(). Usa Ctrl+P en su lugar.

## API Endpoints Usados

Todos los endpoints usan Supabase REST API:
- `GET /rest/v1/carrito`
- `POST /rest/v1/carrito`
- `PATCH /rest/v1/carrito`
- `DELETE /rest/v1/detalle_carrito`
- `POST /rest/v1/factura`
- `POST /rest/v1/detalle_factura`

## Variables de Entorno

```
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

---

**Última actualización:** Diciembre 2024
**Versión:** 1.0.0
**Estado:** En desarrollo (Pagos simulados)
