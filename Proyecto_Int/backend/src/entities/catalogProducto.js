class CatalogProducto {
  constructor({
    id_catalogo,
    categoria,
    descripcion,
    estado,
    foto_url
  } = {}) {
    this.id_catalogo = id_catalogo || null
    this.categoria = categoria || ''
    this.descripcion = descripcion || ''
    this.estado = estado || 'activo'
    this.foto_url = foto_url || null
  }

  validate() {
    const errors = []
    if (!this.categoria) errors.push('categoria es requerido')
    return errors
  }
}

module.exports = CatalogProducto
