import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './Perfil.css';

const Perfil = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    nombre_cliente: '',
    primer_apellido: '',
    direccion: '',
    telefono_cliente: '',
    nit: '',
    genero: ''
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser) {
        navigate('/iniciar-sesion');
        return;
      }

      setUser(authUser);

      // Fetch cliente data from backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cliente/${authUser.id}`);
      const data = await response.json();
      
      if (data.cliente) {
        setFormData({
          nombre_cliente: data.cliente.nombre_cliente || '',
          primer_apellido: data.cliente.primer_apellido || '',
          direccion: data.cliente.direccion || '',
          telefono_cliente: data.cliente.telefono_cliente || '',
          nit: data.cliente.nit || '',
          genero: data.cliente.genero || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cliente/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Perfil actualizado correctamente');
      } else {
        alert('Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) {
        alert('Error al cambiar la contraseña: ' + error.message);
      } else {
        alert('Contraseña actualizada correctamente');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error al cambiar la contraseña');
    }
  };

  if (loading) {
    return <div className="perfil-loading">Cargando perfil...</div>;
  }

  return (
    <div className="perfil-page">
      <div className="perfil-header">
        <h1>Mi Perfil</h1>
        <p>Gestiona tu información personal y configuración de cuenta</p>
      </div>

      <div className="perfil-content">
        {/* Personal Information Section */}
        <section className="perfil-section">
          <h2>Información Personal</h2>
          <form onSubmit={handleSaveProfile} className="perfil-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre_cliente"
                  value={formData.nombre_cliente}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <input
                  type="text"
                  name="primer_apellido"
                  value={formData.primer_apellido}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="telefono_cliente"
                  value={formData.telefono_cliente}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>NIT</label>
                <input
                  type="text"
                  name="nit"
                  value={formData.nit}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Género</label>
              <select name="genero" value={formData.genero} onChange={handleInputChange}>
                <option value="">Seleccionar</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label>Correo electrónico</label>
              <input type="email" value={user?.email || ''} disabled />
              <small>El correo no se puede cambiar desde aquí</small>
            </div>

            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        </section>

        {/* Password Change Section */}
        <section className="perfil-section">
          <h2>Cambiar Contraseña</h2>
          <form onSubmit={handleChangePassword} className="perfil-form">
            <div className="form-group">
              <label>Nueva Contraseña</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirmar Nueva Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <button type="submit" className="btn-save">
              Cambiar Contraseña
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Perfil;
