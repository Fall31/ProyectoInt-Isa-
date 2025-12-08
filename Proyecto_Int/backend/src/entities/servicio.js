class Servicio {
  constructor({
    id_servicio,
    nombre_servicio,
    precio_base,
    descripcion,
    duracion,
    estado_servicio,
    categoria,
    requiere_equipo,
    foto_url
  } = {}) {
    this.id_servicio = id_servicio || null
    this.nombre_servicio = nombre_servicio || ''
    this.precio_base = (precio_base === undefined) ? null : precio_base
    this.descripcion = descripcion || ''
    this.duracion = duracion || null
    this.estado_servicio = estado_servicio || 'activo'
    this.categoria = categoria || ''
    this.requiere_equipo = requiere_equipo || false
    this.foto_url = foto_url || null
  }

  validate() {
    const errors = []
    if (!this.nombre_servicio) errors.push('nombre_servicio es requerido')
    if (this.precio_base == null || isNaN(this.precio_base)) errors.push('precio_base inválido')
    return errors
  }
}

module.exports = Servicio
