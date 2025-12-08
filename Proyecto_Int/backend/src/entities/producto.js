class Producto {
  constructor({
    id_producto,
    nombre_producto,
    categoria,
    precio,
    descripcion,
    marca,
    imagen,
    fecha_vencimiento,
    lote,
    tipo,
    id_proveedor,
    id_catalogo
  } = {}) {
    this.id_producto = id_producto || null
    this.nombre_producto = nombre_producto || ''
    this.categoria = categoria || ''
    this.precio = (precio === undefined) ? null : precio
    this.descripcion = descripcion || ''
    this.marca = marca || ''
    this.imagen = imagen || null
    this.fecha_vencimiento = fecha_vencimiento || null
    this.lote = lote || ''
    this.tipo = tipo || ''
    this.id_proveedor = id_proveedor || null
    this.id_catalogo = id_catalogo || null
  }

  validate() {
    const errors = []
    if (!this.nombre_producto) errors.push('nombre_producto es requerido')
    if (this.precio == null || isNaN(this.precio)) errors.push('precio inválido')
    return errors
  }
}

module.exports = Producto
