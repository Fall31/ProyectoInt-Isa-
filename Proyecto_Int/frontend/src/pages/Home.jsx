import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { VETERINARIA_INFO, DOCTORES_EJEMPLO, TESTIMONIOS_EJEMPLO, BLOGS_EJEMPLO } from '../lib/veterinariaData'
import { supabase } from '../lib/supabaseClient'
import HomeStats from '../components/HomeStats'
import './Home.css'
import { AuthContext } from '../contexts/AuthContext'

const Home = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [doctores] = useState(DOCTORES_EJEMPLO)
  const [testimonios] = useState(TESTIMONIOS_EJEMPLO)
  const [blogs] = useState(BLOGS_EJEMPLO)
  const [showModal, setShowModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)

  const abrirGoogleMaps = () => {
    window.open(VETERINARIA_INFO.ubicacion.mapa_url, '_blank')
  }

  const llamarDoctor = (telefono) => {
    window.location.href = `tel:${telefono}`
  }

  const enviarWhatsApp = (telefono, nombre) => {
    const mensaje = encodeURIComponent(`Hola, me gustaría comunicarme con ${nombre} sobre mis mascotas.`)
    window.open(`https://wa.me/${telefono.replace(/\D/g, '').slice(-10)}?text=${mensaje}`, '_blank')
  }

  const enviarCorreo = (email, nombre) => {
    const subject = encodeURIComponent('Consulta VetCare')
    const body = encodeURIComponent(`Hola Dr./Dra. ${nombre},\n\nMe gustaría comunicarme sobre mis mascotas.\n\nGracias.`)
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
  }

  const seleccionarDoctor = (doctor) => {
    setSelectedDoctor(doctor)
    setShowModal(true)
  }

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">🏥 Bienvenido a VetCare</h1>
          <p className="hero-subtitle">Cuidado integral para tus mascotas con profesionales de confianza</p>
          {!user && (
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigate('/registrar')}>
                Registrarse Ahora
              </button>
              <button className="btn-secondary" onClick={() => navigate('/iniciar-sesion')}>
                Iniciar Sesión
              </button>
            </div>
          )}
        </div>
        <div className="hero-image">🐾🐕🐱</div>
      </section>

      {/* SECCIÓN ESTADÍSTICAS */}
      <section className="estadisticas-section">
        <h2>📊 VetCare en Números</h2>
        <HomeStats />
      </section>

      {/* SECCIÓN EMERGENCIA */}
      <section className="emergencia-section">
        <div className="emergencia-header">
          <h2>🆘 ¿EMERGENCIA?</h2>
          <p>Llámanos inmediatamente - Disponible 24/7</p>
        </div>
        <div className="emergencia-buttons">
          {VETERINARIA_INFO.telefonos_emergencia.map((tel, idx) => (
            <div key={idx} className="emergencia-card">
              <p className="emergencia-tipo">{tel.tipo}</p>
              <p className="emergencia-numero">{tel.numero}</p>
              <div className="emergencia-actions">
                <button className="btn-call" onClick={() => llamarDoctor(tel.numero)}>
                  📞 Llamar
                </button>
                <button className="btn-whatsapp" onClick={() => enviarWhatsApp(tel.numero, 'VetCare')}>
                  💬 WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN UBICACIÓN */}
      <section className="ubicacion-section">
        <div className="ubicacion-info">
          <h2>📍 Nuestra Ubicación</h2>
          <p className="ubicacion-direccion">{VETERINARIA_INFO.ubicacion.direccion}</p>
          <div className="horarios">
            <div className="horario-item">
              <span className="horario-dia">Lunes - Viernes:</span>
              <span className="horario-hora">{VETERINARIA_INFO.horarios.lunes_viernes}</span>
            </div>
            <div className="horario-item">
              <span className="horario-dia">Sábado:</span>
              <span className="horario-hora">{VETERINARIA_INFO.horarios.sabado}</span>
            </div>
            <div className="horario-item">
              <span className="horario-dia">Domingo:</span>
              <span className="horario-hora">{VETERINARIA_INFO.horarios.domingo}</span>
            </div>
            <div className="horario-item emergencia-horario">
              <span className="horario-dia">🚑 Emergencia:</span>
              <span className="horario-hora">{VETERINARIA_INFO.horarios.emergencia}</span>
            </div>
          </div>
          <button className="btn-maps" onClick={abrirGoogleMaps}>
            📍 Abrir en Google Maps
          </button>
        </div>
        <div className="ubicacion-map-placeholder">
          <div className="map-icon">🗺️</div>
          <p>Haz clic en "Abrir en Google Maps" para ver nuestra ubicación exacta</p>
        </div>
      </section>

      {/* SECCIÓN DOCTORES */}
      <section className="doctores-section">
        <h2>👨‍⚕️ Nuestro Equipo Médico</h2>
        <p className="section-subtitle">Profesionales altamente capacitados listos para cuidar a tu mascota</p>
        
        <div className="doctores-grid">
          {doctores.map((doctor) => (
            <div key={doctor.id_personal} className="doctor-card">
              <div className="doctor-header">
                <div className="doctor-avatar">{doctor.imagen}</div>
                {doctor.disponible && <span className="badge-disponible">✓ Disponible</span>}
              </div>
              
              <h3 className="doctor-nombre">
                {doctor.nombre_personal} {doctor.primer_apellido}
              </h3>
              
              <p className="doctor-especialidad">{doctor.especialidad}</p>
              
              <div className="doctor-rating">
                <span className="stars">⭐ {doctor.calificacion}</span>
                <span className="resenas">({doctor.resenas} reseñas)</span>
              </div>
              
              <p className="doctor-descripcion">{doctor.descripcion}</p>
              
              <div className="doctor-actions">
                <button 
                  className="btn-info"
                  onClick={() => seleccionarDoctor(doctor)}
                >
                  📋 Más Información
                </button>
                <button 
                  className="btn-contactar"
                  onClick={() => llamarDoctor(doctor.telefono_personal)}
                >
                  📞 Llamar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN TESTIMONIOS */}
      <section className="testimonios-section">
        <h2>💬 Lo que dicen nuestros clientes</h2>
        <div className="testimonios-grid">
          {testimonios.map((testimonio) => (
            <div key={testimonio.id} className="testimonio-card">
              <div className="testimonio-header">
                <div className="testimonio-stars">
                  {'⭐'.repeat(testimonio.calificacion)}
                </div>
                <span className="testimonio-fecha">{testimonio.fecha}</span>
              </div>
              
              <p className="testimonio-comentario">"{testimonio.comentario}"</p>
              
              <div className="testimonio-autor">
                <p className="autor-nombre">- {testimonio.nombre}</p>
                <p className="autor-mascota">Mascota: {testimonio.mascota}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN SERVICIOS */}
      <section className="servicios-section">
        <h2>🏥 Nuestros Servicios</h2>
        <div className="servicios-grid">
          {VETERINARIA_INFO.servicios_principales.map((servicio, idx) => (
            <div key={idx} className="servicio-card">
              <div className="servicio-icon">
                {idx === 0 && '🩺'}
                {idx === 1 && '🔪'}
                {idx === 2 && '💉'}
                {idx === 3 && '🧪'}
                {idx === 4 && '📸'}
                {idx === 5 && '🚑'}
              </div>
              <h3>{servicio}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN BLOGS */}
      <section className="blogs-section">
        <h2>📚 Blog de Salud Animal</h2>
        <p className="section-subtitle">Consejos y artículos de nuestros expertos</p>
        
        <div className="blogs-grid">
          {blogs.map((blog) => (
            <div key={blog.id} className="blog-card">
              <div className="blog-image">{blog.imagen}</div>
              <div className="blog-content">
                <h3>{blog.titulo}</h3>
                <p>{blog.resumen}</p>
                <div className="blog-meta">
                  <span className="blog-autor">Por {blog.autor}</span>
                  <span className="blog-fecha">{new Date(blog.fecha).toLocaleDateString('es-ES')}</span>
                </div>
                <button className="btn-leer-mas" onClick={() => navigate('/articulos-blog')}>
                  Leer más →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN CONTACTO */}
      <section className="contacto-section">
        <h2>📧 Contáctanos</h2>
        <div className="contacto-grid">
          <div className="contacto-card">
            <h3>📞 Teléfono</h3>
            <p>{VETERINARIA_INFO.telefono_principal}</p>
            <button className="btn-contact" onClick={() => llamarDoctor(VETERINARIA_INFO.telefono_principal)}>
              Llamar
            </button>
          </div>
          
          <div className="contacto-card">
            <h3>📧 Correo</h3>
            <p>{VETERINARIA_INFO.correo}</p>
            <button className="btn-contact" onClick={() => enviarCorreo(VETERINARIA_INFO.correo, 'VetCare')}>
              Enviar Email
            </button>
          </div>
          
          <div className="contacto-card">
            <h3>🚑 Emergencia</h3>
            <p>{VETERINARIA_INFO.correo_emergencia}</p>
            <button className="btn-contact" onClick={() => enviarCorreo(VETERINARIA_INFO.correo_emergencia, 'VetCare')}>
              Reportar Emergencia
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      {!user && (
        <section className="footer-cta">
          <h2>¿Eres un cliente nuevo?</h2>
          <p>Regístrate hoy y accede a todos nuestros servicios</p>
          <button className="btn-registro-grande" onClick={() => navigate('/registrar')}>
            🚀 Comenzar Ahora
          </button>
        </section>
      )}

      {/* MODAL DOCTOR */}
      {showModal && selectedDoctor && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            
            <div className="modal-header">
              <div className="modal-avatar">{selectedDoctor.imagen}</div>
              <h2>{selectedDoctor.nombre_personal} {selectedDoctor.primer_apellido}</h2>
              <p className="modal-especialidad">{selectedDoctor.especialidad}</p>
            </div>
            
            <div className="modal-body">
              <div className="info-block">
                <h4>Acerca del Doctor</h4>
                <p>{selectedDoctor.descripcion}</p>
              </div>
              
              <div className="info-block">
                <h4>Contacto</h4>
                <p>📞 {selectedDoctor.telefono_personal}</p>
                <p>📧 {selectedDoctor.correo_personal}</p>
              </div>
              
              <div className="info-block">
                <h4>Calificación</h4>
                <div className="rating-display">
                  <span>⭐ {selectedDoctor.calificacion}</span>
                  <span>({selectedDoctor.resenas} reseñas)</span>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn-modal-primary"
                onClick={() => llamarDoctor(selectedDoctor.telefono_personal)}
              >
                📞 Llamar
              </button>
              <button 
                className="btn-modal-secondary"
                onClick={() => enviarWhatsApp(selectedDoctor.telefono_personal, selectedDoctor.nombre_personal)}
              >
                💬 WhatsApp
              </button>
              <button 
                className="btn-modal-secondary"
                onClick={() => enviarCorreo(selectedDoctor.correo_personal, selectedDoctor.nombre_personal)}
              >
                📧 Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
