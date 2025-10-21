import React from 'react';
import './ArticulosBlog.css';

const ArticulosBlog = () => {
  const articulos = [
    { id: 1, titulo: 'Cómo cuidar a tu mascota en invierno', contenido: 'El invierno puede ser duro para las mascotas. Aquí hay algunos consejos para mantenerlas cálidas y saludables.' },
    { id: 2, titulo: 'Beneficios de la vacunación en mascotas', contenido: 'Vacunar a tu mascota no solo la protege, sino que también ayuda a prevenir la propagación de enfermedades.' },
    { id: 3, titulo: 'Alimentos peligrosos para perros y gatos', contenido: 'Descubre qué alimentos comunes pueden ser tóxicos para tus mascotas.' },
  ];

  return (
    <div className="articulos-blog">
      <h1>Artículos y Blog</h1>
      <div className="articulos-list">
        {articulos.map((articulo) => (
          <div key={articulo.id} className="articulo-item">
            <h2>{articulo.titulo}</h2>
            <p>{articulo.contenido}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticulosBlog;