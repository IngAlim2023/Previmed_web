export interface MedicosInterface {
    id_medico:number;
    nombre:string;
    segundo_nombre?:string;
    apellido:string;
    segundo_apellido?:string;
    email:string;
    telefono:string;
    direccion:string;
    numero_documento:string;
    fecha_nacimiento:Date;
    numero_hijos?:string;
    estrato?:string;
    //estos campos toca cambiarlos despues cuando se usen los servicios ->
    barrio:string;
    eps?:string;
    rol:string;
    genero?:string;
    tipo_documento:string;
    estado_civil?:string;
    //fin
    autorizacion_datos:boolean;
    password:string;
    created:Date;
    updated:Date;
    habilitar:boolean;
    //hasta aqui son los campos de usuario

    //aqui los datos propios de la tabla medicos
    disponibilidad:boolean; // Si el medicos está en una vista o no
    estado:boolean; // Si el medico está trabajando o de turno
    usuario_id:string;
}

export interface PostMedico {
    nombre:string;
    segundo_nombre?:string;
    apellido:string;
    segundo_apellido?:string;
    email:string;
    telefono:string;
    direccion:string;
    numero_documento:string;
    fecha_nacimiento:Date;
    numero_hijos?:string;
    estrato?:string;
    //estos campos toca cambiarlos despues cuando se usen los servicios ->
    barrio:string;
    eps?:string;
    rol:string;
    genero?:string;
    tipo_documento:string;
    estado_civil?:string;
    //fin
    autorizacion_datos:boolean;
    password:string;
}

export interface ColDataTableMedicos {
  name: string;
  selector?: (row:MedicosInterface) => any;
  sortable?: boolean;
  cell?: (row:MedicosInterface) => any;
  ignoreRowClick?: boolean;
  allowOverflow?: boolean;
  button?: boolean;
  maxWidth?: string;
  width?: string;
  minWidth?: string;
}