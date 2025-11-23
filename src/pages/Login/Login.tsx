import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useIdioma } from "../../context/IdiomaContext";
import axios from "axios";
import type { Usuario } from "../../types/types";

interface LoginProps {
  mostrarRegistro: () => void;
  onLoginExitoso: (usuario: Usuario) => void;
}

const API_URL = "http://localhost:5000/api/auth";

const Login: React.FC<LoginProps> = ({ mostrarRegistro, onLoginExitoso }) => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const { t } = useIdioma();

  const [animar, setAnimar] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimar(true), 100);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        correo_electronico: correo,
        contrasena,
      });

      if (response.data.usuario) {
        console.log("Login exitoso:", response.data.usuario);
        onLoginExitoso(response.data.usuario);
      } else {
        // Mostrar error específico en consola
        const mensaje = response.data.message || "Usuario o contraseña incorrecta";
        console.log("Error login:", mensaje);
      }
    } catch (error) {
      console.log("Error login:", "Usuario o contraseña incorrecta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center w-full h-screen font-poppins bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: 'url("../Login (2).jpeg")' }}
    >
      <div
        className={`bg-white/20 backdrop-blur-xl rounded-2xl p-10 max-w-sm w-full flex flex-col items-center shadow-xl border border-white/30 transition-all duration-700
        ${animar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <img
          src="../logo.jpeg"
          alt="Logo Huellitas"
          className={`w-32 mb-4 drop-shadow-lg rounded-xl transition-all duration-700 
          ${animar ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
        />

        <h2
          className={`text-3xl font-bold text-gray-900 mb-1 drop-shadow-sm text-center transition-all duration-700 
          ${animar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {t("Bienvenido a Huellitas")}
        </h2>

        <p
          className={`text-gray-800 mb-6 transition-all duration-700 delay-200
          ${animar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {t("Inicia sesión para continuar")}
        </p>

        <form className="flex flex-col gap-4 w-full" onSubmit={handleLogin}>
          <div className="flex items-center gap-2 p-3 rounded-md bg-white/40 backdrop-blur-sm border border-white/50 focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-transparent transition-all">
            <FaEnvelope className="text-gray-700" />
            <input
              type="email"
              placeholder={t("Correo Electrónico")}
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-900"
              required
              autoComplete="email"
            />
          </div>

          <div className="relative flex items-center gap-2 p-3 rounded-md bg-white/40 backdrop-blur-sm border border-white/50 focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-transparent transition-all">
            <FaLock className="text-gray-700" />
            <input
              type={mostrarContrasena ? "text" : "password"}
              placeholder={t("Contraseña")}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-900 pr-10"
              required
              autoComplete="current-password"
            />
            {/* Solo un ojo blanco, cambia a tachado */}
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-black hover:text-yellow-400 hover:scale-110 transition-all"
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
            >
              {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-linear-to-r from-[#E6A84E] to-[#8C5E3C] text-white py-3 rounded-md font-semibold shadow-md hover:scale-[1.03] hover:brightness-110 active:scale-[0.97] transition-all"
          >
            {loading ? t("Cargando...") : t("Iniciar Sesión")}
          </button>
        </form>

        <p
          className={`text-gray-900 mt-4 transition-all duration-700
          ${animar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 text-lg"}`}
        >
          {t("O inicia sesión con")}
        </p>

        <div
          className={`flex justify-center gap-6 my-4 transition-all duration-700
          ${animar ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
        >
          <FcGoogle className="text-3xl cursor-pointer hover:scale-125 hover:brightness-110 transition-all" />
          <FaFacebookF className="text-2xl text-blue-700 cursor-pointer hover:scale-125 hover:brightness-110 transition-all" />
          <FaApple className="text-3xl text-black cursor-pointer hover:scale-125 hover:brightness-110 transition-all" />
        </div>

        <p className="text-mango-900 text-lg">
          {t("¿No tienes cuenta?")}{" "}
          <button className="font-bold underline text-white hover:text-yellow-400 active:text-[#E6A84E] transition-colors text-lg" onClick={mostrarRegistro}>
            {t("Crear cuenta")}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;