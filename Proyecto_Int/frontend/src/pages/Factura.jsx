import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import './Factura.css'

const Factura = () => {
  const navigate = useNavigate()
  const { id_factura } = useParams()
  const [searchParams] = useSearchParams()
  const [factura, setFactura] = useState(null)
  const [detalles, setDetalles] = useState([])
  const [cliente, setCliente] = useState(null)
  const [loading, setLoading] = useState(true)

  const cargarFactura = useCallback(async () => {
    try {
      setLoading(true)

      // Cargar factura
      const { data: facturaData, error: facturaError } = await supabase
        .from('factura')
        .select('*')
        .eq('id_factura', id_factura)
        .single()

      if (facturaError) throw facturaError
      setFactura(facturaData)

      // Cargar cliente
      const { data: clienteData } = await supabase
        .from('cliente')
        .select('ci_cliente, nombre_cliente, primer_apellido, segundo_apellido, correo_cliente, telefono_cliente, direccion')
        .eq('ci_cliente', facturaData.ci_cliente)
        .single()

      setCliente(clienteData)

      // Cargar detalles de la factura (sin depender de relaciones implícitas)
      const { data: detallesRows, error: detallesError } = await supabase
        .from('detalle_factura')
        .select('*')
        .eq('id_factura', id_factura)

      if (detallesError) {
        console.error('Error detalles:', detallesError)
      }

      const detallesBase = detallesRows || []

      // Preparar consultas en bloque para productos y servicios
      const prodIds = [...new Set(detallesBase.filter(d => d.id_producto && (d.tipo === 'producto' || !d.tipo)).map(d => d.id_producto))]
      const servIds = [...new Set(detallesBase.filter(d => d.id_servicio && (d.tipo === 'servicio')).map(d => d.id_servicio))]

      let productosMap = {}
      let serviciosMap = {}

      if (prodIds.length > 0) {
        const { data: prods } = await supabase
          .from('producto')
          .select('id_producto, nombre_producto, precio, imagen')
          .in('id_producto', prodIds)
        productosMap = Object.fromEntries((prods || []).map(p => [p.id_producto, p]))
      }

      if (servIds.length > 0) {
        const { data: servs } = await supabase
          .from('servicio')
          .select('id_servicio, nombre_servicio, precio_base, foto_url')
          .in('id_servicio', servIds)
        serviciosMap = Object.fromEntries((servs || []).map(s => [s.id_servicio, s]))
      }

      const detallesEnriquecidos = detallesBase.map(d => {
        const tipo = d.tipo || (d.id_producto ? 'producto' : (d.id_servicio ? 'servicio' : 'otro'))
        const producto = d.id_producto ? productosMap[d.id_producto] : null
        const servicio = d.id_servicio ? serviciosMap[d.id_servicio] : null
        const precio_unit = d.precio_unitario ?? (tipo === 'producto' ? producto?.precio : servicio?.precio_base)
        const subtotal = d.subtotal ?? (Number(d.cantidad || 0) * Number(precio_unit || 0))
        return {
          ...d,
          tipo,
          producto,
          servicio,
          precio_unitario: precio_unit,
          subtotal
        }
      })

      setDetalles(detallesEnriquecidos)
      setLoading(false)
    } catch (err) {
      console.error('Error cargando factura:', err)
      alert('Error: ' + err.message)
      setLoading(false)
    }
  }, [id_factura])

  useEffect(() => {
    cargarFactura()
  }, [cargarFactura])

  // Auto-imprimir si se llega con ?print=1 y los datos están listos
  useEffect(() => {
    if (!loading && factura && detalles.length > 0 && searchParams.get('print') === '1') {
      setTimeout(() => window.print(), 300)
    }
  }, [loading, factura, detalles, searchParams])

  const descargarPDF = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="factura-page">
        <div className="loading">Cargando factura...</div>
      </div>
    )
  }

  if (!factura) {
    return (
      <div className="factura-page">
        <div className="error">
          <p>Factura no encontrada</p>
          <button onClick={() => navigate('/carrito')}>Volver al Carrito</button>
        </div>
      </div>
    )
  }

  const total = factura.total_factura || 0

  return (
    <div className="factura-page">
      <div className="factura-container">
        {/* Header */}
        <div className="factura-header">
          <div className="header-content">
            <div className="logo-section">
              <h1>🏥 VetCare</h1>
              <p>Servicios Veterinarios Integrales</p>
            </div>
            <div className="factura-numero">
              <h2>Factura #{factura.id_factura}</h2>
              <p>{factura.estado_factura.toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Información de Factura */}
        <div className="factura-info">
          <div className="info-block">
            <h3>Información de Factura</h3>
            <p><strong>Fecha:</strong> {new Date(factura.fecha_emision).toLocaleDateString('es-ES')}</p>
            <p><strong>Vencimiento:</strong> {new Date(factura.fecha_caducidad).toLocaleDateString('es-ES')}</p>
            <p><strong>Método de Pago:</strong> {formatoMetodoPago(factura.metodo_pago)}</p>
          </div>

          <div className="info-block">
            <h3>Información del Cliente</h3>
            {cliente && (
              <>
                <p><strong>Nombre:</strong> {cliente.nombre_cliente} {cliente.primer_apellido} {cliente.segundo_apellido}</p>
                <p><strong>CI:</strong> {cliente.ci_cliente}</p>
                <p><strong>Correo:</strong> {cliente.correo_cliente}</p>
                <p><strong>Teléfono:</strong> {cliente.telefono_cliente}</p>
                <p><strong>Dirección:</strong> {cliente.direccion}</p>
              </>
            )}
          </div>
        </div>

        {/* Detalles */}
        <div className="factura-items">
          <table className="items-table">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detalles && detalles.length > 0 ? (
                detalles.map((detalle, index) => (
                  <tr key={detalle.id_detallefactura || detalle.id_detalle_factura || index}>
                    <td>
                      {detalle.tipo === 'producto' 
                        ? (detalle.producto?.nombre_producto || '❌ Producto no encontrado')
                        : (detalle.servicio?.nombre_servicio || '❌ Servicio no encontrado')}
                    </td>
                    <td className="capitalize">{detalle.tipo}</td>
                    <td className="center">{detalle.cantidad}</td>
                    <td className="right">Bs. {parseFloat(detalle.precio_unitario || 0).toFixed(2)}</td>
                    <td className="right">Bs. {parseFloat(detalle.subtotal || 0).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                    ⚠️ No hay items en esta factura
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Resumen */}
        <div className="factura-resumen">
          <div className="resumen-row">
            <span>Subtotal:</span>
            <span>Bs. {total.toFixed(2)}</span>
          </div>
          <div className="resumen-row">
            <span>Impuestos (0%):</span>
            <span>Bs. 0.00</span>
          </div>
          <div className="resumen-row total">
            <span>Total:</span>
            <span>Bs. {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Notas */}
        <div className="factura-notas">
          <p>Gracias por su compra. Esta factura es válida por {Math.ceil((new Date(factura.fecha_caducidad) - new Date(factura.fecha_emision)) / (1000 * 60 * 60 * 24))} días.</p>
        </div>
      </div>

      {/* Acciones */}
      <div className="factura-acciones">
        <button className="btn-descargar" onClick={descargarPDF}>
          📥 Descargar PDF
        </button>
        <button className="btn-volver" onClick={() => navigate('/carrito')}>
          ← Volver al Carrito
        </button>
        <button className="btn-seguir" onClick={() => navigate('/dashboard')}>
          → Ir al Dashboard
        </button>
      </div>
    </div>
  )
}

const formatoMetodoPago = (metodo) => {
  const formatos = {
    tarjeta: '💳 Tarjeta de Crédito/Débito',
    qr: '📱 Pago por QR',
    transferencia: '🏦 Transferencia Bancaria'
  }
  return formatos[metodo] || metodo
}

export default Factura
