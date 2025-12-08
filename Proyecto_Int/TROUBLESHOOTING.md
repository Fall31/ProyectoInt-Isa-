## 🔧 TROUBLESHOOTING - SOLUCIÓN DE PROBLEMAS

---

## ❌ ERROR: "No se pudo cargar el perfil"

### Síntomas:
- Página en blanco
- Console muestra: "Error loading profile"
- No puede llegar a /completar-perfil

### Causa:
Las columnas `perfil_completado` o `rol` no existen en tabla `cliente`

### Solución:
1. Abre Supabase SQL Editor
2. Copia TODO el SQL:
```sql
ALTER TABLE cliente ADD COLUMN IF NOT EXISTS perfil_completado BOOLEAN DEFAULT FALSE;
ALTER TABLE cliente ADD COLUMN IF NOT EXISTS rol VARCHAR(50) DEFAULT 'cliente';
UPDATE cliente SET rol = 'cliente' WHERE rol IS NULL;
UPDATE cliente SET perfil_completado = FALSE WHERE perfil_completado IS NULL;
CREATE INDEX IF NOT EXISTS idx_cliente_perfil_completado ON cliente(perfil_completado);
CREATE INDEX IF NOT EXISTS idx_cliente_rol ON cliente(rol);
```
3. Ejecuta
4. Verifica "Success" en verde ✅
5. Recarga la página

---

## ❌ ERROR: "Column 'perfil_completado' not found"

### Síntomas:
- Error específico en console
- Al intentar guardar perfil, falla

### Causa:
SQL no se ejecutó correctamente

### Solución:
1. Verifica en Supabase → Table editor → cliente
2. ¿Ves las columnas `perfil_completado` y `rol`?
   - ✅ SÍ → Algo else está mal (mira debajo)
   - ❌ NO → Vuelve a ejecutar el SQL

---

## ❌ ERROR: "Email not confirmed"

### Síntomas:
- Al iniciar sesión, sale error: "Email not confirmed"
- No puede entrar al sistema

### Causa:
Email confirmation está activado en Supabase

### Solución:
1. Supabase → Authentication → Providers
2. Busca: "Email"
3. Mira el toggle: "Confirm email"
   - Si está ON (azul) → desactívalo
   - Si está OFF (gris) → está bien
4. Guarda
5. Intenta registrarte de nuevo

---

## ❌ ERROR: "Rol: Sin rol"

### Síntomas:
- Dashboard muestra "SIN ROL" en la esquina
- No es cliente, personal ni admin

### Causa:
El usuario no tiene rol asignado en tabla `cliente`

### Solución:
1. Completa el perfil correctamente
2. En CompletarPerfil.jsx, se asigna automáticamente `rol: 'cliente'`
3. Verifica en Supabase que se guardó:
```sql
SELECT user_id, rol, perfil_completado FROM cliente WHERE correo_cliente = 'tu@email.com';
```

---

## ❌ ERROR: "relation cliente does not exist"

### Síntomas:
- Error: "Relation 'public.cliente' does not exist"
- La tabla no existe

### Causa:
Tabla `cliente` no fue creada en Supabase

### Solución:
1. Supabase → Table editor
2. ¿Ves tabla `cliente` en la lista?
   - ✅ SÍ → El error es diferente
   - ❌ NO → Necesitas crear la tabla primero
3. Si no existe, contacta a admin para crearla

---

## ❌ ERROR: Redirige a /iniciar-sesion en lugar de /bienvenida

### Síntomas:
- Después de registrarse, va a login en lugar de bienvenida
- El flujo está roto

### Causa:
Probablemente es un issue de cache del navegador

### Solución:
1. Limpia cache del navegador:
   - Windows: Ctrl+Shift+R
   - Mac: Cmd+Shift+R
2. O abre en "Incógnito" (nueva ventana privada)
3. Intenta registrarte de nuevo

---

## ❌ ERROR: "Cannot read property 'perfil_completado' of undefined"

### Síntomas:
- Console muestra este error exactamente
- En /bienvenida o /completar-perfil

### Causa:
El registro en tabla `cliente` no se creó correctamente

### Solución:
1. Verifica que el usuario existe en Supabase → Auth → Users
2. Verifica que existe en tabla `cliente`:
```sql
SELECT * FROM cliente WHERE user_id = 'uuid-del-usuario';
```
3. Si NO existe, ejecuta este SQL para crearlo:
```sql
INSERT INTO cliente (user_id, correo_cliente, nombre_cliente, primer_apellido, rol, perfil_completado)
VALUES ('uuid-del-usuario', 'email@example.com', 'Nombre', 'Apellido', 'cliente', false);
```
4. Reemplaza `uuid-del-usuario` con el ID real del usuario

---

## ❌ ERROR: "UNIQUE constraint failed"

### Síntomas:
- Al completar perfil: "UNIQUE constraint failed on (ci_cliente)"
- O similar con otro campo

