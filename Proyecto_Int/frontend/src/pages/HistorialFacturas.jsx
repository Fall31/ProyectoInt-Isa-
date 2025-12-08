import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import './HistorialFacturas.css'

const HistorialFacturas = () => {
  const navigate = useNavigate()
  const [facturas, setFacturas] = useState([])
  const [cliente, setCliente] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todas')

  const cargarFacturas = useCallback(async () => {
    try {
      setLoading(true)

      // Obtener usuario autenticado
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        navigate('/iniciar-sesion')
        return
      }

      // Obtener cliente
      const { data: clienteData } = await supabase
        .from('cliente')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setCliente(clienteData)

      if (clienteData) {
        // Obtener todas las facturas del cliente
        const { data: facturasData, error } = await supabase
          .from('factura')
          .select('*')
          .eq('ci_cliente', clienteData.ci_cliente)
          .order('fecha_emision', { ascending: false })

        if (error) throw error
        setFacturas(facturasData || [])
      }

      setLoading(false)
    } catch (err) {
      console.error('Error cargando facturas:', err)
      alert('Error: ' + err.message)
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    cargarFacturas()
  }, [cargarFacturas])

  const facturasFiltradasS = filtro === 'todas' 
    ? facturas 
    : facturas.filter(f => f.estado_factura === filtro)

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatearMetodo = (metodo) => {
    const formatos = {
      tarjeta: '💳 Tarjeta',
      qr: '📱 QR',
      transferencia: '🏦 Transferencia'
    }
    return formatos[metodo] || metodo
  }

  if (loading) {
    return (
      <div className="historial-page">
        <div className="loading">Cargando historial...</div>
      </div>
    )
  }

  return (
    <div className="historial-page">
      <div className="historial-header">
        <h1>📋 Historial de Facturas</h1>
        {cliente && (
          <p className="cliente-info">
            Cliente: <strong>{cliente.nombre_cliente} {cliente.primer_apellido}</strong>
          </p>
        )}
      </div>

      {/* Filtros */}
      <div className="filtros-facturas">
        <button
          className={`filtro-btn ${filtro === 'todas' ? 'activo' : ''}`}
          onClick={() => setFiltro('todas')}
        >
          ✅ Todas ({facturas.length})
        </button>
        <button
          className={`filtro-btn ${filtro === 'pagada' ? 'activo' : ''}`}
          onClick={() => setFiltro('pagada')}
        >
          💰 Pagadas ({facturas.filter(f => f.estado_factura === 'pagada').length})
        </button>
        <button
          className={`filtro-btn ${filtro === 'pendiente' ? 'activo' : ''}`}
          onClick={() => setFiltro('pendiente')}
        >
          ⏳ Pendientes ({facturas.filter(f => f.estado_factura === 'pendiente').length})
        </button>
      </div>

      {/* Lista de Facturas */}
      {facturasFiltradasS.length === 0 ? (
        <div className="empty-facturas">
          <div className="empty-icon">📭</div>
          <h3>No hay facturas</h3>
          <p>
            {filtro === 'todas' 
              ? 'Aún no has realizado compras' 
              : `No hay facturas ${filtro}`}
          </p>
          <button 
            className="btn-comprar"
            onClick={() => navigate('/catalogo-productos')}
          >
            Ir a Comprar
          </button>
        </div>
      ) : (
        <div className="facturas-grid">
          {facturasFiltradasS.map((factura) => (
            <div key={factura.id_factura} className="factura-card">
              <div className="card-header">
                <h3>Factura #{factura.id_factura}</h3>
                <span className={`estado ${factura.estado_factura}`}>
                  {factura.estado_factura === 'pagada' ? '✅ Pagada' : '⏳ Pendiente'}
                </span>
              </div>

              <div className="card-info">
                <div className="info-row">
                  <span className="label">Fecha:</span>
                  <span className="valor">{formatearFecha(factura.fecha_emision)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Método:</span>
                  <span className="valor">{formatearMetodo(factura.metodo_pago)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Total:</span>
                  <span className="valor total">Bs. {parseFloat(factura.total_factura).toFixed(2)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Vencimiento:</span>
                  <span className="valor">{formatearFecha(factura.fecha_caducidad)}</span>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="btn-ver"
                  onClick={() => navigate(`/factura/${factura.id_factura}`)}
                >
                  👁️ Ver Detalles
                </button>
                <button
                  className="btn-descargar"
                  onClick={() => {
                    navigate(`/factura/${factura.id_factura}?print=1`)
                  }}
                >
                  📥 Descargar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="historial-footer">
        <button 
          className="btn-volver"
          onClick={() => navigate('/dashboard')}
        >
          ← Volver al Dashboard
        </button>
      </div>
    </div>
  )
}

export default HistorialFacturas
