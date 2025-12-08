import React, { useState } from 'react'

const DoctorModalTest = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedDoctor] = useState({
    id_personal: 1,
    nombre_personal: 'Juan',
    primer_apellido: 'Pérez',
    especialidad: 'Cirugía Veterinaria',
    descripcion: 'Especialista en cirugía de pequeños y grandes animales con 15 años de experiencia.',
    telefono_personal: '123456789',
    correo_personal: 'juan@vetcare.com',
    imagen: '👨‍⚕️',
    disponible: true,
    calificacion: 4.9,
    resenas: 45
  })

  const llamarDoctor = (telefono) => {
    console.log('Llamando a:', telefono)
    window.location.href = `tel:${telefono}`
  }

  const enviarWhatsApp = (telefono, nombre) => {
    const mensaje = encodeURIComponent(`Hola, me gustaría comunicarme con ${nombre} sobre mis mascotas.`)
    const numeroLimpio = telefono.replace(/\D/g, '').slice(-10)
    console.log('WhatsApp a:', numeroLimpio)
    window.open(`https://wa.me/${numeroLimpio}?text=${mensaje}`, '_blank')
  }

  const enviarCorreo = (email, nombre) => {
    const subject = encodeURIComponent('Consulta VetCare')
    const body = encodeURIComponent(`Hola Dr./Dra. ${nombre},\n\nMe gustaría comunicarme sobre mis mascotas.\n\nGracias.`)
    console.log('Email a:', email)
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>🧪 Test Modal del Doctor</h2>
      <button 
        onClick={() => setShowModal(true)}
        style={{
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          background: '#5DADE2',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer'
        }}
      >
        Abrir Modal de Doctor
      </button>

      {showModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowModal(false)}
        >
          <div 
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              maxWidth: '500px',
              width: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowModal(false)}
              style={{
                float: 'right',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '4rem' }}>{selectedDoctor.imagen}</div>
              <h2>{selectedDoctor.nombre_personal} {selectedDoctor.primer_apellido}</h2>
              <p style={{ color: '#5DADE2', fontWeight: 'bold' }}>{selectedDoctor.especialidad}</p>
            </div>

            <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <h4>Acerca del Doctor</h4>
              <p>{selectedDoctor.descripcion}</p>

              <h4>Contacto</h4>
              <p>📞 {selectedDoctor.telefono_personal}</p>
              <p>📧 {selectedDoctor.correo_personal}</p>

              <h4>Calificación</h4>
              <p>⭐ {selectedDoctor.calificacion} ({selectedDoctor.resenas} reseñas)</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <button 
                onClick={() => llamarDoctor(selectedDoctor.telefono_personal)}
                style={{
                  padding: '0.8rem',
                  background: '#27AE60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                📞 Llamar
              </button>
              <button 
                onClick={() => enviarWhatsApp(selectedDoctor.telefono_personal, selectedDoctor.nombre_personal)}
                style={{
                  padding: '0.8rem',
                  background: '#25D366',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                💬 WhatsApp
              </button>
              <button 
                onClick={() => enviarCorreo(selectedDoctor.correo_personal, selectedDoctor.nombre_personal)}
                style={{
                  padding: '0.8rem',
                  background: '#E74C3C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
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

export default DoctorModalTest
