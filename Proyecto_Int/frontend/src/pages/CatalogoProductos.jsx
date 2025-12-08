import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import './CatalogoProductos.css'

const CatalogoProductos = () => {
  const navigate = useNavigate()
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [feedbackBtn, setFeedbackBtn] = useState(null)
  
  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todas')
  const [selectedTipo, setSelectedTipo] = useState('todos')
  const [sortBy, setSortBy] = useState('nombre-asc')
  const [viewMode, setViewMode] = useState('grid') // grid o list

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setLoading(true)
        const { data, error: err } = await supabase
          .from('producto')
          .select('*')
        
        if (err) throw err
        setProductos(data || [])
      } catch (err) {
        console.error('Error cargando productos:', err)
        setError('No se pudieron cargar los productos')
      } finally {
        setLoading(false)
      }
    }

    cargarProductos()
  }, [])

  // Obtener categorías únicas
  const categorias = useMemo(() => {
    const cats = [...new Set(productos.map(p => p.categoria).filter(Boolean))]
    return ['todas', ...cats]
  }, [productos])

  // Obtener tipos únicos
  const tipos = useMemo(() => {
    const tps = [...new Set(productos.map(p => p.tipo).filter(Boolean))]
    return ['todos', ...tps]
  }, [productos])

  // Filtrar y ordenar productos
  const productosFiltrados = useMemo(() => {
    let resultado = [...productos]

    // Búsqueda por nombre
    if (searchTerm) {
      resultado = resultado.filter(p =>
        p.nombre_producto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por categoría
    if (selectedCategory !== 'todas') {
      resultado = resultado.filter(p => p.categoria === selectedCategory)
    }

    // Filtrar por tipo
    if (selectedTipo !== 'todos') {
      resultado = resultado.filter(p => p.tipo === selectedTipo)
    }

    // Ordenar
    switch (sortBy) {
      case 'nombre-asc':
        resultado.sort((a, b) => a.nombre_producto?.localeCompare(b.nombre_producto))
        break
      case 'nombre-desc':
        resultado.sort((a, b) => b.nombre_producto?.localeCompare(a.nombre_producto))
        break
      case 'precio-asc':
        resultado.sort((a, b) => (a.precio || 0) - (b.precio || 0))
        break
      case 'precio-desc':
        resultado.sort((a, b) => (b.precio || 0) - (a.precio || 0))
        break
      default:
        break
    }

    return resultado
  }, [productos, searchTerm, selectedCategory, selectedTipo, sortBy])

  const handleAgregarAlCarrito = async (producto) => {
    try {
      // Obtener usuario autenticado
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        navigate('/iniciar-sesion')
        return
      }

      // Obtener cliente
      const { data: clienteData } = await supabase
        .from('cliente')
        .select('ci_cliente')
        .eq('user_id', user.id)
        .single()

      if (!clienteData) {
        alert('No se encontró información del cliente')
        return
      }

      // Verificar si existe carrito activo
      let { data: carritoData } = await supabase
        .from('carrito')
        .select('id_carrito')
        .eq('ci_cliente', clienteData.ci_cliente)
        .eq('estado', 'activo')
        .single()

      // Si no existe, crear uno
      if (!carritoData) {
        const { data: nuevoCarrito, error: carritoError } = await supabase
          .from('carrito')
          .insert([{
            ci_cliente: clienteData.ci_cliente,
            fecha_creacion: new Date().toISOString(),
            estado: 'activo',
            total: 0
          }])
          .select()

        if (carritoError) throw carritoError
        carritoData = nuevoCarrito[0]
      }

      // Verificar si el producto ya existe en el carrito
      const { data: detalleExistente } = await supabase
        .from('detalle_carrito')
        .select('*')
        .eq('id_carrito', carritoData.id_carrito)
        .eq('id_producto', producto.id_producto)
        .single()

      if (detalleExistente) {
        // Actualizar cantidad (subtotal se calcula automáticamente en la BD)
        const nuevaCantidad = detalleExistente.cantidad + 1

        await supabase
          .from('detalle_carrito')
          .update({
            cantidad: nuevaCantidad
          })
          .eq('id_detalle_carrito', detalleExistente.id_detalle_carrito)
      } else {
        // Agregar nuevo item (subtotal se calcula automáticamente en la BD)
        const { error: detalleError } = await supabase
          .from('detalle_carrito')
          .insert([{
            id_carrito: carritoData.id_carrito,
            id_producto: producto.id_producto,
            cantidad: 1,
            precio_unitario: producto.precio
          }])

        if (detalleError) throw detalleError
      }

      // Actualizar total del carrito
      const { data: detalles } = await supabase
        .from('detalle_carrito')
        .select('subtotal')
        .eq('id_carrito', carritoData.id_carrito)

      const total = detalles.reduce((sum, d) => sum + parseFloat(d.subtotal), 0)

      await supabase
        .from('carrito')
        .update({ total })
        .eq('id_carrito', carritoData.id_carrito)

      // Mostrar feedback visual
      setFeedbackBtn(producto.id_producto)
      setTimeout(() => setFeedbackBtn(null), 1500)
      
      alert('✓ Producto agregado al carrito')
    } catch (error) {
      console.error('Error al agregar al carrito:', error)
      alert('Error al agregar al carrito: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="catalogo-page">
        <div className="loading-spinner">Cargando productos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="catalogo-page">
        <div className="error-message">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="catalogo-page">
      <div className="page-header">
        <h1>🛍️ Catálogo de Productos</h1>
        <p className="subtitle">Encuentra todo lo que necesitas para tu mascota</p>
        <div className="results-count">
          {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''} encontrado{productosFiltrados.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-row">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categorias.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'todas' ? '📁 Todas las categorías' : `📁 ${cat}`}
              </option>
            ))}
          </select>

          <select
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value)}
            className="filter-select"
          >
            {tipos.map(tipo => (
              <option key={tipo} value={tipo}>
                {tipo === 'todos' ? '🏷️ Todos los tipos' : `🏷️ ${tipo}`}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="nombre-asc">⬆️ Nombre A-Z</option>
            <option value="nombre-desc">⬇️ Nombre Z-A</option>
            <option value="precio-asc">💰 Precio Menor</option>
            <option value="precio-desc">💰 Precio Mayor</option>
          </select>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Vista en cuadrícula"
            >
              ▦
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Vista en lista"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Productos */}
      {productosFiltrados.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No se encontraron productos</h3>
          <p>Intenta cambiar los filtros de búsqueda</p>
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('todas')
              setSelectedTipo('todos')
            }}
            className="btn-reset"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className={`catalogo-grid ${viewMode}`}>
          {productosFiltrados.map((producto, index) => {
            const isFeedback = feedbackBtn === producto.id_producto
            const precioFormateado = new Intl.NumberFormat('es-UY', { 
              style: 'currency', 
              currency: 'UYU' 
            }).format(producto.precio || 0)
            
            return (
              <article 
                key={producto.id_producto} 
                className="product-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="product-img">
                  {producto.imagen ? (
                    <img src={producto.imagen} alt={producto.nombre_producto} />
                  ) : (
                    <div className="img-placeholder">📦</div>
                  )}
                  {producto.marca && <span className="product-badge">{producto.marca}</span>}
                </div>
                <div className="product-body">
                  <div className="product-tags">
                    <span className="categoria-badge">{producto.categoria}</span>
                    {producto.tipo && <span className="tipo-badge">{producto.tipo}</span>}
                  </div>
                  <h3>{producto.nombre_producto}</h3>
                  {producto.descripcion && (
                    <p className="descripcion">
                      {producto.descripcion.substring(0, 100)}
                      {producto.descripcion.length > 100 ? '...' : ''}
                    </p>
                  )}
                  <div className="product-footer">
                    <span className="price">{precioFormateado}</span>
                    <button 
                      className={`btn-add-cart ${isFeedback ? 'added' : ''}`}
                      onClick={() => handleAgregarAlCarrito(producto)}
                    >
                      {isFeedback ? '✓ Agregado' : '🛒 Agregar'}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CatalogoProductos
