import { useState } from "react";
import "./AgregarProducto.css";

function AgregarProducto() {
  const [producto, setProducto] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    imagen: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagen" && files.length > 0) {
      setProducto({ ...producto, imagen: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setProducto({ ...producto, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Producto agregado:", producto);
    alert("Producto agregado correctamente ");

    setProducto({ nombre: "", precio: "", descripcion: "", imagen: null });
    setPreview(null);
  };

  return (
    <div className="agregar-container">
      <h2>Agregar Producto al Catálogo</h2>

      <form onSubmit={handleSubmit} className="agregar-form">
        <label>Nombre del producto:</label>
        <input
          type="text"
          name="nombre"
          value={producto.nombre}
          onChange={handleChange}
          required
        />

        <label>Precio:</label>
        <input
          type="number"
          name="precio"
          value={producto.precio}
          onChange={handleChange}
          required
        />

        <label>Descripción:</label>
        <textarea
          name="descripcion"
          value={producto.descripcion}
          onChange={handleChange}
          required
        ></textarea>

        <label>Imagen del producto:</label>
        <input type="file" name="imagen" accept="image/*" onChange={handleChange} />

        {preview && (
          <div className="preview">
            <p>Vista previa:</p>
            <img src={preview} alt="Vista previa" />
          </div>
        )}

        <button type="submit">Agregar producto</button>
      </form>
    </div>
  );
}

export default AgregarProducto;
