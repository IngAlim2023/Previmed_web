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

//Comienza Table EPS

export interface ColumnEps{
  name:string,
  selector?: (row:any) =>string,
  cell?:(row:any) => any,
  sortable?: boolean;
}

export interface DataEps{
  ideps: number,
  nombre_eps:string
}

//Termina Table EPS
