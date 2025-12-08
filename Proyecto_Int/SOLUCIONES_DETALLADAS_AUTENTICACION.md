# 🛠️ SOLUCIONES DETALLADAS - Flujo de Autenticación

## SOLUCIÓN 1: Verificar y Corregir Tabla `cliente`

### Paso 1: Verificar estructura actual
```sql
-- Ejecutar en Supabase SQL Editor
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'cliente'
ORDER BY ordinal_position;
```

### Paso 2: Si falta `perfil_completado`, agregar:
```sql
ALTER TABLE cliente ADD COLUMN IF NOT EXISTS perfil_completado BOOLEAN DEFAULT false;
```

### Paso 3: Si falta `rol`, agregar:
```sql
ALTER TABLE cliente ADD COLUMN IF NOT EXISTS rol VARCHAR(50) DEFAULT 'cliente';
```

### Paso 4: Si `user_id` no es UNIQUE, hacer:
```sql
ALTER TABLE cliente ADD CONSTRAINT unique_user_id UNIQUE(user_id);
```

### Paso 5: Crear índice para mejor rendimiento:
```sql
CREATE INDEX IF NOT EXISTS idx_cliente_user_id ON cliente(user_id);
```

### ⚠️ IMPORTANTE - Remover campos inseguros (OPCIONAL):
Si existen columnas `contrasenia` y `salt` en cliente, REMOVER:
```sql
ALTER TABLE cliente DROP COLUMN IF EXISTS contrasenia;
ALTER TABLE cliente DROP COLUMN IF EXISTS salt;
-- Las contraseñas las maneja Supabase Auth, no guardarlas aquí
```

---

## SOLUCIÓN 2: Mejorar `Registrar.jsx`

**Ubicación:** `frontend/src/pages/Registrar.jsx`

**Problema:** El registro crea la cuenta en auth pero puede fallar al crear cliente en BD.

**Solución:** Garantizar que siempre se crea con INSERT + manejo robusto de errores.

```jsx
// En la sección "Paso 2: Crear registro BÁSICO en tabla cliente"
// REEMPLAZAR el bloque completo por:

try {
  // Insertar en tabla cliente con todos los campos necesarios
  const { data: insertedClient, error: insertError } = await supabase
    .from('cliente')
    .insert([{
      user_id: data.user.id,
      nombre_cliente: nombre.split(' ')[0] || nombre,
      primer_apellido: nombre.split(' ')[1] || '-',
      segundo_apellido: '',
      correo_cliente: correo,
      ci_cliente: data.user.id.substring(0, 20), // Temporal, se actualiza en CompletarPerfil
      telefono_cliente: '',
      direccion: '',
      genero: 'O',
      nit: '',
      rol: 'cliente',
      perfil_completado: false,
      fecha_registro: new Date().toISOString().split('T')[0]
    }])

  if (insertError) {
    console.error('Error al crear cliente:', insertError)
    
    // Si el error es por duplicado (usuario ya existe), no es crítico
    if (insertError.message.includes('duplicate') || insertError.message.includes('unique')) {
      console.log('Registro de cliente ya existe, continuando...')
    } else {
      // Para otros errores, registrar pero continuar
      console.warn('Aviso: Hubo un problema crear el perfil básico:', insertError.message)
    }
  } else {
    console.log('✅ Cliente creado correctamente en BD')
  }
} catch (err) {
  console.error('Error inesperado al crear cliente:', err)
  // Continuar de todas formas - la cuenta en auth ya se creó
}
```

---

## SOLUCIÓN 3: Mejorar `AuthContext.jsx`

**Ubicación:** `frontend/src/contexts/AuthContext.jsx`

**Problema:** No expone correctamente el estado `profileComplete`.

**Solución:** Mejorar `loadUserProfile` para verificar correctamente:

```jsx
const loadUserProfile = async (userId) => {
  try {
    // Cargar cliente
    const { data: cliente, error: clientError } = await supabase
      .from('cliente')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!clientError && cliente) {
      setUserProfile(cliente)
      setUserRole('cliente')
      // Explicitar si perfil está completo (puede ser undefined, false, o true)
      console.log('✅ Cliente cargado:', {
        nombre: cliente.nombre_cliente,
        perfil_completado: cliente.perfil_completado,
        ci_cliente: cliente.ci_cliente
      })
      return
    }

    // Cargar personal
    const { data: personal, error: personalError } = await supabase
      .from('personal')
      .select('*, cargo(*)')
      .eq('user_id', userId)
      .single()

    if (!personalError && personal) {
      setUserProfile(personal)
      setUserRole(personal.cargo?.rol === 'Administrador General' ? 'administrador' : 'personal')
      console.log('✅ Personal cargado:', personal.rol_asignado)
      return
    }

    // Si no es cliente ni personal
    console.warn('⚠️ Usuario no tiene perfil de cliente ni personal')
    setUserRole(null)
    setUserProfile(null)
  } catch (err) {
    console.error('Error cargando perfil:', err)
    setUserRole(null)
    setUserProfile(null)
  }
}

// Actualizar el valor que se exporta:
const value = {
  user,
  userRole,
  userProfile,
  loading,
  logout,
  updateProfile,
  isAuthenticated: !!user,
  isClient: userRole === 'cliente',
  isPersonal: userRole === 'personal',
  isAdmin: userRole === 'administrador',
  profileComplete: userProfile?.perfil_completado === true, // ← ARREGLADO
  profileIncomplete: userProfile?.perfil_completado === false, // ← NUEVO
}
```

---

## SOLUCIÓN 4: Mejorar `Bienvenida.jsx`

**Ubicación:** `frontend/src/pages/Bienvenida.jsx`

**Problema:** Verifica `perfil_completado` pero puede no existir.

**Solución:** Mejor manejo de errores y fallback:

```jsx
useEffect(() => {
  const checkUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        navigate('/iniciar-sesion')
        return
      }

      // Cargar datos del cliente
      const { data: clientData, error } = await supabase
        .from('cliente')
        .select('perfil_completado, nombre_cliente, ci_cliente')
        .eq('user_id', authUser.id)
        .single()

      // Si perfil está completo (perfil_completado = true), ir a dashboard
      if (!error && clientData?.perfil_completado === true) {
        console.log('✅ Perfil ya completado, redirigiendo a dashboard')
        navigate('/dashboard')
        return
      }

      // Si la consulta falla o no existe registro, mostrar pantalla de bienvenida
      // para que complete el perfil
      if (error && error.code === 'PGRST116') {
        console.log('⚠️ Registro de cliente no encontrado, debe completar perfil')
      }

      setUser(authUser)
      setLoading(false)
    } catch (err) {
      console.error('Error en checkUser:', err)
      setUser(null)
      setLoading(false)
    }
  }

  checkUser()
}, [navigate])
```

---

## SOLUCIÓN 5: Mejorar `CompletarPerfil.jsx`

**Ubicación:** `frontend/src/pages/CompletarPerfil.jsx`

**Problema:** Intenta UPDATE pero puede no existir el registro.

**Solución:** Usar UPSERT (INSERT + UPDATE) y generar NIT automático:

```jsx
const handleSaveProfile = async (e) => {
  e.preventDefault()
  setLoading(true)
  setMessage({ type: '', text: '' })

  try {
    // Validaciones (mantener igual)
    if (!profileData.nombre_cliente.trim() || profileData.nombre_cliente.trim().length < 2) {
      setMessage({ type: 'error', text: '❌ Nombre inválido (mínimo 2 caracteres)' })
      setLoading(false)
      return
    }

    if (!profileData.primer_apellido.trim() || profileData.primer_apellido.trim().length < 2) {
      setMessage({ type: 'error', text: '❌ Primer apellido inválido (mínimo 2 caracteres)' })
      setLoading(false)
      return
    }

    if (!profileData.ci_cliente.trim() || !validateCI(profileData.ci_cliente)) {
      setMessage({ type: 'error', text: '❌ CI/RUT inválido (5-20 caracteres)' })
      setLoading(false)
      return
    }

    // Generar NIT automáticamente si no existe (usar CI como base + timestamp)
    const nit = profileData.nit || `NIT-${profileData.ci_cliente}-${Date.now()}`

    // USAR UPSERT: Intenta actualizar, si no existe inserta
    const { data, error } = await supabase
      .from('cliente')
      .upsert(
        {
          user_id: user.id,
          ci_cliente: profileData.ci_cliente.trim(),
          nombre_cliente: profileData.nombre_cliente.trim(),
          primer_apellido: profileData.primer_apellido.trim(),
          segundo_apellido: profileData.segundo_apellido.trim(),
          telefono_cliente: profileData.telefono_cliente.trim(),
          direccion: profileData.direccion.trim(),
          genero: profileData.genero,
          nit: nit,
          perfil_completado: true,
          rol: 'cliente',
          fecha_registro: new Date().toISOString().split('T')[0]
        },
        { 
          onConflict: 'user_id'  // Si existe user_id, actualizar
        }
      )
      .select()

    if (error) {
      console.error('Error guardando perfil:', error)
      setMessage({ 
        type: 'error', 
        text: `❌ Error al guardar: ${error.message}` 
      })
      setLoading(false)
      return
    }

    console.log('✅ Perfil completado exitosamente')
    setMessage({ 
      type: 'success', 
      text: '✅ Perfil completado. Redirigiendo al dashboard...' 
    })

    // Redirigir a dashboard después de 1.5 segundos
    setTimeout(() => {
      navigate('/dashboard')
    }, 1500)

  } catch (err) {
    console.error('Error inesperado:', err)
    setMessage({ 
      type: 'error', 
      text: '❌ Error inesperado al guardar perfil' 
    })
    setLoading(false)
  }
}
```

---

## SOLUCIÓN 6: Mejorar `IniciarSesion.jsx`

