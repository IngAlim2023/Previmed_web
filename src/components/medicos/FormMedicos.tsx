import toast from "react-hot-toast";
import { MedicosInterface, PostMedico } from "../../interfaces/Medicos";
import { useForm } from "react-hook-form";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaIdCard,
  FaBirthdayCake,
  FaChild,
  FaCity,
  FaHospital,
  FaUserTag,
  FaVenusMars,
  FaAddressCard,
  FaHeart,
  FaLock,
} from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { FaUserDoctor } from "react-icons/fa6";

type propsFormMedico = {
  medico?: MedicosInterface;
  setForm: (value: boolean) => void;
};

const FormMedicos: React.FC<propsFormMedico> = ({ medico, setForm }) => {
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<PostMedico>();

  const registrarMedico = () => {
    setForm(false);
    toast.success("Médico registrado exitosamente");
  };

  const actualizarMedico = () => {
    setForm(false);
    toast.success("Médico actualizado exitosamente");
  };

  const inputStyle =
    "w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600";
  const labelStyle =
    "text-sm text-gray-600 font-medium flex items-center gap-2";

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex justify-center items-start overflow-y-auto z-50">
        <form
          onSubmit={handleSubmit(medico ? actualizarMedico : registrarMedico)}
          className="bg-white p-8 rounded-2xl shadow-md w-lg md:w-2xl lg:w-6xl mx-auto border border-gray-200 mt-10 space-y-4"
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl mb-8 font-bold text-gray-700 flex items-center gap-2">
              <FaUserDoctor/> {medico?'Actualizar Médico':'Registro de Médico'}
            </h2>
            <ImCancelCircle
              title="Cancelar"
              className="w-6 h-auto text-gray-500 hover:text-red-600 transition-all duration-500 cursor-pointer"
              onClick={() => setForm(false)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className={labelStyle}>
                <FaUser className="text-blue-900" /> Nombre
              </label>
              <input
                {...register("nombre", { required: true })}
                defaultValue={medico? medico.nombre:''}
                className={inputStyle}
              />
              {errors.nombre && (
                <span className="text-red-500 text-sm">
                  Este campo es obligatorio
                </span>
              )}
            </div>

            <div>
              <label className={labelStyle}>
                <FaUser className="text-blue-900" /> Segundo nombre
              </label>
              <input {...register("segundo_nombre")} className={inputStyle} defaultValue={medico? medico.segundo_nombre:''} />
            </div>

            <div>
              <label className={labelStyle}>
                <FaUser className="text-blue-900" /> Apellido
              </label>
              <input
                {...register("apellido", { required: true })}
                className={inputStyle}
                defaultValue={medico? medico.apellido:''}
              />
              {errors.apellido && (
                <span className="text-red-500 text-sm">
                  Este campo es obligatorio
                </span>
              )}
            </div>

            <div>
              <label className={labelStyle}>
                <FaUser className="text-blue-900" /> Segundo apellido
              </label>
              <input {...register("segundo_apellido")} className={inputStyle} defaultValue={medico? medico.segundo_apellido:''} />
            </div>

            <div>
              <label className={labelStyle}>
                <FaEnvelope className="text-blue-900" /> Correo
              </label>
              <input
                type="email"
                {...register("email", { required: true })}
                defaultValue={medico? medico.email:''}
                className={inputStyle}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">Correo requerido</span>
              )}
            </div>

            <div>
              <label className={labelStyle}>
                <FaPhone className="text-blue-900" /> Teléfono
              </label>
              <input
                {...register("telefono", { required: true })}
                defaultValue={medico? medico.telefono:''}
                className={inputStyle}
              />
              {errors.telefono && (
                <span className="text-red-500 text-sm">Teléfono requerido</span>
              )}
            </div>

            <div>
              <label className={labelStyle}>
                <FaHome className="text-blue-900" /> Dirección
              </label>
              <input
                {...register("direccion", { required: true })}
                className={inputStyle}
                defaultValue={medico? medico.direccion:''}
              />
              {errors.direccion && (
                <span className="text-red-500 text-sm">
                  Dirección requerida
                </span>
              )}
            </div>

            <div>
              <label className={labelStyle}>
                <FaIdCard className="text-blue-900" /> Número de documento
              </label>
              <input
                {...register("numero_documento", { required: true })}
                className={inputStyle}
                defaultValue={medico? medico.numero_documento:''}
              />
              {errors.numero_documento && (
                <span className="text-red-500 text-sm">Número requerido</span>
              )}
            </div>

            <div>
              <label className={labelStyle}>
                <FaBirthdayCake className="text-blue-900" /> Fecha de nacimiento
              </label>
              <input
                type="date"
                {...register("fecha_nacimiento", { required: true })}
                className={inputStyle}
                defaultValue={medico ? new Date(medico.fecha_nacimiento).toISOString().slice(0, 10) : ''}
              />
              {errors.fecha_nacimiento && (
                <span className="text-red-500 text-sm">Campo requerido</span>
              )}
            </div>

            <div>
              <label className={labelStyle}>
                <FaChild className="text-blue-900" /> Número de hijos
              </label>
              <input {...register("numero_hijos")} type="number"  className={inputStyle} defaultValue={medico? medico.numero_hijos:''} />
            </div>

            <div>
              <label className={labelStyle}>
                <FaCity className="text-blue-900" /> Estrato
              </label>
              <input {...register("estrato")} className={inputStyle} defaultValue={medico? medico.estrato:''}/>
            </div>

            <div>
              <label className={labelStyle}>
                <FaHome className="text-blue-900" /> Barrio
              </label>
              <input
                {...register("barrio", { required: true })}
                className={inputStyle}
                defaultValue={medico? medico.barrio:''}
              />
              {errors.barrio && (
                <span className="text-red-500 text-sm">Barrio requerido</span>
              )}
            </div>

            <div>
              <label className={labelStyle}>
                <FaHospital className="text-blue-900" /> EPS
              </label>
              <input {...register("eps")} className={inputStyle} defaultValue={medico? medico.eps:''}/>
            </div>

            <div>
              <label className={labelStyle}>
                <FaUserTag className="text-blue-900" /> Rol
              </label>
              <input
                {...register("rol", { required: true })}
                className={inputStyle}
                defaultValue={medico? medico.rol:''}
              />
              {errors.rol && (
                <span className="text-red-500 text-sm">Rol requerido</span>
              )}
            </div>

            <div>
              <label className={labelStyle}>
                <FaVenusMars className="text-blue-900" /> Género
              </label>
              <input {...register("genero")} className={inputStyle} defaultValue={medico? medico.genero:''}/>
            </div>

            <div>
              <label className={labelStyle}>
                <FaAddressCard className="text-blue-900" /> Tipo de documento
              </label>
              <input
                {...register("tipo_documento", { required: true })}
                className={inputStyle}
                defaultValue={medico? medico.tipo_documento:''}
              />
              {errors.tipo_documento && (
                <span className="text-red-500 text-sm">Campo requerido</span>
              )}
            </div>

            <div>
              <label className={labelStyle}>
                <FaHeart className="text-blue-900" /> Estado civil
              </label>
              <input {...register("estado_civil")} className={inputStyle} defaultValue={medico? medico.estado_civil:''}/>
            </div>

            <div>
              <label className={labelStyle}>
                <FaLock className="text-blue-900" /> Contraseña
              </label>
              <input
                type="password"
                {...register("password", { required: true })}
                className={inputStyle}
                defaultValue={medico? medico.password:''}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  Contraseña requerida
                </span>
              )}
            </div>

            <div className="col-span-full">
              <label className="flex items-center gap-2 text-gray-600 mt-2">
                <input
                  type="checkbox"
                  {...register("autorizacion_datos", { required: true })}
                  className="w-5 h-5 accent-blue-600"
                  defaultChecked={medico? true:false}
                />
                <span className="flex items-center gap-1">
                  Autorizo el uso de mis datos personales
                </span>
              </label>
              {errors.autorizacion_datos && (
                <span className="text-red-500 text-sm ml-2">
                  Debes autorizar los datos
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-6 py-2 rounded-lg shadow transition"
            >
              {medico? 'Actualizar médico':'registrar médico'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FormMedicos;
