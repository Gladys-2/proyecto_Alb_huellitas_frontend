import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Adopcion, Usuario, Animal } from "../../types/types";

interface AdopcionesUsuarioProps {
  usuario: Usuario;
}

const COLOR_TITULO = "#1E3A8A";

const AdopcionesUsuario: React.FC<AdopcionesUsuarioProps> = ({ usuario }) => {
  const [solicitudes, setSolicitudes] = useState<Adopcion[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarSolicitudes = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/adopciones/usuario/${usuario.id}`);
      const data: Adopcion[] = await res.json();
      setSolicitudes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (usuario.id) cargarSolicitudes();
  }, [usuario.id]);

  if (cargando)
    return (
      <p className="text-center mt-10 text-xl font-semibold text-gray-600">
        Cargando tus solicitudes...
      </p>
    );

  return (
    <div className="p-6 min-h-screen bg-[#E6F7FF]">
      <h2 className="text-3xl font-bold text-center mb-6" style={{ color: COLOR_TITULO }}>
        Mis Solicitudes de Adopción
      </h2>

      {solicitudes.length === 0 ? (
        <p className="text-center text-gray-600">No tienes solicitudes de adopción aún.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solicitudes.map((s, i) => {
            const animal: Animal = s.animal as Animal; // Asegúrate que tu backend envía el objeto completo

            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl p-4 shadow-md flex flex-col items-center"
              >
                <img
                  src={animal.foto?.startsWith("http") ? animal.foto : `http://localhost:5000/${animal.foto}`}
                  alt={animal.nombre}
                  className="w-32 h-32 object-cover rounded-xl mb-3"
                />
                <h3 className="text-xl font-semibold mb-1">{animal.nombre}</h3>
                <p className="text-gray-600 mb-2">{animal.raza} | {animal.edad ?? "—"} años</p>
                <p>
                  <strong>Estado:</strong>{" "}
                  <span className={s.estado === "Pendiente" ? "text-orange-500 font-bold" : "text-green-500 font-bold"}>
                    {s.estado}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Fecha: {s.fecha ? new Date(s.fecha).toLocaleDateString() : "—"}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdopcionesUsuario;