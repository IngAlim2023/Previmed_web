import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { MdCheckCircle, MdPerson, MdAdd, MdDelete, MdClose } from "react-icons/md";
import { FaFileContract, FaUsers, FaMoneyBillWave, FaCrown } from "react-icons/fa";
import BtnAgregar from "../botones/BtnAgregar";
import BtnCancelar from "../botones/BtnCancelar";
import { DatosContrato, FormularioPagos } from "../../pages/general/FormularioPacientes";
import InputComponent from "../formulario/InputComponent";
import SelectComponent from "../formulario/SelectCompontent";
import ReactSelectComponent from "../formulario/ReactSelectComponent";
import { tiposDocumento } from "../../data/tiposDocumento";
import { generos } from "../../data/generos";
import { getFormasPago } from "../../services/pagosService";
import { getPacientesId } from "../../services/pacientes";
import { getPlanes } from "../../services/planes";
import { Plan } from "../../interfaces/planes";
import { DataFormaPago } from "../../interfaces/formaPago";
import { epsService } from "../../services/epsService";
import { Eps } from "../../interfaces/eps";
import { toast } from "react-hot-toast";
import { renovarContrato } from "../../services/contratos";
import { Paciente, PacienteRenovarContrato, RenovarContrato } from "../../interfaces/interfaces";
import { estadosCiviles } from "../../data/estadosCiviles";

