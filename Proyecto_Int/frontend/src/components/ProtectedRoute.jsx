import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * Componente para proteger rutas basadas en roles de usuario
 * @param {React.Component} Component - Componente a renderizar
 * @param {string[]} allowedRoles - Roles permitidos: ['cliente', 'personal', 'administrador']
 * @param {boolean} requireAuth - Si requiere autenticación
 */
export const ProtectedRoute = ({ 
  Component, 
  allowedRoles = [], 
  requireAuth = true 
}) => {
  const { user, userRole, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        ⏳ Cargando...
      </div>
    )
  }

  // Si requiere autenticación pero no hay usuario
  if (requireAuth && !user) {
    return <Navigate to="/iniciar-sesion" replace />
  }

  // Si no requiere autenticación y hay usuario
  if (!requireAuth && user) {
    return <Navigate to="/dashboard" replace />
  }

  // Si requiere autenticación y hay roles específicos requeridos
  if (requireAuth && allowedRoles.length > 0) {
    if (!userRole || !allowedRoles.includes(userRole)) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          textAlign: 'center'
        }}>
          <div>
            <h1>❌ Acceso Denegado</h1>
            <p>No tienes permisos para acceder a esta página.</p>
            <p>Tu rol: <strong>{userRole || 'Sin rol'}</strong></p>
          </div>
        </div>
      )
    }
  }

  return <Component user={user} />
}

export default ProtectedRoute
