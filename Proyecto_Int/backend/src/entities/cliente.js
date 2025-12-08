class Cliente {
  constructor({
    ci_cliente,
    nombre_cliente,
    primer_apellido,
    segundo_apellido,
    correo_cliente,
    telefono_cliente,
    direccion,
    genero,
    nit,
    user_id,
    perfil_completo,
    foto_url,
    fecha_registro,
    contrasenia,
    salt
  } = {}) {
    this.ci_cliente = ci_cliente || null
    this.nombre_cliente = nombre_cliente || ''
    this.primer_apellido = primer_apellido || ''
    this.segundo_apellido = segundo_apellido || null
    this.correo_cliente = correo_cliente || ''
    this.telefono_cliente = telefono_cliente || ''
    this.direccion = direccion || ''
    this.genero = genero || ''
    this.nit = nit || ''
    this.user_id = user_id || null
    this.perfil_completo = perfil_completo !== undefined ? perfil_completo : false
    this.foto_url = foto_url || null
    this.fecha_registro = fecha_registro || new Date().toISOString().split('T')[0]
    this.contrasenia = contrasenia || null
    this.salt = salt || null
  }

  validate() {
    const errors = []
    if (!this.nombre_cliente) errors.push('nombre_cliente es requerido')
    if (!this.correo_cliente) errors.push('correo_cliente es requerido')
    return errors
  }
}

module.exports = Cliente
