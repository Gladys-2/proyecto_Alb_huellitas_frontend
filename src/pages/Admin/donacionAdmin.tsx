import React, { useEffect, useState } from "react";
import type { Donacion } from "../../types/types";

const DonacionesAdmin: React.FC = () => {
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchDonaciones = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/donaciones/");
        const data = await res.json();
        setDonaciones(data);
      } catch (error) {
        console.error("No se pudieron cargar las donaciones.", error);
      } finally {
        setCargando(false);
      }
    };
    fetchDonaciones();
  }, []);

  const colorTipo = (tipo?: string) => {
    if (!tipo) return "bg-gray-100 text-gray-700";
    const t = tipo.toLowerCase();
    if (t.includes("dinero")) return "bg-green-100 text-green-700";
    if (t.includes("comida") || t.includes("croquetas")) return "bg-yellow-100 text-yellow-700";
    if (t.includes("ropa") || t.includes("mantita")) return "bg-blue-100 text-blue-700";
    if (t.includes("juguete")) return "bg-pink-100 text-pink-700";
    return "bg-gray-100 text-gray-700";
  };

  // Ver detalle en consola
  const handleVerDetalle = (d: Donacion) => {
    console.log("----------Detalles de la Donación-------------");
    console.log(`ID Donación: ${d.id}`);
    console.log(`Usuario ID: ${d.usuarioId}`);
    console.log(`Nombre Usuario: ${d.nombreUsuario || "Anónimo"}`);
    console.log(`Tipo: ${d.tipo || "No especificado"}`);
    console.log(`Monto: $${d.monto}`);
    console.log(`Fecha: ${d.fecha || "No registrada"}`);
    console.log(`Método de Pago: ${d.metodoPago || "No especificado"}`);
    console.log("===================================");
    alert("Detalles de la donación mostrados en consola");
  };

  if (cargando) {
    return <p className="text-center mt-10 text-xl font-semibold text-gray-600">Cargando donaciones...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Donaciones Registradas 
      </h2>

      <table className="min-w-full bg-white rounded-2xl shadow-lg divide-y divide-gray-200">
        <thead className="bg-cyan-200 text-lead rounded-t-2xl">
          <tr>
            <th className="px-6 py-3 text-left font-semibold">ID</th>
            <th className="px-6 py-3 text-left font-semibold">Usuario</th>
            <th className="px-6 py-3 text-left font-semibold">Tipo</th>
            <th className="px-6 py-3 text-left font-semibold">Monto</th>
            <th className="px-6 py-3 text-left font-semibold">Fecha</th>
            <th className="px-6 py-3 text-left font-semibold">Método</th>
            <th className="px-6 py-3 text-left font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {donaciones.map((d) => (
            <tr key={d.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">{d.id}</td>
              <td className="px-6 py-4">{d.nombreUsuario || "Anónimo"}</td>
              <td className={`px-6 py-4 ${colorTipo(d.tipo)}`}>{d.tipo || "-"}</td>
              <td className="px-6 py-4">${d.monto}</td>
              <td className="px-6 py-4">{d.fecha}</td>
              <td className="px-6 py-4">{d.metodoPago || "-"}</td>
              <td className="px-6 py-4">
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => handleVerDetalle(d)}
                >
                  Ver Detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonacionesAdmin;