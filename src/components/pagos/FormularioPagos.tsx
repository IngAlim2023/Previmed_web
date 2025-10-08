import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { ImCancelCircle } from "react-icons/im";
import { MdImageSearch } from "react-icons/md";
import { FaUser, FaCalendarDay, FaCalendarPlus, FaCalendarCheck, FaDollarSign, FaCreditCard } from "react-icons/fa";
import { HiOutlineDocumentCurrencyDollar } from "react-icons/hi2";
import { getTitulares as getTitularesService } from "../../services/pacientes";
import { createPago, updatePago, getFormasPago } from "../../services/pagosService";


type Props = {
  pago?: any;
  setForm: (value: boolean) => void;
  setPago: (value: any | null) => void;
  setPagos: (value: any) => void;
};

type FormValues = {
  foto?: FileList;
  membresia_id?: number;
  fecha_pago?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  forma_pago_id?: number;
  monto?: number;
};

const FormularioPagos: React.FC<Props> = ({ pago, setForm, setPago, setPagos }) => {
  const { register, handleSubmit, getValues, watch, control, reset, formState: { errors, isDirty } } = useForm<FormValues>({
    defaultValues: {
      fecha_pago: new Date().toISOString().split("T")[0]
    }
  });

  const [titulares, setTitulares] = useState<any[]>([]);
  const [formasPago, setFormasPago] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const cargarTitulares = async () => {
      try {
        const response = await getTitularesService();
        if (response?.data) {
          const soloTitulares = response.data.filter((t: any) => t.beneficiario === true);
          setTitulares(soloTitulares);
        }
      } catch (error) {
        toast.error("Error al cargar titulares");
      }
    };

    const cargarFormasPago = async () => {
      try {
        console.log("🔍 Llamando a /formas_pago/read");
        const response = await getFormasPago();
        console.log("✅ Respuesta del backend:", response);
        if (response?.data?.length) {
          setFormasPago(response.data);
        } else {
          console.warn("⚠️ No hay datos en response.data, usando fallback");
          setFormasPago([
            { idFormaPago: 1, tipoPago: "Domicilio" },
            { idFormaPago: 2, tipoPago: "Debito automatico" },
            { idFormaPago: 3, tipoPago: "Convenio" },
            { idFormaPago: 4, tipoPago: "Nequi" },
            { idFormaPago: 5, tipoPago: "Nuevo Pago" }
          ]);
        }
      } catch (error) {
        console.error("❌ Error al cargar formas de pago:", error);
        setFormasPago([
          { idFormaPago: 1, tipoPago: "Domicilio" },
          { idFormaPago: 2, tipoPago: "Debito automatico" },
          { idFormaPago: 3, tipoPago: "Convenio" },
          { idFormaPago: 4, tipoPago: "Nequi" },
          { idFormaPago: 5, tipoPago: "Nuevo Pago" }
        ]);
      }
    };

    cargarTitulares();
    cargarFormasPago();
  }, []);

  useEffect(() => {
    if (!pago) {
      reset({
        fecha_pago: new Date().toISOString().split("T")[0],
        fecha_inicio: "",
        fecha_fin: "",
        monto: "",
        forma_pago_id: "",
        membresia_id: "",
      });
    } else {
      console.log("📦 Datos del pago para editar:", pago);
      reset({
        fecha_pago: pago.fechaPago,
        fecha_inicio: pago.fechaInicio,
        fecha_fin: pago.fechaFin,
        monto: pago.monto,
        forma_pago_id: pago.formaPagoId,
        membresia_id: pago.membresiaId,
      });
    }
  }, [pago, reset]);

  useEffect(() => {
    const file = watch("foto")?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [watch("foto")]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPago(null);
        setForm(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      const response = pago
        ? await updatePago(data, pago.idRegistro)
        : await createPago(data);

      toast.success(response.message);
      setPagos((prev: any) =>
        pago
          ? prev.map((p: any) => (p.idRegistro === pago.idRegistro ? response.data : p))
          : [...prev, response.data]
      );
      setPago(null);
      setForm(false);
    } catch {
      toast.error(pago ? "Error al actualizar el pago" : "Error al registrar el pago");
    } finally {
      setIsSaving(false);
    }
  };

  const opcionesTitular = titulares
    .map(t => {
      const usuario = t.usuario;
      const membresiaPaciente = t.membresiaPaciente?.[0];
      if (!membresiaPaciente || !usuario) return null;
      return {
        value: membresiaPaciente.membresiaId,
        label: `${usuario.nombre ?? ""} ${usuario.segundoNombre ?? ""} ${usuario.apellido ?? ""} ${usuario.segundoApellido ?? ""} - ${usuario.numeroDocumento ?? ""}`
      };
    })
    .filter(Boolean);

  const opcionesFormaPago = formasPago.map(fp => ({
    value: fp.idFormaPago,
    label: fp.tipoPago
  }));

  // 🔍 Logs para debuggear valores al editar
  useEffect(() => {
    if (pago) {
      console.log("🔍 Opciones de forma de pago:", opcionesFormaPago);
      console.log("🔍 Valor actual de forma_pago_id:", watch("forma_pago_id"));
      console.log("🔍 Valor actual de membresia_id:", watch("membresia_id"));
    }
  }, [pago, opcionesFormaPago, watch]);

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-start overflow-y-auto z-50">
      <div className="my-2 bg-white rounded-md p-6 w-full max-w-4xl">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl mb-8 font-semibold text-gray-700 flex items-center gap-2">
            <HiOutlineDocumentCurrencyDollar className="w-10 h-auto text-blue-600" />
            {pago ? `Actualiza el pago ${pago.idRegistro}` : "Registro de pago"}
          </h2>
          <ImCancelCircle className="w-6 h-auto text-gray-500 hover:text-red-600 cursor-pointer" onClick={() => { setPago(null); setForm(false); }} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="flex items-center mb-1 font-medium text-gray-600">Comprobante (imagen) <MdImageSearch className="w-6 h-auto text-blue-900 ml-2" /></label>
            {pago?.foto && !preview && <img src={pago.foto} alt="Comprobante" className="w-full h-40 rounded-md object-contain" />}
            {preview && <img src={preview} alt="Vista previa" className="w-full h-40 object-contain rounded-md mb-2" />}
            <input type="file" {...register("foto")} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-md file:font-semibold file:bg-blue-50 file:text-blue-600 file:cursor-pointer" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-32 gap-y-6">
            <div>
              <label className="text-sm text-gray-600 font-medium flex items-center gap-2"><FaUser className="text-blue-900" /> Titular</label>
              <Controller name="membresia_id" control={control} rules={{ required: "El titular es obligatorio" }}
                render={({ field }) => (
                  <Select {...field} options={opcionesTitular} placeholder="Selecciona el titular" value={opcionesTitular.find(o => o.value === field.value)} onChange={selected => field.onChange(selected?.value)} isClearable />
                )}
              />
              {errors.membresia_id && <p className="text-red-500 text-sm mt-1">{errors.membresia_id.message}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-600 font-medium flex items-center gap-2"><FaCalendarDay className="text-blue-900" /> Fecha de cobro</label>
              <input type="date" {...register("fecha_pago", { required: "La fecha de cobro es obligatoria" })} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.fecha_pago && <p className="text-red-500 text-sm mt-1">{errors.fecha_pago.message}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-600 font-medium flex items-center gap-2"><FaCalendarPlus className="text-blue-900" /> Fecha de inicio</label>
              <input type="date" max={watch("fecha_fin")} {...register("fecha_inicio", { required: "La fecha de inicio es obligatoria" })} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.fecha_inicio && <p className="text-red-500 text-sm mt-1">{errors.fecha_inicio.message}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-600 font-medium flex items-center gap-2"><FaCalendarCheck className="text-blue-900" /> Fecha de fin</label>
              <input type="date" min={watch("fecha_inicio")} {...register("fecha_fin", {
                required: "La fecha de finalización es obligatoria",
                validate: fechaFin => {
                  const fechaInicio = getValues("fecha_inicio");
                  if (!fechaFin || !fechaInicio) return "Las fechas son obligatorias";
                  return new Date(fechaFin) >= new Date(fechaInicio) || "La fecha de fin no puede ser menor que la fecha de inicio";
                }
              })} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.fecha_fin && <p className="text-red-500 text-sm mt-1">{errors.fecha_fin.message}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-600 font-medium flex items-center gap-2"><FaCreditCard className="text-blue-900" /> Forma de pago</label>
              <Controller name="forma_pago_id" control={control} rules={{ required: "La forma de pago es obligatoria" }}
                render={({ field }) => (
                  <Select {...field} options={opcionesFormaPago} placeholder="Selecciona la forma de pago" value={opcionesFormaPago.find(o => o.value === field.value)} onChange={selected => field.onChange(selected?.value)} isClearable />
                )}
              />
              {errors.forma_pago_id && <p className="text-red-500 text-sm mt-1">{errors.forma_pago_id.message}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-600 font-medium flex items-center gap-2"><FaDollarSign className="text-blue-900" /> Monto</label>
              <input type="number" {...register("monto", { required: "El monto es obligatorio", min: { value: 1, message: "El monto debe ser mayor a 0" } })} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.monto && <p className="text-red-500 text-sm mt-1">{errors.monto.message}</p>}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button type="submit" disabled={!isDirty || isSaving} className="w-sm bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50">
              {isSaving ? "Guardando..." : (pago ? "Actualizar" : "Guardar")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioPagos;