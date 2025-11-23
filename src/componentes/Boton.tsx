import React from "react";

type BotonProps = {
  onClick: () => void;
  children: React.ReactNode;
  color?: string;
};

const Boton: React.FC<BotonProps> = ({ onClick, children, color = "bg-blue-500" }) => {
  return (
    <button
      className={`${color} text-white px-4 py-2 rounded hover:opacity-80`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Boton;