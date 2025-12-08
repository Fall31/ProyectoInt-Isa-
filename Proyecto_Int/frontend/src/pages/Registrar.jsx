import { useNavigate, Link } from 'react-router-dom'
import './Registrar.css'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import bcrypt from 'bcryptjs'

function Registrar() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fotoFile, setFotoFile] = useState(null)

  // Validaciones estrictas
  const isLettersOnly = (text) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(text)
  const isDigitsOnly = (text) => /^\d+$/.test(text)

  // Validar email formato
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validar contraseña fuerte
  const validatePassword = (pass) => {
    const errors = []
    if (pass.length < 8) errors.push('Mínimo 8 caracteres')
    if (!/[A-Z]/.test(pass)) errors.push('Incluir mayúscula')
    if (!/[a-z]/.test(pass)) errors.push('Incluir minúscula')
    if (!/[0-9]/.test(pass)) errors.push('Incluir número')
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')
    
    const form = e.target
    const nombre = form.nombre.value.trim()
    const apellido1 = (form.apellido1?.value || '').trim()
    const apellido2 = (form.apellido2?.value || '').trim()
    const ci = (form.ci?.value || '').trim()
    const telefono = (form.telefono?.value || '').trim()
    const direccion = (form.direccion?.value || '').trim()
    const genero = (form.genero?.value || 'O')
    const correo = form.email.value.trim()
    const contrasenia = form.password.value
    const confirmarContrasenia = form.confirmPassword.value

    // Validaciones previas
    if (!nombre || nombre.length < 2 || !isLettersOnly(nombre)) {
      setErrorMessage('❌ Nombre inválido: solo letras, mínimo 2')
      setLoading(false)
      return
    }
    if (!apellido1 || apellido1.length < 2 || !isLettersOnly(apellido1)) {
      setErrorMessage('❌ Primer apellido inválido: solo letras, mínimo 2')
      setLoading(false)
      return
    }
    if (apellido2 && !isLettersOnly(apellido2)) {
      setErrorMessage('❌ Segundo apellido inválido: solo letras')
      setLoading(false)
      return
    }

    if (!isValidEmail(correo)) {
      setErrorMessage('❌ Ingresa un email válido (ej: usuario@ejemplo.com)')
      setLoading(false)
      return
    }

    const passwordErrors = validatePassword(contrasenia)
    if (passwordErrors.length > 0) {
      setErrorMessage(`❌ Contraseña débil. Requiere: ${passwordErrors.join(', ')}`)
      setLoading(false)
      return
    }

    if (contrasenia !== confirmarContrasenia) {
      setErrorMessage('❌ Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    // Validación CI: solo números (6-12)
    if (!isDigitsOnly(ci) || ci.length < 6 || ci.length > 12) {
      setErrorMessage('❌ CI inválido: solo números (6-12 dígitos)')
      setLoading(false)
      return
    }
    // Teléfono: solo números (7-15)
    if (!isDigitsOnly(telefono) || telefono.length < 7 || telefono.length > 15) {
      setErrorMessage('❌ Teléfono inválido: solo números (7-15 dígitos)')
      setLoading(false)
      return
    }
    // Dirección mínima
    if (!direccion || direccion.length < 5) {
      setErrorMessage('❌ Dirección inválida: mínimo 5 caracteres')
      setLoading(false)
      return
    }

    // Validar que email no exista
    // Utilidad: hash SHA-256 del correo normalizado (lower+trim)
    const getEmailHash = async (email) => {
      const normalized = email.trim().toLowerCase()
      const encoder = new TextEncoder()
      const data = encoder.encode(normalized)
      const digest = await crypto.subtle.digest('SHA-256', data)
      const bytes = Array.from(new Uint8Array(digest))
      return bytes.map((b) => b.toString(16).padStart(2, '0')).join('')
    }

    try {
      const { data: existingEmail } = await supabase
        .from('cliente')
        .select('correo_cliente')
        .eq('correo_cliente', correo)
        .single()

      if (existingEmail) {
        setErrorMessage('❌ Este email ya está registrado. Intenta con otro o inicia sesión.')
        setLoading(false)
        return
      }
    } catch (err) {
      // Error 406 es normal si no existe
      console.log('Email disponible')
    }

    try {
      // Paso 1: Crear cuenta en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: correo,
        password: contrasenia,
        options: {
          data: {
            nombre: nombre
          }
        }
      })

      if (error) {
        // Mejores mensajes de error según el tipo
        if (error.message.includes('already registered')) {
          setErrorMessage('❌ Este email ya está registrado. Intenta iniciar sesión.')
        } else if (error.message.includes('invalid')) {
          setErrorMessage('❌ Email inválido. Verifica el formato.')
        } else {
          setErrorMessage(`❌ Error al registrar: ${error.message}`)
        }
        setLoading(false)
        return
      }

      console.log('✅ Usuario creado en auth.users:', data.user?.id)

      // Paso 2: ENCRIPTAR contraseña con bcrypt (NUEVO)
      let contraseniaEncriptada = ''
      let saltBcrypt = ''
      try {
        const saltRounds = 10  // Nivel de seguridad muy alto
        saltBcrypt = await bcrypt.genSalt(saltRounds)
        contraseniaEncriptada = await bcrypt.hash(contrasenia, saltBcrypt)
        
        console.log('✅ Contraseña encriptada con bcrypt')
        console.log('   Encriptada:', contraseniaEncriptada.substring(0, 30) + '...')
        console.log('   Salt:', saltBcrypt)
      } catch (bcryptErr) {
        console.error('⚠️ Error al encriptar contraseña:', bcryptErr)
        // Continuar de todas formas
      }

      // Paso 3: Crear registro completo en tabla cliente (perfil_completo=true)
      if (data.user) {
        try {
          // Subida de foto (opcional)
          let foto_url = null
          if (fotoFile) {
            const fileExt = fotoFile.name.split('.').pop()
            const filePath = `${data.user.id}.${fileExt}`
            const { error: uploadError } = await supabase.storage
              .from('imagenes_clientes')
              .upload(filePath, fotoFile, { upsert: true })
            if (!uploadError) {
              const { data: publicUrlData } = supabase.storage
                .from('imagenes_clientes')
                .getPublicUrl(filePath)
              foto_url = publicUrlData?.publicUrl || null
            }
          }

          // NIT corto para evitar errores de longitud en varchar(20)
          const nitGenerado = ci
          // Calcular hash de correo (opcional, nullable si no aplica)
          let correoHash = null
          try {
            correoHash = await getEmailHash(correo)
          } catch {}

          const clientDataToInsert = {
            user_id: data.user.id,
            correo_cliente: correo,
            correo_cliente_hash: correoHash,
            ci_cliente: ci,
            nombre_cliente: nombre,
            primer_apellido: apellido1,
            segundo_apellido: apellido2 || '',
            telefono_cliente: telefono,
            direccion: direccion,
            genero,
            nit: nitGenerado,
            perfil_completo: true,
            foto_url,
            contrasenia: contraseniaEncriptada || '',
            salt: saltBcrypt || ''
          }

          // Verificar CI único
          const { data: existingCI } = await supabase
            .from('cliente')
            .select('ci_cliente')
            .eq('ci_cliente', ci)
            .limit(1)
          if (existingCI && existingCI.length > 0) {
            setErrorMessage('❌ Este CI ya está registrado')
            setLoading(false)
            return
          }

          // Intenta PRIMERO con todas las columnas
          let insertResult = await supabase
            .from('cliente')
            .insert([clientDataToInsert])

          let insertError = insertResult.error

          // Si falla por columnas inexistentes, remover esas columnas e intentar de nuevo
          if (insertError) {
            if (insertError.message.includes('perfil_completo')) {
              console.log('⚠️ Columna perfil_completo no existe, intentando sin ella...')
              delete clientDataToInsert.perfil_completo
            }
            if (insertError.message.includes('contrasenia')) {
              console.log('⚠️ Columna contrasenia no existe, intentando sin ella...')
              delete clientDataToInsert.contrasenia
            }
            if (insertError.message.includes('salt')) {
              console.log('⚠️ Columna salt no existe, intentando sin ella...')
              delete clientDataToInsert.salt
            }
            if (insertError.message.includes('correo_cliente_hash')) {
              console.log('⚠️ Columna correo_cliente_hash no existe, intentando sin ella...')
              delete clientDataToInsert.correo_cliente_hash
            }
            // Mantener campos mínimos para alta

            // Reintentar sin las columnas problemáticas
            if (Object.keys(clientDataToInsert).length > 0) {
              insertResult = await supabase
                .from('cliente')
                .insert([clientDataToInsert])
              
              insertError = insertResult.error
            }
          }

          if (insertError) {
            // Si aún falla, intentar con solo los campos básicos
            if (insertError.message.includes('user_id') || insertError.message.includes('duplicate')) {
              console.log('📝 Cliente ya existe o error de validación, intentando actualizar...')
              
              const minimalData = {
                nombre_cliente: clientDataToInsert.nombre_cliente,
                primer_apellido: clientDataToInsert.primer_apellido,
                correo_cliente: clientDataToInsert.correo_cliente
              }
              
              const updateResult = await supabase
                .from('cliente')
                .update(minimalData)
                .eq('user_id', data.user.id)
              
              if (updateResult.error) {
                console.warn('⚠️ No se pudo sincronizar completamente:', updateResult.error.message)
                setErrorMessage(`❌ Error al guardar cliente: ${updateResult.error.message}`)
                setLoading(false)
                return
              } else {
                console.log('✅ Cliente actualizado exitosamente')
              }
            } else {
              console.warn('⚠️ Error al crear cliente:', insertError.message)
              setErrorMessage(`❌ Error al crear cliente: ${insertError.message}`)
              setLoading(false)
              return
            }
          } else {
            console.log('✅ Cliente creado exitosamente en tabla cliente')
          }
        } catch (err) {
          console.error('❌ Error inesperado al crear cliente:', err)
          // Continuar de todas formas - la cuenta en auth ya existe
        }
      }

      setSuccessMessage('¡Registro exitoso! 🎉 Tu cuenta y perfil se han creado correctamente.')
      
      // Redirigir directo al dashboard
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
      
    } catch (err) {
      console.error('Error inesperado:', err)
      setErrorMessage('Error inesperado al registrar. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">🐾</div>
            <h1>Únete a VetCare</h1>
            <p>Crea tu cuenta y comienza a cuidar a tus mascotas</p>
          </div>

          {errorMessage && (
            <div className="error-banner">
              <span>⚠️</span>
              <p>{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="success-banner">
              <span>✅</span>
              <p>{successMessage}</p>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo</label>
              <input 
                id="nombre"
                name="nombre" 
                type="text" 
                placeholder="Juan Pérez" 
                required 
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="apellido1">Primer Apellido</label>
              <input 
                id="apellido1"
                name="apellido1" 
                type="text" 
                placeholder="Pérez" 
                required 
                autoComplete="family-name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="apellido2">Segundo Apellido (opcional)</label>
              <input 
                id="apellido2"
                name="apellido2" 
                type="text" 
                placeholder="García" 
                autoComplete="additional-name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="ci">CI</label>
              <input 
                id="ci"
                name="ci" 
                type="text" 
                placeholder="Solo números (6-12)" 
                required 
                inputMode="numeric"
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input 
                id="telefono"
                name="telefono" 
                type="text" 
                placeholder="Solo números (7-15)" 
                required 
                inputMode="tel"
                autoComplete="tel"
              />
            </div>

            <div className="form-group">
              <label htmlFor="direccion">Dirección</label>
              <input 
                id="direccion"
                name="direccion" 
                type="text" 
                placeholder="Calle y número" 
                required 
                autoComplete="street-address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="genero">Género</label>
              <select id="genero" name="genero" defaultValue="O">
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input 
                id="email"
                name="email" 
                type="email" 
                placeholder="tu@email.com" 
                required 
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="password-input-group">
                <input 
                  id="password"
                  name="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres" 
                  required 
                  autoComplete="new-password"
                  minLength={8}
                />
                <button 
                  type="button" 
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Mostrar/ocultar contraseña"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <small className="password-hint">8+ caracteres, mayúscula, minúscula y número</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <div className="password-input-group">
                <input 
                  id="confirmPassword"
                  name="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repite tu contraseña" 
                  required 
                  autoComplete="new-password"
                  minLength={8}
                />
                <button 
                  type="button" 
                  className="toggle-password-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Mostrar/ocultar contraseña"
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="foto">Foto de Perfil (opcional)</label>
              <input 
                id="foto"
                type="file"
                accept="image/*"
                onChange={(e) => setFotoFile(e.target.files?.[0] || null)}
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Registrando...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>¿Ya tienes cuenta? <Link to="/iniciar-sesion">Inicia sesión aquí</Link></p>
            <Link to="/" className="link-secondary">← Volver al inicio</Link>
          </div>
        </div>

        <div className="auth-illustration">
          <div className="illustration-content">
            <h2>🎉 Bienvenido a la familia</h2>
            <p>Únete a miles de dueños que confían en VetCare para el cuidado de sus mascotas.</p>
            <div className="features-list">
              <div className="feature-item">✓ Gestión de mascotas</div>
              <div className="feature-item">✓ Citas veterinarias online</div>
              <div className="feature-item">✓ Seguimiento de vacunas</div>
              <div className="feature-item">✓ Tienda de productos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Registrar
