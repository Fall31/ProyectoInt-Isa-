# 🛒 Guía de Prueba - Sistema de Carrito y Pagos

## 📋 Prerequisitos

1. ✅ Servidor backend corriendo en `localhost:5000`
2. ✅ Servidor frontend corriendo en `localhost:5173`
3. ✅ Conectado a Supabase (verificar en Console)
4. ✅ Usuario autenticado (crear cuenta si es necesario)

## 🧪 Flujo de Prueba Completo

### Paso 1: Preparar la Sesión
```
1. Abrir http://localhost:5173 en navegador
2. Si no estás autenticado:
   → Ir a /registrar y crear cuenta
   → O ir a /iniciar-sesion con cuenta existente
3. Verificar que el usuario está autenticado (navbar muestra nombre)
```

### Paso 2: Agregar Productos al Carrito
```
1. Navegar a "Tienda" o /catalogo-productos
2. Ver lista de productos disponibles
3. Click en "Agregar al Carrito" de cualquier producto
   ✅ Debe mostrar "✓ Agregado" temporalmente
   ✅ Debe mostrar alerta "Producto agregado al carrito"
4. Agregar otro producto (diferente)
   ✅ Debe aparecer en el carrito
5. Agregar el MISMO producto otra vez
   ✅ La cantidad debe incrementarse (no crear nuevo item)
```

### Paso 3: Ver y Gestionar el Carrito
```
1. Click en icono 🛒 o navegar a /carrito
2. Verificar que se cargó el carrito:
   ✅ Muestra todos los items agregados
   ✅ Cada item tiene imagen, nombre, precio
   ✅ Muestra cantidad actual
   ✅ Muestra subtotal de cada item
3. Modificar cantidad:
   ├─ Click en "+" para incrementar
   ├─ Verificar que subtotal se recalcula
   ├─ Click en "-" para decrementar
   └─ Si cantidad = 0, producto debe eliminarse
4. Eliminar item:
   ├─ Click en botón 🗑️ al lado del producto
   └─ Verificar que se elimina del carrito
5. Resumen lateral:
   ├─ Verificar subtotal correcto
   ├─ Verificar impuestos (0%)
   └─ Verificar total final
```

### Paso 4: Procesar Pago
```
1. Click en "Proceder al Pago"
   ✅ Debe abrirse modal de pago
   ✅ Debe mostrar monto a pagar correcto
2. Seleccionar método de pago:
   
   OPCIÓN A: Tarjeta 💳
   ├─ Click en "Tarjeta de Crédito/Débito"
   ├─ Aparecen campos: Número, Nombre, MM/AA, CVV
   └─ Llenar con datos ficticios
   
   OPCIÓN B: QR 📱
   ├─ Click en "Pago por QR"
   ├─ Aparece placeholder de código QR
   └─ En producción: integrar con billetera
   
   OPCIÓN C: Transferencia 🏦
   ├─ Click en "Transferencia Bancaria"
   ├─ Ver información bancaria
   └─ En producción: validar comprobante
   
3. Click en "Confirmar Pago"
   ✅ Debe procesarse sin errores
   ✅ Debe mostrar ID de factura
   ✅ Debe redirigir a página de factura
```

### Paso 5: Ver Factura
```
1. Verificar URL cambió a /factura/{id}
2. Página debe mostrar:
   ✅ Encabezado VetCare con número de factura
   ✅ Estado: PAGADA
   ✅ Fecha de emisión y vencimiento
   ✅ Método de pago seleccionado
3. Información del cliente:
   ✅ Nombre completo
   ✅ CI
   ✅ Correo
   ✅ Teléfono
   ✅ Dirección
4. Tabla de items:
   ✅ Encabezados: Descripción, Tipo, Cantidad, Precio, Subtotal
   ✅ Todos los productos aparecen
   ✅ Cantidades correctas
5. Resumen:
   ✅ Subtotal correcto
   ✅ Impuestos
   ✅ Total correcto
```

### Paso 6: Descargar/Imprimir
```
1. Click en "Descargar PDF"
   ✅ Abre diálogo de impresión
2. Opciones:
   - Guardar como PDF (Ctrl+S)
   - Imprimir a impresora física
3. Verificar que PDF/impresión contiene:
   ✅ Todos los detalles de la factura
   ✅ Tabla formateada correctamente
   ✅ Total visible
```

### Paso 7: Navegación Final
```
1. Click "Volver al Carrito"
   ✅ Regresa a /carrito
   ✅ Carrito debe estar vacío (pedido completado)
2. O Click "Ir al Dashboard"
   ✅ Regresa a /dashboard
   ✅ Puede continuar comprando
```

## 🧪 Casos de Prueba Específicos

### Caso 1: Carrito Vacío
```
Acciones:
1. Usuario sin nada en carrito va a /carrito
Resultado esperado:
✅ Ve ícono 🛒 grande
✅ Mensaje "Tu carrito está vacío"
✅ Botón "Ver Productos" funciona
```

### Caso 2: Agregar Mismo Producto Múltiples Veces
```
Acciones:
1. Agregar producto A (cantidad 1)
2. Agregar producto A de nuevo
3. Agregar producto A una vez más
Resultado esperado:
✅ Un solo item en carrito con cantidad 3
✅ No se crean 3 items separados
```

### Caso 3: Eliminar Todo
```
Acciones:
1. Tener 3-5 productos en carrito
2. Click "Vaciar Carrito"
3. Confirmar en alert
Resultado esperado:
✅ Todos los items se eliminan
✅ Total se pone en 0
✅ Se muestra mensaje "Carrito vaciado"
```