### Causa:
Ya existe otro usuario con el mismo CI/email

### Solución:
1. Supabase → Authentication → Users → Elimina el usuario
2. Ve a tabla cliente y elimina su registro:
```sql
DELETE FROM cliente WHERE user_id = 'uuid-del-usuario';
```
3. Intenta registrarte de nuevo con datos diferentes

---

## ❌ ERROR: "Page shows blank white space"

### Síntomas:
- Página completamente en blanco
- No hay error en console
- Solo blanco

### Causa:
Problema de layout o CSS

### Solución:
1. Abre Console (F12)
2. ¿Hay errores rojos?
   - ✅ SÍ → Lee el error (probablemente otra cosa)
   - ❌ NO → Intenta:
     - Ctrl+Shift+R (limpiar cache)
     - Cierra y abre el navegador
     - En otro navegador (Chrome/Firefox/Edge)

---

## ❌ ERROR: "Network error" al guardar perfil

### Síntomas:
- Al completar perfil, sale: "Network error"
- Al registrarse, sale similar

### Causa:
Backend no está corriendo o Supabase sin conexión

### Solución:
1. Verifica que backend está corriendo:
   ```
   cd backend
   npm start
   ```
   - Debería decir: "Server running on port 5000"

2. Verifica que Supabase está en línea:
   - Abre https://app.supabase.com
   - ¿Ves tu proyecto? ✅ Sí → OK

3. Verifica configuración en `frontend/src/lib/supabaseClient.js`:
   ```javascript
   const SUPABASE_URL = 'https://tu-proyecto.supabase.co'  // ✅ Correcto
   const SUPABASE_ANON_KEY = 'eyJ...'  // ✅ Debe tener contenido
   ```

---

## ✅ VERIFYCHECK: ¿Cómo sé que todo está bien?

Después de completar perfil, verifica:

```
1. ¿Estás en /dashboard?
   ✅ SÍ → Bien
   ❌ NO → Ve arriba a troubleshooting

2. ¿Ves "CLIENTE" en la esquina superior derecha?
   ✅ SÍ → Bien
   ❌ NO → Verifica rol en Supabase

3. ¿Console (F12) NO tiene errores rojos?
   ✅ SÍ → Bien
   ❌ NO → Lee el error y busca arriba

4. ¿Puedes navegar a /mascotas?
   ✅ SÍ → Bien
   ❌ NO → Probablemente permisos

5. Abre Supabase y verifica:
   - ¿El usuario está en auth.users? ✅
   - ¿El usuario está en tabla cliente? ✅
   - ¿perfil_completado = true? ✅
   - ¿rol = 'cliente'? ✅
```

Si TODOS tienen ✅ → **¡ÉXITO!** 🎉

---

## 🆘 SI NADA FUNCIONA

### Opción 1: Reinicia todo
```
1. Cierra navegador completamente
2. npm run dev (frontend)
3. npm start (backend)
4. Ctrl+Shift+R (en navegador)
5. Intenta desde cero
```

### Opción 2: Limpia BD
```
1. Supabase → Authentication → Users
2. Elimina todos los usuarios de prueba
3. Ve a table cliente
4. DELETE all rows
5. Intenta de nuevo
```

### Opción 3: Verifica archivos
```
1. ¿Existen estos archivos?
   ✅ Bienvenida.jsx
   ✅ Bienvenida.css
   ✅ Registrar.jsx (modificado)
   ✅ CompletarPerfil.jsx (modificado)

2. ¿App.jsx tiene ruta /bienvenida?
   Busca: <Route path="/bienvenida"
   ✅ Sí → OK
   ❌ NO → Agrega la ruta
```

### Opción 4: Contacta soporte
- Proporciona:
  1. Captura del error en Console (F12)
  2. El email que intentaste registrar
  3. URL donde ocurre el error
  4. Navegador que usas

---

## 📞 PREGUNTAS DE SOPORTE

**P: ¿Por qué dice "No se pudo cargar el perfil"?**
A: Las columnas en la BD no existen. Ejecuta el SQL.

**P: ¿Por qué no me deja registrar?**
A: Verifica que email no esté registrado ya. Limpia BD si es de prueba.

**P: ¿Qué pasa si pierdo mi contraseña?**
A: Usa /recuperar-contrasenia para resetearla.

**P: ¿Puedo cambiar mi rol después de registrar?**
A: No, está asignado como "cliente". Contacta admin si necesitas otro rol.

**P: ¿Dónde veo mi perfil?**
A: /perfil (después de entrar al dashboard)

---

## 🎯 PRÓXIMO PASO

Después de resolver el problema, prueba el **flujo completo**:
1. Registrar
2. Ver Bienvenida
3. Completar Perfil
4. Ver Dashboard
5. Navegar a Mascotas, Citas, etc.

¡Que funcione bien! 🚀
