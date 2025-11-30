export type Pantalla =
  | "inicioPublico"
  | "login"
  | "registro"
  | "inicio"
  | "usuarios"
  | "reportes"
  | "animalesAdmin"
  | "voluntariosAdmin"
  | "donacionesAdmin"
  | "adopciones"
  | "animales"
  | "voluntarios"
  | "donaciones";
  
export interface Usuario {
  id?: number;                       
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  cedula_identidad?: string;
  telefono?: string;
  correo_electronico: string;
  contrasena?: string;                
  email?: any;                        
  correo?: any;                       
  avatarUrl?: string;
  rol?: "usuario" | "administrador";
  genero?: "M" | "F" | "O";
  estado: "Activo" | "Inactivo";
  fecha_creacion?: Date;
  usuario_creacion?: string;
  fecha_modificacion?: Date;
  usuario_modificacion?: string;
}

export type Refugio = {
  id: number;
  nombre: string;
  direccion: string;
  telefono?: string;
  correo?: string;
  estado?: string;
  fecha_creacion?: Date;
  usuario_creacion?: string;
  fecha_modificacion?: Date;
  usuario_modificacion?: string;
};

export interface Animal {
  imagen: string | undefined;
  liked: any;
  latitud: number;
  longitud: number;
  id?: number;
  nombre: string;
  especie?: string;
  raza?: string;
  edad?: number;
  descripcion?: string;
  estado_animal?: "Disponible" | "Adoptado" | "En cuidado";
  foto?: string;
  sexo?: "Macho" | "Hembra";
  refugio_id?: number;
  estado?: "Activo" | "Inactivo";
  fecha_creacion?: string;
  usuario_creacion?: string;
  fecha_modificacion?: string;
  usuario_modificacion?: string;
}

export interface Adopcion {
  animal: Animal;
  id?: number;
  usuarioId: number;
  animalId: number;
  fecha?: string;
  estado?: "Pendiente" | "Aprobada" | "Rechazada";
  fechaCreacion?: string;
  usuarioCreacion?: string;
  fechaModificacion?: string;
  usuarioModificacion?: string;
}

export interface Donacion {
  id?: number;
  usuarioId?: number;
  nombreUsuario?: string;
  monto: number;
  tipo?: string;
  fecha?: string;
  metodoPago?: string;
  estado?: string;
  fechaCreacion?: string;
  usuarioCreacion?: string;
  fechaModificacion?: string;
  usuarioModificacion?: string;
}

export interface Voluntario {
  id?: number;
  nombre: string;
  telefono?: string;
  correo?: string;
  refugioId?: number;
  estado?: string;
  fechaCreacion?: string;
  usuarioCreacion?: string;
  fechaModificacion?: string;
  usuarioModificacion?: string;
}

export interface Administrador {
  id?: number;
  usuarioId?: number;
  privilegios?: string;
  estado?: string;
  fechaCreacion?: string;
  usuarioCreacion?: string;
  fechaModificacion?: string;
  usuarioModificacion?: string;
}