### Caso 4: Modificar Cantidades Dinámicamente
```
Acciones:
1. Producto con precio Bs. 100
2. Agregar cantidad 5
3. Click + para pasar a 6
4. Verificar subtotal
Resultado esperado:
✅ Subtotal = 100 * 6 = Bs. 600
✅ Total se recalcula
```

### Caso 5: Error sin Usuario Autenticado
```
Acciones:
1. Cerrar sesión (logout)
2. Intentar agregar producto a carrito
Resultado esperado:
✅ Redirige a /iniciar-sesion
✅ Muestra mensaje de autenticación requerida
```

## 📊 Validaciones en BD

Para verificar que todo se guardó correctamente en Supabase:

### Tabla `carrito`
```sql
SELECT * FROM carrito WHERE estado = 'completado';
-- Debe haber una fila con ci_cliente del usuario
-- estado = 'completado'
-- total > 0
```

### Tabla `detalle_carrito`
```sql
SELECT * FROM detalle_carrito 
WHERE id_carrito IN (SELECT id_carrito FROM carrito WHERE estado = 'completado');
-- Debe haber filas con los productos agregados
-- cantidad y subtotal correctos
```

### Tabla `factura`
```sql
SELECT * FROM factura WHERE estado_factura = 'pagada';
-- Debe haber una fila por cada compra completada
-- metodo_pago = uno de: 'tarjeta', 'qr', 'transferencia'
-- total_factura correcto
```

### Tabla `detalle_factura`
```sql
SELECT * FROM detalle_factura 
WHERE id_factura IN (SELECT id_factura FROM factura WHERE estado_factura = 'pagada');
-- Debe haber filas para cada item comprado
-- tipo = 'producto'
-- cantidad y subtotal correctos
```

## 🔍 Cosas a Verificar

### UI/UX
- [ ] Botones responden a clicks
- [ ] Modales se abren/cierran correctamente
- [ ] Imágenes de productos cargan
- [ ] Estilos responsive en móvil
- [ ] Transiciones suaves
- [ ] Alertas muestran mensajes claros

### Funcionalidad
- [ ] Carrito persiste entre navegación
- [ ] Totales se calculan correctamente
- [ ] Datos se guardan en BD
- [ ] Redirecciones funcionan
- [ ] Errores se manejan gracefully

### Seguridad
- [ ] Usuario debe estar autenticado
- [ ] Otros usuarios no ven carrito ajeno
- [ ] Datos sensibles no se exponen
- [ ] IDs de factura son únicos

### Performance
- [ ] Página carga rápido (< 2s)
- [ ] Imágenes cargan sin delay notable
- [ ] Sin console errors
- [ ] Sin memory leaks

## 🐛 Troubleshooting

### Problema: "Producto no aparece en carrito"
**Solución:**
1. Verifica que estés autenticado
2. Abre DevTools (F12) → Network → ve si la request es exitosa
3. Revisa Console para errores
4. Recarga la página

### Problema: "Carrito muestra vacío después de agregar"
**Solución:**
1. Verifica que la página cargó completamente
2. Check si el cliente existe en BD: `SELECT * FROM cliente WHERE user_id = '{user_id}';`
3. Verifica que el carrito se creó: `SELECT * FROM carrito;`

### Problema: "Modal de pago no abre"
**Solución:**
1. Verifica que tienes items en el carrito
2. Abre DevTools → Console para ver si hay errores
3. Intenta refrescar la página

### Problema: "Factura no carga"
**Solución:**
1. Verifica el ID en la URL: `/factura/{id_factura}`
2. Consulta BD: `SELECT * FROM factura WHERE id_factura = {id};`
3. Si no existe, verifica que se completó el pago correctamente

### Problema: "Print/PDF no abre"
**Solución:**
1. Algunos navegadores bloquean print()
2. Intenta: Ctrl+P en la página (atajo de teclado)
3. O usa navegador diferente

## ✅ Checklist Final

Antes de declarar completado:

- [ ] ✅ Agregar al carrito funciona
- [ ] ✅ Visualizar carrito funciona
- [ ] ✅ Modificar cantidades funciona
- [ ] ✅ Eliminar items funciona
- [ ] ✅ Vaciar carrito funciona
- [ ] ✅ Pagar con tarjeta funciona
- [ ] ✅ Pagar con QR funciona
- [ ] ✅ Pagar con transferencia funciona
- [ ] ✅ Factura se crea en BD
- [ ] ✅ Factura se muestra correctamente
- [ ] ✅ Descargar PDF funciona
- [ ] ✅ Impresión funciona
- [ ] ✅ Navegación entre páginas funciona
- [ ] ✅ Todo responsive en móvil
- [ ] ✅ Sin errores en consola
- [ ] ✅ Sin errores en BD
- [ ] ✅ Datos correctos en BD

---

## 📞 Soporte

Si encuentras algún problema:

1. **Verifica los logs:**
   - DevTools Console (F12)
   - Backend console (Terminal)

2. **Revisa la BD:**
   - Supabase Dashboard
   - Valida que las tablas existan
   - Verifica RLS policies

3. **Reinicia servicios:**
   - Frontend: Ctrl+C y `npm run dev`
   - Backend: Ctrl+C y `npm start`

4. **Limpia caché:**
   - Ctrl+Shift+R (hard refresh)
   - Elimina cookies/storage del sitio

---

**Última actualización:** Diciembre 2024
**Tiempo estimado de pruebas:** 30-45 minutos
**Nivel de dificultad:** Bajo
