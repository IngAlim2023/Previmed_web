import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { formasPagoService } from "../../services/formasPagoService";
import { getPlanes } from "../../services/planes";
import { epsService } from "../../services/epsService";
import SelectComponent from "../../components/formulario/SelectCompontent";
import InputComponent from "../../components/formulario/InputComponent";
import { useNavigate } from "react-router-dom";
import { NuevoContratoForm } from "../../interfaces/interfaces";
import { PostPagoInterface } from "../../interfaces/Pagos";
import ReactSelectComponent from "../../components/formulario/ReactSelectComponent";
import { tiposDocumento } from "../../data/tiposDocumento";
import { generos } from "../../data/generos";
import { estadosCiviles } from "../../data/estadosCiviles";
import { registroCompletoTitular } from "../../services/pacientes";

interface Usuario {
  nombre: string;
  segundo_nombre?: string;
  apellido: string;
  segundo_apellido?: string;
  email: string;
  password: string;
  direccion: string;
  numero_documento: string;
  fecha_nacimiento: string;
  rol_id: number;
  genero: string;
  tipo_documento: string;
  estado_civil: string;
  numero_hijos: string;
  estrato?: number;
  eps_id: number;
}

interface PostPaciente {
  activo: boolean;
  beneficiario: boolean;
  direccion_cobro: string;
  ocupacion?: string;
}

interface FormData {
  usuario: Usuario;
  paciente: PostPaciente;
  contrato: NuevoContratoForm;
  beneficiarios?: any[];
  pago: PostPagoInterface;
}

const StepNavigation = ({ currentStep, totalSteps, onPrev, onNext, isLastStep, onSubmit }: any) => (
  <div className="col-span-1 md:col-span-2 flex justify-between items-center mt-6 pt-6 border-t">
    <button
      type="button"
      onClick={onPrev}
      disabled={currentStep === 1}
      className="flex items-center gap-2 px-6 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg shadow transition"
    >
      ← Anterior
    </button>

    <div className="text-sm text-gray-600">
      Paso {currentStep} de {totalSteps}
    </div>

    {isLastStep ? (
      <button
        type="button"
        onClick={onSubmit}
        className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition"
      >
        Enviar →
      </button>
    ) : (
      <button
        type="button"
        onClick={onNext}
        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
      >
        Siguiente →
      </button>
    )}
  </div>
);

const DatosPersonales = ({ register, control, selectEps, errors }: any) => (
  <>
    <h1 className="col-span-1 md:col-span-2 text-2xl font-semibold text-gray-800 mb-4">
      Registro de Titular
    </h1>

    <InputComponent
      label="Nombre"
      required
      error={errors.nombre}
      {...register("usuario.nombre", { required: "El nombre es requerido" })}
      placeholder="Ingrese el nombre"
    />

    <InputComponent
      label="Segundo Nombre"
      {...register("usuario.segundo_nombre")}
      placeholder="Ingrese el segundo nombre"
    />

    <InputComponent
      label="Apellido"
      required
      error={errors.apellido}
      {...register("usuario.apellido", { required: "El apellido es requerido" })}
      placeholder="Ingrese el apellido"
    />

    <InputComponent
      label="Segundo Apellido"
      {...register("usuario.segundo_apellido")}
      placeholder="Ingrese el segundo apellido"
    />

    <SelectComponent
      label="Tipo de Documento"
      required
      errors={errors.tipo_documento}
      {...register("usuario.tipo_documento", { required: true })}
      options={tiposDocumento}
    />

    <InputComponent
      label="Número de Documento"
      required
      error={errors.numero_documento}
      {...register("usuario.numero_documento", { required: true })}
      placeholder="Ingrese el número de documento"
    />

    <InputComponent
      label="Fecha de Nacimiento"
      required
      type="date"
      error={errors.fecha_nacimiento}
      {...register("usuario.fecha_nacimiento", { required: true })}
    />

    <SelectComponent
      label="Género"
      {...register("usuario.genero")}
      options={generos}
    />

    <SelectComponent
      label="Estado Civil"
      {...register("usuario.estado_civil")}
      options={estadosCiviles}
    />

    <InputComponent
      label="Correo electronico"
      required
      type="email"
      error={errors.email}
      {...register("usuario.email")}
      placeholder="correo@ejemplo.com"
    />

    <InputComponent
      label="Contraseña"
      required
      type="password"
      error={errors.password}
      {...register("usuario.password", {
        minLength: {
          value: 6,
          message: "Mínimo 6 caracteres"
        },
      })}
      placeholder="********"
    />

    <InputComponent
      label="Dirección"
      required
      error={errors.direccion}
      {...register("usuario.direccion")}
      placeholder="Cra .. # ... - .. , barrio"
    />

    <ReactSelectComponent
      name="usuario.eps_id"
      control={control}
      label="EPS"
      options={selectEps}
      placeholder="Selecciona la eps"
      isClearable
    />

    <InputComponent
      label="Número de Hijos"
      type="text"
      {...register("usuario.numero_hijos")}
      placeholder="0"
      min="0"
    />

    <InputComponent
      label="Ocupación"
      {...register("paciente.ocupacion")}
      placeholder="Ingrese la ocupación"
    />

    <InputComponent
      label="Estrato"
      type="number"
      {...register("usuario.estrato")}
      placeholder="Estrato"
      min="1"
      max="6"
    />

    <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600 transition">
      <input
        type="checkbox"
        required
        {...register("usuario.autorizacion_datos")}
        className="w-4 h-4 accent-blue-600"
      />
      <span>Autorización de datos personales</span>
    </label>
    <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600 transition">
      <input
        type="checkbox"
        {...register("paciente.activo")}
        className="w-4 h-4 accent-blue-600"
      />
      <span>Habilitar usuario</span>
    </label>
    <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600 transition">
      <input
        type="checkbox"
        required
        {...register("paciente.beneficiario")}
        className="w-4 h-4 accent-blue-600"
      />
      <span>¿Desea adquirir el servicio?</span>
    </label>
  </>
);

