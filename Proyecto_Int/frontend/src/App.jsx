import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
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
import SupabaseDebug from './components/SupabaseDebug'
import { supabase } from './lib/supabaseClient'
import "./App.css";
import CatalogoVacunas from './pages/CatalogoVacunas';
import ArticulosBlog from './pages/ArticulosBlog';
import Perfil from './pages/Perfil';
import Mascotas from './pages/Mascotas';
import Inventario from './pages/Inventario';
import Proveedores from './pages/Proveedores';
import Horarios from './pages/Horarios';
import DashboardPersonal from './pages/DashboardPersonal';
import PerfilPersonal from './pages/PerfilPersonal';
import MisReservas from './pages/MisReservas';
import HistorialMedicoPersonal from './pages/HistorialMedicoPersonal';
import RecetasTratamientos from './pages/RecetasTratamientos';
import GestionBlog from './pages/GestionBlog';
import ChatPersonal from './pages/ChatPersonal';
import MisHorarios from './pages/MisHorarios';
import Servicios from './pages/Servicios';
import DashboardAdmin from './pages/DashboardAdmin';
import ReportesAdmin from './pages/ReportesAdmin';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Obtener usuario actual (supabase)
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

    getUser();
  }, []);

  return (
    <Router>
      <div className="app-container">
        {/* Navbar Horizontal */}
        <nav className="sidebar">
          <h2>🐾 VetCare</h2>
          
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            {user && <li><Link to="/dashboard-admin">📊 Admin Dashboard</Link></li>}
            {user && <li><Link to="/reportes-admin">📑 Reportes</Link></li>}
            <li><Link to="/perfil">Perfil</Link></li>
            <li><Link to="/mascotas">Mascotas</Link></li>
            <li><Link to="/reservas">Reservas</Link></li>
            <li><Link to="/catalogo-servicios">Servicios</Link></li>
            <li><Link to="/catalogo-productos">Tienda</Link></li>
            <li><Link to="/catalogo-vacunas">Vacunas</Link></li>
            <li><Link to="/carrito">🛒</Link></li>
            <li><Link to="/historial">Historial</Link></li>
            <li><Link to="/doctores">Doctores</Link></li>
            <li><Link to="/articulos-blog">Blog</Link></li>
            {user && <li><Link to="/agregar-producto">AgregarProducto</Link></li>}
            {user && <li><Link to="/inventario">📦 Inventario</Link></li>}
            {user && <li><Link to="/proveedores">🏢 Proveedores</Link></li>}
            {user && <li><Link to="/servicios">💼 Servicios</Link></li>}
            {user && <li><Link to="/horarios">🕐 Horarios</Link></li>}
            {user && <li><Link to="/dashboard-personal">👨‍⚕️ Dashboard Personal</Link></li>}
          </ul>

          <div className="header">
            <Link to="/iniciar-sesion" className="login-btn">Iniciar sesión</Link>
            <Link to="/registrar" className="register-btn">Registrar</Link>
          </div>
        </nav>

        {/* Contenido scrolleable */}
        <main className="content">
          <div className="content-wrapper">

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/dashboard-admin" element={<DashboardAdmin />} />
            <Route path="/reportes-admin" element={<ReportesAdmin />} />
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
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/proveedores" element={<Proveedores />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/horarios" element={<Horarios />} />
            <Route path="/dashboard-personal" element={<DashboardPersonal />} />
            <Route path="/perfil-personal" element={<PerfilPersonal />} />
            <Route path="/mis-reservas" element={<MisReservas />} />
            <Route path="/historial-medico-personal" element={<HistorialMedicoPersonal />} />
            <Route path="/recetas-tratamientos" element={<RecetasTratamientos />} />
            <Route path="/gestion-blog" element={<GestionBlog />} />
            <Route path="/chat-personal" element={<ChatPersonal />} />
            <Route path="/mis-horarios" element={<MisHorarios />} />
          </Routes>
          </div>
        </main>
        <ChatbotWidget />
        <SupabaseDebug />
      </div>
    </Router>
  );
}
export default App;
