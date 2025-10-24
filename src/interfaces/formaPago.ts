export interface FormaPago {
  id_forma_pago: number;
  tipo_pago: string;
  estado: boolean;
}

export interface CreateFormaPagoDto {
  tipo_pago: string;
  estado?: boolean;
}

export interface UpdateFormaPagoDto {
  id_forma_pago: number;
  tipo_pago: string;
  estado: boolean;
}
