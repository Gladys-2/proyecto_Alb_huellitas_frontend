import React, { useState, useEffect } from "react";
import { IdiomaProvider } from "./context/IdiomaContext";
import Login from "./pages/Login/Login";
import Registro from "./pages/Login/Registro";
import type { Usuario, Pantalla } from "./types/types";

// Administrador
import InicioAdmin from "./pages/Admin/InicioAdmin";
import Usuarios from "./pages/Admin/Usuarios"; 
import AnimalesAdmin from "./pages/Admin/AnimalesAdmin";
import ReportesAdmin from "./pages/Admin/ReportesAdmin";
import TablaVoluntarios from "./pages/Admin/VoluntariosAdmin";
import TablaDonaciones from "./pages/Admin/donacionAdmin";

// Usuario 
import InicioUsuario from "./pages/Usuario/Inicio";
import AnimalesUsuario from "./pages/Usuario/Animales";
import VoluntariosUsuario from "./pages/Usuario/Voluntarios";
import AdopcionesUsuario from "./pages/Usuario/Adopciones";
import DonacionesUsuario from "./pages/Usuario/donaciones";

//inicio visible sin login esto sera publico para todo
import InicioPublico from "../src/componentes/InicioContenido"

import Navbar from "./componentes/Navbar";
import Sidebar from "./componentes/Sidebar";
import i18n from "./i18n";
import "./i18n";

const App: React.FC = () => {
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [pantalla, setPantalla] = useState<Pantalla>("inicioPublico"); 
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const handleLoginExitoso = (usuario: Usuario) => {
    setUsuarioActual(usuario);
    setPantalla("inicio");  
  };

  const handleSalir = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUsuarioActual(null);
    setPantalla("inicioPublico"); 
  };

  return (
    <IdiomaProvider>
      <Navbar
        usuario={usuarioActual}
        sidebarAbierto={sidebarAbierto}
        setSidebarAbierto={setSidebarAbierto}
        setPantalla={setPantalla}
      />

      {!usuarioActual && (
        <main className="pt-20 px-6 w-full">
          {pantalla === "inicioPublico" && <InicioPublico sidebarAbierto={false} />}

          {pantalla === "login" && (
            <Login
              mostrarRegistro={() => setPantalla("registro")}
              onLoginExitoso={handleLoginExitoso}
            />
          )}

          {pantalla === "registro" && (
            <Registro mostrarLogin={() => setPantalla("login")} />
          )}
        </main>
      )}

      {usuarioActual && (
        <div className="flex w-full min-h-screen">

          {/* sidebr*/}
          <Sidebar
            abierto={sidebarAbierto}
            toggleSidebar={() => setSidebarAbierto(!sidebarAbierto)}
            usuario={{ ...usuarioActual, rol: usuarioActual.rol ?? "usuario" }}
            setPantalla={setPantalla}
            handleSalir={handleSalir}
          />

          <div
            className={`flex-1 transition-all duration-300 ${
              sidebarAbierto ? "ml-60" : "ml-0"
            }`}
          >
            <main className="pt-20 px-6 w-full">
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