const DatosContrato = ({ register, control, watch, selectPlanes, selectFormasContrato }: any) => (
  <>
    <h2 className="col-span-1 md:col-span-2 text-2xl font-semibold text-gray-800 mb-4">
      Datos del Contrato
    </h2>

    <InputComponent
      label="Numero de contrato"
      required
      value={`CT - ${Date.now()}`}
      {...register("contrato.numero_contrato", { required: true })}
    />

    <InputComponent
      label="Fecha de Inicio"
      required
      type="date"
      max={watch("contrato.fecha_fin")}
      {...register("contrato.fecha_inicio", { required: true })}
    />

    <InputComponent
      label="Fecha de Fin"
      required
      type="date"
      min={watch("contrato.fecha_inicio")}
      {...register("contrato.fecha_fin", { required: true })}
    />

    <ReactSelectComponent
      name="contrato.plan_id"
      control={control}
      label="Plan"
      options={selectPlanes}
      required
      placeholder="Selecciona el plan"
      isClearable
    />

    <ReactSelectComponent
      name="contrato.forma_pago"
      control={control}
      label="Forma de Pago"
      options={selectFormasContrato}
      required
      placeholder="Selecciona la forma de pago"
      isClearable
    />
  </>
);

const RegistroBeneficiarios = () => (
  <>
    <h2 className="col-span-1 md:col-span-2 text-2xl font-semibold text-gray-800 mb-4">
      Registro de Beneficiarios
    </h2>
    <div className="col-span-1 md:col-span-2 p-8 bg-gray-50 rounded-lg text-center">
      <p className="text-gray-600">Módulo de beneficiarios en construcción</p>
    </div>
  </>
);

const FormularioPagos = ({ register, control, watch, selectFormas, errors }: any) => (
  <>
    <h2 className="col-span-1 md:col-span-2 text-2xl font-semibold text-gray-800 mb-4">
      Detalles de pago
    </h2>

    <InputComponent
      label="Fecha de Inicio"
      required
      type="date"
      errors={errors.fecha_inicio}
      max={watch("pago.fecha_fin")}
      {...register("pago.fecha_inicio", { required: true })}
    />

    <InputComponent
      label="Fecha de fin"
      required
      errors={errors.fecha_fin}
      type="date"
      min={watch("pago.fecha_inicio")}
      {...register("pago.fecha_fin", { required: true })}
    />

    <ReactSelectComponent
      name="pago.forma_pago_id"
      control={control}
      label="Forma de Pago"
      options={selectFormas}
      required
      placeholder="Selecciona la forma de pago"
      isClearable
    />

    <InputComponent
      label="Monto"
      required
      errors={errors.monto}
      placeholder="$..."
      type="number"
      {...register("pago.monto", { required: true })}
    />
  </>
);

