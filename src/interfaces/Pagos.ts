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
  membresia:any;  
  numeroRecibo: string;
  estado: string;
  cobradorId: string;
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
    foto?:File;
    fecha_inicio:Date | string;
    fecha_fin:Date | string;
    fecha_pago: Date | string;
    membresia_id:number;
    forma_pago_id:number;
}