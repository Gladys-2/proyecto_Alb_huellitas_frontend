import React, { useState, useEffect } from "react";
import type { Animal } from "../types/types";
import axios from "axios";

interface ModalAnimalProps {
  animal: Animal | null; 
  onClose: () => void;
  onSave: (animal: Animal) => void; 
}

const API_URL = import.meta.env.VITE_API_URL;

const ModalAnimal: React.FC<ModalAnimalProps> = ({ animal, onClose, onSave }) => {
  const [nombre, setNombre] = useState("");
  const [especie, setEspecie] = useState("");
  const [raza, setRaza] = useState("");
  const [edad, setEdad] = useState("");
  const [sexo, setSexo] = useState<"Macho" | "Hembra">("Macho");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState<"Disponible" | "Adoptado" | "En cuidado">("Disponible");
  const [foto, setFoto] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (animal) {
      setNombre(animal.nombre ?? "");
      setEspecie(animal.especie ?? "");
      setRaza(animal.raza ?? "");
      setEdad(animal.edad?.toString() ?? "");
      setSexo(animal.sexo ?? "Macho");
      setDescripcion(animal.descripcion ?? "");
      setEstado(animal.estado_animal ?? "Disponible");
      setFoto(animal.foto ?? "");
    } else {
      setNombre("");
      setEspecie("");
      setRaza("");
      setEdad("");
      setSexo("Macho");
      setDescripcion("");
      setEstado("Disponible");
      setFoto("");
    }
  }, [animal]);

  const handleSubmit = async () => {

    if (!nombre || !especie || !raza || !edad || !descripcion || !foto) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s]+$/.test(nombre)) {
      alert("El nombre solo debe contener letras");
      return;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s]+$/.test(especie)) {
      alert("La especie solo debe contener letras");
      return;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s]+$/.test(raza)) {
      alert("La raza solo debe contener letras");
      return;
    }

    const animalPayload: Animal = {
      id: animal?.id,
      nombre,
      especie,
      raza,
      edad: Number(edad),
      sexo,
      descripcion,
      estado_animal: estado,
      foto,
      refugio_id: animal?.refugio_id || 1,
      longitud: 0,
      latitud: 0,
      liked: undefined,
      imagen: undefined
    };

    try {
      setGuardando(true);
      let resAnimal: Animal;
      if (animal?.id) {
        const res = await axios.put(`${API_URL}/animales/editar-animal/${animal.id}`, animalPayload);
        resAnimal = res.data;
      } else {
        const res = await axios.post(`${API_URL}/animales/crear-animal`, animalPayload);
        resAnimal = res.data;
      }
      onSave(resAnimal);
      onClose();
    } catch (err) {
      console.error("Error al guardar animal:", err);
      alert("No se pudo guardar el animal, intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-3xl w-11/12 max-w-lg p-6 flex flex-col gap-4 shadow-xl animate-scaleIn">
        <h2 className="text-2xl font-bold text-center mb-4">
          {animal ? "Editar Animal" : "Registrar Animal"}
        </h2>

        <div className="flex gap-3">
          <FloatingInput label="Nombre" value={nombre} onChange={setNombre} />
          <FloatingInput label="Especie" value={especie} onChange={setEspecie} />
        </div>

        <div className="flex gap-3">
          <FloatingInput label="Raza" value={raza} onChange={setRaza} />
          <FloatingInput label="Edad" value={edad} onChange={setEdad} type="number" />
        </div>

        <FloatingInput label="URL de la foto" value={foto} onChange={setFoto} />
        {foto && <img src={foto} alt="preview" className="w-full h-36 object-cover rounded-lg" />}

        <FloatingTextarea label="Descripción" value={descripcion} onChange={setDescripcion} />

        <div className="flex gap-3">
          <select
            value={sexo}
            onChange={(e) => setSexo(e.target.value as "Macho" | "Hembra")}
            className={selectStyle}
          >
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value as "Disponible" | "Adoptado" | "En cuidado")}
            className={selectStyle}
          >
            <option value="Disponible">Disponible</option>
            <option value="Adoptado">Adoptado</option>
            <option value="En cuidado">En cuidado</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={handleSubmit}
            disabled={guardando}
            className={`${buttonGuardar} ${guardando ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {guardando ? "Guardando..." : "Guardar"}
          </button>
          <button onClick={onClose} disabled={guardando} className={buttonCancelar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// FloatingInput
const FloatingInput: React.FC<{ label: string; value: string; onChange: (val: string) => void; type?: string }> = ({
  label,
  value,
  onChange,
  type = "text",
}) => (
  <div className="relative flex-1">
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder=" "
      className="peer border border-gray-300 px-3 pt-5 pb-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-shadow text-gray-900"
    />
    <label
      className={`absolute left-3 text-sm font-medium transition-all pointer-events-none ${
        value ? "-top-2 text-cyan-400 bg-white px-1" : "top-3 text-gray-400 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400"
      }`}
    >
      {label}
    </label>
  </div>
);

// FloatingTextarea
const FloatingTextarea: React.FC<{ label: string; value: string; onChange: (val: string) => void }> = ({
  label,
  value,
  onChange,
}) => (
  <div className="relative w-full">
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder=" "
      className="peer border border-gray-300 px-3 pt-5 pb-2 rounded-xl w-full h-24 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-shadow text-gray-900"
    />
    <label
      className={`absolute left-3 text-sm font-medium transition-all pointer-events-none ${
        value ? "-top-2 text-cyan-400 bg-white px-1" : "top-3 text-gray-400 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400"
      }`}
    >
      {label}
    </label>
  </div>
);

const selectStyle =
  "border border-gray-300 px-4 py-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-shadow";

const buttonGuardar =
  "bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-xl font-semibold shadow-md transition transform hover:scale-105";
const buttonCancelar =
  "bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-xl font-semibold shadow-md transition transform hover:scale-105";

export default ModalAnimal;