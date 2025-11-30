import React, { useState, useEffect } from "react";
import type { Usuario } from "../../types/types";
import BandejaUsuarios from "../../componentes/Bandejas/BandejaUsuarios";
import ModalUsuario from "../../componentes/ModalUsuario";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface UsuariosProps {
  usuarioLogueado: Usuario;
}

const API_URL = import.meta.env.VITE_API_URL;

const Usuarios: React.FC<UsuariosProps> = ({ usuarioLogueado }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [modalUsuario, setModalUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 5;

  const fetchUsuarios = async () => {
    try {
      setCargando(true);
      const res = await axios.get<Usuario[]>(`${API_URL}/usuarios`);
      const usuariosConEstado = res.data.map(u => ({
        ...u,
        estado: u.estado ?? "Activo",
      }));
      setUsuarios(usuariosConEstado);
    } catch (err) {
      console.error("Ocurrio un error al obtener el usuarios:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter(
    u =>
      u.nombre.toLowerCase().startsWith(busqueda.toLowerCase()) ||
      (u.apellido_paterno?.toLowerCase().startsWith(busqueda.toLowerCase()) ?? false) ||
      u.correo_electronico.toLowerCase().startsWith(busqueda.toLowerCase())
  );

  const indexUltimo = paginaActual * itemsPorPagina;
  const indexPrimero = indexUltimo - itemsPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(usuariosFiltrados.length / itemsPorPagina);

  const handleEdit = (usuario: Usuario) => setModalUsuario(usuario);

  const handleCreate = () =>
    setModalUsuario({
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      correo_electronico: "",
      rol: "usuario",
      estado: "Activo",
    });

  // Toggle estado usando backend
  const handleToggle = async (usuario: Usuario) => {
    const nuevoEstado = usuario.estado === "Activo" ? "Inactivo" : "Activo";

    try {
      const res = await axios.put(`${API_URL}/usuarios/${usuario.id}`, {
        ...usuario,
        estado: nuevoEstado,
      });
      const usuarioActualizado = res.data;
      setUsuarios(prev =>
        prev.map(u => (u.id === usuario.id ? usuarioActualizado : u))
      );
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert("No se pudo cambiar el estado del usuario.");
    }
  };

  // Guardar usuario (crear o editar)
  const handleSave = async (usuarioEditado: Usuario) => {
    try {
      let usuarioGuardado: Usuario;

      if (usuarioEditado.id) {
        // Editar
        const res = await axios.put(`${API_URL}/usuarios/${usuarioEditado.id}`, usuarioEditado);
        usuarioGuardado = res.data;
        setUsuarios(prev =>
          prev.map(u => (u.id === usuarioEditado.id ? usuarioGuardado : u))
        );
      } else {
        // Crear
        const res = await axios.post(`${API_URL}/usuarios`, usuarioEditado);
        usuarioGuardado = res.data;
        setUsuarios(prev => [...prev, usuarioGuardado]);
        setPaginaActual(1); 
      }

      setModalUsuario(null);
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      alert("No se pudo guardar el usuario.");
    }
  };

  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Nombre,Apellido,Correo,Rol,Estado"]
        .concat(
          usuariosFiltrados.map(
            u =>
              `${u.nombre},${u.apellido_paterno},${u.correo_electronico},${u.rol},${u.estado}`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, "usuarios.csv");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      usuariosFiltrados.map(u => ({
        Nombre: u.nombre,
        Apellido: u.apellido_paterno,
        Correo: u.correo_electronico,
        Rol: u.rol,
        Estado: u.estado,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    XLSX.writeFile(wb, "usuarios.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Usuarios Registrados", 14, 15);
    const body = usuariosFiltrados.map(u => [
      u.nombre,
      u.apellido_paterno,
      u.correo_electronico,
      u.rol,
      u.estado,
    ]);
    (doc as any).autoTable({
      head: [["Nombre", "Apellido", "Correo", "Rol", "Estado"]],
      body,
      startY: 20,
    });
    doc.save("usuarios.pdf");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Usuarios Registrados</h1>
        <button
          onClick={handleCreate}
          className="bg-cyan-200 hover:bg-cyan-500 text-lead px-5 py-2 rounded-3xl shadow-xl font-semibold transition-transform transform hover:scale-105"
        >
          + Agregar Usuario
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-2 items-center">
        <input
          type="text"
          placeholder="Buscar usuarios..."
          className="border px-3 py-2 rounded-3xl w-full md:w-1/3 shadow focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <div className="flex gap-2 mt-2 md:mt-0">
          <button onClick={exportCSV} className={buttonStyle}>CSV</button>
          <button onClick={exportExcel} className={buttonStyle}>Excel</button>
          <button onClick={exportPDF} className={buttonStyle}>PDF</button>
        </div>
      </div>

      {cargando ? (
        <div className="text-center py-20 text-gray-500">Cargando usuarios...</div>
      ) : usuariosFiltrados.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No hay usuarios para mostrar.</div>
      ) : (
        <>
          <BandejaUsuarios
            usuarios={usuariosPaginados}
            onEdit={handleEdit}
            onToggle={handleToggle}
            rolActual={usuarioLogueado.rol ?? "usuario"}
          />

          <div className="flex justify-center gap-3 mt-6">
            <button
              disabled={paginaActual === 1}
              className={buttonStyle}
              onClick={() => setPaginaActual(paginaActual - 1)}
            >
              Anterior
            </button>
            <span className="px-2 py-1 bg-white rounded-full shadow">{`${paginaActual} / ${totalPaginas}`}</span>
            <button
              disabled={paginaActual === totalPaginas}
              className={buttonStyle}
              onClick={() => setPaginaActual(paginaActual + 1)}
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {modalUsuario && (
        <ModalUsuario
          usuario={modalUsuario}
          usuarioLogueado={usuarioLogueado}
          onClose={() => setModalUsuario(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const buttonStyle =
  "bg-cyan-200 hover:bg-cyan-500 text-lead px-4 py-2 rounded-3xl shadow transition-transform transform hover:scale-105 font-semibold";

export default Usuarios;