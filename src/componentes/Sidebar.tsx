import React from "react";
import { FaUsers, FaPaw, FaChartBar, FaSignOutAlt, FaHandHoldingHeart } from "react-icons/fa";
import type { Usuario, Pantalla } from "../types/types";

interface SidebarProps {
  abierto: boolean;
  toggleSidebar?: () => void;
  usuario: Usuario;
  setPantalla: (pantalla: Pantalla) => void;
  handleSalir: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ abierto, usuario, setPantalla, handleSalir }) => {
  return (
    <aside className={`fixed top-0 left-0 h-full w-60 bg-white shadow-2xl transform transition-transform duration-500 z-50 ${abierto ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex flex-col h-full p-6">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Menú</h2>
        <div className="flex flex-col gap-3">
          {usuario.rol === "usuario" && (
            <>
              <button onClick={() => setPantalla("adopciones")} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all duration-300"><FaUsers /> Adopciones</button>
              <button onClick={() => setPantalla("animales")} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all duration-300"><FaPaw /> Animales</button>
              <button onClick={() => setPantalla("voluntarios")} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all duration-300"><FaUsers /> Voluntarios</button>
              <button onClick={() => setPantalla("donaciones")} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all duration-300"><FaHandHoldingHeart /> Donaciones</button>
            </>
          )}
          {usuario.rol === "administrador" && (
            <>
              <button onClick={() => setPantalla("usuarios")} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all duration-300"><FaUsers /> Usuarios</button>
              <button onClick={() => setPantalla("animalesAdmin")} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all duration-300"><FaPaw /> AnimalesAdmin</button>
              <button onClick={() => setPantalla("reportes")} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all duration-300"><FaChartBar /> ReportesAdmin</button>
              <button onClick={() => setPantalla("voluntarios")} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all duration-300"><FaUsers /> Voluntarios</button>
              <button onClick={() => setPantalla("donacioneAdmin")} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-100 transition-all duration-300"><FaHandHoldingHeart /> DonacionesAdmin</button>
            </>
          )}
        </div>
        <div className="mt-auto">
          <button onClick={handleSalir} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"><FaSignOutAlt /> Salir</button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;