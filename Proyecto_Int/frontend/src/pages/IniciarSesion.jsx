import { useNavigate } from 'react-router-dom'
import './IniciarSesion.css'
import { supabase } from '../lib/supabaseClient'
import { useState } from 'react'

function IniciarSesion() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const form = e.target
    const correo = form.email.value
    const contrasenia = form.password.value

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: correo,
        password: contrasenia,
      })

      if (error) {
        console.error('Supabase signIn error:', error)
        alert('Error iniciando sesión: ' + error.message)
        setLoading(false)
        return
      }

      console.log('Login success:', data)
      alert('Inicio de sesión correcto')
      setLoading(false)
      navigate('/')
    } catch (err) {
      console.error('Unexpected login error:', err)
      alert('Error inesperado al iniciar sesión')
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <label>Correo:</label>
        <input name="email" type="email" placeholder="Ingresa tu correo" required />

        <label>Contraseña:</label>
        <input name="password" type="password" placeholder="Ingresa tu contraseña" required />

        <button type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Iniciar sesión'}</button>
      </form>
    </div>
  )
}

export default IniciarSesion
