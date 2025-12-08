const crypto = require('crypto')

/**
 * Servicio de encriptación de contraseñas usando PBKDF2
 * Compatible con Node.js sin dependencias externas
 */
class EncriptacionService {
  /**
   * Genera un salt aleatorio (usado para encriptar)
   * @returns {string} Salt en formato hexadecimal
   */
  static generarSalt() {
    return crypto.randomBytes(32).toString('hex')
  }

  /**
   * Encripta una contraseña usando PBKDF2
   * @param {string} contrasenia - Contraseña en texto plano
   * @param {string} salt - Salt para encriptación (si no se proporciona, se genera uno)
   * @returns {object} { contrasenia_encriptada, salt }
   */
  static encriptarContrasenia(contrasenia, salt = null) {
    if (!salt) {
      salt = this.generarSalt()
    }

    // Usar PBKDF2 con SHA-256, 100,000 iteraciones
    const contrasenia_encriptada = crypto
      .pbkdf2Sync(contrasenia, salt, 100000, 64, 'sha256')
      .toString('hex')

    return {
      contrasenia_encriptada,
      salt
    }
  }

  /**
   * Verifica si una contraseña coincide con la encriptada
   * @param {string} contraseniaTextoPlano - Contraseña en texto plano para verificar
   * @param {string} contraseniaEncriptada - Contraseña encriptada almacenada en BD
   * @param {string} salt - Salt almacenado en BD
   * @returns {boolean} true si coincide, false si no
   */
  static verificarContrasenia(contraseniaTextoPlano, contraseniaEncriptada, salt) {
    const { contrasenia_encriptada: hash } = this.encriptarContrasenia(
      contraseniaTextoPlano,
      salt
    )
    return hash === contraseniaEncriptada
  }
}

module.exports = EncriptacionService
