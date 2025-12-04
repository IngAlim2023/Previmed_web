// src/interfaces/barrios.ts
export interface DataBarrio {
  idBarrio?: string | number;             // id (string o number según backend)
  nombreBarrio: string;          // nombre del barrio
  ciudad?: string;               // opcional
  comuna?: number | string;      // opcional
  latitud?: number | null;       // opcional
  longitud?: number | null;      // opcional
  habilitar: boolean;            // activo/inactivo
}

export interface BarrioFormProps {
  initialData?: Partial<DataBarrio>;
  onSubmit: (barrio: Partial<DataBarrio>) => void;
  onCancel: () => void;
}
