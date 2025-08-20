export interface PagoInterface {
  idRegistro: number;
  monto: number;
  foto?: string;
  fechaInicio: Date;
  fechaFin: Date;
  membresiaId:number;
  formaPagoId: number;
  fechaPago: Date;
  formaPago:object;
  membresia:object;  
}

export interface ColDataTablePagos {
  name: string;
  selector?: (row: any) => string;
  sortable?: boolean;
  cell?: (row:PagoInterface) => any;
  ignoreRowClick?: boolean;
  allowOverflow?: boolean;
  button?: boolean;
  maxWidth?:string;
  minWidth?:string;
}

export interface PostPagoInterface {
    monto:number;
    foto?:string;
    fecha_inicio:Date;
    fecha_fin:Date;
    fecha_pago: Date;
    membresia_id:number;
    forma_pago_id:number;
}