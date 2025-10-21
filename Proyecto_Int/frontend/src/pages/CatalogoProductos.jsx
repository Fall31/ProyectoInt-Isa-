import React, { useEffect, useState } from 'react'
import { productosAPI, carritoAPI } from '../lib/api'
import { supabase } from '../lib/supabaseClient'
import './CatalogoProductos.css'

const CatalogoProductos = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Obtener usuario actual
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // Cargar productos desde API
    const loadProductos = async () => {
      try {
        const data = await productosAPI.getAll()
        setProductos(data.productos || [])
      } catch (error) {
        console.error('Error cargando productos:', error)
        // Fallback a datos estáticos si API falla
        setProductos([
          { id_producto: 1, nombre_producto: 'Comida Premium', precio: 25.00, categoria: 'Alimento', imagen: '' },
          { id_producto: 2, nombre_producto: 'Antipulgas', precio: 10.00, categoria: 'Salud', imagen: '' },
          { id_producto: 3, nombre_producto: 'Juguete', precio: 7.50, categoria: 'Accesorios', imagen: '' },
        ])
      } finally {
        setLoading(false)
      }
    }
    loadProductos()
  }, [])

  const agregarAlCarrito = async (producto) => {
    try {
      // Agregar a localStorage para usuarios no autenticados
      const carrito = JSON.parse(localStorage.getItem('carrito') || '[]')
      const existingIndex = carrito.findIndex(item => item.id_producto === producto.id_producto)
      
      if (existingIndex >= 0) {
        carrito[existingIndex].cantidad += 1
      } else {
        carrito.push({
          id_producto: producto.id_producto,
          nombre: producto.nombre_producto,
          precio: producto.precio,
          cantidad: 1
        })
      }
      localStorage.setItem('carrito', JSON.stringify(carrito))

      // Si hay usuario autenticado, también agregar a la DB
      if (user) {
        await carritoAPI.agregar(user.id, producto.id_producto, 1)
      }

      // Mostrar feedback visual
      const button = event.target
      const originalText = button.textContent
      button.textContent = '✓ Agregado'
      button.style.backgroundColor = 'var(--success-color)'
      setTimeout(() => {
        button.textContent = originalText
        button.style.backgroundColor = 'var(--mid-blue)'
      }, 1500)

    } catch (error) {
      console.error('Error agregando al carrito:', error)
      alert('Error al agregar al carrito')
    }
  }

  if (loading) {
    return (
      <div className="catalogo-page">
        <div className="loading-spinner">Cargando productos...</div>
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
        {productos.map(p => (
          <article key={p.id_producto} className="product-card">
            <div className="product-img">
              {p.imagen ? (
                <img src={p.imagen} alt={p.nombre_producto} />
              ) : (
                <div className="img-placeholder">📦</div>
              )}
            </div>
            <div className="product-body">
              <h3>{p.nombre_producto}</h3>
              <p className="categoria">{p.categoria}</p>
              {p.descripcion && <p className="descripcion">{p.descripcion}</p>}
              <div className="product-footer">
                <span className="price">${p.precio.toFixed(2)}</span>
                <button 
                  className="btn-primary" 
                  onClick={() => agregarAlCarrito(p)}
                >
                  Agregar
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default CatalogoProductos
