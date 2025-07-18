export interface PagoInterface {
  idPago: number;
  imagen?: string;
  noRecibo: number;
  noContrato: number;
  titular: string;
  cobrador: string;
  fechaCobro: Date;
  fechaInicio: Date;
  fechaFin: Date;
  formaPago: string;
  monto: number;
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
  imagen?: string;
  titular: number;
  fechaCobro: Date;
  fechaInicio: Date;
  fechaFin: Date;
  formaPago: number;
  monto: number;
}