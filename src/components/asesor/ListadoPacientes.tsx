import { Paciente } from '../../pages/asesor/PacientesAsesor'
import DataTable from 'react-data-table-component'
import { FaEye } from 'react-icons/fa'


interface Props {
  filtro: string
  onVerDetalle: (paciente: Paciente) => void
}

const datosFicticios: Paciente[] = [
  { id: '1', nombre: 'Juan Pérez', doctor: 'Dr. López', direccion: 'Calle 1', plan: 'Plan A' },
  { id: '2', nombre: 'Ana Díaz', doctor: 'Dra. Martínez', direccion: 'Calle 2', plan: 'Plan B' },
]

const ListadoPacientes: React.FC<Props> = ({ filtro, onVerDetalle }) => {
  const pacientesFiltrados = datosFicticios.filter(p =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase())
  )

  const columnas = [
    { name: 'Nombre', selector: (row: Paciente) => row.nombre, sortable: true },
    { name: 'Doctor', selector: (row: Paciente) => row.doctor, sortable: true },
    { name: 'Dirección', selector: (row: Paciente) => row.direccion, sortable: true },
    { name: 'Plan', selector: (row: Paciente) => row.plan, sortable: true },
    {
      name: 'Acciones',
      cell: (row: Paciente) => (
        <button
          onClick={() => onVerDetalle(row)}
          className="text-blue-600 hover:text-blue-800"
        >
          <FaEye />
        </button>
      ),
    },
  ]

  return (
    <DataTable
      columns={columnas}
      data={pacientesFiltrados}
      pagination
      highlightOnHover
      responsive
    />
  )
}

export default ListadoPacientes
