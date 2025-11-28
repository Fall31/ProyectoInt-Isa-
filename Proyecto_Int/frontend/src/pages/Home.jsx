import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import supabaseServices from '../services/supabase'
import './Home.css'

const Home = () => {
  const [stats, setStats] = useState({
    mascotas: 0,
    servicios: 0,
    doctores: 0,
    productos: 0
  })
  const [serviciosDestacados, setServiciosDestacados] = useState([])
  const [productosDestacados, setProductosDestacados] = useState([])
  const [articulosRecientes, setArticulosRecientes] = useState([])
  const [doctores, setDoctores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarDatosHome()
  }, [])

  const cargarDatosHome = async () => {
    try {
      setLoading(true)

      // Cargar estadísticas
      const [mascotas, servicios, doctoresData, productos] = await Promise.all([
        supabase.from('mascota').select('*', { count: 'exact', head: true }),
        supabase.from('servicio').select('*', { count: 'exact', head: true }),
        supabase.from('personal').select('*', { count: 'exact', head: true }).eq('estado', 'activo'),
        supabase.from('producto').select('*', { count: 'exact', head: true })
      ])

      setStats({
        mascotas: mascotas.count || 0,
        servicios: servicios.count || 0,
        doctores: doctoresData.count || 0,
        productos: productos.count || 0
      })

      // Cargar servicios destacados (primeros 4)
      const serviciosData = await supabaseServices.servicios.getAll()
      setServiciosDestacados(serviciosData.slice(0, 4))

      // Cargar productos destacados (primeros 4)
      const productosData = await supabaseServices.productos.getAll()
      setProductosDestacados(productosData.slice(0, 4))

      // Cargar artículos recientes (primeros 3)
      const articulosData = await supabaseServices.articulos.getAll()
      setArticulosRecientes(articulosData.slice(0, 3))

      // Cargar doctores (primeros 3)
      const doctoresCompletos = await supabaseServices.doctores.getAll()
      setDoctores(doctoresCompletos.slice(0, 3))

      setLoading(false)
    } catch (err) {
      console.error('Error cargando datos del home:', err)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="home-loading">
        <div className="spinner-large"></div>
        <p>Cargando VetCare...</p>
      </div>
    )
  }

  return (
    <div className="home-page">
      {/* SECCIÓN TEMPORAL - NAVEGACIÓN AL PORTAL DE PERSONAL */}
      <section style={{
        background: 'linear-gradient(135deg, #5DADE2, #85C1E9)',
        padding: '2rem',
        borderRadius: '1rem',
        margin: '2rem',
        color: 'white'
      }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>🔧 Navegación Temporal - Portal de Personal</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem'
        }}>
          <Link to="/dashboard-personal" style={{
            background: 'white',
            color: '#2C3E50',
            padding: '1.5rem',
            borderRadius: '0.8rem',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            textAlign: 'center'
          }}>
            👨‍⚕️ Dashboard Personal
          </Link>
          <Link to="/mis-reservas" style={{
            background: 'white',
            color: '#2C3E50',
            padding: '1.5rem',
            borderRadius: '0.8rem',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            textAlign: 'center'
          }}>
            📋 Mis Reservas
          </Link>
          <Link to="/historial-medico-personal" style={{
            background: 'white',
            color: '#2C3E50',
            padding: '1.5rem',
            borderRadius: '0.8rem',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            textAlign: 'center'
          }}>
            🏥 Historial Médico
          </Link>
          <Link to="/recetas-tratamientos" style={{
            background: 'white',
            color: '#2C3E50',
            padding: '1.5rem',
            borderRadius: '0.8rem',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            textAlign: 'center'
          }}>
            💊 Recetas y Tratamientos
          </Link>
          <Link to="/gestion-blog" style={{
            background: 'white',
            color: '#2C3E50',
            padding: '1.5rem',
            borderRadius: '0.8rem',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            textAlign: 'center'
          }}>
            📝 Gestión de Blog
          </Link>
          <Link to="/chat-personal" style={{
            background: 'white',
            color: '#2C3E50',
            padding: '1.5rem',
            borderRadius: '0.8rem',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            textAlign: 'center'
          }}>
            💬 Chat Personal
          </Link>
          <Link to="/mis-horarios" style={{
            background: 'white',
            color: '#2C3E50',
            padding: '1.5rem',
            borderRadius: '0.8rem',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            textAlign: 'center'
          }}>
            🗓️ Mis Horarios
          </Link>
        </div>
        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', opacity: '0.9' }}>
          ⚠️ Estas páginas requieren autenticación. Si no tienes un usuario de personal configurado, 
          verás un mensaje de error. Las tablas necesarias: personal (con user_id), horario_personal, 
          conversaciones_personal, mensajes_personal.
        </p>
      </section>

      {/* Hero Section Mejorado */}
      <section className="hero-home">
        <div className="hero-background"></div>
        <div className="hero-content">
          <span className="hero-badge">🐾 #1 en Cuidado Veterinario</span>
          <h1 className="hero-title">
            Bienvenido a <span className="brand-highlight">VetCare</span>
          </h1>
          <p className="hero-description">
            Cuidamos a tus mascotas con cariño y profesionalismo. Servicios integrales, 
            vacunación y productos seleccionados para su bienestar.
          </p>
          <div className="hero-actions">
            <Link to="/reservas" className="btn-hero btn-primary">
              📅 Reservar Cita Ahora
            </Link>
            <Link to="/catalogo-productos" className="btn-hero btn-secondary">
              🛍️ Ver Tienda
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-icon">🐾</div>
              <h3>{stats.mascotas}+</h3>
              <p>Mascotas felices</p>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⚕️</div>
              <h3>{stats.servicios}+</h3>
              <p>Servicios disponibles</p>
            </div>
            <div className="stat-item">
              <div className="stat-icon">👨‍⚕️</div>
              <h3>{stats.doctores}+</h3>
              <p>Profesionales</p>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🛒</div>
              <h3>{stats.productos}+</h3>
              <p>Productos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Destacados */}
      <section className="section-destacados">
        <div className="section-header">
          <h2>🏥 Servicios Destacados</h2>
          <Link to="/catalogo-servicios" className="view-all-link">Ver todos →</Link>
        </div>
        <div className="grid-4">
          {serviciosDestacados.map((servicio, index) => (
            <div key={servicio.id_servicio} className="preview-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="card-icon-large">🏥</div>
              <h3>{servicio.nombre_servicio}</h3>
              <p className="card-description">{servicio.descripcion?.substring(0, 80) || 'Servicio profesional'}...</p>
              <div className="card-footer">
                <span className="price-tag">
                  ${servicio.precio_base?.toFixed(2) || '0.00'}
                </span>
                <Link to="/reservas" className="btn-card">
                  Reservar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="section-destacados bg-alt">
        <div className="section-header">
          <h2>🛍️ Productos Destacados</h2>
          <Link to="/catalogo-productos" className="view-all-link">Ver todos →</Link>
        </div>
        <div className="grid-4">
          {productosDestacados.map((producto, index) => (
            <div key={producto.id_producto} className="preview-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="product-image">
                {producto.imagen ? (
                  <img src={producto.imagen} alt={producto.nombre_producto} />
                ) : (
                  <div className="image-placeholder">📦</div>
                )}
              </div>
              <h3>{producto.nombre_producto}</h3>
              <p className="categoria-tag">{producto.categoria}</p>
              <div className="card-footer">
                <span className="price-tag">
                  ${producto.precio?.toFixed(2) || '0.00'}
                </span>
                <Link to="/catalogo-productos" className="btn-card">
                  Ver más
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nuestro Equipo */}
      <section className="section-destacados">
        <div className="section-header">
          <h2>👨‍⚕️ Conoce a Nuestro Equipo</h2>
          <Link to="/doctores" className="view-all-link">Ver todos →</Link>
        </div>
        <div className="grid-3">
          {doctores.map((doctor, index) => {
            const iniciales = `${doctor.primer_nombre?.[0] || ''}${doctor.primer_apellido?.[0] || ''}`
            const nombreCompleto = `${doctor.primer_nombre || ''} ${doctor.primer_apellido || ''}`.trim()
            
            return (
              <div key={doctor.ci_personal} className="doctor-preview-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="doctor-avatar-preview">
                  <div className="avatar-circle-preview">{iniciales}</div>
                </div>
                <h3>{nombreCompleto}</h3>
                <p className="doctor-role">{doctor.funcion || 'Veterinario'}</p>
                <Link to="/doctores" className="btn-card">
                  Ver perfil
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      {/* Blog Reciente */}
      <section className="section-destacados bg-alt">
        <div className="section-header">
          <h2>📰 Últimas Noticias del Blog</h2>
          <Link to="/articulos-blog" className="view-all-link">Ver todos →</Link>
        </div>
        <div className="grid-3">
          {articulosRecientes.map((articulo, index) => (
            <div key={articulo.id_articulo} className="blog-preview-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="blog-date">
                📅 {new Date(articulo.fecha_publicacion).toLocaleDateString('es-ES')}
              </div>
              <h3>{articulo.titulo}</h3>
              <p className="blog-excerpt">
                {articulo.contenido?.substring(0, 120) || 'Contenido del artículo'}...
              </p>
              <Link to="/articulos-blog" className="btn-card">
                Leer más
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>¿Listo para cuidar mejor a tu mascota?</h2>
          <p>Únete a nuestra comunidad de dueños responsables</p>
          <div className="cta-buttons">
            <Link to="/registrar" className="btn-cta btn-white">
              Crear Cuenta Gratis
            </Link>
            <Link to="/catalogo-servicios" className="btn-cta btn-outline-white">
              Ver Servicios
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
