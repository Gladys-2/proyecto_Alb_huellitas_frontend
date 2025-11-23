import React, { useEffect, useState } from "react";

interface Donacion {
  id: number;
  nombreDonante?: string;
  monto?: number;
  fecha?: string;
  metodoPago?: string;
}

const DonacionesAdmin: React.FC = () => {
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);

  useEffect(() => {
    const fetchDonaciones = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/donaciones/");
        const data = await res.json();
        setDonaciones(data);
      } catch (error) {
        console.error("No se pudieron cargar las donaciones.", error);
      }
    };
    fetchDonaciones();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Donaciones Registradas</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-teal-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Nombre Donante</th>
              <th className="px-6 py-3 text-left">Monto</th>
              <th className="px-6 py-3 text-left">Fecha</th>
              <th className="px-6 py-3 text-left">Método de Pago</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donaciones.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">{d.id}</td>
                <td className="px-6 py-4">{d.nombreDonante}</td>
                <td className="px-6 py-4">${d.monto}</td>
                <td className="px-6 py-4">{d.fecha}</td>
                <td className="px-6 py-4">{d.metodoPago}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonacionesAdmin;