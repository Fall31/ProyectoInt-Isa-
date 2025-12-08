class Vacuna {
  constructor({
    id_vacuna,
    nombre_vacuna,
    fecha_aplicacion,
    fecha_proxima,
    id_historial,
    id_producto,
    foto_url
  } = {}) {
    this.id_vacuna = id_vacuna || null
    this.nombre_vacuna = nombre_vacuna || ''
    this.fecha_aplicacion = fecha_aplicacion || null
    this.fecha_proxima = fecha_proxima || null
    this.id_historial = id_historial || null
    this.id_producto = id_producto || null
    this.foto_url = foto_url || null
  }

  validate() {
    const errors = []
    if (!this.nombre_vacuna) errors.push('nombre_vacuna es requerido')
    if (!this.fecha_aplicacion) errors.push('fecha_aplicacion es requerido')
    return errors
  }
}

module.exports = Vacuna
