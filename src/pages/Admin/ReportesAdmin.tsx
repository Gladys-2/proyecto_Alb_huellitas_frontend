import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import type { Usuario, Animal } from "../../types/types";

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const API_URL = import.meta.env.VITE_API_URL;
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const centerCoords = { lat: -16.500, lng: -68.150 };

const ReportesAdmin: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 5;
  const [cargando, setCargando] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<Animal | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCargando(true);
        const [usuariosRes, animalesRes] = await Promise.all([
          axios.get<Usuario[]>(`${API_URL}/usuarios`),
          axios.get<Animal[]>(`${API_URL}/animales`)
        ]);
        setUsuarios(usuariosRes.data);
        setAnimales(animalesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    fetchData();
  }, []);

  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.apellido_paterno.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.correo_electronico.toLowerCase().includes(busqueda.toLowerCase())
  );

  const indexUltimo = paginaActual * itemsPorPagina;
  const indexPrimero = indexUltimo - itemsPorPagina;
  const usuariosPagina = usuariosFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(usuariosFiltrados.length / itemsPorPagina);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["Nombre,Apellido,Correo"]
        .concat(usuariosFiltrados.map(u => `${u.nombre},${u.apellido_paterno},${u.correo_electronico}`))
        .join("\n");
    saveAs(encodeURI(csvContent), "usuarios.csv");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      usuariosFiltrados.map(u => ({ Nombre: u.nombre, Apellido: u.apellido_paterno, Correo: u.correo_electronico }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    XLSX.writeFile(wb, "usuarios.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Usuarios Registrados", 14, 15);
    (doc as any).autoTable({
      head: [["Nombre", "Apellido", "Correo"]],
      body: usuariosFiltrados.map(u => [u.nombre, u.apellido_paterno, u.correo_electronico]),
      startY: 20
    });
    doc.save("usuarios.pdf");
  };

  const mascotasDisponibles = animales.filter(a => a.estado_animal === "Disponible").length;
  const mascotasAdoptadas = animales.filter(a => a.estado_animal === "Adoptado").length;
  const puntosRescate = animales.filter(a => a.latitud && a.longitud);

  const doughnutData = {
    labels: ["Disponibles", "Adoptadas"],
    datasets: [{
      data: [mascotasDisponibles, mascotasAdoptadas],
      backgroundColor: ["#22c55e", "#facc15"],
      hoverBackgroundColor: ["#16a34a", "#eab308"],
    }]
  };

  const barData = {
    labels: ["Usuarios"],
    datasets: [{
      label: "Cantidad de usuarios",
      data: [usuarios.length],
      backgroundColor: "#3b82f6",
    }]
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Reportes y Estadísticas</h1>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-linear-to-r from-blue-400 to-blue-600 text-white p-6 rounded-xl shadow-lg text-center hover:scale-105 transition">
          <h2 className="text-lg font-semibold">Usuarios</h2>
          <p className="text-3xl mt-2 font-bold">{usuarios.length}</p>
        </div>
        <div className="bg-linear-to-r from-green-400 to-green-600 text-white p-6 rounded-xl shadow-lg text-center hover:scale-105 transition">
          <h2 className="text-lg font-semibold">Mascotas Disponibles</h2>
          <p className="text-3xl mt-2 font-bold">{mascotasDisponibles}</p>
        </div>
        <div className="bg-linear-to-r from-yellow-400 to-yellow-500 text-white p-6 rounded-xl shadow-lg text-center hover:scale-105 transition">
          <h2 className="text-lg font-semibold">Mascotas Adoptadas</h2>
          <p className="text-3xl mt-2 font-bold">{mascotasAdoptadas}</p>
        </div>
        <div className="bg-linear-to-r from-purple-400 to-purple-600 text-white p-6 rounded-xl shadow-lg text-center hover:scale-105 transition">
          <h2 className="text-lg font-semibold">Solicitudes Pendientes</h2>
          <p className="text-3xl mt-2 font-bold">---</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-semibold mb-4 text-gray-700">Estado de Mascotas</h3>
          <Doughnut data={doughnutData} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-semibold mb-4 text-gray-700">Usuarios Registrados</h3>
          <Bar data={barData} />
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Buscar usuarios..."
            className="border px-4 py-2 rounded-xl w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={busqueda}
            onChange={e => { setBusqueda(e.target.value); setPaginaActual(1); }}
          />
          <div className="flex gap-2 mt-2 md:mt-0">
            <button onClick={exportCSV} className="bg-cyan-500 text-white px-4 py-2 rounded-xl hover:bg-cyan-600 transition">CSV</button>
            <button onClick={exportExcel} className="bg-cyan-500 text-white px-4 py-2 rounded-xl hover:bg-cyan-600 transition">Excel</button>
            <button onClick={exportPDF} className="bg-cyan-500 text-white px-4 py-2 rounded-xl hover:bg-cyan-600 transition">PDF</button>
          </div>
        </div>

        {cargando ? <p className="text-center text-gray-500">Cargando usuarios...</p> : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse shadow-sm rounded-xl">
              <thead className="bg-linear-to-r from-cyan-400 to-blue-500 text-white">
                <tr>
                  <th className="px-6 py-3 font-semibold">Nombre</th>
                  <th className="px-6 py-3 font-semibold">Apellido</th>
                  <th className="px-6 py-3 font-semibold">Correo</th>
                </tr>
              </thead>
              <tbody>
                {usuariosPagina.map(u => (
                  <tr key={u.id} className="border-b hover:bg-gray-50 transition cursor-pointer">
                    <td className="px-6 py-3">{u.nombre}</td>
                    <td className="px-6 py-3">{u.apellido_paterno}</td>
                    <td className="px-6 py-3">{u.correo_electronico}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginación */}
            <div className="flex justify-center gap-2 mt-4">
              <button disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)} className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-cyan-100 disabled:opacity-50">Anterior</button>
              {[...Array(totalPaginas)].map((_, i) => (
                <button key={i} onClick={() => setPaginaActual(i + 1)} className={`px-3 py-1 rounded-lg border border-gray-300 ${paginaActual === i + 1 ? "bg-cyan-200 border-cyan-400 text-cyan-700" : "hover:bg-cyan-100"}`}>{i + 1}</button>
              ))}
              <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(paginaActual + 1)} className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-cyan-100 disabled:opacity-50">Siguiente</button>
            </div>
          </div>
        )}
      </div>

      {/* Mapa con Google Maps full-width */}
      {isLoaded && (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-gray-700 font-semibold text-xl mb-4">Mapa de Rescates</h3>
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Contenedor del mapa */}
            <div className="flex-1 rounded-2xl overflow-hidden shadow-inner">
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "600px" }}
                center={centerCoords}
                zoom={12}
              >
                {puntosRescate.map(p => (
                  <Marker
                    key={p.id}
                    position={{ lat: p.latitud!, lng: p.longitud! }}
                    onClick={() => setSelectedMarker(p)}
                  />
                ))}

                {selectedMarker && (
                  <InfoWindow
                    position={{ lat: selectedMarker.latitud!, lng: selectedMarker.longitud! }}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div className="text-gray-800 font-medium">{selectedMarker.nombre}</div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </div>

            {/* Lista lateral */}
            <ul className="flex-1 list-disc list-inside bg-gray-50 p-4 rounded-2xl h-[600px] lg:h-[600px] overflow-y-auto shadow-inner">
              {puntosRescate.map(p => (
                <li key={p.id} className="py-1 text-gray-700 font-medium cursor-pointer" onClick={() => setSelectedMarker(p)}>
                  {p.nombre} - <span className="font-semibold">{p.estado_animal}</span>
                </li>
              ))}
            </ul>

          </div>
        </div>
      )}

    </div>
  );
};

export default ReportesAdmin;