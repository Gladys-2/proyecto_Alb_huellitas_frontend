import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebookF, FaInstagram, FaTiktok, FaChevronLeft, FaChevronRight, FaHeart, FaPaw, FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import { BiWorld } from 'react-icons/bi';
import { GiSittingDog } from 'react-icons/gi';
import { useTranslation } from "react-i18next";

const mascotasAdopcionHero = [
    {
        id: 1,
        tituloPrincipal: "DAIZON",
        subtituloPrincipal: "LABRADOR",
        ubicacion: "2 Años | Amigable",
        descripcion: "Un compañero lleno de vida, muy cariñoso y juguetón. Ideal para familias que buscan un amigo leal.",
        imagenFondo: "https://i.postimg.cc/Yq6rk9bK/Whats-App-Image-2025-11-03-at-19-26-44.jpg",
        imagenTarjeta: "https://i.postimg.cc/Yq6rk9bK/Whats-App-Image-2025-11-03-at-19-26-44.jpg",
    },
    {
        id: 2,
        tituloPrincipal: "LUCAS",
        subtituloPrincipal: "BULLDOG",
        ubicacion: "3 Años | Enérgico",
        descripcion: "Lleno de energía, activo y leal. Necesita ejercicio diario y mucho amor.",
        imagenFondo: "https://i.postimg.cc/8Cq9jdzx/Whats-App-Image-2025-11-03-at-19-29-41.jpg",
        imagenTarjeta: "https://i.postimg.cc/8Cq9jdzx/Whats-App-Image-2025-11-03-at-19-29-41.jpg",
    },
    {
        id: 3,
        tituloPrincipal: "LUNA",
        subtituloPrincipal: "PASTOR ALEMÁN",
        ubicacion: "1 Año | Inteligente",
        descripcion: "Alegre, curiosa e inteligente. Lista para explorar y llenar tu hogar de ternura.",
        imagenFondo: "https://img.freepik.com/foto-gratis/hermosos-gatos-campo_23-2151983519.jpg?semt=ais_incoming&w=740&q=80",
        imagenTarjeta: "https://img.freepik.com/foto-gratis/hermosos-gatos-campo_23-2151983519.jpg?semt=ais_incoming&w=740&q=80",
    },
    {
        id: 4,
        tituloPrincipal: "Rocky",
        subtituloPrincipal: "Huscky Siberiano",
        ubicacion: "1 Año | Energetico",
        descripcion: "Jugueton, curioso e inteligente. Lista para explorar y llenar tu hogar de ternura.",
        imagenFondo: "https://media.istockphoto.com/id/1214614376/es/foto/d%C3%BAo-aullante.jpg?s=612x612&w=0&k=20&c=NyETS_akVC6cWWxVPTn6c8zdpeM-ykZbHGU633uSIYo=",
        imagenTarjeta: "https://media.istockphoto.com/id/1214614376/es/foto/d%C3%BAo-aullante.jpg?s=612x612&w=0&k=20&c=NyETS_akVC6cWWxVPTn6c8zdpeM-ykZbHGU633uSIYo=",
    },
    {
        id: 5,
        tituloPrincipal: "Lucas",
        subtituloPrincipal: "Pomerania",
        ubicacion: "1 Año | Inteligente",
        descripcion: "Muy jugueton, cariñosa. Lista para explorar y llenar tu hogar de ternura.",
        imagenFondo: "https://rovinfood.com/wp-content/uploads/2024/03/destacada-pomerania-1200x675.jpg",
        imagenTarjeta: "https://rovinfood.com/wp-content/uploads/2024/03/destacada-pomerania-1200x675.jpg",
    },
];

const perrosData = [
    { nombre: "Daizon", edad: "2 años", raza: "Labrador", imagen: "https://i.postimg.cc/Yq6rk9bK/Whats-App-Image-2025-11-03-at-19-26-44.jpg", descripcion: "Daizon es un compañero lleno de vida, muy cariñoso y juguetón. Ideal para familias." },
    { nombre: "Lucas", edad: "3 años", raza: "Bulldog", imagen: "https://i.postimg.cc/8Cq9jdzx/Whats-App-Image-2025-11-03-at-19-29-41.jpg", descripcion: "Lucas es un compañero lleno de energía, muy activo y leal. Necesita ejercicio diario." },
    { nombre: "Luna", edad: "1 año", raza: "Pastor Alemán", imagen: "https://i.postimg.cc/jddgq3hR/Whats-App-Image-2025-11-03-at-19-30-59.jpg", descripcion: "Luna es una compañera alegre y curiosa, muy inteligente y siempre lista para aprender cosas nuevas." },
];
const carouselPerros = [...perrosData, ...perrosData];


const blogs = [
    {
        titulo: "¿Cómo adoptar un perrito?",
        descripcion: "Te explicamos el proceso de adopción y los requisitos necesarios.",
        imagen: "https://image.petmd.com/files/styles/978x550/public/2022-04/happy-dogs.jpg",
    },
    {
        titulo: "Cuidados básicos",
        descripcion: "Aprende cómo cuidar correctamente a tu nuevo amigo peludo.",
        imagen: "https://images.unsplash.com/photo-1564325810764-3b92cd6a1833?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE3fHx8ZW58MHx8fHx8",
    },
    {
        titulo: "La importancia de la esterilización",
        descripcion: "Descubre por qué esterilizar a tu mascota es fundamental para su salud y la comunidad.",
        imagen: "https://www.protectivity.com/wp-content/uploads/2024/08/Explained-Dog-Walking-Qualifications-and-Licensing.jpg",
    },
];

const latitud = -16.5;
const longitud = -68.15;
const direccion = "Calle de las Huellitas #2311, La Paz, Bolivia";

interface InicioContenidoProps {
    sidebarAbierto: boolean;
}

