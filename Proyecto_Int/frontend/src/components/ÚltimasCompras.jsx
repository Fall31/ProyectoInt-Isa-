import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

const ÚltimasCompras = () => {
  const navigate = useNavigate()
  const [facturas, setFacturas] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pagadas: 0,
    pendientes: 0,
    totalGastado: 0
  })

  useEffect(() => {
    cargarCompras()
  }, [])

  const cargarCompras = async () => {
    try {
      setLoading(true)

      // Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setLoading(false)
        return
      }

      // Obtener cliente
      const { data: clienteData } = await supabase
        .from('cliente')
        .select('ci_cliente')
        .eq('user_id', user.id)
        .single()

      if (clienteData) {
        // Obtener últimas 5 facturas
        const { data: facturasData } = await supabase
          .from('factura')
          .select('*')
          .eq('ci_cliente', clienteData.ci_cliente)
          .order('fecha_emision', { ascending: false })
          .limit(5)

        setFacturas(facturasData || [])

        // Calcular estadísticas
        const totalFacturas = facturasData?.length || 0
        const pagadas = facturasData?.filter(f => f.estado_factura === 'pagada').length || 0
        const pendientes = facturasData?.filter(f => f.estado_factura === 'pendiente').length || 0
        const totalGastado = facturasData?.reduce((sum, f) => sum + parseFloat(f.total_factura || 0), 0) || 0

        setStats({
          total: totalFacturas,
          pagadas,
          pendientes,
          totalGastado: totalGastado.toFixed(2)
        })
      }

      setLoading(false)
    } catch (err) {
      console.error('Error cargando compras:', err)
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>⏳ Cargando compras...</div>
  }

  return (
    <div className="ultimas-compras">
      {/* Estadísticas */}
      <div className="compras-stats">
        <div className="stat-item stat-total">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Compras</div>
        </div>
        <div className="stat-item stat-pagada">
          <div className="stat-number">{stats.pagadas}</div>
          <div className="stat-label">Pagadas</div>
        </div>
        <div className="stat-item stat-pendiente">
          <div className="stat-number">{stats.pendientes}</div>
          <div className="stat-label">Pendientes</div>
        </div>
        <div className="stat-item stat-gasto">
          <div className="stat-number">Bs. {stats.totalGastado}</div>
          <div className="stat-label">Total Gastado</div>
        </div>
      </div>

      {/* Lista de facturas */}
      {facturas.length === 0 ? (
        <div className="empty-compras">
          <p>📭 No tienes compras aún</p>
          <button 
            className="btn-comprar"
            onClick={() => navigate('/catalogo-productos')}
          >
            Ir a Comprar
          </button>
        </div>
      ) : (
        <div className="facturas-list">
          {facturas.map((factura) => (
            <div key={factura.id_factura} className="factura-mini">
              <div className="factura-left">
                <div className="factura-id">#{factura.id_factura}</div>
                <div className="factura-fecha">
                  {new Date(factura.fecha_emision).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>

              <div className="factura-middle">
                <div className="factura-metodo">{factura.metodo_pago}</div>
              </div>

              <div className="factura-right">
                <div className="factura-total">Bs. {parseFloat(factura.total_factura).toFixed(2)}</div>
                <div className={`factura-estado estado-${factura.estado_factura}`}>
                  {factura.estado_factura === 'pagada' ? '✅ Pagada' : '⏳ Pendiente'}
                </div>
              </div>

              <button
                className="btn-factura-mini"
                onClick={() => navigate(`/factura/${factura.id_factura}`)}
                title="Ver factura"
              >
                👁️
              </button>
            </div>
          ))}
        </div>
      )}

      {facturas.length > 0 && (
        <button 
          className="btn-ver-todas"
          onClick={() => navigate('/historial-facturas')}
        >
          📋 Ver todas las compras →
        </button>
      )}
    </div>
  )
}

export default ÚltimasCompras
