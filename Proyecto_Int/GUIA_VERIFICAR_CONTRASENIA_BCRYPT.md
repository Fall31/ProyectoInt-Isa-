# 🔐 VERIFICAR CONTRASEÑA - Cómo usar Bcrypt

Guía para verificar que la contraseña ingresada coincide con el hash guardado.

---

## 📌 IMPORTANTE: Supabase Auth ya lo hace

Cuando el usuario inicia sesión:

```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: correo,
  password: contrasenia  // Supabase verifica automáticamente
})
```

✅ **Supabase Auth verifica contra auth.users automáticamente**
✅ **NO necesitas verificar manualmente contra tabla cliente**
✅ **Las contraseñas en cliente son solo para referencia/compatibilidad**

---

## 🧪 PERO: Si necesitas verificar manualmente

Si alguna vez necesitas verificar que una contraseña coincide con el hash guardado:

### 1. En Frontend (React):

```javascript
import bcrypt from 'bcryptjs'

// Función para verificar contraseña
async function verificarContrasenia(contraseniaIngresada, hashGuardado) {
  try {
    const esValida = await bcrypt.compare(
      contraseniaIngresada,      // Lo que ingresa el usuario
      hashGuardado                // El hash $2b$10$... guardado en BD
    )
    
    if (esValida) {
      console.log('✅ Contraseña correcta')
      return true
    } else {
      console.log('❌ Contraseña incorrecta')
      return false
    }
  } catch (err) {
    console.error('Error al verificar:', err)
    return false
  }
}

// Uso:
const contrasenia = 'MiPassword123'
const hashGuardado = '$2b$10$FnG2g5.v.YJnM.Gxf7kqCLOH7hL4vQzZ2c...'

const esCorrecta = await verificarContrasenia(contrasenia, hashGuardado)
```

### 2. En Backend (Node.js):

```javascript
const bcrypt = require('bcryptjs')

// Función para verificar
async function verificarContrasenia(contraseniaIngresada, hashGuardado) {
  return await bcrypt.compare(contraseniaIngresada, hashGuardado)
}

// Uso en ruta:
app.post('/verificar-contrasenia', async (req, res) => {
  const { contrasenia } = req.body
  const user_id = req.user.id  // Del token JWT
  
  // Obtener hash de BD
  const { data } = await supabase
    .from('cliente')
    .select('contrasenia')
    .eq('user_id', user_id)
    .single()
  
  const esValida = await bcrypt.compare(contrasenia, data.contrasenia)
  
  res.json({ valida: esValida })
})
```

### 3. En Backend (SQL - NO RECOMENDADO):

❌ **NO se puede verificar bcrypt en SQL** (no es reversible)

Debes usar JavaScript/Node.js

---

## 🔄 FLUJOS DONDE SE VERIFICA

### ✅ LOGIN (ya funciona automático):
```
1. Usuario ingresa email + contraseña
2. Supabase Auth verifica contra auth.users
3. ✅ Correcto = Login exitoso
```

### ✅ CAMBIAR CONTRASEÑA:
```
1. Usuario ingresa contraseña actual
2. Verificar: bcrypt.compare(actual, hashGuardado)
3. Si ✅ correcto, permitir cambio
4. Encriptar nueva con bcrypt
5. Actualizar en contrasenia + salt
```

### ✅ RECUPERAR CONTRASEÑA:
```
1. Usuario hace clic en "Olvidé contraseña"
2. Supabase envía email (automático)
3. Usuario hace clic en link del email
4. Ingresa nueva contraseña
5. Supabase Auth actualiza automáticamente
6. Sincronizar en tabla cliente también
```

### ⚠️ CAMBIO DE CONTRASEÑA - CÓMO HACERLO:

```javascript
// 1. Verificar que la contraseña actual es correcta
const { data, error } = await supabase.auth.signInWithPassword({
  email: userEmail,
  password: contraseniaActual  // Verificamos contra auth.users
})

if (error) {
  console.log('❌ Contraseña actual incorrecta')
  return
}

// 2. Actualizar en Supabase Auth
const { error: updateError } = await supabase.auth.updateUser({
  password: nuevaContrasenia
})

if (updateError) {
  console.log('❌ Error al actualizar en Auth')
  return
}

// 3. Actualizar en tabla cliente también (para compatibilidad)
try {
  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds)
  const newHash = await bcrypt.hash(nuevaContrasenia, salt)
  
  await supabase
    .from('cliente')
    .update({
      contrasenia: newHash,
      salt: salt
    })
    .eq('user_id', user_id)
  
  console.log('✅ Contraseña actualizada en ambos lugares')
} catch (err) {
  console.warn('⚠️ Error al actualizar tabla cliente:', err)
  // Pero Auth ya se actualizó, así que está bien
}
```

---

## 🛡️ SEGURIDAD CRIPTOGRÁFICA

### ¿Por qué bcrypt es seguro?

1. **One-way**: No se puede desencriptar
   ```
   ✅ hash = bcrypt.hash(password)
   ❌ password = bcrypt.decrypt(hash)  // IMPOSIBLE
   ```

2. **Unique salt**: Cada hash es diferente
   ```
   Password: "MiPassword123"
   
   Hash 1: $2b$10$xyz123...  ← Con salt único
   Hash 2: $2b$10$abc789...  ← Diferente (otro salt)
   Hash 3: $2b$10$def456...  ← Diferente (otro salt)
   
   Todos se verifican con bcrypt.compare(password, hash)
   ```

3. **Costly**: Lento de propósito (más seguro)
   ```
   bcrypt.compare() toma ~100-200ms
   Esto hace que ataques de fuerza bruta sean muy lentos
   ```

4. **Iterable**: 10 rondas = muy seguro
   ```
   Ronda 1: Hash inicial
   Ronda 2-10: Re-hash 9 veces más
   Total: 2^10 = 1024 iteraciones mínimo
   ```

---

## 🧪 TEST: Verificar que es imposible desencriptar

### En Node.js:

```javascript
const bcrypt = require('bcryptjs')

async function test() {
  const password = 'MiPassword123'
  
  // Crear hash
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  
  console.log('Password:', password)
  console.log('Hash:', hash)
  
  // Verificar que es correcto
  const esValida = await bcrypt.compare(password, hash)
  console.log('¿Correcto?:', esValida)  // true
  
  // Intentar con contraseña incorrecta
  const esValida2 = await bcrypt.compare('OtraPassword', hash)
  console.log('¿Otra?:', esValida2)  // false
  
  // ❌ IMPOSIBLE: Desencriptar
  // No existe función para esto
  // console.log(await bcrypt.decrypt(hash))  // ❌ NO EXISTE
}

test()
```

---

## 📊 ESTADOS DE SEGURIDAD

| Escenario | Seguridad | Descripción |
|-----------|-----------|-------------|
| **Texto plano en BD** | ❌❌❌ | PELIGRO: Si hackean BD ven todo |
| **Hash simple (MD5)** | ❌❌ | Peligro: Se crackerá rápido |
| **Hash con salt** | ✅✅ | Bueno: Pero lento |
| **Bcrypt (10 rondas)** | ✅✅✅ | EXCELENTE: Nuestro nivel |
| **Argon2** | ✅✅✅✅ | Máximo: Para casos ultra-críticos |

---

## 🎯 RESUMEN

✅ **Contraseña guardada:** $2b$10$hash... (bcrypt)
✅ **Verificación:** bcrypt.compare(ingresada, guardada)
✅ **Desencriptación:** ❌ IMPOSIBLE (diseño seguro)
✅ **Supabase Auth:** Ya verifica automáticamente
✅ **Tabla cliente:** Copia para compatibilidad con compañeros
✅ **Seguridad:** 2 niveles (Auth.users + tabla cliente)

---

## 🚀 FLUJO COMPLETO (CON CIFRADO)

```
REGISTRO:
1. Usuario ingresa password
2. Supabase Auth encripta (auth.users)
3. Frontend encripta con bcrypt
4. Guarda hash en tabla cliente
5. ✅ Password segura 2x

LOGIN:
1. Usuario ingresa email + password
2. Supabase Auth verifica contra auth.users
3. ✅ Acceso concedido
(No necesita verificar tabla cliente)

CAMBIO PASSWORD:
1. Usuario ingresa actual + nueva
2. Supabase Auth verifica actual
3. Auth actualiza a nueva
4. Frontend actualiza tabla cliente
5. ✅ Actualizado en ambos lugares

RECUPERACIÓN:
1. Usuario: "Olvidé contraseña"
2. Email de Supabase (automático)
3. Usuario hace clic
4. Ingresa nueva password
5. Supabase Auth actualiza
6. Sincronizar tabla cliente
7. ✅ Acceso recuperado
```

---

**Cualquier duda sobre criptografía o bcrypt, aquí está la guía completa.**
