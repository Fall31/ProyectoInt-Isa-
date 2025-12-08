import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
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
import Factura from "./pages/Factura";
import ChatbotWidget from './components/ChatbotWidget'
import SupabaseDebug from './components/SupabaseDebug'
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
import HistorialFacturas from './pages/HistorialFacturas';
import CambiarContrasenia from './pages/CambiarContrasenia';
import RecuperarContrasenia from './pages/RecuperarContrasenia';
import CompletarPerfil from './pages/CompletarPerfil';
import ConfirmacionEmail from './pages/ConfirmacionEmail';
import Bienvenida from './pages/Bienvenida';

// Componente Navbar con soporte para roles
function AppNavbar() {
  const { user, userRole, logout } = useAuth();

  return (
    <nav className="sidebar">
      <h2>🐾 VetCare</h2>
      
      <ul>
        <li><Link to="/">Inicio</Link></li>
        
        {/* Rutas para clientes */}
        {userRole === 'cliente' && (
          <>
            <li><Link to="/dashboard">📊 Dashboard</Link></li>
            <li><Link to="/perfil">👤 Perfil</Link></li>
            <li><Link to="/mascotas">🐕 Mascotas</Link></li>
            <li><Link to="/reservas">📅 Reservas</Link></li>
            <li><Link to="/historial-facturas">📋 Mis Compras</Link></li>
          </>
        )}
        
        {/* Rutas para personal/doctores */}
        {(userRole === 'personal' || userRole === 'administrador') && (
          <>
            <li><Link to="/dashboard-personal">👨‍⚕️ Dashboard</Link></li>
            <li><Link to="/perfil-personal">👤 Mi Perfil</Link></li>
            <li><Link to="/mis-horarios">🕐 Mis Horarios</Link></li>
            <li><Link to="/mis-reservas">📅 Mis Citas</Link></li>
            <li><Link to="/historial-medico-personal">📝 Historiales</Link></li>
          </>
        )}
        
        {/* Rutas para administrador */}
        {userRole === 'administrador' && (
          <>
            <li><Link to="/inventario">📦 Inventario</Link></li>
            <li><Link to="/proveedores">🏢 Proveedores</Link></li>
            <li><Link to="/horarios">🕐 Horarios Generales</Link></li>
            <li><Link to="/gestion-blog">✍️ Blog</Link></li>
          </>
        )}
        
        {/* Rutas públicas */}
        <li><Link to="/catalogo-servicios">🏥 Servicios</Link></li>
        <li><Link to="/catalogo-productos">🛍️ Tienda</Link></li>
        <li><Link to="/catalogo-vacunas">💉 Vacunas</Link></li>
        <li><Link to="/doctores">👨‍⚕️ Doctores</Link></li>
        <li><Link to="/articulos-blog">📚 Blog</Link></li>
        {user && <li><Link to="/carrito">🛒 Carrito</Link></li>}
      </ul>

      <div className="header">
        {user ? (
          <>
            <button
              className="avatar-btn"
              title="Mi Perfil"
              onClick={() => window.location.assign('/perfil')}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <div
                className="avatar"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#e0f7fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}
              >
                🐾
              </div>
              <span className="user-info">{userRole === 'cliente' ? 'Cliente' : (userRole || 'Usuario')}</span>
            </button>
            <button onClick={logout} className="login-btn">Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/iniciar-sesion" className="login-btn">Iniciar sesión</Link>
            {/* Ocultar Registrar cuando haya usuario; solo mostrar si NO autenticado */}
            <Link to="/registrar" className="register-btn">Registrar</Link>
          </>
        )}
      </div>
    </nav>
  );
}

