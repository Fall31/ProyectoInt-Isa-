## 🚀 CHECKLIST RÁPIDA - 5 MINUTOS

### PASO 1️⃣: EJECUTAR SQL (1 MIN) ⏱️
```
[ ] Abre: https://app.supabase.com
[ ] Selecciona tu proyecto
[ ] Va a: SQL Editor
[ ] Copia TODO esto:

-- ============================================
ALTER TABLE cliente
ADD COLUMN IF NOT EXISTS perfil_completado BOOLEAN DEFAULT FALSE;

ALTER TABLE cliente
ADD COLUMN IF NOT EXISTS rol VARCHAR(50) DEFAULT 'cliente';

UPDATE cliente SET rol = 'cliente' WHERE rol IS NULL;
UPDATE cliente SET perfil_completado = FALSE WHERE perfil_completado IS NULL;

CREATE INDEX IF NOT EXISTS idx_cliente_perfil_completado ON cliente(perfil_completado);
CREATE INDEX IF NOT EXISTS idx_cliente_rol ON cliente(rol);
-- ============================================

[ ] Pega en SQL Editor
[ ] Haz click: RUN
[ ] Verifica: Debe decir "Success" en verde ✅
```

---

### PASO 2️⃣: LIMPIAR USUARIOS (1 MIN) ⏱️
```
[ ] Supabase → Authentication → Users
[ ] Si hay usuarios anteriores, elimínalos
[ ] Esto evita conflictos
```

---

### PASO 3️⃣: REGISTRAR USUARIO NUEVO (1 MIN) ⏱️
```
[ ] Abre: http://localhost:5173/registrar
[ ] Completa:
    - Nombre: Juan
    - Email: juan@test.com
    - Contraseña: Juan123456 (mayús, minús, número)
    - Confirmar: Juan123456
[ ] Click: Crear Cuenta
[ ] Espera a que redirija a /bienvenida
```

---

### PASO 4️⃣: COMPLETAR PERFIL (1 MIN) ⏱️
```
[ ] Ahora estás en /bienvenida
[ ] Click: Completar Mi Perfil Ahora
[ ] Completa TODO:
    ✓ Nombre: Juan
    ✓ Primer Apellido: Pérez
    ✓ Segundo Apellido: García (opcional)
    ✓ Género: Masculino
    ✓ CI/RUT: 12345678
    ✓ Teléfono: 56912345678
    ✓ Dirección: Calle 123
[ ] Click: Guardar Perfil
[ ] Espera a que redirija a /dashboard
```

---

### PASO 5️⃣: VERIFICAR ÉXITO (1 MIN) ⏱️
```
[ ] ¿Estás en /dashboard?
    ✅ SÍ → ¡Perfecto!
    ❌ NO → Lee errors en console (F12)

[ ] ¿Ves "CLIENTE" en esquina arriba?
    ✅ SÍ → ¡Excelente!
    ❌ NO → Algo falta

[ ] Abre Console (F12) y verifica:
    ✅ NO debe haber errores rojos
    ✅ Debe decir algo como "User authenticated: email@test.com"
```

---

## 🎉 SI TODO ESTÁ VERDE = ¡ÉXITO!

El flujo completo está funcionando:
1. ✅ Registro
2. ✅ Email en auth.users
3. ✅ Entrada en tabla cliente
4. ✅ Página bienvenida
5. ✅ Completar perfil
6. ✅ Acceso a dashboard

---

## ⚠️ SI ALGO FALLA

### Error: "No se pudo cargar el perfil"
→ **Solución:** Ejecuta el SQL en Supabase

### Error: "perfil_completado column not found"
→ **Solución:** SQL no se ejecutó correctamente, verifica "Success"

### Redirige a /iniciar-sesion en lugar de /bienvenida
→ **Solución:** Ctrl+Shift+R (limpiar cache)

### No ve "CLIENTE" en navbar
→ **Solución:** F12 → Console → mira si hay errores
  
---

## 📍 ARCHIVOS QUE CAMBIARON

✅ Creado: `Bienvenida.jsx` + `Bienvenida.css`
✅ Modificado: `Registrar.jsx`
✅ Modificado: `CompletarPerfil.jsx`
✅ Modificado: `App.jsx`
✅ Creado: `DB_MIGRATION_CLIENTE_FIXED.sql`

---

**¿Completaste los 5 pasos? ¡Cuéntame qué pasó! 👇**
