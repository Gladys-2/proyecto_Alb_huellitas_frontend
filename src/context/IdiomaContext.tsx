import { createContext, useState, useContext, type ReactNode, type FC } from "react";
import es from "../locales/es/translation.json";
import en from "../locales/en/translation.json";

type Traducciones = Record<string, any>;
export type Idioma = "es" | "en";

interface IdiomaContextType {
  idioma: Idioma;
  setIdioma: (i: Idioma) => void;
  t: (key: string) => any; 
  cambiarIdioma: (i: Idioma) => void;
  modoOscuro: boolean;
  setModoOscuro: (valor: boolean) => void;
}

export const IdiomaContext = createContext<IdiomaContextType>({
  idioma: "es",
  setIdioma: () => {},
  t: (key) => key,
  cambiarIdioma: () => {},
  modoOscuro: false,
  setModoOscuro: () => {},
});

export const IdiomaProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [idioma, setIdioma] = useState<Idioma>(localStorage.getItem("idioma") as Idioma || "es");
  const [modoOscuro, setModoOscuro] = useState(localStorage.getItem("modo") === "oscuro");

  const cambiarIdioma = (nuevoIdioma: Idioma) => {
    setIdioma(nuevoIdioma);
    localStorage.setItem("idioma", nuevoIdioma);
  };

  const t = (key: string): any => {
    const traducciones: Traducciones = idioma === "es" ? es : en;
    return traducciones[key] || key;
  };

  return (
    <IdiomaContext.Provider value={{ idioma, setIdioma, t, cambiarIdioma, modoOscuro, setModoOscuro }}>
      {children}
    </IdiomaContext.Provider>
  );
};

export const useIdioma = (): IdiomaContextType => {
  const context = useContext(IdiomaContext);
  if (!context) throw new Error("useIdioma debe usarse dentro de un IdiomaProvider");
  return context;
};