{/* COMPONENTE PRINCIPAL */}
const FormularioPacientes = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const [paso, setPaso] = useState(1);
  const [formasPago, setFormasPago] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [eps, setEps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const resFormas = await formasPagoService.getAll();
      const resPlan = await getPlanes();
      const resEps = await epsService.getAll();
      setFormasPago(resFormas as any);
      setPlanes(resPlan as any);
      setEps(resEps as any);
    };
    getData();
  }, []);

  const selectFormas = (formasPago as any[])
    .filter((fp) => fp.estado === true)
    .map((fp) => ({
      value: fp.id_forma_pago,
      label: fp.tipo_pago,
    }));

  const selectFormasContrato = (formasPago as any[])
    .filter((fp) => fp.estado === true)
    .map((fp) => ({
      value: fp.id_forma_pago,
      label: fp.tipo_pago,
    }));

  const selectPlanes = (planes as any[])
    .filter((p) => p.estado === true)
    .map((p) => ({
      value: p.idPlan,
      label: (
        <div className="py-2">
          <div className="flex justify-between items-center mb-1">
            <h2 className="font-bold">{p.tipoPlan}</h2>
            <span className="text-blue-600 font-semibold">${p.precio}</span>
          </div>
          <p className="text-sm text-gray-600">{p.descripcion}</p>
          {p.planXBeneficios && p.planXBeneficios.length > 0 && (
            <ul className="list-disc pl-5 mt-1 text-xs text-gray-700">
              {p.planXBeneficios.map((b: any, i: number) => (
                <li key={i}>{b.beneficio?.tipoBeneficio}</li>
              ))}
            </ul>
          )}
          <p className="text-xs font-semibold mt-1 text-gray-700">
            Beneficiarios: {p.cantidadBeneficiarios}
          </p>
        </div>
      ),
    }));

  const selectEps = (eps as any[])
    .filter((e) => e.estado === true)
    .map((e) => ({
      value: e.idEps,
      label: e.nombreEps,
    }));

  const onSubmit = async (data: FormData) => {
    const res = await registroCompletoTitular(data);
    console.log('BODY DE USUARIO = ', data.usuario);
    console.log('BODY DE PACIENTE = ', data.paciente);
    console.log('BODY DE CONTRATO = ', data.contrato);
    console.log('BODY DE PAGO = ', data.pago);
  
    if (!res.data) {
      console.log(res.error)
      toast.error("Ha ocurrido un error en el registro");
      return;
    }
    toast.success("Registro exitoso");
    console.log(res.data)
    setTimeout(() => {
      navigate("/pacientes");
    }, 1500);
  };

  const handleNext = () => {
    if (paso < 4) setPaso(paso + 1);
  };

  const handlePrev = () => {
    if (paso > 1) setPaso(paso - 1);
  };

  const renderStep = () => {
    switch (paso) {
      case 1:
        return (
          <DatosPersonales
            register={register}
            control={control}
            selectEps={selectEps}
            errors={errors}
          />
        );
      case 2:
        return (
          <DatosContrato
            register={register}
            control={control}
            watch={watch}
            selectPlanes={selectPlanes}
            selectFormasContrato={selectFormasContrato}
          />
        );
      case 3:
        return <RegistroBeneficiarios />;
      case 4:
        return (
          <FormularioPagos
            register={register}
            control={control}
            watch={watch}
            selectFormas={selectFormas}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Indicador de progreso */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                    paso >= step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition ${
                      paso > step ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-around text-xs text-gray-600 mt-2 px-2">
            <span>Datos titular</span>
            <span>Contrato</span>
            <span>Beneficiarios</span>
            <span>Pago</span>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderStep()}
          </div>

          <StepNavigation
            currentStep={paso}
            totalSteps={4}
            onPrev={handlePrev}
            onNext={handleNext}
            isLastStep={paso === 4}
            onSubmit={handleSubmit(onSubmit)}
          />
        </div>
      </div>
    </div>
  );
};

export default FormularioPacientes;