# 💻 INFO PARA COMPAÑEROS - Contraseña Encriptada

**Para:** Equipo móvil/desktop trabajando en la misma BD
**Asunto:** Nueva encriptación de contraseñas en tabla cliente
**Importante:** Lee esto si trabajas con la BD

---

## 📢 ¿QUÉ CAMBIÓ?

**Nuevo:** Las contraseñas se guardan ENCRIPTADAS en tabla cliente

```sql
ANTES:
- ❌ Sin contraseña en tabla cliente
- Compañeros: "¿Dónde está el password?"

DESPUÉS:
- ✅ Contraseña encriptada con bcrypt
- ✅ Salt guardado
- ✅ Compañeros ven datos
```

---

## 🔐 QUÉ VES EN LA BD

### Columna: `contrasenia`

```
$2b$10$FnG2g5.v.YJnM.Gxf7kqCLOH7hL4vQzZ2c.yMl0w3Y5k9p2q...
```

✅ **Esto es un hash bcrypt** (SEGURO)
❌ **NO intentes desencriptarlo** (imposible)

### Columna: `salt`

```
$2b$10$FnG2g5.v.YJnM.Gxf7kqCL
```

✅ **Esto es parte del hash** (para referencia)
✅ **Sirve para verificar contraseña**

---

## ✅ ¿FUNCIONA MI APP?

### Sí, totalmente:

- ✅ Login funciona igual
- ✅ Supabase Auth maneja verificación
- ✅ No necesitas tocar nada
- ✅ Contraseña verificada automáticamente

### Flujo de Login:

```
1. Usuario ingresa Email + Contraseña
2. Tu app envía a Supabase Auth
3. Supabase verifica contra auth.users (no tabla cliente)
4. ✅ Login exitoso
5. No necesitas verificar tabla cliente
```

---

## 🚀 ¿NECESITO CAMBIAR MI APP?

### NO (pero mira esto):

**Si lees tabla cliente:**
```javascript
// ❌ NO HAGAS ESTO:
const password = cliente.contrasenia  // Es hash, no texto plano

// ✅ HACES ESTO:
const { data } = await supabase.auth.signInWithPassword({
  email: cliente.correo_cliente,
  password: passwordQueIngresoUsuario
})
// Supabase verifica automáticamente
```

**Si escribes a tabla cliente:**
```javascript
// ❌ NO ESCRIBAS TEXTO PLANO:
await supabase.from('cliente').insert({
  contrasenia: 'MiPassword123'  // ❌ PELIGRO
})

// ✅ ENCRIPTA PRIMERO:
import bcrypt from 'bcryptjs'

const saltRounds = 10
const salt = await bcrypt.genSalt(saltRounds)
const hash = await bcrypt.hash(passwordTextoPlano, salt)

await supabase.from('cliente').insert({
  contrasenia: hash,  // ✅ ENCRIPTADO
  salt: salt
})
```

---

## 📋 SI NECESITAS VERIFICAR CONTRASEÑA

### Opción 1: Usar Supabase Auth (RECOMENDADO)

```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: correo,
  password: contrasenia  // Supabase verifica automáticamente
})
```

✅ **Fácil**
✅ **Seguro**
✅ **Ya está hecho**

### Opción 2: Verificar manualmente contra tabla cliente

```javascript
import bcrypt from 'bcryptjs'

// Obtener hash de BD
const { data: cliente } = await supabase
  .from('cliente')
  .select('contrasenia')
  .eq('user_id', userId)
  .single()

// Verificar contraseña
const esValida = await bcrypt.compare(
  contraseniaIngresada,    // Lo que ingresa usuario
  cliente.contrasenia      // Hash guardado en BD
)

if (esValida) {
  console.log('✅ Contraseña correcta')
} else {
  console.log('❌ Contraseña incorrecta')
}
```

---

## 🛡️ SEGURIDAD - LO QUE NECESITAS SABER

### Bcrypt:
- ✅ Algoritmo criptográfico estándar
- ✅ No se puede desencriptar (one-way)
- ✅ Lento a propósito (seguro vs fuerza bruta)
- ✅ 10 rondas = nivel militar

### Salt:
- ✅ Único por cada contraseña
- ✅ Hace imposible tener hash igual
- ✅ Almacenado con el hash

### Doble Encriptación:
```
auth.users (Supabase)  ✅ Encriptada
    ↓
tabla cliente          ✅ Encriptada (bcrypt)
    ↓
Total protección: 2x  ✅ MÁS SEGURO
```

---

