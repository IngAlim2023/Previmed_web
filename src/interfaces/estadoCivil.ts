export interface HookFormEstadoCivil{
    estado_civil:string,
    estado_civilRequired:string,
}

export interface DataEstadoCivil{
    id_estado_civil:number,
    estado_civil:string
}

export interface ColumnEstadoCivil{
  name:string,
  selector?: (row:any) =>string,
  cell?:(row:any) => any,
  sortable?: boolean;
}