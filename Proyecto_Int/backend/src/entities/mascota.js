class Mascota {
  constructor({
    ci_mascota,
    nombre_mascota,
    raza,
    peso,
    edad,
    genero_mascota,
    especie,
    ci_cliente,
    imagen,
    alergias
  } = {}) {
    this.ci_mascota = ci_mascota || null
    this.nombre_mascota = nombre_mascota || ''
    this.raza = raza || ''
    this.peso = peso || null
    this.edad = edad || null
    this.genero_mascota = genero_mascota || ''
    this.especie = especie || ''
    this.ci_cliente = ci_cliente || null
    this.imagen = imagen || null
    this.alergias = alergias || ''
  }

  validate() {
    const errors = []
    if (!this.nombre_mascota) errors.push('nombre_mascota es requerido')
    if (!this.ci_cliente) errors.push('ci_cliente es requerido')
    if (!this.especie) errors.push('especie es requerido')
    return errors
  }
}

module.exports = Mascota
