import React from "react";
import type { Animal } from "../types/types";

type CardAnimalProps = {
  animal: Animal;
  onEdit?: (animal: Animal) => void;
};

const CardAnimal: React.FC<CardAnimalProps> = ({ animal, onEdit }) => {
  return (
    <div className="border p-4 rounded shadow-md flex flex-col gap-2">
      <img src={animal.foto || "/assets/default-animal.png"} alt={animal.nombre} className="w-full h-32 object-cover rounded" />
      <h3 className="font-bold text-lg">{animal.nombre}</h3>
      <p>Especie: {animal.especie}</p>
      <p>Raza: {animal.raza}</p>
      <p>Edad: {animal.edad} años</p>
      <p>Estado: {animal.estado_animal}</p>
      {onEdit && (
        <button className="bg-green-500 text-white px-3 py-1 rounded mt-2" onClick={() => onEdit(animal)}>
          Editar
        </button>
      )}
    </div>
  );
};

export default CardAnimal;