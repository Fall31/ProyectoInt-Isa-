import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './CatalogoServicios.css';

function CatalogoServicios() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('all');
  const [sortBy, setSortBy] = useState('nombre-asc');
  const navigate = useNavigate();

  const categorias = useMemo(() => {
    if (!servicios.length) return [];
    return [...new Set(servicios.map(s => s.tipo_servicio))].sort();
  }, [servicios]);

  const serviciosFiltrados = useMemo(() => {
    let filtered = [...servicios];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.tipo_servicio.toLowerCase().includes(term) ||
        s.descripcion?.toLowerCase().includes(term)
      );
    }

    if (selectedCategoria !== 'all') {
      filtered = filtered.filter(s => s.tipo_servicio === selectedCategoria);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'nombre-asc':
          return a.tipo_servicio.localeCompare(b.tipo_servicio);
        case 'nombre-desc':
          return b.tipo_servicio.localeCompare(a.tipo_servicio);
        case 'precio-asc':
          return parseFloat(a.costo_pequeno) - parseFloat(b.costo_pequeno);
        case 'precio-desc':
          return parseFloat(b.costo_pequeno) - parseFloat(a.costo_pequeno);
        default:
          return 0;
      }
    });

    return filtered;
  }, [servicios, searchTerm, selectedCategoria, sortBy]);

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      // Cargar catálogo de servicios con JOIN a la tabla servicio para obtener la foto
      const { data, error } = await supabase
        .from('catalogo_servicio')
        .select(`
          id_catalogo,
          tipo_servicio,
          costo_pequeno,
          costo_mediano,
          costo_grande,
          duracion,
          descripcion,
          disponibilidad,
          estado_catalogo,
          id_servicio,
          servicio:id_servicio (
            id_servicio,
            nombre_servicio,
            foto_url
          )
        `)
        .eq('disponibilidad', true)
        .order('tipo_servicio');

      if (error) throw error;
      
      // Transformar datos para compatibilidad con el resto del código
      const serviciosTransformados = (data || []).map(item => ({
        id: item.id_catalogo,
        tipo_servicio: item.tipo_servicio,
        costo_pequeno: item.costo_pequeno,
        costo_mediano: item.costo_mediano,
        costo_grande: item.costo_grande,
        duracion: item.duracion,
        descripcion: item.descripcion,
        disponibilidad: item.disponibilidad,
        foto_url: item.servicio?.foto_url || '/default-servicio.png', // Imagen por defecto si no hay
        nombre_servicio: item.servicio?.nombre_servicio || item.tipo_servicio
      }));
      
      setServicios(serviciosTransformados);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirReserva = (servicio) => {
    navigate('/reservas', { state: { servicioSeleccionado: servicio } });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategoria('all');
    setSortBy('nombre-asc');
  };

  if (loading) {
    return (
      <div className="catalogo-servicios">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando servicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="catalogo-servicios">
      <div className="catalogo-header">
        <h1>Catálogo de Servicios</h1>
        <p className="catalogo-subtitle">Descubre todos nuestros servicios veterinarios</p>
        {serviciosFiltrados.length > 0 && (
          <div className="results-count">
            {serviciosFiltrados.length} {serviciosFiltrados.length === 1 ? 'servicio encontrado' : 'servicios encontrados'}
          </div>
        )}
      </div>

      <div className="filters-bar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-selects">
          <select
            value={selectedCategoria}
            onChange={(e) => setSelectedCategoria(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="nombre-asc">Nombre A-Z</option>
            <option value="nombre-desc">Nombre Z-A</option>
            <option value="precio-asc">Precio: Menor a Mayor</option>
            <option value="precio-desc">Precio: Mayor a Menor</option>
          </select>
        </div>
      </div>

      {serviciosFiltrados.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"></div>
          <h3>No se encontraron servicios</h3>
          <p>Intenta ajustar los filtros de búsqueda</p>
          <button onClick={resetFilters} className="btn-reset">
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="servicios-grid">
          {serviciosFiltrados.map((servicio, index) => (
            <div
              key={servicio.id}
              className="servicio-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {servicio.foto_url && (
                <div className="servicio-imagen">
                  <img src={servicio.foto_url} alt={servicio.tipo_servicio} />
                </div>
              )}
              
              <div className="servicio-header">
                <h3>{servicio.tipo_servicio}</h3>
              </div>

              <p className="servicio-descripcion">{servicio.descripcion}</p>

              <div className="servicio-details">
                {servicio.duracion && (
                  <div className="detail-item">
                    <span className="detail-icon">⏱️</span>
                    <span>{servicio.duracion} min</span>
                  </div>
                )}
              </div>

              <div className="precios-container">
                <div className="precio-item">
                  <span className="precio-label">Pequeño</span>
                  <span className="precio">Bs. {servicio.costo_pequeno}</span>
                </div>
                <div className="precio-item">
                  <span className="precio-label">Mediano</span>
                  <span className="precio">Bs. {servicio.costo_mediano}</span>
                </div>
                <div className="precio-item">
                  <span className="precio-label">Grande</span>
                  <span className="precio">Bs. {servicio.costo_grande}</span>
                </div>
              </div>

              <div className="servicio-footer">
                <button
                  className="btn-reservar"
                  onClick={() => abrirReserva(servicio)}
                >
                  Reservar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CatalogoServicios;