**Ubicación:** `frontend/src/pages/IniciarSesion.jsx`

**Problema:** Las redirecciones pueden fallar si no lee correctamente `profileComplete`.

**Solución:** Usar contexto de autenticación:

```jsx
import { useAuth } from '../contexts/AuthContext'

function IniciarSesion() {
  const navigate = useNavigate()
  const { user, userRole, profileComplete, isClient, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Redirigir basado en rol y estado del perfil
  useEffect(() => {
    if (!authLoading && user && userRole) {
      console.log('🔍 Verificando estado:', {
        user: user.email,
        rol: userRole,
        profileComplete: profileComplete
      })

      // Si es cliente SIN perfil completo, ir a completar perfil
      if (isClient && !profileComplete) {
        console.log('→ Redirigiendo a completar perfil')
        navigate('/completar-perfil', { replace: true })
        return
      }

      // Si es cliente CON perfil completo, ir a dashboard
      if (userRole === 'cliente') {
        console.log('→ Redirigiendo a dashboard de cliente')
        navigate('/dashboard', { replace: true })
        return
      }

      // Si es personal o admin
      if (userRole === 'personal' || userRole === 'administrador') {
        console.log('→ Redirigiendo a dashboard personal')
        navigate('/dashboard-personal', { replace: true })
        return
      }
    }
  }, [user, userRole, profileComplete, isClient, authLoading, navigate])

  // ... resto del código igual
}
```

---

## SOLUCIÓN 7: Agregar validación de ROL en registro (FASE 2)

**Para futuro:** Cuando personal se registre, asignarle rol automático

Por ahora:
- Solo clientes se registran con `Registrar.jsx`
- Personal se crea desde admin panel
- Todos los clientes tienen `rol = 'cliente'`

En futuro, crear página `/registrar-personal` que:
1. Requiera código de invitación
2. Asigne rol específico (doctor, recepcionista, etc.)
3. Cree en tabla `personal` en lugar de `cliente`

---

## 🧪 Checklist de Testing

Después de implementar los fixes, probar en este orden:

- [ ] **Registro exitoso con email/contraseña**
  - [ ] Ir a `/registrar`
  - [ ] Llenar formulario
  - [ ] Recibir email de confirmación
  - [ ] Click en link de confirmación
  - [ ] Se debe redirigir a `/bienvenida`

- [ ] **Bienvenida funciona correctamente**
  - [ ] Mostrar email confirmado
  - [ ] Botón "Completar Mi Perfil" debe funcionar
  - [ ] Si intento refresh, debo seguir en Bienvenida

- [ ] **Completar Perfil funciona**
  - [ ] Llenar todos los campos
  - [ ] Click en guardar
  - [ ] Validaciones funcionan
  - [ ] Se debe redirigir a `/dashboard`

- [ ] **Dashboard accesible**
  - [ ] Ver menú de cliente
  - [ ] Poder navegar a mascotas, compras, etc.

- [ ] **Iniciar Sesión funciona**
  - [ ] Login con email/contraseña
  - [ ] Si perfil incompleto → `/completar-perfil`
  - [ ] Si perfil completo → `/dashboard`

- [ ] **Google OAuth (si lo implementas)**
  - [ ] Click en "Sign up with Google"
  - [ ] Autorizar
  - [ ] Debe crear cliente automáticamente
  - [ ] Ir a `/bienvenida`

---

## 📊 Resumen de Cambios

| Archivo | Cambio | Prioridad |
|---------|--------|-----------|
| BD (tabla cliente) | Agregar/verificar columnas | 🔴 CRÍTICO |
| `Registrar.jsx` | INSERT robusto con error handling | 🔴 CRÍTICO |
| `AuthContext.jsx` | Verificar profileComplete | 🟠 ALTA |
| `CompletarPerfil.jsx` | Cambiar a UPSERT + generar NIT | 🟠 ALTA |
| `Bienvenida.jsx` | Mejor error handling | 🟡 MEDIA |
| `IniciarSesion.jsx` | Usar AuthContext | 🟡 MEDIA |

---

## ❓ Preguntas Frecuentes

**P: ¿Por qué usar UPSERT en CompletarPerfil?**
R: Porque si el INSERT en Registrar falla, CompletarPerfil puede corregirlo automáticamente.

**P: ¿Cómo genero el NIT automáticamente?**
R: Usa formato: `NIT-{CI}-{timestamp}`. El admin puede cambiarlo después.

**P: ¿Qué pasa con Google OAuth?**
R: Necesita webhook en Supabase que ejecute SQL para crear cliente cuando se registra con OAuth.

**P: ¿Por qué no guardar contraseña en cliente?**
R: Supabase Auth ya la encripta y la maneja de forma segura. Guardarla aquí es riesgo de seguridad.

**P: ¿Cuándo agregamos soporte para otro rol de registro?**
R: En fase 2. Por ahora solo clientes se registran.

---

**PRÓXIMO PASO:** Implementar fixes en el código según orden de prioridad. ¿Empezamos?
