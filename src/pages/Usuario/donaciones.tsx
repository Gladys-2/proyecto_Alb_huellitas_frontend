import React, { useEffect, useState } from "react";
import type { Donacion, Usuario } from "../../types/types";
import { FaMoneyBillWave, FaUtensils, FaTshirt, FaGift } from "react-icons/fa";
import QRCode from "react-qr-code"; // npm install react-qr-code

interface DonacionesUsuarioProps {
  usuario: Usuario;
}

const DonacionesUsuario: React.FC<DonacionesUsuarioProps> = ({ usuario }) => {
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [cargando, setCargando] = useState(true);


  const [nuevoTipo, setNuevoTipo] = useState("");
  const [nuevoMonto, setNuevoMonto] = useState<number | "">("");

  const opcionesSugeridas = [
    { tipo: "Croquetas", img: "https://www.cocinadelirante.com/sites/default/files/images/2020/01/de-que-estan-hechas-las-croquetas-para-perro-croquetas.jpg" },
    { tipo: "Ropa / Mantita", img: "https://images.ctfassets.net/denf86kkcx7r/7cBBhgXWEPikoqMnUAMp4J/d02af392eca9efbdb3bb8614514c9abe/ropaperros-78" },
    { tipo: "Juguete", img: "https://i0.wp.com/paramascotas.com.ar/wp-content/uploads/2021/03/Set-de-juguetes-full-con-pulpo-para-perros-chicos-y-cachorros-azul.jpg?fit=1170%2C1200&ssl=1" },
    { tipo: "Dinero", img: "https://www.bolivianfullexplorer.com/wp-content/uploads/2022/11/dinero-1-1.jpg" },
  ];

  const cargarDonaciones = async () => {
    if (!usuario?.id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/donaciones/usuario/${usuario.id}`);
      const dataRaw: any[] = await res.json();
      const data: Donacion[] = dataRaw.map(d => ({
        id: d.Donacion_id,
        monto: d.Donacion_monto,
        tipo: d.Donacion_tipo,
        fecha: d.Donacion_fecha,
      }));
      setDonaciones(data);
    } catch (err) {
      console.error(err);
      setDonaciones([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDonaciones();
  }, [usuario?.id]);

  const agregarDonacion = async () => {
    if (!usuario?.id) return;
    if (!nuevoTipo.trim()) {
      alert("Por favor ingresa el tipo de donación");
      return;
    }
    if (nuevoTipo.toLowerCase() === "dinero" && (!nuevoMonto || nuevoMonto <= 0)) {
      alert("Ingresa un monto válido para dinero");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/donaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: usuario.id,
          tipo: nuevoTipo,
          monto: nuevoMonto || 0,
        }),
      });
      if (!res.ok) throw new Error("Error creando donación");
      const nuevaDonacion = await res.json();
      setDonaciones(prev => [nuevaDonacion, ...prev]);
      setNuevoTipo("");
      setNuevoMonto("");
    } catch (err) {
      console.error(err);
    }
  };

  // Iconos por tipo
  const iconoTipo = (tipo: string) => {
    const t = tipo?.toLowerCase();
    if (t.includes("dinero") || t.includes("transferencia")) return <FaMoneyBillWave className="text-green-500 w-8 h-8" />;
    if (t.includes("comida") || t.includes("croquetas")) return <FaUtensils className="text-yellow-500 w-8 h-8" />;
    if (t.includes("ropa") || t.includes("mantita")) return <FaTshirt className="text-blue-500 w-8 h-8" />;
    if (t.includes("juguete")) return <FaGift className="text-pink-500 w-8 h-8" />;
    return <FaGift className="text-gray-500 w-8 h-8" />;
  };

  const colorTipo = (tipo?: string) => {
    const t = tipo?.toLowerCase();
    if (!t) return "bg-gray-100 text-gray-700";
    if (t.includes("dinero")) return "bg-green-100 text-green-700";
    if (t.includes("comida") || t.includes("croquetas")) return "bg-yellow-100 text-yellow-700";
    if (t.includes("ropa") || t.includes("mantita")) return "bg-blue-100 text-blue-700";
    if (t.includes("juguete")) return "bg-pink-100 text-pink-700";
    return "bg-gray-100 text-gray-700";
  };

  if (cargando)
    return <p className="text-center mt-10 text-xl font-semibold text-gray-600">Cargando tus donaciones...</p>;

  return (
    <div className="p-6 bg-[#E6F7FF] min-h-screen flex flex-col lg:flex-row gap-8">
      <div className="lg:w-1/3 bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#1E3A8A] mb-2">Nueva Donación</h2>

        <input
          type="text"
          placeholder="¿Qué deseas donar? (Ej: Croquetas, Atún, Peluche)"
          className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-300"
          value={nuevoTipo}
          onChange={e => setNuevoTipo(e.target.value)}
        />

        {nuevoTipo.toLowerCase() === "dinero" && (
          <input
            type="number"
            min={0}
            placeholder="Monto a donar ($)"
            className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-300"
            value={nuevoMonto}
            onChange={e => setNuevoMonto(parseFloat(e.target.value))}
          />
        )}

        {/* Cards de suger. */}
        <div className="flex gap-3 flex-wrap mt-2">
          {opcionesSugeridas.map(op => (
            <div
              key={op.tipo}
              className={`cursor-pointer flex flex-col items-center border rounded-xl p-2 hover:shadow-lg transition-all ${
                nuevoTipo.toLowerCase() === op.tipo.toLowerCase() ? "border-blue-500" : "border-gray-300"
              }`}
              onClick={() => setNuevoTipo(op.tipo)}
            >
              <img src={op.img} alt={op.tipo} className="w-16 h-16 object-cover rounded-lg mb-1" />
              <span className="text-sm font-medium">{op.tipo}</span>
            </div>
          ))}
        </div>

        <button
          className="mt-4 px-6 py-3 bg-[#4DA6FF] hover:bg-[#3399FF] text-white font-bold text-lg rounded-xl shadow-md transition-all"
          onClick={agregarDonacion}
        >
          {nuevoTipo ? `Donar ${nuevoTipo}` : "Donar Ahora"}
        </button>
      </div>

      {/* hist. donaciones*/}
      <div className="lg:w-2/3 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#1E3A8A] mb-2">Historial de Donaciones</h2>

        {donaciones.length === 0 ? (
          <p className="text-gray-600 text-lg">Aún no has realizado donaciones. ¡Anímate a ayudar!</p>
        ) : (
          <div className="flex flex-col gap-4">
            {donaciones.map(d => (
              <div
                key={d.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col sm:flex-row overflow-hidden"
              >
                <div className="sm:w-1/4 h-32 sm:h-auto flex items-center justify-center bg-gray-50">
                  {iconoTipo(d.tipo || "")}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {d.id !== undefined && <p className="text-gray-500 text-sm mb-1"><strong>ID Donación:</strong> {d.id}</p>}
                    {d.monto !== undefined && d.monto > 0 && <p className="text-gray-700 text-lg font-semibold mb-2">Monto: ${d.monto.toFixed(2)}</p>}
                    {d.tipo && <p className={`mb-2 inline-block px-3 py-1 rounded-full font-medium text-sm ${colorTipo(d.tipo)}`}>{d.tipo}</p>}
                    {d.fecha && <p className="text-gray-500 text-sm mb-3">Fecha: {new Date(d.fecha).toLocaleDateString()}</p>}
                  </div>

                  {d.tipo?.toLowerCase() === "dinero" && (
                    <div className="mb-3 p-2 bg-gray-50 rounded-lg flex justify-center">
                      <QRCode value={`https://huellitas-albergue.com/donacion-exitosa`} size={128} />
                    </div>
                  )}

                  <button
                    className="w-full py-2 bg-[#4DA6FF] hover:bg-[#3399FF] text-white font-semibold rounded-xl shadow-md transition-all"
                    onClick={() => alert(`Donar nuevamente a ${d.tipo}`)}
                  >
                    Donar nuevamente
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonacionesUsuario;