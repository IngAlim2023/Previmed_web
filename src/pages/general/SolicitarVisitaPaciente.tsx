import { useForm, Controller } from "react-hook-form";
import InputComponent from "../../components/formulario/InputComponent";
import ReactSelectComponent from "../../components/formulario/ReactSelectComponent";
import { useEffect, useState } from "react";
import { Visita } from "../../interfaces/visitas";
import { getBarrios } from "../../services/barrios";
import { DataBarrio } from "../../interfaces/Barrio";
import { medicoService } from "../../services/medicoService";
import { getPacientesId } from "../../services/pacientes";
import { useAuthContext } from "../../context/AuthContext";
import { createVisita } from "../../services/visitasService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

//Probar Socket.io Borrar cuando este implementado:
import socket from "../../services/socket";
import { createNotificacionMedico } from "../../services/notificaciones";

const SolicitarVisitaPaciente: React.FC = () => {
  const [pacientes, setpacientes] = useState([]);
  const [medicos, setMedicos] = useState<any>([]);
  const [barrios, setBarrios] = useState<DataBarrio[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectPacientes, setSelectPacientes] = useState<any>([]);
  const [selectMedicos, setSelectMedicos] = useState<any>([]);
  const [selectBarrios, setSelectBarrios] = useState<any>([]);

  const { user } = useAuthContext();
  const navigate = useNavigate();

  // 🔹 Obtener fecha de hoy en formato YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const todayDate = getTodayDate();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Visita>({
    defaultValues: {
      fecha_visita: todayDate,
      estado: true,
      descripcion: "",
      direccion: "",
      paciente_id: null,
      medico_id: null,
      telefono: "",
      barrio_id: null,
    },
  });

  const solicitarVisita = async (data: Visita) => {
    try {
      setIsLoading(true);

      const adjustedData = {
        ...data,
        fecha_visita: `${data.fecha_visita}T12:00:00`,
      };

       await createVisita(adjustedData);

       const notifi = {
        paciente_id:user.id,
        medico_id:data.medico_id
       }

       await createNotificacionMedico(notifi)

      toast.success("Solicitud de visita exitosa");
      socket.emit("solicitudVisita", user);
      socket.emit('visitaMedico',{toUserId:data.medico_id, data:user})
      setTimeout(() => navigate("/home/paciente"), 500);
    } catch (error: any) {
      toast.error(error?.message || "Ocurrió un problema");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const resBarrios = await getBarrios();
        const resMedicos = await medicoService.getDisponibles();
        const resPacientes = await getPacientesId(user.id ? user.id : "");

        setpacientes(resPacientes);
        setBarrios(resBarrios);
        setMedicos(resMedicos);

        // Procesar pacientes
        const pacientesOptions = (resPacientes as any[])
          .filter((b) => b.activo === true && b.beneficiario === true)
          .map((b) => ({
            value: b.idPaciente ? b.idPaciente : b.pacienteId,
            label: `${b.usuario.nombre} ${b.usuario.apellido}`,
          }));
        setSelectPacientes(pacientesOptions);

        // Procesar médicos
        const medicosOptions = (resMedicos as any[])
          .filter((b) => b.estado === true)
          .map((b) => ({
            value: b.id_medico,
            label: `${b.usuario.nombre} ${b.usuario.apellido}`,
          }));
        setSelectMedicos(medicosOptions);

        // Procesar barrios
        const barriosOptions = (resBarrios as any[])
          .filter((b) => b.habilitar === true)
          .map((b) => ({
            value: b.idBarrio,
            label: b.nombreBarrio,
          }));
        setSelectBarrios(barriosOptions);
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("Error al cargar los datos");
      }
    };
    getData();
  }, [user.id]);

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-white px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Solicitud de Visita Médica
            </h1>
            <p className="text-gray-600 mt-2">
              Complete el formulario para agendar una visita médica en casa.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(solicitarVisita)}
            className="px-4 py-4 space-y-4"
          >
            <InputComponent label="Descripción" {...register("descripcion")} />

            <Controller
              name="paciente_id"
              control={control}
              rules={{ required: "El paciente es requerido" }}
              render={({ field }) => (
                <ReactSelectComponent
                  {...field}
                  label="Paciente"
                  placeholder="Selecciona el paciente"
                  required
                  isClearable
                  noOptionsMessage="No hay pacientes disponibles"
                  control={control}
                  options={selectPacientes}
                  name="paciente_id"
                />
              )}
            />

            <Controller
              name="medico_id"
              control={control}
              rules={{ required: "El médico es requerido" }}
              render={({ field }) => (
                <ReactSelectComponent
                  {...field}
                  label="Médico"
                  placeholder="Selecciona el médico"
                  required
                  noOptionsMessage="No hay médicos disponibles"
                  control={control}
                  options={selectMedicos}
                  isClearable
                  name="medico_id"
                />
              )}
            />

            <Controller
              name="barrio_id"
              control={control}
              rules={{ required: "El barrio es requerido" }}
              render={({ field }) => (
                <ReactSelectComponent
                  {...field}
                  label="Barrio"
                  placeholder="Selecciona el barrio"
                  required
                  noOptionsMessage="No hay barrios disponibles"
                  control={control}
                  options={selectBarrios}
                  isClearable
                  name="barrio_id"
                />
              )}
            />

            <InputComponent
              label="Dirección"
              required
              errors={errors?.direccion}
              placeholder="Cra .. # .. - .."
              {...register("direccion", {
                required: "La dirección es requerida",
              })}
            />

            <InputComponent
              label="Fecha de Visita"
              required
              type="date"
              min={todayDate}
              errors={errors?.fecha_visita}
              {...register("fecha_visita", {
                required: "Fecha de visita requerida",
                validate: (value: string) => {
                  if (!value) return "La fecha es requerida";

                  const selectedDate = new Date(value + "T00:00:00");
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  return (
                    selectedDate >= today ||
                    "La fecha de la visita debe ser hoy o posterior"
                  );
                },
              })}
            />

            <InputComponent
              label="Teléfono"
              required
              type="number"
              errors={errors?.telefono}
              {...register("telefono", {
                required: "El teléfono es requerido",
              })}
            />

            <button
              type="submit"
              disabled={isLoading || !isValid}
              className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transform hover:scale-101 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? "Solicitando Visita..." : "Solicitar Visita"}
            </button>
          </form>
        </div>
        <button onClick={()=>{
          socket.emit('solicitudVisita', user)
        }}>
          socket
        </button>
      </div>
    </div>
  );
};

export default SolicitarVisitaPaciente;