const FormContrato = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { contrato, usuario_id, titular_id } = location.state;
  
  const [paso, setPaso] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [personasActuales, setPersonasActuales] = useState<PacienteRenovarContrato[]>([]);
  const [formasPago, setFormasPago] = useState<DataFormaPago[]>([]);
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [eps, setEps] = useState<Eps[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [titularActual, setTitularActual] = useState(titular_id);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<RenovarContrato>({
    defaultValues: {
      contrato: {
        numero_contrato: contrato?.numeroContrato ?? `CT-${Date.now()}`,
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_fin: "",
        forma_pago: contrato?.formaPago ?? '',
        plan_id: contrato?.planId ?? 0
      },
      pago: {
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_fin: '',
        forma_pago_id: 0,
        monto: 0
      },
      titularId: titular_id
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'personasNuevas' });
  const selectedPlan = planes.find((p: any) => p.idPlan == watch('contrato.plan_id'));

  useEffect(() => {
    const getData = async () => {
      const [resFormasPago, resPersonas, resPlanes, resEps] = await Promise.all([
        getFormasPago(),
        getPacientesId(usuario_id),
        getPlanes(),
        epsService.getAll()
      ]);
      
      if (resFormasPago) setFormasPago(resFormasPago);
      if (resPlanes) setPlanes(resPlanes);
      if (resEps) setEps(resEps as any);
      if (resPersonas) {
        setPersonasActuales(resPersonas.map((p: Paciente) => ({
          ...p,
          seleccionado: p.idPaciente === titular_id
        })));
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (selectedPlan) setValue("pago.monto", parseFloat(selectedPlan.precio));
  }, [selectedPlan, setValue]);

  const selectFormas = formasPago.filter(fp => fp.estado).map(fp => ({
    value: fp.idFormaPago,
    label: fp.tipoPago
  }));

  const selectFormasContrato = formasPago.filter(fp => fp.estado).map(fp => ({
    value: fp.tipoPago,
    label: fp.tipoPago
  }));

  const selectPlanes = (planes as any[]).filter((p) => p.estado).map((p) => ({
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

  const selectEps = eps.filter(e => e.estado).map(e => ({
    value: e.idEps,
    label: e.nombreEps
  }));

  const handleCambiarTitular = (newTitularId: number) => {
    setTitularActual(newTitularId);
    setValue('titularId', newTitularId);
    setPersonasActuales(prev =>
      prev.map(p => ({
        ...p,
        seleccionado: p.idPaciente === newTitularId ? true : p.seleccionado
      }))
    );
  };

  const handleSelectPersona = (idPaciente: number) => {
    if (idPaciente === titularActual) {
      toast.error("El titular no se puede deseleccionar");
      return;
    }

    const totalSeleccionados = personasActuales.filter(p => p.seleccionado).length + fields.length;
    const maxBeneficiarios = selectedPlan?.cantidadBeneficiarios || 0;
    const persona = personasActuales.find(p => p.idPaciente === idPaciente);

    if (!persona?.seleccionado && totalSeleccionados >= maxBeneficiarios) {
      toast.error(`El plan permite máximo ${maxBeneficiarios} personas`);
      return;
    }

    setPersonasActuales(prev =>
      prev.map(p => p.idPaciente === idPaciente ? { ...p, seleccionado: !p.seleccionado } : p)
    );
  };

  const handleAgregarNuevo = () => {
    const totalSeleccionados = personasActuales.filter(p => p.seleccionado).length + fields.length;
    const maxBeneficiarios = selectedPlan?.cantidadBeneficiarios || 0;

    if (totalSeleccionados >= maxBeneficiarios) {
      toast.error(`El plan permite máximo ${maxBeneficiarios} personas`);
      return;
    }
    setShowModal(true);
  };

  const handleGuardarNuevo = () => {
    append({
      usuario: {
        nombre: "", segundo_nombre:'', apellido: "", segundo_apellido:"", email: "", password: "", direccion: "",
        numero_documento: "", fecha_nacimiento: "", rol_id: 4, eps_id: null,
        tipo_documento: "", autorizacion_datos: false, genero: "", estado_civil: "",
        estrato: 0
      },
      paciente: { activo: true, beneficiario: true },
      seleccionado: true
    });
    setShowModal(false);
  };

  const onSubmit = async (data: RenovarContrato) => {
    setIsSaving(true);
    await renovarContrato(data);
    setIsSaving(false);
  };

  const handleNext = () => { if (paso < 3) setPaso(paso + 1); };
  const handlePrev = () => { if (paso > 1) setPaso(paso - 1); };

  const totalSeleccionados = personasActuales.filter(p => p.seleccionado).length + fields.length;
  const maxBeneficiarios = selectedPlan?.cantidadBeneficiarios || 0;
  const titularPersona = personasActuales.find(p => p.idPaciente === titularActual);

  const GestionPersonas = () => (
    <>
      <div className="col-span-2 mb-6">
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FaUsers className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Beneficiarios del Contrato</h2>
              <p className="text-sm text-gray-500">Selecciona quiénes continuarán en el contrato</p>
            </div>
          </div>
          <div className="bg-blue-100 px-4 py-2 rounded-lg">
            <p className="text-sm font-semibold text-blue-800">
              {totalSeleccionados} / {maxBeneficiarios} personas
            </p>
          </div>
        </div>
      </div>

      {/* Selector de Titular */}
      <div className="col-span-2 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <FaCrown className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-800">Titular del Nuevo Contrato</h3>
        </div>
        
        {titularPersona && (
          <div className="bg-white p-4 rounded-lg mb-4 border-2 border-purple-300">
            <p className="text-sm text-gray-600 mb-1">Titular Actual:</p>
            <p className="font-bold text-gray-800 text-lg">
              {titularPersona.usuario?.nombre} {titularPersona.usuario?.apellido}
            </p>
            <p className="text-sm text-gray-500">
              {titularPersona.usuario?.tipoDocumento}: {titularPersona.usuario?.numeroDocumento}
            </p>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            ¿Deseas cambiar el titular?
          </label>
          <select
            value={titularActual}
            onChange={(e) => handleCambiarTitular(Number(e.target.value))}
            className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white"
          >
            {personasActuales.map(p => (
              <option key={p.idPaciente} value={p.idPaciente}>
                {p.usuario?.tipoDocumento}: {p.usuario?.numeroDocumento} - {p.usuario?.nombre} {p.usuario?.apellido}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Personas Actuales */}
      <div className="col-span-2">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Personas del Contrato Actual</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {personasActuales.map((persona) => {
            const esTitular = persona.idPaciente === titularActual;
            return (
              <div
                key={persona.idPaciente}
                onClick={() => handleSelectPersona(persona.idPaciente)}
                className={`p-4 rounded-xl border-2 transition ${
                  esTitular 
                    ? 'border-purple-500 bg-purple-50 cursor-not-allowed' 
                    : persona.seleccionado
                      ? 'border-blue-500 bg-blue-50 cursor-pointer'
                      : 'border-gray-200 bg-white hover:border-blue-300 cursor-pointer'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      esTitular ? 'bg-purple-500' : persona.seleccionado ? 'bg-blue-500' : 'bg-gray-300'
                    }`}>
                      {esTitular ? <FaCrown className="w-5 h-5 text-white" /> : <MdPerson className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {persona.usuario?.nombre} {persona.usuario?.apellido}
                      </h4>
                      <p className="text-sm text-gray-500">{persona.usuario?.numeroDocumento}</p>
                      <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                        esTitular 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {esTitular ? 'TITULAR' : 'Beneficiario'}
                      </span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    persona.seleccionado ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {persona.seleccionado && <MdCheckCircle className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nuevos Beneficiarios */}
      {fields.length > 0 && (
        <div className="col-span-2 mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Nuevos Beneficiarios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border-2 border-green-500 bg-green-50 rounded-xl">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                      <MdPerson className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Nuevo Beneficiario #{index + 1}</h4>
                      <p className="text-sm text-gray-500">Pendiente de registro</p>
                      <span className="inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Nuevo
                      </span>
                    </div>
                  </div>
                  <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700">
                    <MdDelete className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón Agregar */}
      <div className="col-span-2">
        <button
          type="button"
          onClick={handleAgregarNuevo}
          disabled={totalSeleccionados >= maxBeneficiarios}
          className={`w-full py-3 border-2 border-dashed rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
            totalSeleccionados >= maxBeneficiarios
              ? 'border-gray-300 text-gray-400 cursor-not-allowed'
              : 'border-blue-300 text-blue-600 hover:bg-blue-50'
          }`}
        >
          <MdAdd className="w-5 h-5" />
          Agregar Nuevo Beneficiario
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">Nuevo Beneficiario</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <MdClose className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputComponent label="Nombre" required placeholder="Ingrese el nombre" />
                <InputComponent label="Apellido" required placeholder="Ingrese el apellido" />
                <SelectComponent label="Tipo de Documento" required options={tiposDocumento} />
                <InputComponent label="Número de Documento" required type="number" placeholder="123456" />
                <InputComponent label="Fecha de Nacimiento" required type="date" max={new Date().toISOString().split("T")[0]} />
                <InputComponent label="Correo" required type="email" placeholder="correo@ejemplo.com" />
                <InputComponent label="Contraseña" required type="password" placeholder="********" />
                <InputComponent label="Dirección" required placeholder="Cra .. # ..." />
                <SelectComponent label="Género" options={generos} />
                <SelectComponent label="Estado Civil" options={estadosCiviles} />
                <ReactSelectComponent label="EPS" control={control} name="eps_id" isClearable options={selectEps} />
                <div className="col-span-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-blue-600" />
                    <span>Autorización de datos personales *</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={handleGuardarNuevo} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700">
                  Guardar
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const steps = [
    { num: 1, icon: FaFileContract, label: 'Contrato' },
    { num: 2, icon: FaUsers, label: 'Beneficiarios' },
    { num: 3, icon: FaMoneyBillWave, label: 'Pago' }
  ];

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex justify-center items-center">
            <div className="flex items-center justify-around w-full max-w-2xl gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-600">Renovación de Contrato</h2>
            </div>
          </div>

          <div className="flex items-center justify-around gap-4 mt-8 w-full">
            {steps.map((item, idx) => (
              <React.Fragment key={item.num}>
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 transition ${
                    paso >= item.num ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-400'
                  }`}>
                    {paso > item.num ? <MdCheckCircle className="w-6 h-6" /> : <item.icon className="w-5 h-5" />}
                  </div>
                  <div className="ml-3">
                    <p className={`font-semibold ${paso >= item.num ? 'text-blue-600' : 'text-gray-400'}`}>
                      Paso {item.num}
                    </p>
                    <p className="text-sm text-gray-500">{item.label}</p>
                  </div>
                </div>
                {idx < 2 && <div className={`h-1 w-20 rounded transition ${paso > item.num ? 'bg-blue-600' : 'bg-gray-300'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paso === 1 && <DatosContrato register={register} control={control} watch={watch} selectPlanes={selectPlanes} selectFormasContrato={selectFormasContrato} errors={errors} />}
            {paso === 2 && <GestionPersonas />}
            {paso === 3 && <FormularioPagos register={register} control={control} watch={watch} selectFormas={selectFormas} errors={errors} />}
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            {paso === 1 ? (
              <div onClick={() => navigate('/pacientes')}><BtnCancelar verText /></div>
            ) : (
              <button type="button" onClick={handlePrev} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition">
                Anterior
              </button>
            )}

            {paso === 3 ? (
              <div onClick={!isSaving ? handleSubmit(onSubmit) : undefined}><BtnAgregar verText /></div>
            ) : (
              <button type="button" onClick={handleNext} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg">
                Continuar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormContrato;