import { useForm } from "react-hook-form"
import { Rol } from "../../interfaces/roles"
import toast from "react-hot-toast"
import { createRol, updateRol } from "../../services/roles"

// 👇 Tus botones personalizados
import BtnActualizar from "../botones/BtnActualizar"
import BtnCancelar from "../botones/BtnCancelar"

type Props = {
  rol?: Rol | null
  setForm: (value: boolean) => void
  onSuccess: () => void // 🔥 refresca los datos al guardar
}

type RolFormValues = {
  nombre_rol: string
  estado: string
}

const FormularioRoles: React.FC<Props> = ({ rol, setForm, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RolFormValues>({
    defaultValues: rol
      ? {
          nombre_rol: rol.nombre_rol,
          estado: rol.estado ? "true" : "false",
        }
      : {
          nombre_rol: "",
          estado: "true",
        },
  })

  const onSubmit = async (data: RolFormValues) => {
    try {
      const payload: Rol = {
        id_rol: rol ? rol.id_rol : 0,
        nombre_rol: data.nombre_rol,
        estado: data.estado === "true",
      }

      if (rol) {
        await updateRol(rol.id_rol, payload)
        toast.success("Rol actualizado")
      } else {
        await createRol(payload)
        toast.success("Rol creado")
      }

      setForm(false)
      onSuccess() // 🔥 recarga los datos
    } catch (error) {
      toast.error("Error al guardar el rol")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-96 p-6 relative">
        {/* Encabezado */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            {rol ? "Editar Rol" : "Nuevo Rol"}
          </h2>

          {/* 👇 Aquí usamos tu BtnCancelar como botón de cerrar */}
          <div onClick={() => setForm(false)}>
            <BtnCancelar verText={false} text="" />
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Nombre del Rol
            </label>
            <input
              type="text"
              {...register("nombre_rol", {
                required: "El nombre es obligatorio",
              })}
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
            />
            {errors.nombre_rol && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nombre_rol.message}
              </p>
            )}
          </div>

          {/* Estado */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Estado</label>
            <select
              {...register("estado", { required: true })}
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>

          {/* Botón Guardar/Actualizar */}
          <div className="flex justify-end pt-2">
            <div onClick={handleSubmit(onSubmit)}>
              <BtnActualizar
                verText={true}
                text={rol ? "Actualizar" : "Guardar"}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioRoles
