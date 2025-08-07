export interface PagoInterface {
  idPago: number;
  imagen?: string;
  noRecibo: number;
  noContrato: number;
  titular: string;
  cobrador: string;
  fechaCobro: Date | string;
  fechaInicio: Date | string;
  fechaFin: Date | string;
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
  fechaCobro: Date | string;
  fechaInicio: Date | string;
  fechaFin: Date | string;
  formaPago: number;
  monto: number;
}