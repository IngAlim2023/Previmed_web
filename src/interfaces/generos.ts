export interface HookFormGeneros{
    generos:string,
    generosRequired: string
}

export interface DataGeneros{
    id_genero:number,
    generos:string
}

export interface ColumnGeneros{
  name:string,
  selector?: (row:any) =>string,
  cell?:(row:any) => any,
  sortable?: boolean;
}