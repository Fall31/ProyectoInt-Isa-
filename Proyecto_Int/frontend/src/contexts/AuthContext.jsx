import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null) // 'cliente', 'personal', 'administrador'
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cargar inmediatamente sin esperar BD
    setLoading(false)
    
    // Verificar auth en background
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        setUser(authUser)
        setUserRole('cliente') // Asumir cliente por defecto
      }
    }).catch(err => console.warn('Auth check:', err))

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user)
          setUserRole('cliente')
        } else {
          setUser(null)
          setUserRole(null)
          setUserProfile(null)
        }
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Cargar perfil del cliente desde tabla `cliente`
  useEffect(() => {
    const loadClientePerfil = async () => {
      if (!user) {
        setUserProfile(null)
        return
      }
      try {
        const { data: cliente, error } = await supabase
          .from('cliente')
          .select('*')
          .eq('user_id', user.id)
          .limit(1)
        if (!error && cliente && cliente.length > 0) {
          setUserProfile(cliente[0])
        }
      } catch (e) {
        console.warn('Perfil cliente no disponible aún')
      }
    }
    loadClientePerfil()
  }, [user])

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setUserRole(null)
      setUserProfile(null)
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (userRole === 'cliente') {
        const { data, error } = await supabase
          .from('cliente')
          .update(updates)
          .eq('user_id', user.id)
          .select()

        if (error) throw error
        setUserProfile(data[0])
        return data[0]
      } else if (userRole === 'personal' || userRole === 'administrador') {
        const { data, error } = await supabase
          .from('personal')
          .update(updates)
          .eq('user_id', user.id)
          .select()

        if (error) throw error
        setUserProfile(data[0])
        return data[0]
      }
    } catch (err) {
      console.error('Error actualizando perfil:', err)
      throw err
    }
  }

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
    profileComplete: userProfile?.perfil_completo === true,
    profileIncomplete: userProfile?.perfil_completo === false
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
