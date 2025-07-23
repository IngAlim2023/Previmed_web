import { useForm } from 'react-hook-form'

interface FormularioProps {
  onClose: () => void
}

interface FormularioValores {
  nombre: string
  titular: boolean
}

const FormularioPaciente: React.FC<FormularioProps> = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormularioValores>()

  const onSubmit = (datos: FormularioValores) => {
    console.log('Datos del nuevo paciente:', datos)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Registrar Paciente</h2>

        <label className="block mb-2">Nombre completo</label>
        <input
          {...register('nombre', { required: true })}
          className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
        />
        {errors.nombre && <span className="text-red-500">El nombre es obligatorio</span>}

        <div className="flex items-center mt-4 gap-2">
          <input type="checkbox" {...register('titular')} />
          <label>¿Es titular?</label>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Registrar
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormularioPaciente
