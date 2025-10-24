import { useForm, useFieldArray  } from "react-hook-form";
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
  genero?: string;
  tipo_documento: string;
  estado_civil?: string;
  numero_hijos?: string;
  estrato?: number;
  eps_id?: number | null;
  autorizacion_datos: boolean;
}

interface PostPaciente {
  activo: boolean;
  beneficiario: boolean;
  direccion_cobro?: string;
  ocupacion?: string;
}

interface Persona{
  usuario:Usuario;
  paciente:PostPaciente;
}

interface FormData {
  titular: Persona;
  contrato: NuevoContratoForm;
  beneficiarios?: Persona[];
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

const DatosPersonales = ({ register, control, selectEps, errors, prefix = "titular" }: any) => (
  <>
    <h1 className="col-span-1 md:col-span-2 text-2xl font-semibold text-gray-800 mb-4">
      Registro de {prefix === "titular" ? "Titular" : "Beneficiario"}
    </h1>

    <InputComponent
      label="Nombre"
      required
      errors={errors?.usuario?.nombre}
      {...register(`${prefix}.usuario.nombre`, { required: "El nombre es requerido" })}
      placeholder="Ingrese el nombre"
    />

    <InputComponent
      label="Segundo Nombre"
      {...register(`${prefix}.usuario.segundo_nombre`)}
      placeholder="Ingrese el segundo nombre"
    />

    <InputComponent
      label="Apellido"
      required
      errors={errors?.usuario?.apellido}
      {...register(`${prefix}.usuario.apellido`, { required: "El apellido es requerido" })}
      placeholder="Ingrese el apellido"
    />

    <InputComponent
      label="Segundo Apellido"
      {...register(`${prefix}.usuario.segundo_apellido`)}
      placeholder="Ingrese el segundo apellido"
    />

    <SelectComponent
      label="Tipo de Documento"
      required
      errors={errors?.usuario?.tipo_documento}
      {...register(`${prefix}.usuario.tipo_documento`, { required: "Tipo de documento requerido" })}
      options={tiposDocumento}
    />

    <InputComponent
      label="Número de Documento"
      required
      type="number"
      errors={errors?.usuario?.numero_documento}
      {...register(`${prefix}.usuario.numero_documento`, { required: "Número de documento requerido" })}
      placeholder="Ingrese el número de documento"
    />

    <InputComponent
      label="Fecha de Nacimiento"
      required
      type="date"
      max={new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split("T")[0]}
      errors={errors?.usuario?.fecha_nacimiento}
      {...register(`${prefix}.usuario.fecha_nacimiento`, 
        { required: "Fecha de nacimiento requerida",
            validate: (value:string) => {
              const fecha = new Date(value);
              const limite = new Date();
              limite.setDate(limite.getDate() - 1);
              return fecha <= limite || "La fecha no puede ser posterior a hoy";
            }
        })
      }
    />

    <SelectComponent
      label="Género"
      {...register(`${prefix}.usuario.genero`)}
      options={generos}
    />

    <SelectComponent
      label="Estado Civil"
      {...register(`${prefix}.usuario.estado_civil`)}
      options={estadosCiviles}
    />

    <InputComponent
      label="Correo electronico"
      required
      type="email"
      errors={errors?.usuario?.email}
      {...register(`${prefix}.usuario.email`, {
        required: "El correo es requerido",
      })}
      placeholder="correo@ejemplo.com"
    />

    <InputComponent
      label="Contraseña"
      required
      type="password"
      errors={errors?.usuario?.password}
      {...register(`${prefix}.usuario.password`, {
        required: "La contraseña es requerida",
        minLength: {
          value: 6,
          message: "Mínimo 6 caracteres"
        }
      })}
      placeholder="********"
    /> 

    <InputComponent
      label="Dirección"
      required
      errors={errors?.usuario?.direccion}
      {...register(`${prefix}.usuario.direccion`, { required: "La dirección es requerida" })}
      placeholder="Cra .. # ... - .. , barrio"
    />

    <ReactSelectComponent
      name={`${prefix}.usuario.eps_id`}
      control={control}
      label="EPS"
      options={selectEps}
      placeholder="Selecciona la eps"
      isClearable
    />

    <InputComponent
      label="Número de Hijos"
      type="number"
      {...register(`${prefix}.usuario.numero_hijos`)}
      placeholder="0"
      min="0"
    />

    <InputComponent
      label="Ocupación"
      {...register(`${prefix}.paciente.ocupacion`)}
      placeholder="Ingrese la ocupación"
    />

    <InputComponent
      label="Estrato"
      type="number"
      {...register(`${prefix}.usuario.estrato`)}
      placeholder="Estrato"
      min="1"
      max="6"
    />

    <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600 transition">
      <input
        type="checkbox"
        {...register(`${prefix}.usuario.autorizacion_datos`, { required: "Debe autorizar el uso de datos" })}
        className="w-4 h-4 accent-blue-600"
      />
      <span>Autorización de datos personales *</span>
    </label>
    
    {errors?.usuario?.autorizacion_datos && (
      <span className="col-span-1 md:col-span-2 text-xs text-red-500 -mt-4">
        {errors.usuario.autorizacion_datos.message}
      </span>
    )}

    <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600 transition">
      <input
        type="checkbox"
        {...register(`${prefix}.paciente.activo`)}
        className="w-4 h-4 accent-blue-600"
      />
      <span>Habilitar usuario</span>
    </label>

    {prefix == 'titular' && (
    <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600 transition">
      <input
        type="checkbox"
        {...register(`${prefix}.paciente.beneficiario`)}
        className="w-4 h-4 accent-blue-600"
      />
      <span>¿Desea hacer uso del servicio?</span>
    </label>
    )}
  </>
);

const DatosContrato = ({ register, control, watch, selectPlanes, selectFormasContrato, errors }: any) => (
  <>
    <h2 className="col-span-1 md:col-span-2 text-2xl font-semibold text-gray-800 mb-4">
      Datos del Contrato
    </h2>

    <InputComponent
      label="Numero de contrato"
      required
      errors={errors?.contrato?.numero_contrato}
      {...register("contrato.numero_contrato", { required: "Número de contrato requerido" })}
      readOnly
    />

    <InputComponent
      label="Fecha de Inicio"
      required
      type="date"
      errors={errors?.contrato?.fecha_inicio}
      max={watch("contrato.fecha_fin")}
      {...register("contrato.fecha_inicio", 
        { required: "Fecha de inicio requerida",
          validate: (value:any) => {
            const fechaInicio = new Date(value);
            const fechaFin = new Date(watch("contrato.fecha_fin"));
            return (fechaInicio < fechaFin || "La fecha de inicio debe ser inferior a la fecha de fin");
          }
        })
      }
    />

    <InputComponent
      label="Fecha de Fin"
      required
      type="date"
      errors={errors?.contrato?.fecha_fin}
      min={watch("contrato.fecha_inicio")}
      {...register("contrato.fecha_fin", 
        { required: "Fecha de fin requerida",
          validate: (value:any) => {
            const fechaFin = new Date(value);
            const fechaInicio = new Date(watch("contrato.fecha_inicio"))
            return (fechaFin > fechaInicio || "La fecha de fin debe ser posterior a la fecha de inicio");
          }
        })
      }
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

    <ReactSelectComponent
      name="contrato.plan_id"
      control={control}
      label="Plan"
      options={selectPlanes}
      required
      placeholder="Selecciona el plan"
      isClearable
    />
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
      errors={errors?.pago?.fecha_inicio}
      max={watch("pago.fecha_fin")}
      {...register("pago.fecha_inicio", 
        { required: "Fecha de inicio requerida",
          validate: (value:any) => {
            const fechaInicio = new Date(value);
            const fechaFin = new Date(watch("pago.fecha_fin"));
            return (fechaInicio < fechaFin || "La fecha de inicio debe ser inferior a la fecha de fin");
          }
        })}
    />

    <InputComponent
      label="Fecha de fin"
      required
      type="date"
      errors={errors?.pago?.fecha_fin}
      min={watch("pago.fecha_inicio")}
      {...register("pago.fecha_fin", 
        { required: "Fecha de fin requerida",
          validate: (value:any) => {
            const fechaFin = new Date(value);
            const fechaInicio = new Date(watch("pago.fecha_inicio"))
            return (fechaFin > fechaInicio || "La fecha de fin debe ser posterior a la fecha de inicio");
          }
        })}
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
      type="number"
      errors={errors?.pago?.monto}
      placeholder="$..."
      {...register("pago.monto", { 
        required: "El monto es requerido",
        min: { value: 1, message: "Monto debe ser mayor a 0" }
      })}
    />
  </>
);

const FormularioPacientes = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    mode: "all",
    defaultValues: {
      titular: {
        usuario: {
          rol_id: 4,
          autorizacion_datos: false,
        },
        paciente: {
          activo: true,
          beneficiario: false,
          direccion_cobro: ""
        }
      },
      contrato: {
        numero_contrato: `CT-${Date.now()}`,
        fecha_inicio: new Date().toISOString().split("T")[0]
      },
      pago: {
        fecha_inicio: new Date().toISOString().split("T")[0]
      }
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "beneficiarios"
  });

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
        
    setValue("contrato.numero_contrato", `CT-${Date.now()}`);
    setValue("contrato.fecha_inicio", new Date().toISOString().split("T")[0]);
    setValue("pago.fecha_inicio", new Date().toISOString().split("T")[0]);
    trigger('contrato.fecha_inicio')
    trigger('contrato.fecha_fin')
    trigger('pago.fecha_inicio')
    trigger('pago.fecha_fin')
  }, [setValue, watch('contrato.fecha_fin'), watch('pago.fecha_fin')]);

  const validateStep = async () => {
    let fieldsToValidate: string[] = [];

    switch (paso) {
      case 1: // Validar datos del titular
        fieldsToValidate = [
          "titular.usuario.nombre",
          "titular.usuario.apellido",
          "titular.usuario.tipo_documento",
          "titular.usuario.numero_documento",
          "titular.usuario.fecha_nacimiento",
          "titular.usuario.email",
          "titular.usuario.password",
          "titular.usuario.direccion",
          "titular.usuario.autorizacion_datos"
        ];
        break;
      case 2: // Validar datos del contrato
        fieldsToValidate = [
          "contrato.numero_contrato",
          "contrato.fecha_inicio",
          "contrato.fecha_fin",
          "contrato.forma_pago",
          "contrato.plan_id"
        ];
        break;
      case 3: // Beneficiarios - opcional
        if (fields.length === 0) {
          return true; // Si no hay beneficiarios, es válido (es opcional)
        }
  
        // Validar cada beneficiario
        const beneficiarioFields: string[] = [];
        fields.forEach((_, index) => {
          beneficiarioFields.push(
            `beneficiarios.${index}.usuario.nombre`,
            `beneficiarios.${index}.usuario.apellido`,
            `beneficiarios.${index}.usuario.tipo_documento`,
            `beneficiarios.${index}.usuario.numero_documento`,
            `beneficiarios.${index}.usuario.fecha_nacimiento`,
            `beneficiarios.${index}.usuario.email`,
            `beneficiarios.${index}.usuario.password`,
            `beneficiarios.${index}.usuario.direccion`,
            `beneficiarios.${index}.usuario.autorizacion_datos`
          );
        });
        const result = await trigger(beneficiarioFields as any);
        return result;
      case 4: // Validar datos de pago
        fieldsToValidate = [
          "pago.numero_contrato",
          "pago.fecha_inicio",
          "pago.fecha_fin",
          "pago.monto",
          "pago.forma_pago_id"
        ];
        break;
      default:
        return true;
    }

    const result = await trigger(fieldsToValidate as any);
    return result;
  };

  const selectedPlan:any = planes.find((p: any) => p.idPlan == watch('contrato.plan_id'));
  if (selectedPlan) {
    setValue("pago.monto", parseFloat(selectedPlan.precio));
  }

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
    // Preparar datos correctamente para el backend
    const dataToSend = {
      titular: {
        usuario: {
          ...data.titular.usuario,
          rol_id: 4,
          numero_documento: data.titular.usuario.numero_documento.toString()
        },
        paciente: {
          ...data.titular.paciente,
          beneficiario: data.titular.paciente.beneficiario
        }
      },
      contrato: data.contrato,
      beneficiarios: data.beneficiarios?.map(b => ({
        usuario: {
          ...b.usuario,
          rol_id: 4,
          numero_documento: b.usuario.numero_documento.toString()
        },
        paciente: {
          ...b.paciente,
          beneficiario: true,
          direccion_cobro: b.usuario.direccion
        }
      })) || [],
      pago: data.pago
    };

    const res = await registroCompletoTitular(dataToSend);
  
    if (!res.data) {
      toast.error(res.message || "Ha ocurrido un error en el registro");
      return;
    }
    toast.success("Registro exitoso");
    
    setTimeout(() => {
      navigate("/pacientes");
    }, 1000);
  };

  const handleNext = async () => {
    const isStepValid = await validateStep();
    
    if (isStepValid) {
      if (paso < 4) setPaso(paso + 1);
    } else {
      toast.error("Por favor llena o verifica los campos marcados en rojo");
      // Forzar scroll hacia arriba para ver los errores
      setTimeout(() => {
        const errorSpan = document.querySelector('span.text-red-500.text-xs');
        if (errorSpan) {
          const inputContainer = errorSpan.closest('.flex.flex-col');
          const input = inputContainer?.querySelector('input, select');
          if (input) {
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 200);
    }
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
            errors={errors?.titular}
            prefix="titular"
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
            errors={errors}
          />
        );
      case 3:
        return (
          <div className="col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Beneficiarios (Opcional)
            </h2>
            
            {fields.map((field, index) => (
              <div key={field.id} className="mb-8 p-6 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DatosPersonales
                    register={register}
                    control={control}
                    selectEps={selectEps}
                    errors={errors?.beneficiarios?.[index] || {}}
                    prefix={`beneficiarios.${index}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition">
                  Eliminar beneficiario
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => {
                if (selectedPlan && fields.length > selectedPlan.cantidadBeneficiarios) {
                  toast.error(`El plan ${selectedPlan.tipoPlan} solo permite ${selectedPlan.cantidadBeneficiarios} beneficiarios.`);
                  return;
                }
                append({
                usuario: {
                  nombre: "",
                  segundo_nombre: "",
                  apellido: "",
                  segundo_apellido: "",
                  email: "",
                  password: "",
                  direccion: "",
                  numero_documento: "",
                  fecha_nacimiento: "",
                  rol_id: 4,
                  genero: "",
                  tipo_documento: "",
                  estado_civil: "",
                  numero_hijos: "",
                  eps_id: null,
                  autorizacion_datos: false
                },
                paciente: {
                  activo: true,
                  beneficiario: true,
                  direccion_cobro: "",
                  ocupacion: ""
                }
              })}}
              className={`w-full px-6 py-3 rounded-lg shadow transition ${
              selectedPlan && fields.length >= selectedPlan.cantidadBeneficiarios
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              disabled={selectedPlan && fields.length >= selectedPlan.cantidadBeneficiarios}>
              + Agregar beneficiario
            </button>
              <p className={fields.length >= selectedPlan.cantidadBeneficiarios? 'text-red-600 text-center mt-4':'text-gray-600 text-center mt-4'}>{fields.length}/{selectedPlan.cantidadBeneficiarios} Beneficiarios</p>
          </div>
        );
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
                    paso >= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-1 mx-2 transition ${paso > step ? "bg-blue-600" : "bg-gray-200"}`}/>
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