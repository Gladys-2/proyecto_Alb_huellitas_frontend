import React, { useState } from "react";
import { FaPen, FaPlus } from "react-icons/fa";
import type { Animal, Usuario } from "../../types/types";

interface BandejaAnimalesProps {
  animales: Animal[];
  usuarioLogueado: Usuario | null;
  onEdit: (animal: Animal) => void;
  onAdd: () => void;
  onToggle: (animal: Animal, nuevoEstado: "Disponible" | "Adoptado" | "En cuidado") => void;
  itemsPorPagina?: number;
}

const BandejaAnimales: React.FC<BandejaAnimalesProps> = ({
  animales,
  usuarioLogueado,
  onEdit,
  onAdd,
  onToggle,
  itemsPorPagina = 5,
}) => {
  const esAdministrador = usuarioLogueado?.rol?.toLowerCase() === "administrador";
  const [buscar, setBuscar] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const animalesFiltrados = animales.filter((a) => {
    const coincide =
      (a.nombre ?? "").toLowerCase().includes(buscar.toLowerCase()) ||
      (a.especie ?? "").toLowerCase().includes(buscar.toLowerCase()) ||
      (a.raza ?? "").toLowerCase().includes(buscar.toLowerCase());
    const visible = esAdministrador || a.estado_animal !== "Adoptado";
    return coincide && visible;
  });

  const totalPaginas = Math.ceil(animalesFiltrados.length / itemsPorPagina);
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const animalesPagina = animalesFiltrados.slice(inicio, inicio + itemsPorPagina);

  const coloresEstado = {
    Disponible: "#276749",
    Adoptado: "#dd6b20",
    "En cuidado": "#c53030",
  };

  return (
    <div className="p-6 bg-gray-50 rounded-3xl shadow-xl flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        {/* BUSCADOR */}
        <div className="flex items-center gap-2 bg-white/90 px-6 py-3 rounded-xl shadow-md focus-within:ring-2 ring-cyan-400 transition w-full md:w-1/2">
          <input
            type="text"
            placeholder="Buscar animales..."
            value={buscar}
            onChange={(e) => {
              setBuscar(e.target.value);
              setPaginaActual(1);
            }}
            className="outline-none bg-transparent placeholder-gray-400 w-full text-gray-800 font-medium text-lg"
          />
        </div>

        {esAdministrador && (
          <button
            onClick={onAdd}
            className="flex items-center gap-3 px-6 py-3 rounded-xl border border-cyan-400 text-cyan-400 font-semibold hover:bg-cyan-400 hover:text-white text-lg transition"
          >
            <FaPlus /> Agregar
          </button>
        )}
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full border-collapse text-lg">
          <thead className="bg-cyan-100 sticky top-0 text-base">
            <tr>
              <th className="px-2 py-1 text-center border-b border-gray-300">Foto</th>
              <th className="px-2 py-1 text-center border-b border-gray-300">Nombre</th>
              <th className="px-2 py-1 text-center border-b border-gray-300">Especie</th>
              <th className="px-2 py-1 text-center border-b border-gray-300">Raza</th>
              <th className="px-2 py-1 text-center border-b border-gray-300">Sexo</th>
              <th className="px-2 py-1 text-center border-b border-gray-300">Edad</th>
              <th className="px-2 py-1 text-center border-b border-gray-300">Descripción</th>
              <th className="px-2 py-1 text-center border-b border-gray-300">Estado</th>
              {esAdministrador && <th className="px-6 py-4 text-center border-b border-gray-300">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {animalesPagina.map((animal, index) => (
              <tr
                key={animal.id}
                className={`transition hover:bg-cyan-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="px-3 py-2 text-center">
                  {animal.foto ? (
                    <img
                      src={animal.foto.startsWith("http") ? animal.foto : `http://localhost:5000/${animal.foto}`}
                      alt={animal.nombre || "Foto"}
                      className="w-20 h-20 object-cover rounded-xl shadow-sm mx-auto"
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-1 py-2 text-center font-medium">{animal.nombre || "—"}</td>
                <td className="px-1 py-2 text-center">{animal.especie || "—"}</td>
                <td className="px-1 py-2 text-center">{animal.raza || "—"}</td>
                <td className="px-1 py-2 text-center">{animal.sexo || "—"}</td>
                <td className="px-1 py-2 text-center">{animal.edad ?? "—"}</td>
                <td className="px-1 py-2 text-center">{animal.descripcion || "—"}</td>
                <td
                  className="px-1 py-2 text-center font-bold"
                  style={{ color: coloresEstado[animal.estado_animal || "Disponible"] }}
                >
                  {animal.estado_animal}
                </td>
                {esAdministrador && (
                  <td className="px-6 py-4 text-center flex justify-center gap-3">
                    <FaPen
                      className="cursor-pointer text-cyan-500 hover:text-cyan-700 transition text-xl"
                      onClick={() => onEdit(animal)}
                    />
                    <button
                      className="px-1 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-lg font-bold"
                      onClick={() => {
                        const siguienteEstado =
                          animal.estado_animal === "Disponible"
                            ? "En cuidado"
                            : animal.estado_animal === "En cuidado"
                            ? "Adoptado"
                            : "Disponible";
                        onToggle(animal, siguienteEstado as "Disponible" | "Adoptado" | "En cuidado");
                      }}
                    >
                      {animal.estado_animal}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
        <button
          disabled={paginaActual === 1}
          onClick={() => setPaginaActual(paginaActual - 1)}
          className="px-2 py-2 rounded-lg border border-gray-300 hover:bg-cyan-100 disabled:opacity-50 text-lg"
        >
          Anterior
        </button>
        {[...Array(totalPaginas)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPaginaActual(i + 1)}
            className={`px-4 py-2 rounded-lg border border-gray-300 text-lg ${
              paginaActual === i + 1 ? "bg-cyan-200 border-cyan-400 text-cyan-700" : "hover:bg-cyan-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={paginaActual === totalPaginas}
          onClick={() => setPaginaActual(paginaActual + 1)}
          className="px-2 py-2 rounded-lg border border-gray-300 hover:bg-cyan-100 disabled:opacity-50 text-lg"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default BandejaAnimales;