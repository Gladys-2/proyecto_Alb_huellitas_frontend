import React from "react";
import {
  FaUsers,
  FaPaw,
  FaChartBar,
  FaSignOutAlt,
  FaHandHoldingHeart,
} from "react-icons/fa";

import type { Usuario, Pantalla } from "../types/types";

interface SidebarProps {
  abierto: boolean;
  toggleSidebar?: () => void;
  usuario: Usuario;
  setPantalla: (pantalla: Pantalla) => void;
  handleSalir: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  abierto,
  usuario,
  setPantalla,
  handleSalir,
}) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-full w-60 bg-white shadow-2xl transform transition-transform duration-500 z-50 ${
        abierto ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full p-6">

        {/* TITULO */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
          Menú
        </h2>

        {/* OPCIONES */}
        <div className="flex flex-col gap-3">
          {usuario.rol === "usuario" && (
            <>
              <button
                onClick={() => setPantalla("adopciones")}
                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all duration-300"
              >
                <FaUsers size={22} /> Adopciones
              </button>

              <button
                onClick={() => setPantalla("animales")}
                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all duration-300"
              >
                <FaPaw size={22} /> Animales
              </button>

              <button
                onClick={() => setPantalla("voluntarios")}
                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all duration-300"
              >
                <FaUsers size={22} /> Voluntarios
              </button>

              <button
                onClick={() => setPantalla("donaciones")}
                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all duration-300"
              >
                <FaHandHoldingHeart size={22} /> Donaciones
              </button>
            </>
          )}

          {/* ADMIN */}
          {usuario.rol === "administrador" && (
            <>
              <button
                onClick={() => setPantalla("usuarios")}
                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all duration-300"
              >
                <FaUsers size={22} /> Usuarios
              </button>

              <button
                onClick={() => setPantalla("animalesAdmin")}
                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all duration-300"
              >
                <FaPaw size={22} /> Animales
              </button>

              <button
                onClick={() => setPantalla("reportes")}
                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all duration-300"
              >
                <FaChartBar size={22} /> Reportes
              </button>

              <button
                onClick={() => setPantalla("voluntariosAdmin")}
                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all duration-300"
              >
                <FaUsers size={22} /> Voluntarios
              </button>

              <button
                onClick={() => setPantalla("donacionesAdmin")}
                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all duration-300"
              >
                <FaHandHoldingHeart size={22} /> Donaciones
              </button>
            </>
          )}
        </div>

        {/* BOTÓN SALIR */}
        <div className="mt-auto">
          <button
            onClick={handleSalir}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            <FaSignOutAlt size={22} /> Salir
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;