import { supabase } from '../lib/supabaseClient'

/**
 * Servicio para gestionar operaciones del carrito
 * Proporciona funciones para CRUD de carrito y detalles
 */
export const carritoService = {
  /**
   * Obtiene o crea el carrito activo del cliente
   * @param {string} ci_cliente - CI del cliente
   * @returns {Promise<Object>} Datos del carrito
   */
  async obtenerOCrearCarrito(ci_cliente) {
    try {
      // Buscar carrito activo existente
      let { data: carrito, error } = await supabase
        .from('carrito')
        .select('*')
        .eq('ci_cliente', ci_cliente)
        .eq('estado', 'activo')
        .single()

      // Si no existe, crear uno
      if (error && error.code === 'PGRST116') {
        const { data: nuevoCarrito, error: createError } = await supabase
          .from('carrito')
          .insert([{
            ci_cliente,
            fecha_creacion: new Date().toISOString(),
            estado: 'activo',
            total: 0
          }])
          .select()

        if (createError) throw createError
        return nuevoCarrito[0]
      }

      if (error) throw error
      return carrito
    } catch (err) {
      console.error('Error en obtenerOCrearCarrito:', err)
      throw err
    }
  },

  /**
   * Obtiene todos los items del carrito con información del producto
   * @param {number} id_carrito - ID del carrito
   * @returns {Promise<Array>} Items del carrito
   */
  async obtenerItems(id_carrito) {
    try {
      const { data, error } = await supabase
        .from('detalle_carrito')
        .select(`
          *,
          producto(id_producto, nombre_producto, precio, imagen)
        `)
        .eq('id_carrito', id_carrito)

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error en obtenerItems:', err)
      throw err
    }
  },

  /**
   * Agrega un producto al carrito o actualiza su cantidad
   * @param {number} id_carrito - ID del carrito
   * @param {number} id_producto - ID del producto
   * @param {number} cantidad - Cantidad a agregar (default: 1)
   * @param {number} precio_unitario - Precio del producto
   * @returns {Promise<Object>} Detalle del carrito creado/actualizado
   */
  async agregarProducto(id_carrito, id_producto, cantidad = 1, precio_unitario) {
    try {
      // Verificar si el producto ya existe
      const { data: existente } = await supabase
        .from('detalle_carrito')
        .select('*')
        .eq('id_carrito', id_carrito)
        .eq('id_producto', id_producto)
        .single()

      if (existente) {
        // Actualizar cantidad
        return await this.actualizarCantidad(
          existente.id_detalle_carrito,
          existente.cantidad + cantidad,
          precio_unitario
        )
      } else {
        // Crear nuevo detalle
        // subtotal se calcula automáticamente en la BD
        const { data, error } = await supabase
          .from('detalle_carrito')
          .insert([{
            id_carrito,
            id_producto,
            cantidad,
            precio_unitario
          }])
          .select()

        if (error) throw error
        return data[0]
      }
    } catch (err) {
      console.error('Error en agregarProducto:', err)
      throw err
    }
  },

  /**
   * Actualiza la cantidad de un item en el carrito
   * @param {number} id_detalle_carrito - ID del detalle
   * @param {number} cantidad - Nueva cantidad
   * @param {number} precio_unitario - Precio unitario
   * @returns {Promise<Object>} Detalle actualizado
   */
  async actualizarCantidad(id_detalle_carrito, cantidad, precio_unitario) {
    try {
      if (cantidad < 1) {
        return await this.eliminarItem(id_detalle_carrito)
      }

      // subtotal se calcula automáticamente en la BD
      const { data, error } = await supabase
        .from('detalle_carrito')
        .update({ cantidad })
        .eq('id_detalle_carrito', id_detalle_carrito)
        .select()

      if (error) throw error
      return data[0]
    } catch (err) {
      console.error('Error en actualizarCantidad:', err)
      throw err
    }
  },

  /**
   * Elimina un item del carrito
   * @param {number} id_detalle_carrito - ID del detalle
   * @returns {Promise<void>}
   */
  async eliminarItem(id_detalle_carrito) {
    try {
      const { error } = await supabase
        .from('detalle_carrito')
        .delete()
        .eq('id_detalle_carrito', id_detalle_carrito)

      if (error) throw error
    } catch (err) {
      console.error('Error en eliminarItem:', err)
      throw err
    }
  },

  /**
   * Vacía todos los items del carrito
   * @param {number} id_carrito - ID del carrito
   * @returns {Promise<void>}
   */
  async vaciarCarrito(id_carrito) {
    try {
      const { error } = await supabase
        .from('detalle_carrito')
        .delete()
        .eq('id_carrito', id_carrito)

      if (error) throw error

      // Actualizar total a 0
      await supabase
        .from('carrito')
        .update({ total: 0 })
        .eq('id_carrito', id_carrito)
    } catch (err) {
      console.error('Error en vaciarCarrito:', err)
      throw err
    }
  },

  /**
   * Calcula y actualiza el total del carrito
   * @param {number} id_carrito - ID del carrito
   * @returns {Promise<number>} Total calculado
   */
  async actualizarTotal(id_carrito) {
    try {
      const { data: detalles, error } = await supabase
        .from('detalle_carrito')
        .select('subtotal')
        .eq('id_carrito', id_carrito)

      if (error) throw error

      const total = detalles.reduce((sum, d) => sum + parseFloat(d.subtotal), 0)

      const { error: updateError } = await supabase
        .from('carrito')
        .update({ total })
        .eq('id_carrito', id_carrito)

      if (updateError) throw updateError
      return total
    } catch (err) {
      console.error('Error en actualizarTotal:', err)
      throw err
    }
  },

  /**
   * Crea una factura con los items del carrito
   * @param {number} id_carrito - ID del carrito
   * @param {string} ci_cliente - CI del cliente
   * @param {string} metodo_pago - Método de pago seleccionado
   * @returns {Promise<number>} ID de la factura creada
   */
  async crearFactura(id_carrito, ci_cliente, metodo_pago) {
    try {
      // Obtener total del carrito
      const { data: carrito } = await supabase
        .from('carrito')
        .select('total')
        .eq('id_carrito', id_carrito)
        .single()

      // Crear factura
      const { data: facturaData, error: facturaError } = await supabase
        .from('factura')
        .insert([{
          fecha_emision: new Date().toISOString().split('T')[0],
          ci_cliente,
          fecha_caducidad: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          metodo_pago,
          total_factura: carrito.total,
          estado_factura: 'pagada'
        }])
        .select()

      if (facturaError) throw facturaError

      const id_factura = facturaData[0].id_factura

      // Obtener items del carrito
      const items = await this.obtenerItems(id_carrito)

      // Crear detalles de factura
      // Nota: subtotal en detalle_factura se calcula automáticamente
      const detalles_factura = items.map(item => ({
        id_factura,
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        fecha: new Date().toISOString().split('T')[0],
        tipo: 'producto'
      }))

      const { error: detalleError } = await supabase
        .from('detalle_factura')
        .insert(detalles_factura)

      if (detalleError) throw detalleError

      // Marcar carrito como completado
      await supabase
        .from('carrito')
        .update({ estado: 'completado' })
        .eq('id_carrito', id_carrito)

      return id_factura
    } catch (err) {
      console.error('Error en crearFactura:', err)
      throw err
    }
  },

  /**
   * Obtiene factura con sus detalles
   * @param {number} id_factura - ID de la factura
   * @returns {Promise<Object>} Datos completos de la factura
   */
  async obtenerFactura(id_factura) {
    try {
      const { data, error } = await supabase
        .from('factura')
        .select('*')
        .eq('id_factura', id_factura)
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error('Error en obtenerFactura:', err)
      throw err
    }
  },

  /**
   * Obtiene detalles de una factura
   * @param {number} id_factura - ID de la factura
   * @returns {Promise<Array>} Items de la factura
   */
  async obtenerDetallesFactura(id_factura) {
    try {
      const { data: detalles, error } = await supabase
        .from('detalle_factura')
        .select('*')
        .eq('id_factura', id_factura)

      if (error) throw error

      const rows = detalles || []
      const prodIds = [...new Set(rows.filter(r => r.id_producto && (r.tipo === 'producto' || !r.tipo)).map(r => r.id_producto))]
      const servIds = [...new Set(rows.filter(r => r.id_servicio && r.tipo === 'servicio').map(r => r.id_servicio))]

      let productosMap = {}
      let serviciosMap = {}

      if (prodIds.length) {
        const { data: prods } = await supabase
          .from('producto')
          .select('id_producto, nombre_producto, precio')
          .in('id_producto', prodIds)
        productosMap = Object.fromEntries((prods || []).map(p => [p.id_producto, p]))
      }

      if (servIds.length) {
        const { data: servs } = await supabase
          .from('servicio')
          .select('id_servicio, nombre_servicio, precio_base')
          .in('id_servicio', servIds)
        serviciosMap = Object.fromEntries((servs || []).map(s => [s.id_servicio, s]))
      }

      return rows.map(r => {
        const tipo = r.tipo || (r.id_producto ? 'producto' : (r.id_servicio ? 'servicio' : 'otro'))
        const producto = r.id_producto ? productosMap[r.id_producto] : null
        const servicio = r.id_servicio ? serviciosMap[r.id_servicio] : null
        const precio_unit = r.precio_unitario ?? (tipo === 'producto' ? producto?.precio : servicio?.precio_base)
        const subtotal = r.subtotal ?? (Number(r.cantidad || 0) * Number(precio_unit || 0))
        return { ...r, tipo, producto, servicio, precio_unitario: precio_unit, subtotal }
      })
    } catch (err) {
      console.error('Error en obtenerDetallesFactura:', err)
      throw err
    }
  },

  /**
   * Obtiene historial de facturas del cliente
   * @param {string} ci_cliente - CI del cliente
   * @returns {Promise<Array>} Facturas del cliente
   */
  async obtenerFacturasCliente(ci_cliente) {
    try {
      const { data, error } = await supabase
        .from('factura')
        .select('*')
        .eq('ci_cliente', ci_cliente)
        .order('fecha_emision', { ascending: false })

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error en obtenerFacturasCliente:', err)
      throw err
    }
  },

  /**
   * Obtiene el carrito del cliente autenticado
   * @param {string} ci_cliente - CI del cliente
   * @returns {Promise<Object>} Carrito completo con items
   */
  async obtenerCarritoCompleto(ci_cliente) {
    try {
      const carrito = await this.obtenerOCrearCarrito(ci_cliente)
      const items = await this.obtenerItems(carrito.id_carrito)

      return {
        ...carrito,
        items
      }
    } catch (err) {
      console.error('Error en obtenerCarritoCompleto:', err)
      throw err
    }
  }
}

export default carritoService
