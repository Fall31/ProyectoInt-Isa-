import React, { useState } from 'react'
import { useProductos, useCarrito } from '@/hooks'
import { Producto } from '@/domain'
import './CatalogoProductos.css'

const CatalogoProductos = () => {
  const { productos, loading, error } = useProductos()
  const { agregarProducto, loading: addingToCart } = useCarrito()
  const [feedbackBtn, setFeedbackBtn] = useState(null)

  const handleAgregarAlCarrito = async (producto, event) => {
    const result = await agregarProducto(producto, 1)
    
    if (result.success) {
      // Mostrar feedback visual
      const button = event.currentTarget
      setFeedbackBtn(producto.id_producto)
      setTimeout(() => setFeedbackBtn(null), 1500)
    } else {
      alert('Error al agregar al carrito: ' + result.error)
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
        <h1>Catálogo de Productos</h1>
        <p className="subtitle">Encuentra todo lo que necesitas para tu mascota</p>
      </div>
      
      <div className="catalogo-grid">
        {productos.map(p => {
          const producto = p instanceof Producto ? p : Producto.fromAPI(p)
          const isFeedback = feedbackBtn === producto.id_producto
          
          return (
            <article key={producto.id_producto} className="product-card">
              <div className="product-img">
                {producto.imagen ? (
                  <img src={producto.imagen} alt={producto.nombre_producto} />
                ) : (
                  <div className="img-placeholder">📦</div>
                )}
              </div>
              <div className="product-body">
                <h3>{producto.nombre_producto}</h3>
                <p className="categoria">{producto.categoria}</p>
                {producto.descripcion && <p className="descripcion">{producto.descripcion}</p>}
                <div className="product-footer">
                  <span className="price">{producto.precioFormateado}</span>
                  <button 
                    className="btn-primary" 
                    onClick={(e) => handleAgregarAlCarrito(producto, e)}
                    disabled={addingToCart}
                    style={{
                      backgroundColor: isFeedback ? 'var(--success-color)' : undefined
                    }}
                  >
                    {isFeedback ? '✓ Agregado' : 'Agregar'}
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

export default CatalogoProductos
