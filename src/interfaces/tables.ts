//Comienza Table Documento
export interface ColumnDocumento {
  name: string;
  selector: (row: any) => string;
  sortable: boolean;
}
export interface DataDocumento{
    idtipo_documento: number,
    nombre_documento: string
}

//Termina Table Documento