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
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Voluntarios Registrados</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-teal-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Nombre</th>
              <th className="px-6 py-3 text-left">Correo</th>
              <th className="px-6 py-3 text-left">Teléfono</th>
              <th className="px-6 py-3 text-left">Refugio</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {voluntarios.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">{v.id}</td>
                <td className="px-6 py-4">{v.nombre}</td>
                <td className="px-6 py-4">{v.correo}</td>
                <td className="px-6 py-4">{v.telefono}</td>
                <td className="px-6 py-4">{v.refugio?.nombre || "Sin refugio"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaVoluntarios;