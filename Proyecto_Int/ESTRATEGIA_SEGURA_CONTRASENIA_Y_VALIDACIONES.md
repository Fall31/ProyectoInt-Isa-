# 🔐 ESTRATEGIA SEGURA - Manejo de Contraseña + Validaciones

**Fecha:** Diciembre 6, 2025
**CRÍTICO:** NO romper BD de compañeras en móvil/escritorio

---

## 📋 SITUACIÓN ACTUAL

### Lo que TENEMOS:
- ✅ Tabla `cliente` con columnas: `ci_cliente`, `nombre_cliente`, `primer_apellido`, etc.
- ✅ Columna `perfil_completo` BOOLEAN (ya existe)
- ✅ Columnas `contrasenia` y `salt` (existen pero NO USARLAS - Supabase Auth maneja)
- ✅ Base de datos compartida con compañeras (móvil + escritorio)

### Lo que NECESITAMOS:
1. ✅ `ci_cliente` UNIQUE (no dos iguales)
2. ✅ `nit` generado automáticamente (puede ser diferente del CI)
3. ✅ Contraseña encriptada guardada SOLO en auth.users (Supabase)
4. ✅ NO afectar a compañeras que ya trabajan con la BD

---

## 🚀 SOLUCIÓN (FASE POR FASE)

### FASE 1: Validaciones en BD (SIN ROMPER NADA)

```sql
-- 1. Hacer ci_cliente UNIQUE (seguro, solo agrega restricción)
ALTER TABLE cliente 
ADD CONSTRAINT IF NOT EXISTS unique_ci_cliente UNIQUE(ci_cliente);

-- 2. Agregar NIT si no existe
ALTER TABLE cliente 
ADD COLUMN IF NOT EXISTS nit VARCHAR(50) UNIQUE;

-- 3. Crear función para generar NIT automático
CREATE OR REPLACE FUNCTION generar_nit()
RETURNS VARCHAR AS $$
BEGIN
  RETURN 'NIT-' || TO_CHAR(NOW(), 'YYYYMMDDHH24MISS') || '-' || FLOOR(RANDOM() * 10000);
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger para NIT automático al crear cliente
DROP TRIGGER IF EXISTS trigger_nit_auto ON cliente;
CREATE TRIGGER trigger_nit_auto
  BEFORE INSERT ON cliente
  FOR EACH ROW
  WHEN (NEW.nit IS NULL)
  EXECUTE FUNCTION generar_nit();
```

---

## 🔐 FASE 2: Gestión de Contraseña (SEGURO)

### ✅ VERDAD FUNDAMENTAL:
```
NO guardar contraseña en tabla cliente
├─ Supabase Auth ya la encripta
├─ Es redundante guardarla dos veces
├─ Es riesgo de seguridad
└─ Usar las columnas contrasenia/salt es INSEGURO
```

### ✅ FLUJO CORRECTO:

```
1. REGISTRO
   └─ Usuario ingresa email + contraseña
   └─ Supabase Auth encripta y guarda en auth.users ✓
   └─ TÚ NUNCA VES la contraseña
   └─ Se crea cliente en tabla cliente (SIN contraseña)

2. CUANDO COMPLETA PERFIL
   └─ Usuario ingresa CI, teléfono, dirección, etc.
   └─ Todo se guarda en tabla cliente
   └─ perfil_completo = true
   └─ Contraseña ya está en auth.users (no se toca)

3. EN LOGIN FUTURO
   └─ Usuario ingresa email + contraseña
   └─ Supabase Auth verifica contra auth.users
   └─ Si es correcto, se autentica
   └─ TÚ NUNCA accedes a la contraseña directamente
```

### 🚫 NO HAGAS ESTO:
```javascript
// ❌ INCORRECTO - No guardes contraseña en cliente
const { data, error } = await supabase
  .from('cliente')
  .insert({
    contrasenia: passwordHash,  // ❌ MALO
    salt: saltValue             // ❌ MALO
  })

// ✅ CORRECTO - Solo en auth
const { data, error } = await supabase.auth.signUp({
  email: correo,
  password: contrasenia  // ✓ Supabase Auth encripta
})
```

---

## 📧 MANEJO DE EMAIL

### Email está predefinido en auth.users

```
IMPORTANTE:
├─ Email lo define Supabase Auth
├─ NO puedes cambiar email desde tabla cliente
├─ Si quieres cambiar email, usa:
│  └─ supabase.auth.updateUser({ email: newEmail })
└─ Eso actualiza auth.users, no tabla cliente
```

### En tabla cliente:
```sql
-- Email solo como referencia (copia de auth.users)
-- No es la fuente de verdad
SELECT correo_cliente FROM cliente 
WHERE user_id = auth.uid();

-- PERO si cambias email en auth.users,
-- DEBES actualizar también en cliente para consistencia
```

---

## ✅ ESTRATEGIA FINAL (SIN ROMPER NADA)

### SCRIPT SQL SEGURO (FASE 1)
```sql
-- PASO 1: Hacer CI_CLIENTE único (seguro)
ALTER TABLE cliente 
ADD CONSTRAINT IF NOT EXISTS unique_ci_cliente UNIQUE(ci_cliente);

-- PASO 2: Agregar columna NIT si no existe
ALTER TABLE cliente 
ADD COLUMN IF NOT EXISTS nit VARCHAR(50) UNIQUE;

-- PASO 3: Crear índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_cliente_ci ON cliente(ci_cliente);
CREATE INDEX IF NOT EXISTS idx_cliente_nit ON cliente(nit);

-- ⚠️ NO remover contrasenia/salt por ahora
-- ⚠️ NO tocar data existente
-- ✓ Solo agregar nuevas restricciones
```

### CÓDIGO FRONTEND (FASE 2)

#### En `CompletarPerfil.jsx`:
```javascript
const handleSaveProfile = async (e) => {
  e.preventDefault()
  
  try {
    // VALIDAR CI ÚNICO
    const { data: existingCI, error: checkError } = await supabase
      .from('cliente')
      .select('ci_cliente')
      .eq('ci_cliente', profileData.ci_cliente.trim())
      .neq('user_id', user.id)  // Excluir mi propio registro
      .single()

    if (existingCI && existingCI.ci_cliente) {
      setMessage({ 
        type: 'error', 
        text: '❌ Este CI ya está registrado por otro usuario' 
      })
      setLoading(false)
      return
    }

    // GENERAR NIT si no existe
    // Formato: NIT-{CI}-{timestamp}-{random}
    const nitGenerado = `NIT-${profileData.ci_cliente.trim()}-${Date.now()}-${Math.floor(Math.random() * 10000)}`

    // GUARDAR SIN CONTRASEÑA
    const { error: updateError } = await supabase
      .from('cliente')
      .upsert({
        user_id: user.id,
        nombre_cliente: profileData.nombre_cliente.trim(),
        primer_apellido: profileData.primer_apellido.trim(),
        segundo_apellido: profileData.segundo_apellido.trim(),
        ci_cliente: profileData.ci_cliente.trim(),  // ← ÚNICO
        telefono_cliente: profileData.telefono_cliente.trim(),
        direccion: profileData.direccion.trim(),
        genero: profileData.genero,
        nit: nitGenerado,  // ← GENERADO AUTOMÁTICAMENTE
        perfil_completo: true,
        rol: 'cliente'
        // ⚠️ NO incluir contrasenia aquí
        // ⚠️ NO incluir salt aquí
      }, {
        onConflict: 'user_id'
      })

    if (updateError) throw updateError
    
    console.log('✅ Perfil guardado correctamente')
    navigate('/dashboard')
    
  } catch (err) {
    console.error('Error:', err)
    setMessage({ type: 'error', text: '❌ Error al guardar' })
  }
}
```

---

## 🔒 TABLA FINAL SEGURA

```sql
-- Estructura segura de tabla cliente
CREATE TABLE cliente (
  -- Identificadores
  ci_cliente VARCHAR(50) PRIMARY KEY UNIQUE,        ← ÚNICO
  user_id UUID UNIQUE NOT NULL,                      ← Referencia auth.users
  
  -- Datos personales
  nombre_cliente VARCHAR(100),
  primer_apellido VARCHAR(100),
  segundo_apellido VARCHAR(100),
  correo_cliente VARCHAR UNIQUE,                     ← Copia de auth.users
  
  -- Contacto
  telefono_cliente VARCHAR(20),
  direccion TEXT,
  genero VARCHAR(1),
  
  -- Identificadores especiales
  nit VARCHAR(50) UNIQUE,                            ← AUTOGENERADO
  
  -- Control
  rol VARCHAR(50) DEFAULT 'cliente',
  perfil_completo BOOLEAN DEFAULT false,
  
  -- Auditoría
  fecha_registro DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- ⚠️ NO GUARDAR AQUÍ
  -- contrasenia y salt ya están en auth.users
);

-- Restricciones
ALTER TABLE cliente ADD CONSTRAINT unique_ci_cliente UNIQUE(ci_cliente);
ALTER TABLE cliente ADD CONSTRAINT unique_nit UNIQUE(nit);

-- Índices
CREATE INDEX idx_cliente_user_id ON cliente(user_id);
CREATE INDEX idx_cliente_ci ON cliente(ci_cliente);
CREATE INDEX idx_cliente_nit ON cliente(nit);
```

---

## 🛡️ SEGURIDAD GARANTIZADA

### Para contraseña:
```
✓ Guardada encriptada en auth.users
✓ Supabase maneja la encriptación
✓ TÚ nunca ves la contraseña en texto plano
✓ No puedes hackear la contraseña accediendo a tabla cliente
```

### Para CI:
```
✓ UNIQUE - No dos iguales
✓ Validado en frontend ANTES de guardar
✓ Validado en BD con restricción UNIQUE
✓ Si intenta duplicado, BD rechaza
```

### Para NIT:
```
✓ Generado automáticamente
✓ UNIQUE - Cada cliente tiene uno único
✓ Formato: NIT-{CI}-{timestamp}-{random}
✓ Puede ser diferente del CI
```

---

## 🚫 QUÉ NO HACER

```javascript
// ❌ NO grabar contraseña en cliente
await supabase.from('cliente').insert({
  contrasenia: password  // ❌ NUNCA
})

// ❌ NO permitir cambiar contraseña desde tabla cliente
await supabase.from('cliente').update({
  contrasenia: newPassword  // ❌ NUNCA
})

// ✅ SI necesitas cambiar contraseña, usa auth:
await supabase.auth.updateUser({
  password: newPassword  // ✓ CORRECTO
})

// ❌ NO permitir cambiar email desde tabla cliente
await supabase.from('cliente').update({
  correo_cliente: newEmail  // ❌ PARCIALMENTE (inconsistencia)
})

// ✅ SI necesitas cambiar email, usa auth PRIMERO:
await supabase.auth.updateUser({
  email: newEmail  // ✓ CORRECTO
})
// LUEGO actualiza tabla cliente para consistencia:
await supabase.from('cliente').update({
  correo_cliente: newEmail  // ✓ CORRECTO (después de auth)
})
```

---

## 🚀 PASOS PARA IMPLEMENTAR (SEGURO)

### PASO 1: Ejecutar SQL en Supabase (NO afecta a compañeras)
```sql
-- Solo agrega restricciones, no cambia data existente
ALTER TABLE cliente 
ADD CONSTRAINT IF NOT EXISTS unique_ci_cliente UNIQUE(ci_cliente);

ALTER TABLE cliente 
ADD COLUMN IF NOT EXISTS nit VARCHAR(50) UNIQUE;

CREATE INDEX IF NOT EXISTS idx_cliente_ci ON cliente(ci_cliente);
```

### PASO 2: Actualizar frontend (web)
- Usar código de `CompletarPerfil.jsx` que valida CI
- No guardar contraseña en tabla cliente
- Generar NIT automático

### PASO 3: Verificar compañeras (IMPORTANTE)
- ✅ Móvil sigue funcionando normal
- ✅ Escritorio sigue funcionando normal
- ✅ Solo web tiene validaciones nuevas

---

## 📊 COMPARATIVA

| Aspecto | Antes | Después |
|---------|-------|---------|
| Contraseña en cliente | ⚠️ Dudoso | ❌ No la guardamos |
| Contraseña en auth.users | ✓ Sí | ✓ Sí (encriptada) |
| CI puede repetirse | ⚠️ Posible | ✅ UNIQUE |
| NIT | ❓ Manual | ✅ Automático |
| Email en cliente | Copia | Copia + validación |
| Seguridad | Media | Alta |
| Compañeras afectadas | - | ✓ NO |

---

## ⚠️ IMPORTANTE: Transición Segura

Si YA hay datos con CI duplicados:

```sql
-- ANTES de agregar restricción UNIQUE, limpiar:
SELECT ci_cliente, COUNT(*) 
FROM cliente 
GROUP BY ci_cliente 
HAVING COUNT(*) > 1;

-- Si hay duplicados, decidir:
-- Opción 1: Mantener el primero, marcar otros como inactivos
-- Opción 2: Generar CI temporal diferente

UPDATE cliente 
SET ci_cliente = 'TEMP-' || user_id 
WHERE ci_cliente IN (
  SELECT ci_cliente FROM cliente 
  GROUP BY ci_cliente HAVING COUNT(*) > 1
) 
AND user_id NOT IN (
  SELECT user_id FROM cliente 
  WHERE ci_cliente IN (
    SELECT ci_cliente FROM cliente 
    GROUP BY ci_cliente HAVING COUNT(*) > 1
  ) 
  LIMIT 1
);
```

---

## ✅ CHECKLIST FINAL

- [ ] BD: Ejecutar script SQL (agrega restricciones)
- [ ] Frontend: Validar CI no exista antes de guardar
- [ ] Frontend: Generar NIT automáticamente
- [ ] Frontend: NO guardar contraseña en cliente
- [ ] Frontend: Usar supabase.auth para cambios de contraseña
- [ ] Verificar: Compañeras pueden acceder a móvil/escritorio
- [ ] Verificar: Sin errors en console
- [ ] Prueba: Registro completo → CI único → NIT generado

---

## 🎯 RESUMEN

✅ **Contraseña:** Encriptada solo en auth.users (Supabase)
✅ **CI:** UNIQUE en BD, validado en frontend
✅ **NIT:** Generado automáticamente, único
✅ **Email:** Predefinido en auth.users, copia en cliente
✅ **Seguridad:** Alta, no guardamos datos sensibles en tabla cliente
✅ **Compañeras:** No afectadas, base de datos compatible

**ESTO ES SEGURO Y NO ROMPE NADA** ✓

---

**PRÓXIMO PASO:** ¿Quieres que actualice el script SQL y el código frontend con esta estrategia?
