import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './Mascotas.css';

const Mascotas = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMascota, setEditingMascota] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre_mascota: '',
    especie: '',
    raza: '',
    edad: '',
    peso: '',
    genero_mascota: '',
    alergias: ''
  });

  useEffect(() => {
    checkAuthAndFetchMascotas();
  }, []);

  const checkAuthAndFetchMascotas = async () => {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser();
      
      if (error || !authUser) {
        navigate('/iniciar-sesion');
        return;
      }

      setUser(authUser);
      await fetchMascotas(authUser.id);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMascotas = async (userId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas/${userId}`);
      const data = await response.json();
      setMascotas(data.mascotas || []);
    } catch (error) {
      console.error('Error fetching mascotas:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = editingMascota
      ? `${import.meta.env.VITE_API_URL}/api/mascotas/${editingMascota.ci_mascota}`
      : `${import.meta.env.VITE_API_URL}/api/mascotas`;
    
    const method = editingMascota ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ci_cliente: user.id
        })
      });

      if (response.ok) {
        alert(editingMascota ? 'Mascota actualizada' : 'Mascota registrada correctamente');
        setShowForm(false);
        setEditingMascota(null);
        resetForm();
        fetchMascotas(user.id);
      } else {
        alert('Error al guardar la mascota');
      }
    } catch (error) {
      console.error('Error saving mascota:', error);
      alert('Error al guardar la mascota');
    }
  };

  const handleEdit = (mascota) => {
    setEditingMascota(mascota);
    setFormData({
      nombre_mascota: mascota.nombre_mascota,
      especie: mascota.especie,
      raza: mascota.raza,
      edad: mascota.edad,
      peso: mascota.peso,
      genero_mascota: mascota.genero_mascota,
      alergias: mascota.alergias || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (ci_mascota) => {
    if (!confirm('¿Estás seguro de eliminar esta mascota?')) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/mascotas/${ci_mascota}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        alert('Mascota eliminada');
        fetchMascotas(user.id);
      } else {
        alert('Error al eliminar');
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre_mascota: '',
      especie: '',
      raza: '',
      edad: '',
      peso: '',
      genero_mascota: '',
      alergias: ''
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMascota(null);
    resetForm();
  };

  if (loading) {
    return <div className="mascotas-loading">Cargando mascotas...</div>;
  }

  return (
    <div className="mascotas-page">
      <div className="mascotas-header">
        <div>
          <h1>Mis Mascotas</h1>
          <p>Gestiona la información de tus mascotas y su historial médico</p>
        </div>
        <button 
          className="btn-add" 
          onClick={() => setShowForm(true)}
        >
          + Registrar Mascota
        </button>
      </div>

      {showForm && (
        <div className="mascota-form-container">
          <div className="form-header">
            <h2>{editingMascota ? 'Editar Mascota' : 'Registrar Nueva Mascota'}</h2>
            <button className="btn-close" onClick={handleCancel}>×</button>
          </div>
          <form onSubmit={handleSubmit} className="mascota-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre_mascota"
                  value={formData.nombre_mascota}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Especie *</label>
                <select
                  name="especie"
                  value={formData.especie}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  <option value="Ave">Ave</option>
                  <option value="Roedor">Roedor</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Raza</label>
                <input
                  type="text"
                  name="raza"
                  value={formData.raza}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Género</label>
                <select
                  name="genero_mascota"
                  value={formData.genero_mascota}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar</option>
                  <option value="M">Macho</option>
                  <option value="F">Hembra</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Edad (años)</label>
                <input
                  type="number"
                  name="edad"
                  value={formData.edad}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                />
              </div>
              <div className="form-group">
                <label>Peso (kg)</label>
                <input
                  type="number"
                  name="peso"
                  value={formData.peso}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Alergias o condiciones especiales</label>
              <textarea
                name="alergias"
                value={formData.alergias}
                onChange={handleInputChange}
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={handleCancel}>
                Cancelar
              </button>
              <button type="submit" className="btn-submit">
                {editingMascota ? 'Actualizar' : 'Registrar'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mascotas-grid">
        {mascotas.length === 0 ? (
          <div className="empty-state">
            <p>No tienes mascotas registradas</p>
            <button className="btn-add" onClick={() => setShowForm(true)}>
              Registrar primera mascota
            </button>
          </div>
        ) : (
          mascotas.map((mascota) => (
            <div key={mascota.ci_mascota} className="mascota-card">
              <div className="mascota-image">
                {mascota.imagen ? (
                  <img src={mascota.imagen} alt={mascota.nombre_mascota} />
                ) : (
                  <div className="placeholder-image">🐾</div>
                )}
              </div>
              <div className="mascota-info">
                <h3>{mascota.nombre_mascota}</h3>
                <p className="mascota-species">{mascota.especie} • {mascota.raza || 'Sin raza'}</p>
                <div className="mascota-details">
                  <span>Edad: {mascota.edad} años</span>
                  <span>Peso: {mascota.peso} kg</span>
                  <span>Género: {mascota.genero_mascota === 'M' ? 'Macho' : 'Hembra'}</span>
                </div>
                {mascota.alergias && (
                  <p className="mascota-allergies">⚠️ {mascota.alergias}</p>
                )}
              </div>
              <div className="mascota-actions">
                <button onClick={() => handleEdit(mascota)} className="btn-edit">
                  Editar
                </button>
                <button onClick={() => navigate(`/historial/${mascota.ci_mascota}`)} className="btn-history">
                  Historial
                </button>
                <button onClick={() => handleDelete(mascota.ci_mascota)} className="btn-delete">
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Mascotas;
