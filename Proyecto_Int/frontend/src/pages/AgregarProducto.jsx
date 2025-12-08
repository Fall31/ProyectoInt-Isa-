import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import "./AgregarProducto.css";

function AgregarProducto() {
  const [producto, setProducto] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    descripcion: "",
    marca: "",
    imagen: null,
    fecha_vencimiento: "",
    lote: "",
    tipo: "",
    id_proveedor: "",
    id_catalogo: "",
  });

  const [preview, setPreview] = useState(null);
  const [proveedores, setProveedores] = useState([])
  const [catalogos, setCatalogos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagen" && files && files.length > 0) {
      setProducto({ ...producto, imagen: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setProducto({ ...producto, [name]: value });
    }
  };

  useEffect(() => {
    const fetchRelations = async () => {
      try {
        const { data: prov, error: errProv } = await supabase.from('proveedor').select('*').order('nombre');
        if (!errProv && prov) setProveedores(prov);

        const { data: cat, error: errCat } = await supabase.from('catalogo').select('*').order('nombre_catalogo');
        if (!errCat && cat) setCatalogos(cat);
      } catch (err) {
        console.error('Error cargando proveedores/catalogos:', err);
      }
    }

    fetchRelations()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null)
    setLoading(true)

    try {
      let imagenUrl = null

      // Si hay un File, subir a Storage
      if (producto.imagen && producto.imagen instanceof File) {
        const file = producto.imagen
        const fileExt = file.name.split('.').pop()
        const fileName = `${(producto.nombre || 'producto').replace(/\s+/g, '_')}-${Date.now()}.${fileExt}`
        const filePath = `productos/${fileName}`

        const { error: uploadError } = await supabase.storage.from('imagenes').upload(filePath, file, { upsert: true })
        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage.from('imagenes').getPublicUrl(filePath)
        imagenUrl = publicUrl
      } else if (typeof producto.imagen === 'string' && producto.imagen) {
        imagenUrl = producto.imagen
      }

      const payload = {
        nombre_producto: producto.nombre,
        categoria: producto.categoria || null,
        precio: producto.precio ? Number(producto.precio) : 0,
        descripcion: producto.descripcion || null,
        marca: producto.marca || null,
        imagen: imagenUrl,
        fecha_vencimiento: producto.fecha_vencimiento || null,
        lote: producto.lote || null,
        tipo: producto.tipo || null,
        id_proveedor: producto.id_proveedor || null,
        id_catalogo: producto.id_catalogo || null,
      }

      // Enviar payload al backend (usa la API del servidor)
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
      const res = await fetch(`${backendUrl}/api/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Error ${res.status}`)
      }

      alert('Producto agregado correctamente')

      setProducto({
        nombre: "",
        categoria: "",
        precio: "",
        descripcion: "",
        marca: "",
        imagen: null,
        fecha_vencimiento: "",
        lote: "",
        tipo: "",
        id_proveedor: "",
        id_catalogo: "",
      })
      setPreview(null)
    } catch (err) {
      console.error('Error guardando producto:', err)
      setError(err.message || String(err))
      alert('Error guardando producto: ' + (err.message || String(err)))
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="agregar-page">
      <div className="page-header">
        <h1>🛒 Agregar Producto</h1>
        <p className="subtitle">Añade un nuevo producto al catálogo</p>
      </div>

      <div className="agregar-card">
        <form onSubmit={handleSubmit} className="agregar-form">
          {error && <div className="error-banner">❌ {error}</div>}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre del producto</label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                value={producto.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="precio">Precio (Bs.)</label>
              <input
                id="precio"
                type="number"
                name="precio"
                value={producto.precio}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="categoria">Categoría</label>
              <input id="categoria" type="text" name="categoria" value={producto.categoria} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="marca">Marca</label>
              <input id="marca" type="text" name="marca" value={producto.marca} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tipo">Tipo</label>
              <input id="tipo" type="text" name="tipo" value={producto.tipo} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="lote">Lote</label>
              <input id="lote" type="text" name="lote" value={producto.lote} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fecha_vencimiento">Fecha de vencimiento</label>
              <input id="fecha_vencimiento" type="date" name="fecha_vencimiento" value={producto.fecha_vencimiento} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="id_proveedor">Proveedor</label>
              <select id="id_proveedor" name="id_proveedor" value={producto.id_proveedor} onChange={handleChange}>
                <option value="">-- Seleccionar proveedor --</option>
                {proveedores.map(p => (
                  <option key={p.id_proveedor || p.id} value={p.id_proveedor || p.id}>{p.nombre || p.nombre_proveedor || p.razon_social}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="id_catalogo">Catálogo</label>
              <select id="id_catalogo" name="id_catalogo" value={producto.id_catalogo} onChange={handleChange}>
                <option value="">-- Seleccionar catálogo --</option>
                {catalogos.map(c => (
                  <option key={c.id_catalogo || c.id} value={c.id_catalogo || c.id}>{c.nombre_catalogo || c.nombre}</option>
                ))}
              </select>
            </div>
            <div className="form-group" />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={producto.descripcion}
              onChange={handleChange}
              required
              rows={4}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="imagen">Imagen del producto</label>
            <input id="imagen" type="file" name="imagen" accept="image/*" onChange={handleChange} />
          </div>

          {preview && (
            <div className="preview">
              <p>Vista previa</p>
              <img src={preview} alt="Vista previa" />
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              ➕ Agregar producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AgregarProducto;