// Contenido principal de la app
function AppRoutes() {
  return (
    <main className="content">
      <div className="content-wrapper">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/registrar" element={<ProtectedRoute Component={Registrar} requireAuth={false} />} />
          <Route path="/iniciar-sesion" element={<ProtectedRoute Component={IniciarSesion} requireAuth={false} />} />
          <Route path="/bienvenida" element={<ProtectedRoute Component={Bienvenida} />} />
          <Route path="/confirmacion-email" element={<ConfirmacionEmail />} />
          <Route path="/recuperar-contrasenia" element={<RecuperarContrasenia />} />
          <Route path="/catalogo-productos" element={<CatalogoProductos />} />
          <Route path="/catalogo-servicios" element={<CatalogoServicios />} />
          <Route path="/catalogo-vacunas" element={<CatalogoVacunas />} />
          <Route path="/doctores" element={<Doctores />} />
          <Route path="/articulos-blog" element={<ArticulosBlog />} />

          {/* Rutas para clientes */}
          <Route path="/completar-perfil" element={<ProtectedRoute Component={CompletarPerfil} allowedRoles={['cliente']} />} />
          <Route path="/dashboard" element={<ProtectedRoute Component={Dashboard} allowedRoles={['cliente']} />} />
          <Route path="/perfil" element={<ProtectedRoute Component={Perfil} allowedRoles={['cliente']} />} />
          <Route path="/cambiar-contrasenia" element={<ProtectedRoute Component={CambiarContrasenia} allowedRoles={['cliente', 'personal', 'administrador']} />} />
          <Route path="/mascotas" element={<ProtectedRoute Component={Mascotas} allowedRoles={['cliente']} />} />
          <Route path="/reservas" element={<ProtectedRoute Component={Reservas} allowedRoles={['cliente']} />} />
          <Route path="/historial" element={<ProtectedRoute Component={Historial} allowedRoles={['cliente']} />} />
          <Route path="/historial/:ci_mascota" element={<ProtectedRoute Component={Historial} allowedRoles={['cliente']} />} />
          <Route path="/carrito" element={<ProtectedRoute Component={Carrito} allowedRoles={['cliente']} />} />
          <Route path="/factura/:id_factura" element={<ProtectedRoute Component={Factura} allowedRoles={['cliente']} />} />
          <Route path="/historial-facturas" element={<ProtectedRoute Component={HistorialFacturas} allowedRoles={['cliente']} />} />

          {/* Rutas para personal/doctores */}
          <Route path="/dashboard-personal" element={<ProtectedRoute Component={DashboardPersonal} allowedRoles={['personal', 'administrador']} />} />
          <Route path="/perfil-personal" element={<ProtectedRoute Component={PerfilPersonal} allowedRoles={['personal', 'administrador']} />} />
          <Route path="/mis-reservas" element={<ProtectedRoute Component={MisReservas} allowedRoles={['personal', 'administrador']} />} />
          <Route path="/historial-medico-personal" element={<ProtectedRoute Component={HistorialMedicoPersonal} allowedRoles={['personal', 'administrador']} />} />
          <Route path="/recetas-tratamientos" element={<ProtectedRoute Component={RecetasTratamientos} allowedRoles={['personal', 'administrador']} />} />
          <Route path="/chat-personal" element={<ProtectedRoute Component={ChatPersonal} allowedRoles={['personal', 'administrador']} />} />
          <Route path="/mis-horarios" element={<ProtectedRoute Component={MisHorarios} allowedRoles={['personal', 'administrador']} />} />

          {/* Rutas solo para administrador */}
          <Route path="/agregar-producto" element={<ProtectedRoute Component={AgregarProducto} allowedRoles={['administrador']} />} />
          <Route path="/inventario" element={<ProtectedRoute Component={Inventario} allowedRoles={['administrador']} />} />
          <Route path="/proveedores" element={<ProtectedRoute Component={Proveedores} allowedRoles={['administrador']} />} />
          <Route path="/horarios" element={<ProtectedRoute Component={Horarios} allowedRoles={['administrador']} />} />
          <Route path="/gestion-blog" element={<ProtectedRoute Component={GestionBlog} allowedRoles={['administrador']} />} />
        </Routes>
      </div>
    </main>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <AppNavbar />
          <AppRoutes />
          <ChatbotWidget />
          <SupabaseDebug />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
