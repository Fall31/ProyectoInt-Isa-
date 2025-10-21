import { useNavigate } from 'react-router-dom'
import './Registrar.css'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function Registrar() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const form = e.target
    const nombre = form.nombre.value
    const correo = form.email.value
    const contrasenia = form.password.value

    // Signup con Supabase Auth (front-end) — devuelve user (id)
    const { data, error } = await supabase.auth.signUp({
      email: correo,
      password: contrasenia,
    })

    if (error) {
      alert('Error al registrar: ' + error.message)
      setLoading(false)
      return
    }

    // data.user contiene el id (user.id) que puedes usar para enlazar el perfil
    // En este flujo llamaríamos al backend para crear el registro en la tabla Cliente
    // usando la service_role key (backend).
    try {
      await fetch(import.meta.env.VITE_API_URL + '/api/cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: data.user.id, // enviar user_id (uuid) para ligar con auth
            nombre_cliente: nombre,
            correo_cliente: correo,
          }),
      })
    } catch (err) {
      console.error('Error creando perfil:', err)
    }

    alert('Registro iniciado. Revisa tu correo para confirmar si aplica.')
    setLoading(false)
    navigate('/')
  }

  return (
    <div className="register-container">
      <h2>Registro de Usuario</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input name="nombre" type="text" placeholder="Ingresa tu nombre" required />

        <label>Correo:</label>
        <input name="email" type="email" placeholder="Ingresa tu correo" required />

        <label>Contraseña:</label>
        <input name="password" type="password" placeholder="Ingresa tu contraseña" required />

        <button type="submit" disabled={loading}>{loading ? 'Registrando...' : 'Registrar'}</button>
      </form>
    </div>
  )
}

export default Registrar