## ⚠️ COSAS QUE NO HACER

### ❌ NO:

1. **Desencriptar**
   ```javascript
   const pass = desencriptar(cliente.contrasenia)  // ❌ IMPOSIBLE
   ```

2. **Guardar texto plano**
   ```javascript
   await supabase.from('cliente').update({
     contrasenia: 'MiPassword123'  // ❌ PELIGRO
   })
   ```

3. **Comparar directamente**
   ```javascript
   if (contrasenia === cliente.contrasenia) {  // ❌ NUNCA IGUAL
     // ...
   }
   ```

4. **Leer para logging**
   ```javascript
   console.log('Contraseña:', cliente.contrasenia)  // ❌ Nunca en logs
   ```

### ✅ SÍ:

1. **Usar bcrypt.compare para verificar**
   ```javascript
   const esValida = await bcrypt.compare(ingresada, guardada)
   ```

2. **Usar Supabase Auth (automático)**
   ```javascript
   await supabase.auth.signInWithPassword(...)
   ```

3. **Encriptar antes de guardar**
   ```javascript
   const hash = await bcrypt.hash(password, salt)
   ```

---

## 📋 CHECKLIST PARA TU CÓDIGO

```
[ ] ¿Leo contraseña de tabla cliente?
    └─ ✅ Úsala con bcrypt.compare, no directamente

[ ] ¿Escribo contraseña a tabla cliente?
    └─ ✅ Encríptala primero con bcrypt

[ ] ¿Verifico login?
    └─ ✅ Usa Supabase Auth (automático)

[ ] ¿Mi app quedó rota?
    └─ ✅ No, todo funciona igual

[ ] ¿Puedo desencriptar el hash?
    └─ ❌ No (y no lo necesitas)
```

---

## 📊 ANTES vs DESPUÉS

| Operación | Antes | Después |
|-----------|-------|---------|
| **Leer contraseña** | ❌ No existe | ✅ Existe (hash) |
| **Verificar login** | ✅ Supabase Auth | ✅ Supabase Auth (igual) |
| **Guardar contraseña** | ❌ No | ✅ Encriptada |
| **Desencriptar** | N/A | ❌ Imposible |
| **App móvil** | ✅ Funciona | ✅ Funciona igual |
| **App desktop** | ✅ Funciona | ✅ Funciona igual |

---

## 🎯 RESUMEN RÁPIDO

✅ **Tu app sigue funcionando igual**
✅ **No necesitas cambiar nada (probablemente)**
✅ **Si lees tabla cliente, encripta primero**
✅ **Si verificas login, usa Supabase Auth**
✅ **Más seguridad = mejor para todos**

---

## ❓ PREGUNTAS FRECUENTES

**¿Mi app se rompió?**
No. Todo funciona igual.

**¿Por qué cambió?**
Para mejor seguridad y compatibilidad.

**¿Tengo que cambiar mi código?**
Probablemente no. Pero revisa si usas `cliente.contrasenia`.

**¿Cómo verifico que funciona?**
Registra usuario → ve DevTools → ejecuta SQL → verifica hash.

**¿Puedo leer la contraseña?**
No, es un hash (imposible desencriptar).

**¿Es peligroso dejarla así?**
No, bcrypt es muy seguro.

**¿Qué hago si alguien hackea BD?**
Está segura igual (no pueden ver contraseña original).

---

## 📞 SI NECESITAS AYUDA

1. **Lea:** `ENCRIPTAR_CONTRASENIA_BCRYPT.md` (explicación)
2. **Ejecute:** Consultas en `VERIFICAR_ENCRIPTACION_BCRYPT.sql`
3. **Verifique:** Que su app funciona igual
4. **Pregunte:** Si tiene dudas específicas

---

## 🎓 DOCUMENTACIÓN RELACIONADA

- 📖 `ENCRIPTAR_CONTRASENIA_BCRYPT.md` - Cómo funciona
- 🔍 `VERIFICAR_ENCRIPTACION_BCRYPT.sql` - Consultas SQL
- 📚 `GUIA_VERIFICAR_CONTRASENIA_BCRYPT.md` - Guía completa
- 📋 `GUIA_RAPIDA_BCRYPT_5MIN.md` - Resumen rápido

---

**¿Preguntas?** 
- ✅ Sí: Lee documentación arriba
- ✅ Dudas: Pregunta a VetCare lead
- ✅ Problemas: Abre issue con detalles

---

**Estado:** ✅ IMPLEMENTADO Y SEGURO
**Versión:** 1.0
**Fecha:** 2025-12-06
