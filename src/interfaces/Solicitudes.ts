export interface PostSolicitud {
    primer_nombre: string;
    segundo_nombre?: string;
    primer_apellido: string;
    segundo_apellido?: string;
    email:string;
    documento:string;
    telefono:string;
    descripcion?:string;
    autorizacion_datos:boolean;
    id_tipo_solicitud:number;
    id_usuario?:string;
}