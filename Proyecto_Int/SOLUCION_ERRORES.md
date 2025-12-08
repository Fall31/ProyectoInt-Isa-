# 🔧 INSTRUCCIONES PARA ARREGLAR LOS ERRORES

## ❌ Error 1: "Could not find the 'perfil_completado' column"

### Causa
La tabla `cliente` en tu base de datos Supabase no tiene la columna `perfil_completado`.

### Solución
1. Ve a **Supabase Dashboard** → Tu proyecto
2. Click en **SQL Editor** (lado izquierdo)
3. Abre el archivo `DB_MIGRATION_CLIENTE.sql` en este proyecto
4. **Copia TODO el contenido SQL**
5. En Supabase SQL Editor, **pega el código**
6. Click en el botón **▶ Run** (o presiona Ctrl+Enter)
7. Deberías ver: **"Success"**

### ¿Qué hace el script?
- Agrega columna `perfil_completado` (BOOLEAN)
- Agrega columna `rol` (VARCHAR)
- Crea índices para mejor rendimiento
- Actualiza registros existentes

---

## ❌ Error 2: "Email not confirmed"

### Causa
El usuario intentó login sin confirmar su email primero.

### Solución para el Usuario
1. **Revisa tu email** (incluyendo spam)
2. Busca un email de "noreply@mail.supabase.io"
3. Haz click en **"Confirm your email"**
4. Deberías ver un mensaje de confirmación
5. Ahora puedes iniciar sesión

### Si No Recibiste el Email
1. Intenta registrarte con un email diferente
2. O ve a `http://localhost:5173/confirmacion-email`
3. Ingresa tu email
4. Click en "Reenviar Email de Confirmación"

### Verificación en Supabase
1. Ve a **Authentication** → **Users**
2. Busca tu usuario
3. Columna **"Status"** debe decir **"Confirmed"**

---

## ❌ Error 3: "Tu rol: Sin rol"

### Causa
El usuario se autenticó pero no tiene un rol asignado en la tabla `cliente`.

### Solución
Una vez ejecutes el SQL script anterior (Error 1), esto se arreglará automáticamente porque:
- La columna `rol` se agregará con valor default `'cliente'`
- Todos los clientes obtendrán automáticamente el rol `'cliente'`

### Verificación Manual
1. Ve a Supabase → **SQL Editor**
2. Ejecuta esta query:
```sql
SELECT user_id, correo_cliente, rol, perfil_completado 
FROM cliente 
LIMIT 10;
```
3. Deberías ver:
   - `rol` = `'cliente'`
   - `perfil_completado` = `false`

---

## 📋 CHECKLIST DE SOLUCIÓN

Sigue estos pasos en orden:

### Paso 1: Arreglar Base de Datos ✓
- [ ] Abre `DB_MIGRATION_CLIENTE.sql`
- [ ] Copia el contenido SQL
- [ ] Ve a Supabase SQL Editor
- [ ] Pega y ejecuta el script
- [ ] Espera a que diga "Success"

### Paso 2: Borrar Datos de Prueba ✓
- [ ] Ve a **Supabase** → **Authentication** → **Users**
- [ ] Selecciona el usuario de prueba que creaste
- [ ] Click en **Delete user**
- [ ] Confirma la eliminación

### Paso 3: Probar de Nuevo ✓
- [ ] Ve a `http://localhost:5173/registrar`
- [ ] Crea un nuevo usuario:
  - Nombre: Juan Pérez
  - Email: juan+[timestamp]@test.com
  - Contraseña: Test123456
- [ ] Click en "Crear Cuenta"
- [ ] Deberías ver mensaje de éxito sin errores

### Paso 4: Confirmar Email ✓
- [ ] Revisa tu email (o spam)
- [ ] Haz click en el link de confirmación
- [ ] Deberías ver "Email confirmed"

### Paso 5: Login ✓
- [ ] Ve a `http://localhost:5173/iniciar-sesion`
- [ ] Ingresa el email y contraseña
- [ ] Click en "Iniciar sesión"
- [ ] Deberías redirigirse a `/completar-perfil`

### Paso 6: Completar Perfil ✓
- [ ] Llena todos los campos
- [ ] Click en "Guardar Perfil"
- [ ] Deberías redirigirse a `/dashboard`

---

## 🆘 Si Algo Sigue Fallando

### Recheck 1: Verificar que el SQL se ejecutó correctamente
```bash
1. Ve a Supabase → Table Editor
2. Abre tabla 'cliente'
3. Verifica que existen estas columnas:
   - perfil_completado ✓
   - rol ✓
```

### Recheck 2: Limpiar Cache del Navegador
```bash
F12 → Application → Clear All → Reload
```

### Recheck 3: Reiniciar Servidores
```bash
Ctrl+C en ambos terminales (frontend y backend)
npm run dev (frontend)
npm start (backend)
```

### Recheck 4: Ver Logs en Consola
```bash
F12 → Console → Busca mensajes rojos
Copia el mensaje de error y búscalo en el chat
```

---

## ✅ ÉXITO

Una vez completado todo, deberías poder:
- ✅ Registrar nuevos usuarios sin errores
- ✅ Recibir email de confirmación
- ✅ Confirmar email y login
- ✅ Completar perfil automáticamente
- ✅ Acceder al dashboard
- ✅ Cambiar contraseña
- ✅ Ver rol como "CLIENTE"

---

## 📞 Preguntas Frecuentes

**P: ¿Cuánto tiempo dura la confirmación de email?**
R: El link es válido por 24 horas. Si expira, usa `/confirmacion-email` para reenviar.

**P: ¿Qué pasa si borro un usuario de Supabase?**
R: También se elimina de `auth.users`. Debes recrear el registro.

**P: ¿Puedo deshabilitar la confirmación de email?**
R: Sí, en Supabase Settings → Auth → Disable Email Confirmations (no recomendado para producción).

**P: ¿El rol se asigna automáticamente?**
R: Sí, todos los clientes nuevos reciben `rol='cliente'` automáticamente.

---

¿Ejecutaste el SQL script? ¿Funcionó? 🚀
