import { useForm } from "react-hook-form";
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

const SolicitarVisitaPaciente: React.FC = () => {
  const [pacientes, setpacientes] = useState([]);
  const [medicos, setMedicos] = useState<any>([]);
  const [barrios, setBarrios] = useState<DataBarrio[]>([]);
  const {user} = useAuthContext();
  const navigate = useNavigate()

  const { control, register, handleSubmit, formState:{errors} } = useForm<Visita>({
    defaultValues: {
      fecha_visita: new Date().toISOString().split("T")[0],
      estado:true,
      descripcion: "",
      direccion: "",
      paciente_id: null,
      medico_id: null,
      telefono: "",
      barrio_id: null,
    },
  });

  const solicitarVisita = async(data: Visita) => {
    try {
      const res = await createVisita(data)
      if(!res){
        toast.error('Error en la solicitud de la visita')
        return
      }
      toast.success('Solicitud de visita exitosa')
      setTimeout(()=>{
        navigate('/home/paciente')
      }, 500)
    } catch (error) {
      toast.error('Ocurrió un problema en la solicitud de la visita')
    }
  };

  useEffect(()=>{
    const getData = async () => {
      const resBarrios = await getBarrios();
      const resMedicos = await medicoService.getDisponibles();
      const resPacientes = await getPacientesId(user.id? user.id : '');
      setpacientes(resPacientes)
      setBarrios(resBarrios)
      setMedicos(resMedicos)
    }
    getData();
  }, [])

  const selectPacientes = (pacientes as any[])
  .filter((b) => b.activo === true && b.beneficiario === true)
  .map((b) => ({
    value: b.idPaciente? b.idPaciente : b.pacienteId,
    label: (
      <div className="flex justify-between">
        <p>{b.usuario.nombre + ' ' + b.usuario.apellido}</p>
        {b.pacienteId == null? (<p className="text-blue-700 px-2 bg-blue-200 rounded-xl">Titular</p>) : <p className="text-gray-700 px-2 bg-gray-200 rounded-xl">Beneficiario</p>}
      </div>
    )
  }));

  const selectMedicos = (medicos as any[])
  .filter((b) => b.estado === true)
  .map((b) => ({
    value: b.id_medico,
    label: b.usuario.nombre + ' ' + b.usuario.apellido,
  }));

  const selectBarrios = (barrios as any[])
  .filter((b) => b.habilitar === true)
  .map((b) => ({
    value: b.idBarrio,
    label: b.nombreBarrio,
  }));

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

          <form onSubmit={handleSubmit(solicitarVisita)} className="px-4 py-4 space-y-4">
              <InputComponent label="Descripción" {...register('descripcion')}/>

              <ReactSelectComponent
                label="Paciente"
                name="paciente_id"
                placeholder="Selecciona el paciente"
                required
                isClearable
                noOptionsMessage="No hay pacientes disponibles"
                control={control}
                options={selectPacientes}
              />

              <ReactSelectComponent
                label="Médico"
                name="medico_id"
                placeholder="Selecciona el médico"
                required
                noOptionsMessage="No hay médicos disponibles"
                control={control}
                options={selectMedicos}
                isClearable
              />

              <ReactSelectComponent
                label="Barrio"
                name="barrio_id"
                placeholder="Selecciona el barrio"
                required
                noOptionsMessage="No hay barrios disponibles"
                control={control}
                options={selectBarrios}
                isClearable
              />

              <InputComponent 
                label="Dirección" 
                required
                errors={errors?.direccion}
                placeholder="Cra .. # .. - .."
                {...register('direccion', {required: "La dirección es requerida"})}
              />

              <InputComponent
                label="Fecha de Visita"
                required
                type="date"
                min={new Date().toISOString().split("T")[0]}
                errors={errors?.fecha_visita}
                {...register('fecha_visita', 
                  { required: "Fecha de visita requerida",
                      validate: (value:string) => {
                        const fecha = new Date(value);
                        const limite = new Date();
                        return fecha < limite || "La fecha de la visita no puede ser inferior a hoy";
                      }
                  })
                }
              />

              <InputComponent 
                label="Teléfono" 
                required
                type="number"
                errors={errors?.telefono}
                {...register('telefono', {required: "El teléfono es requerido"})}
              />
            
              <button
                type="submit"
                className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transform hover:scale-101 transition-all"
              >
                Solicitar Visita
              </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SolicitarVisitaPaciente;