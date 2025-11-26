import React, { useEffect, useState } from "react";

interface Voluntario {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  refugio?: { id: number; nombre: string };
}

const TablaVoluntarios: React.FC = () => {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);

  useEffect(() => {
    const fetchVoluntarios = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/voluntarios/");
        const data = await res.json();
        setVoluntarios(data);
      } catch (error) {
        console.error("No se pudieron cargar los voluntarios.", error);
      }
    };
    fetchVoluntarios();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Voluntarios Registrados
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {voluntarios.map((v) => (
          <div
            key={v.id}
            className="bg-cyan-200 rounded-3xl p-4 shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="bg-cyan-400 text-white w-12 h-12 flex items-center justify-center rounded-full font-bold text-lg">
                {v.id}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg">{v.nombre}</h3>
                <p className="text-gray-700 text-sm">{v.correo}</p>
                <p className="text-gray-700 text-sm">{v.telefono}</p>
                <p className="text-gray-700 text-sm font-medium">
                  {v.refugio?.nombre || "Sin refugio"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablaVoluntarios;