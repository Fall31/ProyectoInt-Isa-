# 🔧 FIX: Columna `subtotal` como Generated Column

## Problema
```
Error al agregar al carrito: 
cannot insert a non-DEFAULT value into column "subtotal"
Column "subtotal" is a generated column.
```

## Causa
Las columnas `subtotal` en las tablas `detalle_carrito` y `detalle_factura` son **columnas generadas** (computed columns) en Supabase. Se calculan automáticamente como:

```sql
subtotal = cantidad * precio_unitario
```

No debemos intentar insertar o actualizar valores manualmente.

## Solución
Se removió el campo `subtotal` de todos los INSERT y UPDATE en:

### 1. **carritoService.js**
```javascript
// ❌ ANTES
const subtotal = precio_unitario * cantidad
const { data, error } = await supabase
  .from('detalle_carrito')
  .insert([{
    id_carrito,
    id_producto,
    cantidad,
    precio_unitario,
    subtotal  // ← REMOVER
  }])

// ✅ DESPUÉS
const { data, error } = await supabase
  .from('detalle_carrito')
  .insert([{
    id_carrito,
    id_producto,
    cantidad,
    precio_unitario  // Solo estos campos
  }])
```

### 2. **Carrito.jsx**
```javascript
// ❌ ANTES
const { error } = await supabase
  .from('detalle_carrito')
  .update({
    cantidad: nuevaCantidad,
    subtotal: nuevoSubtotal  // ← REMOVER
  })

// ✅ DESPUÉS
const { error } = await supabase
  .from('detalle_carrito')
  .update({
    cantidad: nuevaCantidad  // Solo cantidad
  })
```

### 3. **CatalogoProductos.jsx**
```javascript
// ❌ ANTES
if (detalleExistente) {
  const nuevaCantidad = detalleExistente.cantidad + 1
  const nuevoSubtotal = producto.precio * nuevaCantidad
  
  await supabase
    .from('detalle_carrito')
    .update({
      cantidad: nuevaCantidad,
      subtotal: nuevoSubtotal  // ← REMOVER
    })
}

// ✅ DESPUÉS
if (detalleExistente) {
  const nuevaCantidad = detalleExistente.cantidad + 1
  
  await supabase
    .from('detalle_carrito')
    .update({
      cantidad: nuevaCantidad  // Solo cantidad
    })
}
```

## Archivos Modificados

1. ✅ `frontend/src/services/carritoService.js`
   - Remover `subtotal` de INSERT en `agregarProducto()`
   - Remover `subtotal` de UPDATE en `actualizarCantidad()`
   - Remover `subtotal` de mapping en `crearFactura()`

2. ✅ `frontend/src/pages/Carrito.jsx`
   - Remover `subtotal` de UPDATE en `actualizarCantidad()`
   - Remover `subtotal` de mapping en `procesarPago()`

3. ✅ `frontend/src/pages/CatalogoProductos.jsx`
   - Remover `subtotal` de UPDATE cuando producto existe
   - Remover `subtotal` de INSERT cuando es nuevo producto

## Cómo Funciona Ahora

### Agregar Producto
```
1. Usuario click "Agregar al Carrito"
2. Se inserta en detalle_carrito:
   {
     id_carrito: 1,
     id_producto: 5,
     cantidad: 1,
     precio_unitario: 100
   }
3. BD calcula automáticamente:
   subtotal = 1 * 100 = 100
4. Al leer: se obtiene el subtotal calculado ✅
```

### Actualizar Cantidad
```
1. Usuario cambia cantidad a 3
2. Se actualiza solo cantidad:
   {
     cantidad: 3
   }
3. BD recalcula automáticamente:
   subtotal = 3 * 100 = 300
4. Al leer: se obtiene el nuevo subtotal ✅
```

### Crear Factura
```
1. Al pagar, se crea detalle_factura:
   {
     id_factura: 1,
     id_producto: 5,
     cantidad: 3,
     precio_unitario: 100
   }
2. BD calcula automáticamente:
   subtotal = 3 * 100 = 300
3. En factura: se muestra el subtotal calculado ✅
```

## Ventajas de Columnas Generadas

✅ **Consistencia:** El subtotal siempre es correcto (cantidad × precio)
✅ **Eficiencia:** No hay que calcular en el frontend
✅ **Seguridad:** No se puede meter un valor incorrecto
✅ **Performance:** Se calcula a nivel BD (muy rápido)

## Verificación

Para confirmar que todo funciona:

1. **Ir a /catalogo-productos**
2. **Click "Agregar al Carrito"**
   - ✅ Debe agregarse sin error
   - ✅ Debe mostrar mensaje de éxito

3. **Ir a /carrito**
   - ✅ Ver el producto con subtotal correcto
   - ✅ Modificar cantidad
   - ✅ Subtotal debe recalcularse automáticamente

4. **Proceder al pago**
   - ✅ Crear factura debe funcionar
   - ✅ Ver factura con subtotales correctos

## Testing

```bash
# En la consola del navegador (F12)
# El error anterior no debe aparecer:
# ❌ Error al agregar al carrito: cannot insert a non-DEFAULT value into column "subtotal"

# Solo debe funcionar correctamente:
# ✅ Producto agregado al carrito
```

## Notas Técnicas

### Columnas Generadas en Supabase/PostgreSQL

```sql
-- Definición en la BD
ALTER TABLE detalle_carrito ADD COLUMN subtotal GENERATED ALWAYS AS (cantidad * precio_unitario) STORED;

-- Lo que significa:
-- - GENERATED ALWAYS: se calcula siempre automáticamente
-- - (cantidad * precio_unitario): la fórmula
-- - STORED: se almacena (no es virtual)
```

### Lectura vs Escritura

```javascript
// ✅ Lectura - SÍ se devuelve subtotal
const { data } = await supabase
  .from('detalle_carrito')
  .select('*')

// data[0].subtotal ← Tiene valor calculado ✅

// ✅ Escritura - NO se envía subtotal
await supabase
  .from('detalle_carrito')
  .insert([{
    cantidad: 1,
    precio_unitario: 100
    // subtotal: NO enviar
  }])
```

## Resumen de Cambios

| Operación | Antes | Después |
|-----------|-------|---------|
| INSERT | Enviar subtotal | NO enviar |
| UPDATE | Enviar subtotal | NO enviar |
| SELECT | Leer subtotal | Leer subtotal ✅ |
| Cálculo | Frontend (manual) | BD (automático) ✅ |

---

**Fix completado:** ✅
**Errores:** 0
**Archivos actualizados:** 3
**Líneas modificadas:** ~40

Ahora el carrito debe funcionar correctamente sin errores de columnas generadas.
