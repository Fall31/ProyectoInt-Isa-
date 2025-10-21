import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Registrar from "./pages/Registrar";
import IniciarSesion from "./pages/IniciarSesion";
import AgregarProducto from "./pages/AgregarProducto";
import Dashboard from "./pages/Dashboard";
import Doctores from "./pages/Doctores";
import Reservas from "./pages/Reservas";
import Historial from "./pages/Historial";
import CatalogoProductos from "./pages/CatalogoProductos";
import CatalogoServicios from "./pages/CatalogoServicios";
import Carrito from "./pages/Carrito";
import ChatbotWidget from './components/ChatbotWidget'
import { supabase } from './lib/supabaseClient'
import "./App.css";
import CatalogoVacunas from './pages/CatalogoVacunas';
import ArticulosBlog from './pages/ArticulosBlog';
import Perfil from './pages/Perfil';
import Mascotas from './pages/Mascotas';

function App() {
  const [mensaje, setMensaje] = useState("");
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch("http://localhost:5000/api/saludo")
      .then((res) => res.json())
      .then((data) => setMensaje(data.mensaje))
      .catch((err) => console.error(err));
    // obtener usuario actual (supabase)
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)
      } catch (e) {
        console.error('Error fetching user', e)
      }
    }

    getUser()
  }, []);

  return (
    <Router>
      <div className="app-container">
          <aside className="sidebar">
          <h2>VetCare - Clínica Veterinaria</h2>
          <nav>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/perfil">Mi Perfil</Link></li>
              <li><Link to="/mascotas">Mis Mascotas</Link></li>
              <li><Link to="/reservas">Reservas</Link></li>
              <li><Link to="/catalogo-servicios">Servicios</Link></li>
              <li><Link to="/catalogo-productos">Tienda</Link></li>
              <li><Link to="/catalogo-vacunas">Vacunas</Link></li>
              <li><Link to="/carrito">Carrito</Link></li>
              <li><Link to="/historial">Historial Médico</Link></li>
              <li><Link to="/doctores">Doctores</Link></li>
              <li><Link to="/articulos-blog">Blog</Link></li>
              <li><Link to="/agregar-producto">Admin: Productos</Link></li>
            </ul>
          </nav>
        </aside>

        <main className="content">
          <header className="header">
            <Link to="/iniciar-sesion" className="login-btn">Iniciar sesión</Link>
            <Link to="/registrar" className="register-btn">Registrar</Link>
          </header>

          <Routes>
            <Route
              path="/"
              element={
                <div className="welcome-page">
                  <section className="hero">
                    <div className="hero-content">
                      <h1>Bienvenido a VetCare</h1>
                      <p className="lead">Cuidamos a tus mascotas con cariño y profesionalismo. Servicios integrales, vacunación y productos seleccionados para su bienestar.</p>
                      <div className="hero-actions">
                        <Link to="/reservas" className="btn primary">Reservar cita</Link>
                        <Link to="/catalogo-productos" className="btn outline">Ver productos</Link>
                      </div>
                    </div>
                    <div className="hero-illustration" aria-hidden></div>
                  </section>

                  <section className="features">
                    <div className="home-cards">
                      <div className="card">
                        <h3>Reservas</h3>
                        <p>Agenda citas con nuestros especialistas de forma rápida y segura.</p>
                      </div>
                      <div className="card">
                        <h3>Productos</h3>
                        <p>Alimentos, medicamentos y accesorios seleccionados para la salud de tu mascota.</p>
                      </div>
                      <div className="card">
                        <h3>Vacunas</h3>
                        <p>Esquemas de vacunación completos y asesoría profesional.</p>
                      </div>
                    </div>
                  </section>

                  <p className="api-message">{mensaje}</p>
                </div>
              }
            />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/mascotas" element={<Mascotas />} />
            <Route path="/catalogo-productos" element={<CatalogoProductos />} />
            <Route path="/catalogo-servicios" element={<CatalogoServicios />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/doctores" element={<Doctores />} />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/historial/:ci_mascota" element={<Historial />} />
            <Route path="/registrar" element={<Registrar />} />
            <Route path="/iniciar-sesion" element={<IniciarSesion />} />
            <Route path="/agregar-producto" element={<AgregarProducto />} />
            <Route path="/catalogo-vacunas" element={<CatalogoVacunas />} />
            <Route path="/articulos-blog" element={<ArticulosBlog />} />
          </Routes>
        </main>
  <ChatbotWidget />
      </div>
    </Router>
  );
}
export default App;
