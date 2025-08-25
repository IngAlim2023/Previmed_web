import { Controller, useForm } from "react-hook-form";
import { PagoInterface, PostPagoInterface } from "../../interfaces/Pagos";
import { ImCancelCircle } from "react-icons/im";
import { MdImageSearch } from "react-icons/md";
import toast from "react-hot-toast";
import Select from "react-select";
import { createPago, updatePago, subirImgCloudinary } from "../../services/pagosService";
import {
  FaUser,
  FaCalendarDay,
  FaCalendarPlus,
  FaCalendarCheck,
  FaDollarSign,
  FaCreditCard,
} from "react-icons/fa";
import { HiOutlineDocumentCurrencyDollar } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { getTitulares as getTitularesService } from "../../services/pacientes";

type prop = {
  pago?: PagoInterface;
  setForm: (value: boolean) => void;
};

  const fecha = new Date(); //Instancia de la clase Date para manejar fechas
  const fechaHoy = fecha.toLocaleDateString("sv-SE"); //Se consigue la fecha actual

const FormularioPagos: React.FC<prop> = ({ pago, setForm }) => {
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<PostPagoInterface>({
  defaultValues: pago
    ? {
        fecha_pago: pago.fechaPago,
        fecha_inicio: pago.fechaInicio,
        fecha_fin: pago.fechaFin,
        monto: pago.monto,
        forma_pago_id: pago.formaPagoId,
        membresia_id: pago.membresiaId,
      }
    : {
        fecha_pago: fechaHoy,
      },
});

  //const [formasPago, setFormasPago] = useState<any[]>([]);
  const [titulares, setTitulares] = useState<any[]>([]);

  const actualizarPago = async (data: PostPagoInterface) => {
    try {
      if (!pago) return;
      if (data.foto && data.foto.length > 0) {
        data.foto = await subirImgCloudinary(data.foto[0]);
      } else {
        data.foto = pago.foto;
      }
      const response = await updatePago(data, pago.idRegistro);
      toast.success(response.message);
      setForm(false);
    } catch (error) {
      toast.error("Error al actualizar el pago");
    }
  };

  const registrarPago = async (data: PostPagoInterface) => {
    try {
      if (data.foto && data.foto.length > 0) {
        data.foto = await subirImgCloudinary(data.foto[0]);
      } else {
        data.foto = null;
      }
      const resonse = await createPago(data);
      toast.success(resonse.message);
      setForm(false);
    } catch (error) {
      toast.error("Error al registrar el pago");
    }
  };

  const getTitulares = async () => {
    try {
      const response = await getTitularesService();
      setTitulares(response.data);
    } catch (error) {
      throw new Error("Error al obtener los titulares");
    }
  };

  const opcionesTitular = titulares.map((t) => ({
    value: t.idPaciente,
    label: `${t.usuario.nombre ?? ""} ${t.usuario.segundoNombre ?? ""} ${
      t.usuario.apellido
    } ${t.usuario.segundoApellido ?? ""}`,
  }));

  const formatDate = (date: string | Date | null | undefined) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0]; // -> "2025-08-25"
};

  useEffect(() => {
    getTitulares();
      if (pago) {
    reset({
      fecha_pago: formatDate(pago.fechaPago),
      fecha_inicio: formatDate(pago.fechaInicio),
      fecha_fin: formatDate(pago.fechaFin),
      monto: pago.monto,
      forma_pago_id: pago.formaPagoId,
      membresia_id: pago.membresiaId,
    });
  }
  }, [pago, reset, opcionesTitular]);

  const formasPago = [
    { id: 1, nombre: "Domicilio" },
    { id: 2, nombre: "Debito automático" },
    { id: 3, nombre: "Convenio" },
    { id: 4, nombre: "Nequi" },
    { id: 5, nombre: "Daviplata" },
  ];

  const opcionesFormaFpago = formasPago.map((fp) => ({
    value: fp.id,
    label: fp.nombre,
  }));

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex justify-center items-start pt-8 overflow-y-auto z-50">
        <div className="my-2 bg-white rounded-md p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-3xl mb-8 font-semibold text-gray-700 flex items-center gap-2">
              <HiOutlineDocumentCurrencyDollar className="w-10 h-auto text-blue-600" />
              {pago
                ? `Actualiza el pago ${pago.idRegistro}`
                : "Registro de pago"}
            </h2>
            <ImCancelCircle
              title="Cancelar"
              className="w-6 h-auto text-gray-500 hover:text-red-600 transition-all duration-500 cursor-pointer"
              onClick={() => setForm(false)}
            />
          </div>

          <form
            onSubmit={handleSubmit(pago ? actualizarPago : registrarPago)}
            className="space-y-4"
          >
            {/* Imagen */}
            <div>
              <label className="flex items-center  mb-1 font-medium text-gray-600">
                Comprobante (imagen)
                <MdImageSearch className="w-6 h-auto text-blue-900 ml-2" />
              </label>
              {pago?.foto && (
                <div>
                  <img
                    src={pago.foto}
                    alt="Comprobante"
                    className="w-full h-80 rounded-md object-contain md:col-auto"
                  />
                </div>
              )}

              <input
                type="file"
                {...register("foto")}
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-md file:font-semibold file:bg-blue-50 file:hover:file:bg-blue-100 file:text-blue-600 file:cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-32">
              {/* Titular */}
              <div>
                <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                  <FaUser className="text-blue-900" /> Titular
                </label>
                <Controller
                  name="membresia_id"
                  control={control}
                  rules={{
                    required: "El titular es obligatorio",
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={opcionesTitular}
                      placeholder="Selecciona el titular"
                      value={opcionesTitular.find(o=>o.value == field.value)}
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption);
                      }}
                    />
                  )}
                />
                {errors.membresia_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.membresia_id.message}
                  </p>
                )}
              </div>

              {/* Fecha cobro */}
              <div>
                <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                  <FaCalendarDay className="text-blue-900" /> Fecha de cobro
                </label>
                <input
                  type="date"
                  defaultValue={pago ? pago.fechaPago : fechaHoy}
                  {...register("fecha_pago", {
                    required: "La fecha de cobro es obligatoria",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.fecha_pago && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fecha_pago.message}
                  </p>
                )}
              </div>

              {/* Fecha inicio */}
              <div>
                <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                  <FaCalendarPlus className="text-blue-900" /> Fecha de inicio
                </label>
                <input
                  type="date"
                  max={watch("fecha_fin")}
                  defaultValue={pago ? pago.fechaInicio : ""}
                  {...register("fecha_inicio", {
                    required: "La fecha de inicio es obligatoria",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.fecha_inicio && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fecha_inicio.message}
                  </p>
                )}
              </div>

              {/* Fecha fin */}
              <div>
                <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                  <FaCalendarCheck className="text-blue-900" /> Fecha de fin
                </label>
                <input
                  type="date"
                  min={watch("fecha_inicio")}
                  defaultValue={pago ? pago.fechaFin : ""}
                  {...register("fecha_fin", {
                    required: "La fecha de finalización es obligatoria",
                    validate: (fechaFin) => {
                      const fechaInicio = getValues("fecha_inicio");
                      return (
                        new Date(fechaFin) >= new Date(fechaInicio) ||
                        "La fecha de fin no puede ser menor que la fecha de inicio"
                      );
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.fecha_fin && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fecha_fin.message}
                  </p>
                )}
              </div>

              {/* Forma de pago */}
              <div>
                <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                  <FaCreditCard className="text-blue-900" /> Forma de pago
                </label>
                <Controller
                  name="forma_pago_id"
                  control={control}
                  rules={{
                    required: "La forma de pago es obligatoria",
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={opcionesFormaFpago}
                      placeholder="Selecciona la forma de pago"
                      value={opcionesFormaFpago.find(o => o.value == field.value)}
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption);
                      }}
                    />
                  )}
                />
                {errors.forma_pago_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.forma_pago_id.message}
                  </p>
                )}
              </div>

              {/* Monto */}
              <div>
                <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                  <FaDollarSign className="text-blue-900" /> Monto
                </label>
                <input
                  type="number"
                  defaultValue={pago ? pago.monto : ""}
                  {...register("monto", {
                    required: "El monto es obligatorio",
                    minLength: {
                      value: 5,
                      message: "El monto debe ser mayor a 4 dígitos",
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.monto && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.monto.message}
                  </p>
                )}
              </div>
            </div>

            {/* Botón */}
            <div className="flex justify-center  pt-4">
              <button
                type="submit"
                className="w-sm bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                {pago ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormularioPagos;
