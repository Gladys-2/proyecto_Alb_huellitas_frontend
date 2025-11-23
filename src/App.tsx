import React, { useState } from "react";
import { IdiomaProvider } from "./context/IdiomaContext";
import Login from "./pages/Login/Login";
import Registro from "./pages/Login/Registro";
import type { Usuario, Pantalla } from "./types/types";

// Admin Pages
import InicioAdmin from "./pages/Admin/InicioAdmin";
import Usuarios from "./pages/Admin/Usuarios"; 
import AnimalesAdmin from "./pages/Admin/AnimalesAdmin";
import ReportesAdmin from "./pages/Admin/ReportesAdmin";
import TablaVoluntarios from "./pages/Admin/VoluntariosAdmin";
import TablaDonaciones from "./pages/Admin/donacionAdmin";

// Usuario Pages
import InicioUsuario from "./pages/Usuario/Inicio";
import AnimalesUsuario from "./pages/Usuario/Animales";
import VoluntariosUsuario from "./pages/Usuario/Voluntarios";
import AdopcionesUsuario from "./pages/Usuario/Adopciones";
import DonacionesUsuario from "./pages/Usuario/donaciones";

import Navbar from "./componentes/Navbar";
import Sidebar from "./componentes/Sidebar";
import "./i18n";

const App: React.FC = () => {
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [pantalla, setPantalla] = useState<Pantalla>("login");
  const [sidebarAbierto, setSidebarAbierto] = useState(true);

  const handleLoginExitoso = (usuario: Usuario) => setUsuarioActual(usuario);
  const irLogin = () => setPantalla("login");
  const irRegistro = () => setPantalla("registro");

  const handleSalir = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUsuarioActual(null);
    setPantalla("login");
  };

  return (
    <IdiomaProvider>
      {!usuarioActual ? (
        pantalla === "login" ? (
          <Login mostrarRegistro={irRegistro} onLoginExitoso={handleLoginExitoso} />
        ) : (
          <Registro mostrarLogin={irLogin} />
        )
      ) : (
        <div className="flex w-full min-h-screen">
          {/* Sidebar */}
          <Sidebar
            abierto={sidebarAbierto}
            toggleSidebar={() => setSidebarAbierto(!sidebarAbierto)}
            usuario={{ ...usuarioActual, rol: usuarioActual.rol ?? "usuario" }}
            setPantalla={setPantalla}
            handleSalir={handleSalir}
          />

          {/* Contenido principal */}
          <div className={`flex-1 flex flex-col transition-all duration-300`}>
            <Navbar
              usuario={usuarioActual}
              sidebarAbierto={sidebarAbierto}
              setSidebarAbierto={setSidebarAbierto}
              setPantalla={setPantalla}
            />

            {/* Main */}
            <main className="pt-16 w-full">
              {usuarioActual.rol === "administrador" ? (
                pantalla === "usuarios" ? (
                  <Usuarios usuarioLogueado={usuarioActual} />
                ) : pantalla === "reportes" ? (
                  <ReportesAdmin />
                ) : pantalla === "animalesAdmin" ? (
                  <AnimalesAdmin usuarioLogueado={usuarioActual} />
                ) : pantalla === "voluntariosAdmin" ? (
                  <TablaVoluntarios />
                ) : pantalla === "donacionesAdmin" ? (
                  <TablaDonaciones />
                ) : (
                  <InicioAdmin usuario={usuarioActual} sidebarAbierto={sidebarAbierto} />
                )
              ) : (
                // Usuario normal
                pantalla === "inicio" ? (
                  <InicioUsuario usuario={usuarioActual} sidebarAbierto={sidebarAbierto} />
                ) : pantalla === "adopciones" ? (
                  <AdopcionesUsuario usuario={usuarioActual} />
                ) : pantalla === "animales" ? (
                  <AnimalesUsuario usuario={usuarioActual} /> 
                ) : pantalla === "voluntarios" ? (
                  <VoluntariosUsuario />
                ) : pantalla === "donaciones" ? (
                  <DonacionesUsuario usuario={usuarioActual} />
                ) : null
              )}
            </main>
          </div>
        </div>
      )}
    </IdiomaProvider>
  );
};

export default App;