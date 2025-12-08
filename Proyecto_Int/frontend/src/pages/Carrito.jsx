import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import './Carrito.css'

const Carrito = () => {
  const navigate = useNavigate()
  const [carrito, setCarrito] = useState(null)
  const [detalles, setDetalles] = useState([])
  const [loading, setLoading] = useState(true)
  const [cliente, setCliente] = useState(null)
  const [showPagoModal, setShowPagoModal] = useState(false)
  const [metodoPago, setMetodoPago] = useState('tarjeta')

  useEffect(() => {
    cargarCarrito()
  }, [])

  const cargarCarrito = async () => {
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
        // Obtener carrito activo
        const { data: carritoData } = await supabase
          .from('carrito')
          .select('*')
          .eq('ci_cliente', clienteData.ci_cliente)
          .eq('estado', 'activo')
          .single()

        if (carritoData) {
          setCarrito(carritoData)

          // Obtener detalles del carrito
          const { data: detallesData } = await supabase
            .from('detalle_carrito')
            .select(`
              *,
              producto(id_producto, nombre_producto, precio, imagen)
            `)
            .eq('id_carrito', carritoData.id_carrito)

          setDetalles(detallesData || [])
        }
      }

      setLoading(false)
    } catch (err) {
      console.error('Error cargando carrito:', err)
      setLoading(false)
    }
  }

  const eliminarDelCarrito = async (id_detalle_carrito) => {
    try {
      const { error } = await supabase
        .from('detalle_carrito')
        .delete()
        .eq('id_detalle_carrito', id_detalle_carrito)

      if (error) throw error

      // Actualizar total del carrito
      await actualizarTotalCarrito()
      cargarCarrito()
    } catch (err) {
      console.error('Error eliminando del carrito:', err)
      alert('Error al eliminar: ' + err.message)
    }
  }

  const actualizarCantidad = async (id_detalle_carrito, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      await eliminarDelCarrito(id_detalle_carrito)
      return
    }

    try {
      // subtotal se calcula automáticamente en la BD
      const { error } = await supabase
        .from('detalle_carrito')
        .update({
          cantidad: nuevaCantidad
        })
        .eq('id_detalle_carrito', id_detalle_carrito)

      if (error) throw error

      await actualizarTotalCarrito()
      cargarCarrito()
    } catch (err) {
      console.error('Error actualizando cantidad:', err)
      alert('Error: ' + err.message)
    }
  }

  const actualizarTotalCarrito = async () => {
    if (!carrito) return

    try {
      const { data: detallesData } = await supabase
        .from('detalle_carrito')
        .select('subtotal')
        .eq('id_carrito', carrito.id_carrito)

      const total = detallesData.reduce((sum, d) => sum + parseFloat(d.subtotal), 0)

      await supabase
        .from('carrito')
        .update({ total })
        .eq('id_carrito', carrito.id_carrito)
    } catch (err) {
      console.error('Error actualizando total:', err)
    }
  }

  const vaciarCarrito = async () => {
    if (!window.confirm('¿Seguro que deseas vaciar el carrito?')) return

    try {
      await supabase
        .from('detalle_carrito')
        .delete()
        .eq('id_carrito', carrito.id_carrito)

      await supabase
        .from('carrito')
        .update({ total: 0 })
        .eq('id_carrito', carrito.id_carrito)

      cargarCarrito()
      alert('Carrito vaciado')
    } catch (err) {
      console.error('Error vaciando carrito:', err)
      alert('Error: ' + err.message)
    }
  }

  const procesarPago = async () => {
    if (!carrito || !cliente) {
      alert('Error: carrito o cliente no encontrado')
      return
    }

    // Validar que el perfil esté completo
    if (!cliente.ci_cliente || cliente.ci_cliente.trim() === '') {
      alert('Por favor, completa tu CI en tu perfil antes de hacer compras')
      navigate('/perfil')
      return
    }

    if (!cliente.telefono_cliente || cliente.telefono_cliente.trim() === '') {
      alert('Por favor, completa tu teléfono en tu perfil antes de hacer compras')
      navigate('/perfil')
      return
    }

    try {
      // Crear factura
      const { data: facturaData, error: facturaError } = await supabase
        .from('factura')
        .insert([{
          fecha_emision: new Date().toISOString().split('T')[0],
          ci_cliente: cliente.ci_cliente,
          fecha_caducidad: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          metodo_pago: metodoPago,
          total_factura: carrito.total,
          estado_factura: 'pagada'
        }])
        .select()

      if (facturaError) throw facturaError

      const id_factura = facturaData[0].id_factura

      // Crear detalles de factura desde el carrito
      // Nota: subtotal se calcula automáticamente en la BD
      const detalles_factura = detalles.map(d => ({
        id_factura,
        id_producto: d.id_producto,
        id_servicio: null,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
        fecha: new Date().toISOString().split('T')[0],
        tipo: 'producto'
      }))

      const { error: detalleError } = await supabase
        .from('detalle_factura')
        .insert(detalles_factura)

      if (detalleError) throw detalleError

      // Marcar carrito como completado
      await supabase
        .from('carrito')
        .update({ estado: 'completado' })
        .eq('id_carrito', carrito.id_carrito)

      alert('✅ Pago procesado exitosamente. Factura #' + id_factura)
      setShowPagoModal(false)
      navigate(`/factura/${id_factura}`)
    } catch (err) {
      console.error('Error procesando pago:', err)
      alert('Error al procesar el pago: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="carrito-page">
        <div className="loading">Cargando carrito...</div>
      </div>
    )
  }

  if (!carrito || detalles.length === 0) {
    return (
      <div className="carrito-page">
        <div className="empty-carrito">
          <div className="empty-icon">🛒</div>
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos para comenzar a comprar</p>
          <button className="btn-primary" onClick={() => navigate('/catalogo-productos')}>
            Ver Productos
          </button>
        </div>
      </div>
    )
  }

  const total = carrito.total || 0

  return (
    <div className="carrito-page">
      <div className="carrito-header">
        <h1>🛒 Mi Carrito</h1>
        <p className="subtitle">{detalles.length} producto(s)</p>
      </div>

      <div className="carrito-container">
        <div className="carrito-items">
          {detalles.map((detalle) => (
            <div key={detalle.id_detalle_carrito} className="carrito-item">
              {detalle.producto?.imagen && (
                <div className="item-imagen">
                  <img src={detalle.producto.imagen} alt={detalle.producto.nombre_producto} />
                </div>
              )}
              
              <div className="item-info">
                <h3>{detalle.producto?.nombre_producto || 'Producto'}</h3>
                <p className="precio">Bs. {parseFloat(detalle.precio_unitario).toFixed(2)}</p>
              </div>

              <div className="item-cantidad">
                <button 
                  className="btn-qty"
                  onClick={() => actualizarCantidad(detalle.id_detalle_carrito, detalle.cantidad - 1)}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={detalle.cantidad}
                  onChange={(e) => actualizarCantidad(detalle.id_detalle_carrito, parseInt(e.target.value))}
                  min="1"
                />
                <button 
                  className="btn-qty"
                  onClick={() => actualizarCantidad(detalle.id_detalle_carrito, detalle.cantidad + 1)}
                >
                  +
                </button>
              </div>

              <div className="item-subtotal">
                <p>Bs. {parseFloat(detalle.subtotal).toFixed(2)}</p>
              </div>

              <button 
                className="btn-remove"
                onClick={() => eliminarDelCarrito(detalle.id_detalle_carrito)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="carrito-resumen">
          <div className="resumen-header">
            <h2>Resumen</h2>
          </div>

          <div className="resumen-row">
            <span>Subtotal:</span>
            <span>Bs. {total.toFixed(2)}</span>
          </div>

          <div className="resumen-row">
            <span>Impuestos:</span>
            <span>Bs. 0.00</span>
          </div>

          <div className="resumen-row total">
            <span>Total:</span>
            <span>Bs. {total.toFixed(2)}</span>
          </div>

          <div className="carrito-acciones">
            <button 
              className="btn-pagar"
              onClick={() => setShowPagoModal(true)}
            >
              💳 Proceder al Pago
            </button>
            <button 
              className="btn-vaciar"
              onClick={vaciarCarrito}
            >
              🗑️ Vaciar Carrito
            </button>
            <button 
              className="btn-continuar"
              onClick={() => navigate('/catalogo-productos')}
            >
              Continuar Comprando
            </button>
            <button 
              className="btn-historial"
              onClick={() => navigate('/historial-facturas')}
            >
              📋 Ver Mis Compras
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Pago */}
      {showPagoModal && (
        <div className="modal-overlay" onClick={() => setShowPagoModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Selecciona Método de Pago</h2>
              <button className="btn-close" onClick={() => setShowPagoModal(false)}>✕</button>
            </div>

            <div className="pago-form">
              <div className="pago-monto">
                <p>Monto a Pagar:</p>
                <h3>Bs. {total.toFixed(2)}</h3>
              </div>

              <div className="metodos-pago">
                <label className="metodo">
                  <input 
                    type="radio" 
                    value="tarjeta" 
                    checked={metodoPago === 'tarjeta'}
                    onChange={(e) => setMetodoPago(e.target.value)}
                  />
                  <span>💳 Tarjeta de Crédito/Débito</span>
                </label>

                <label className="metodo">
                  <input 
                    type="radio" 
                    value="qr" 
                    checked={metodoPago === 'qr'}
                    onChange={(e) => setMetodoPago(e.target.value)}
                  />
                  <span>📱 Pago por QR</span>
                </label>

                <label className="metodo">
                  <input 
                    type="radio" 
                    value="transferencia" 
                    checked={metodoPago === 'transferencia'}
                    onChange={(e) => setMetodoPago(e.target.value)}
                  />
                  <span>🏦 Transferencia Bancaria</span>
                </label>
              </div>

              {metodoPago === 'qr' && (
                <div className="qr-info">
                  <p>📱 Escanea el código QR con tu app bancaria:</p>
                  <div className="qr-placeholder">
                    [Código QR aquí - Bs. {total.toFixed(2)}]
                  </div>
                </div>
              )}

              {metodoPago === 'tarjeta' && (
                <div className="tarjeta-info">
                  <p>💳 Ingresa los datos de tu tarjeta:</p>
                  <input type="text" placeholder="Número de tarjeta" />
                  <input type="text" placeholder="Nombre en tarjeta" />
                  <div className="tarjeta-row">
                    <input type="text" placeholder="MM/AA" />
                    <input type="text" placeholder="CVV" />
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowPagoModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-primary"
                  onClick={procesarPago}
                >
                  Confirmar Pago
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Carrito
