import React, { useEffect, useState } from 'react'
import './Carrito.css'

const Carrito = () => {
  const [items, setItems] = useState([])

  useEffect(() => {
    const saved = window.localStorage.getItem('carrito')
    if (saved) setItems(JSON.parse(saved))
  }, [])

  const total = items.reduce((s, it) => s + (it.precio * it.cantidad), 0)

  const clear = () => {
    setItems([])
    window.localStorage.removeItem('carrito')
  }

  return (
    <div className="carrito-page">
      <h1>Carrito</h1>
      {items.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div className="carrito-list">
          {items.map((it, idx) => (
            <div key={idx} className="carrito-item">
              <div>{it.nombre}</div>
              <div>{it.cantidad} x ${it.precio.toFixed(2)}</div>
            </div>
          ))}
          <div className="carrito-total">Total: ${total.toFixed(2)}</div>
          <div className="carrito-actions">
            <button className="btn-primary">Pagar</button>
            <button className="btn-muted" onClick={clear}>Vaciar</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Carrito
