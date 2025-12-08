class Personal {
  constructor({
    ci_personal,
    nombre_personal,
    primer_apellido,
    direccion,
    estado,
    correo_personal,
    genero_personal,
    titulo_universitario,
    fecha_nacimiento,
    contrasenia,
    salt,
    telefono_personal,
    descripcion,
    imagen,
    id_cargo,
    user_id,
    perfil_completo
  } = {}) {
    this.ci_personal = ci_personal || null
    this.nombre_personal = nombre_personal || ''
    this.primer_apellido = primer_apellido || ''
    this.direccion = direccion || ''
    this.estado = estado || 'activo'
    this.correo_personal = correo_personal || ''
    this.genero_personal = genero_personal || ''
    this.titulo_universitario = titulo_universitario || ''
    this.fecha_nacimiento = fecha_nacimiento || null
    this.contrasenia = contrasenia || ''
    this.salt = salt || ''
    this.telefono_personal = telefono_personal || ''
    this.descripcion = descripcion || ''
    this.imagen = imagen || null
    this.id_cargo = id_cargo || null
    this.user_id = user_id || null
    this.perfil_completo = perfil_completo !== undefined ? perfil_completo : false
  }

  validate() {
    const errors = []
    if (!this.nombre_personal) errors.push('nombre_personal es requerido')
    if (!this.correo_personal) errors.push('correo_personal es requerido')
    return errors
  }
}

module.exports = Personal