const InicioContenido: React.FC<InicioContenidoProps> = ({ sidebarAbierto }) => {
    const { t } = useTranslation();
    const [indiceMascotaActual, setIndiceMascotaActual] = useState(0);
    const [emailSuscripcion, setEmailSuscripcion] = useState("");
    const mascotaActiva = mascotasAdopcionHero[indiceMascotaActual];

    const siguienteMascota = () => setIndiceMascotaActual((prev) => (prev + 1) % mascotasAdopcionHero.length);
    const anteriorMascota = () => setIndiceMascotaActual((prev) => (prev - 1 + mascotasAdopcionHero.length) % mascotasAdopcionHero.length);


    const handleSuscribirse = (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailSuscripcion) return alert("Ingresa un correo válido");
        alert(`¡Gracias por suscribirte! Correo: ${emailSuscripcion}`);
        setEmailSuscripcion("");
    };

    return (
        <div
            className="w-full transition-all duration-300"
            style={{ marginLeft: sidebarAbierto ? 240 : 0 }} 
        >
            {/* inicio..*/}
            <section className="relative w-full h-[90vh] flex items-end justify-start pb-16  overflow-hidden text-white">
                <AnimatePresence initial={false}>
                    <motion.div
                        key={mascotaActiva.id}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${mascotaActiva.imagenFondo}')` }}
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

                <div className="relative z-10 text-center text-white px-2 md:text-left md:px-1 max-w-2xl mb-24">
                    <motion.span className="text-xl font-semibold tracking-wide uppercase text-orange-400">
                        {t(mascotaActiva.ubicacion)}
                    </motion.span>
                    <motion.h1 className="text-5xl sm:text-8xl lg:text-7xl font-extrabold drop-shadow-lg leading-none">
                        {mascotaActiva.tituloPrincipal}
                    </motion.h1>
                    <motion.h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold drop-shadow-lg leading-tight text-gray-200">
                        {mascotaActiva.subtituloPrincipal}
                    </motion.h2>
                    <motion.p className="mt-4 text-xl max-w-lg">
                        {t(mascotaActiva.descripcion)}
                    </motion.p>
                </div>

                {/* Carrusel lateral */}
                <div className="relative z-10 w-full lg:w-1/2 flex items-end justify-end space-x-4 lg:space-x-6 pb-4 md:pb-0">
                    {mascotasAdopcionHero.map((mascota, index) => (
                        <motion.div
                            key={mascota.id}
                            className={`w-40 h-64 rounded-xl overflow-hidden shadow-2xl cursor-pointer transition-transform duration-300
                                ${index === indiceMascotaActual ? "scale-110 border-4 border-orange-500" : "scale-90 opacity-70 hover:opacity-100 hover:scale-95"}`}
                            onClick={() => setIndiceMascotaActual(index)}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 + 1.2, duration: 0.8 }}
                        >
                            <img src={mascota.imagenTarjeta} alt={mascota.tituloPrincipal} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent flex items-end p-4">
                                <h3 className="text-white text-md font-semibold leading-tight">{mascota.tituloPrincipal}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Controles */}
                <div className="absolute bottom-6 left-8 z-20 flex items-center space-x-4">
                    <button onClick={anteriorMascota} className="p-3 bg-white/20 text-white rounded-full hover:bg-white/40 backdrop-blur-sm">
                        <FaChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={siguienteMascota} className="p-3 bg-white/20 text-white rounded-full hover:bg-white/40 backdrop-blur-sm">
                        <FaChevronRight className="w-5 h-5" />
                    </button>
                    <span className="text-xl font-bold ml-4">{String(indiceMascotaActual + 1).padStart(2, "0")}</span>
                </div>
            </section>

            {/* --- */}

            {/*miion */}
            <section className="w-full py-20 bg-gray-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-5xl font-extrabold text-gray-800 mb-4 flex items-center justify-center gap-3">
                        <FaHeart className="text-orange-500 text-4xl" />
                        {t("Nuestra Misión en Huellitas")}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12">{t("Nos dedicamos a transformar vidas, encontrando hogares amorosos para cada animal rescatado, y promoviendo la tenencia responsable.")}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Tarjeta 1 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-teal-500 hover:shadow-xl transition-shadow">
                            <GiSittingDog className="text-6xl text-teal-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t("Rescate y Rehabilitación")}</h3>
                            <p className="text-gray-600">{t("Ofrecemos un refugio seguro, atención médica y el amor necesario para que se recuperen física y emocionalmente.")}</p>
                        </div>
                        {/* Tarjeta 2 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-orange-500 hover:shadow-xl transition-shadow">
                            <FaPaw className="text-6xl text-orange-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t("Conexiones para Siempre")}</h3>
                            <p className="text-gray-600">{t("Facilitamos el proceso de adopción, asegurando que cada mascota encuentre el hogar perfecto para sus necesidades.")}</p>
                        </div>
                        {/* Tarjeta 3 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-teal-500 hover:shadow-xl transition-shadow">
                            <BiWorld className="text-6xl text-teal-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t("Educación Comunitaria")}</h3>
                            <p className="text-gray-600">{t("Promovemos campañas de esterilización y educamos sobre los derechos y el cuidado de los animales.")}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- */}

            {/* el carrusel del perro*/}
            <section className="relative w-full min-h-[700px] py-32 bg-linear-to-b from-white to-orange-50 flex flex-col items-center overflow-hidden border-t border-gray-200">
                <h2 className="relative z-10 text-5xl font-extrabold text-gray-800 mb-4 flex items-center gap-3">
                    <GiSittingDog className="text-orange-500 text-5xl" />
                    {t("Listos para Adoptar")}
                </h2>
                <p className="relative z-10 text-xl text-gray-600 mb-12 text-center max-w-3xl">{t("Desliza para conocer a nuestros residentes más recientes y encuentra a tu nuevo mejor amigo.")}</p>

                <div className="relative z-10 w-full max-w-7xl mx-auto overflow-hidden">
                    <motion.div className="flex items-stretch gap-8" animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }}>
                        {carouselPerros.map((perro, idx) => (
                            <div key={idx} className="flex-none w-[350px] bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-transform hover:scale-105 cursor-pointer border-4 border-white hover:border-teal-500">
                                <img src={perro.imagen} alt={perro.nombre} className="w-full h-72 object-cover" />
                                <div className="p-6 flex flex-col justify-between h-auto min-h-[170px]">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{perro.nombre}</h3>
                                        <p className="text-orange-600 font-semibold text-base mb-2">{t("Edad")}: {perro.edad} | {t("Raza")}: {perro.raza}</p>
                                        <p className="text-gray-600 text-sm line-clamp-none">{perro.descripcion}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* --- */}

            {/* 4. Blogs */}
            <section className="w-full py-20 bg-gray-100 flex flex-col items-center border-t border-gray-200">
                <h2 className="text-5xl font-extrabold mb-4 text-gray-800 flex items-center gap-3">
                    <FaPaw className="text-teal-500 text-4xl" />
                    {t("Consejos y Artículos")}
                </h2>
                <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl">
                    {t("Aprende sobre cuidados, historias de éxito y las últimas noticias de Huellitas.")}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl px-6">
                    {blogs.map((blog, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                            <img src={blog.imagen} alt={blog.titulo} className="w-full h-56 object-cover" />
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{t(blog.titulo)}</h3>
                                <p className="text-gray-600 line-clamp-none">{t(blog.descripcion)}</p>
                                {/* Botón "Leer más" ELIMINADO */}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- */}

            {/*5. Newsletter*/}
            <section className="w-full py-20 bg-teal-500 text-white flex flex-col items-center text-center">
                <h2 className="text-4xl font-extrabold mb-4">{t("Suscríbete a nuestro boletín")}</h2>
                <p className="mb-8 max-w-2xl">{t("Recibe noticias, consejos y novedades sobre nuestras mascotas y eventos.")}</p>
                <form className="flex flex-col sm:flex-row gap-4 w-full max-w-xl px-6" onSubmit={handleSuscribirse}>
                    <input
                        type="email"
                        placeholder={t("Ingresa tu correo")}
                        value={emailSuscripcion}
                        onChange={(e) => setEmailSuscripcion(e.target.value)}
                        className="flex-1 p-4 rounded-lg border-2 border-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <button type="submit" className="bg-orange-500 hover:bg-orange-600 px-6 py-4 rounded-lg font-bold transition-colors">
                        {t("Suscribirse")}
                    </button>
                </form>
            </section>

            {/* --- */}

            <footer className="w-full bg-gray-900 text-gray-200 py-16">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4">Huellitas</h3>
                        <p className="text-gray-400">
                            {t("Brindando amor y un hogar para cada mascota que lo necesita.")}
                        </p>
                        <div className="flex items-center gap-4 mt-6">
                            <a href="#" className="hover:text-white"><FaFacebookF /></a>
                            <a href="#" className="hover:text-white"><FaInstagram /></a>
                            <a href="#" className="hover:text-white"><FaTiktok /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xl font-bold text-white mb-4">{t("Enlaces Rápidos")}</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white">{t("Inicio")}</a></li>
                            <li><a href="#" className="hover:text-white">{t("Adopciones")}</a></li>
                            <li><a href="#" className="hover:text-white">{t("Blog")}</a></li>
                            <li><a href="#" className="hover:text-white">{t("Contacto")}</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white mb-4">{t("Contacto")}</h4>
                        <p className="flex items-center gap-2"><FaMapMarkerAlt /> {t(direccion)}</p>
                        <p className="flex items-center gap-2"><FaPhone /> +591 700-000-000</p>
                        <p className="flex items-center gap-2"><FaEnvelope /> info@huellitas.com</p>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white mb-4">{t("Nuestra Ubicación")}</h4>
                        <iframe
                            src={`https://www.google.com/maps?q=${latitud},${longitud}&hl=es;z=14&output=embed`}
                            width="100%"
                            height="200"
                            className="rounded-lg"
                            loading="lazy"
                        />
                    </div>
                </div>
                <div className="mt-12 text-center text-gray-500">
                    © {new Date().getFullYear()} Huellitas. {t("Todos los derechos reservados.")}
                </div>
            </footer>
        </div>
    );
};

export default InicioContenido;