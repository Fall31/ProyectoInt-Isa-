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
          <h2>Mi App</h2>
          <nav>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/catalogo-productos">Catálogo Productos</Link></li>
              <li><Link to="/catalogo-servicios">Catálogo Servicios</Link></li>
              <li><Link to="/carrito">Carrito</Link></li>
              <li><Link to="/doctores">Doctores</Link></li>
              <li><Link to="/reservas">Reservas</Link></li>
              <li><Link to="/historial">Historial</Link></li>
              <li><Link to="#">Usuarios</Link></li>
              <li><Link to="#">Configuración</Link></li>
              <li><Link to="#">Acerca de</Link></li>
              <li><Link to="/agregar-producto">Agregar Productos</Link></li>
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
                <div>
                  <h1>Frontend React</h1>
                  <p>{mensaje}</p>
                </div>
              }
            />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/catalogo-productos" element={<CatalogoProductos />} />
            <Route path="/catalogo-servicios" element={<CatalogoServicios />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/doctores" element={<Doctores />} />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/registrar" element={<Registrar />} />
            <Route path="/iniciar-sesion" element={<IniciarSesion />} />
            <Route path="/agregar-producto" element={<AgregarProducto />} />
          </Routes>
        </main>
  <ChatbotWidget />
      </div>
    </Router>
  );
}
export default App;
