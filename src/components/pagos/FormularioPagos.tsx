import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { ImCancelCircle } from "react-icons/im";
import { MdImageSearch } from "react-icons/md";
import {
  FaUser,
  FaCalendarDay,
  FaCalendarPlus,
  FaCalendarCheck,
  FaDollarSign,
  FaCreditCard,
} from "react-icons/fa";
import { HiOutlineDocumentCurrencyDollar } from "react-icons/hi2";
import { getTitulares as getTitularesService } from "../../services/pacientes";
import {
  createPago,
  updatePago,
  getFormasPago,
  procesarImagenOCR,
} from "../../services/pagosService";
import { estadosPago } from "../../data/estadosPago";
import { getAsesores } from "../../services/usuarios";
import { useAuthContext } from "../../context/AuthContext";
import socket from "../../services/socket";
import { createNotificacionPago } from "../../services/notificaciones";

type Props = {
  pago?: any;
  setForm: (value: boolean) => void;
  setPago: (value: any | null) => void;
  setPagos: (value: any) => void;
};

type FormValues = {
  foto?: FileList;
  membresia_id?: number | string;
  fecha_pago?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  forma_pago_id?: number | string;
  monto?: number | string;
  cobrador_id: string | null;
  numero_recibo: string;
  estado: string;
};

const FormularioPagos: React.FC<Props> = ({
  pago,
  setForm,
  setPago,
  setPagos,
}) => {
  const { user } = useAuthContext();
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    control,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      fecha_pago: new Date().toISOString().split("T")[0],
      cobrador_id: "",
      numero_recibo: "",
      estado: "",
    },
  });

  const [titulares, setTitulares] = useState<any[]>([]);
  const [formasPago, setFormasPago] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [asesores, setAsesores] = useState<any[]>([]);
  const [lastProcessedFile, setLastProcessedFile] = useState<string | null>(null);


  useEffect(() => {
    const cargarTitulares = async () => {
      try {
        const response = await getTitularesService();
        if (response?.data) {
          const soloTitulares = response.data.filter(
            (t: any) => t.beneficiario === true
          );
          setTitulares(soloTitulares);
        }
      } catch (error) {
        toast.error("Error al cargar titulares");
      }
    };

    const cargarFormasPago = async () => {
      try {
        const response = await getFormasPago();
        if (response?.data?.length) {
          setFormasPago(response.data);
        } else {
          setFormasPago([
            { idFormaPago: 1, tipoPago: "Domicilio" },
            { idFormaPago: 2, tipoPago: "Debito automatico" },
            { idFormaPago: 3, tipoPago: "Convenio" },
            { idFormaPago: 4, tipoPago: "Nequi" },
            { idFormaPago: 5, tipoPago: "Nuevo Pago" },
            { idFormaPago: 13, "tipoPago": "bancolombia" }
          ]);
        }
      } catch (error) {
        console.error("Error al cargar formas de pago");
      }
    };

    cargarTitulares();
    cargarFormasPago();
  }, []);

  // Cargar asesores desde el servicio
  useEffect(() => {
    const cargarAsesores = async () => {
      try {
        const data = await getAsesores();
        setAsesores(data);
      } catch (error) {
        toast.error("Error al cargar asesores");
      }
    };

    cargarAsesores();
  }, []);

  useEffect(() => {
    if (!pago) {
      reset({
        fecha_pago: new Date().toISOString().split("T")[0],
        fecha_inicio: new Date().toISOString().split("T")[0],
        fecha_fin: "",
        monto: "",
        forma_pago_id: "",
        membresia_id: "",
        cobrador_id: user.id,
        numero_recibo: String(Math.floor(100000 + Math.random() * 900000)),
        estado: user.rol?.nombreRol === "Administrador" ? "Aprobado" : "Realizado",
      });
    } else {
      const formatoFecha = (fecha: string) => {
        if (!fecha) return "";
        return fecha.includes("T") ? fecha.split("T")[0] : fecha;
      };

      reset({
        fecha_pago: formatoFecha(pago.fechaPago),
        fecha_inicio: formatoFecha(pago.fechaInicio),
        fecha_fin: formatoFecha(pago.fechaFin),
        monto: pago.monto,
        forma_pago_id: pago.formaPagoId,
        membresia_id: pago.membresiaId,
        cobrador_id: pago.cobradorId,
        numero_recibo: pago.numeroRecibo,
        estado: pago.estado
          ? pago.estado.charAt(0).toUpperCase() +
          pago.estado.slice(1).toLowerCase()
          : "",
      });
    }
  }, [pago, reset, user.id]);

  const fotoValue = watch("foto");
  // Procesar OCR cuando se sube una imagen
  useEffect(() => {
    const file = fotoValue?.[0] ?? null;
    if (!file) {
      setPreview(null);
      return;
    }
    // Preview INMEDIATO
    const url = URL.createObjectURL(file);
    setPreview(url);

    // Si ya procesamos este archivo, no repetimos
    if (lastProcessedFile === file.name) return;

    // Ejecutamos OCR en paralelo  
    (async () => {
      try {
        const ocr = await procesarImagenOCR(file);
        // Rellenamos solo cuando llegue
        if (ocr.fecha_pago) setValue("fecha_pago", ocr.fecha_pago, { shouldDirty: true });
        if (ocr.monto) setValue("monto", ocr.monto, { shouldDirty: true });
        if (ocr.numero_recibo) setValue("numero_recibo", ocr.numero_recibo, { shouldDirty: true });
        if (ocr.forma_pago_id) setValue("forma_pago_id", ocr.forma_pago_id, { shouldDirty: true });
        setLastProcessedFile(file.name);
      } catch {
        toast.error("No se pudo leer la imagen");
      }
    })();

    return () => URL.revokeObjectURL(url);
  }, [fotoValue, lastProcessedFile, setValue]);



  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPago(null);
        setForm(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setPago, setForm]);

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      const response = pago
        ? await updatePago(data, pago.idRegistro)
        : await createPago(data);

      const info = { cobrador_id: user.id, registro_pago_id: response.data.idRegistro }
      await createNotificacionPago(info)

      socket.emit('registroPago', user)

      toast.success(response?.message || "Operación exitosa");
      setPagos((prev: any) =>
        pago
          ? prev.map((p: any) =>
            p.idRegistro === pago.idRegistro ? response.data : p
          )
          : [...prev, response.data]
      );
      setPago(null);
      setForm(false);
    } catch (err) {
      toast.error(
        pago ? "Error al actualizar el pago" : "Error al registrar el pago"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const opcionesTitular = titulares
    .map((t) => {
      const usuario = t.usuario;
      const membresiaPaciente = t.membresiaPaciente?.[0];
      if (!membresiaPaciente || !usuario) return null;
      return {
        value: membresiaPaciente.membresiaId,
        label: `${usuario.nombre ?? ""} ${usuario.segundoNombre ?? ""} ${usuario.apellido ?? ""
          } ${usuario.segundoApellido ?? ""} - ${usuario.numeroDocumento ?? ""}`,
      };
    })
    .filter((x): x is { value: any; label: string } => Boolean(x));

  const opcionesFormaPago = formasPago.map((fp) => ({
    value: fp.idFormaPago,
    label: fp.tipoPago,
  }));

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-start overflow-y-auto z-50">
      <div className="my-2 bg-white rounded-md p-6 w-full max-w-4xl">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl mb-8 font-semibold text-gray-700 flex items-center gap-2">
            <HiOutlineDocumentCurrencyDollar className="w-10 h-auto text-blue-600" />
            {pago ? `Actualiza el pago ${pago.idRegistro}` : "Registro de pago"}
          </h2>
          <ImCancelCircle
            className="w-6 h-auto text-gray-500 hover:text-red-600 cursor-pointer"
            onClick={() => {
              setPago(null);
              setForm(false);
            }}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="flex items-center mb-1 font-medium text-gray-600">
              Comprobante (imagen){" "}
              <MdImageSearch className="w-6 h-auto text-blue-900 ml-2" />
            </label>
            {pago?.foto && !preview && (
              <img
                src={pago.foto}
                alt="Comprobante"
                className="w-full h-40 rounded-md object-contain"
              />
            )}
            {preview && (
              <img
                src={preview}
                alt="Vista previa"
                className="w-full h-40 object-contain rounded-md mb-2"
              />
            )}
            <input
              type="file"
              {...register("foto")}
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-md file:font-semibold file:bg-blue-50 file:text-blue-600 file:cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-32 gap-y-6">
            {/* Campos existentes */}
            <div>
              <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                <FaUser className="text-blue-900" /> Titular
              </label>
              <Controller
                name="membresia_id"
                control={control}
                rules={{ required: "El titular es obligatorio" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={opcionesTitular}
                    placeholder="Selecciona el titular"
                    value={opcionesTitular.find((o) => o.value === field.value)}
                    onChange={(selected) => field.onChange(selected?.value)}
                    isClearable
                  />
                )}
              />
              {errors.membresia_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.membresia_id.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                <FaCalendarDay className="text-blue-900" /> Fecha de cobro
              </label>
              <input
                type="date"
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

            <div>
              <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                <FaCalendarPlus className="text-blue-900" /> Fecha de inicio
              </label>
              <input
                type="date"
                max={watch("fecha_fin")}
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

            <div>
              <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                <FaCalendarCheck className="text-blue-900" /> Fecha de fin
              </label>
              <input
                type="date"
                min={watch("fecha_inicio")}
                {...register("fecha_fin", {
                  required: "La fecha de finalización es obligatoria",
                  validate: (fechaFin) => {
                    const fechaInicio = getValues("fecha_inicio");
                    if (!fechaFin || !fechaInicio)
                      return "Las fechas son obligatorias";
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

            <div>
              <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                <FaCreditCard className="text-blue-900" /> Forma de pago
              </label>
              <Controller
                name="forma_pago_id"
                control={control}
                rules={{ required: "La forma de pago es obligatoria" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={opcionesFormaPago}
                    placeholder="Selecciona la forma de pago"
                    value={opcionesFormaPago.find(
                      (o) => o.value === field.value
                    )}
                    onChange={(selected) => field.onChange(selected?.value)}
                    isClearable
                  />
                )}
              />
              {errors.forma_pago_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.forma_pago_id.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                <FaDollarSign className="text-blue-900" /> Monto
              </label>
              <input
                type="number"
                {...register("monto", {
                  required: "El monto es obligatorio",
                  min: { value: 1000, message: "El monto debe ser mayor a 1000" },
                  max: { value: 1000000, message: "El monto debe ser menor a 10 millones" },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.monto && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.monto.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                <FaCreditCard className="text-blue-900" /> Número de Recibo
              </label>
              <input
                type="text"
                {...register("numero_recibo", {
                  required: "El número de recibo es obligatorio",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.numero_recibo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.numero_recibo.message}
                </p>
              )}
            </div>

            {
              user.rol?.nombreRol === "Administrador" &&
              <div>
                <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                  <FaCalendarCheck className="text-blue-900" /> Estado
                </label>
                <Controller
                  name="estado"
                  control={control}
                  rules={{ required: "El estado es obligatorio" }}
                  render={({ field }) => {
                    const normalizado = field.value
                      ? field.value.charAt(0).toUpperCase() +
                      field.value.slice(1).toLowerCase()
                      : "";

                    return (
                      <Select
                        {...field}
                        options={estadosPago}
                        placeholder="Selecciona el estado"
                        value={
                          estadosPago.find((o) => o.value === normalizado) || null
                        }
                        onChange={(selected) => field.onChange(selected?.value)}
                        isClearable
                      />
                    );
                  }}
                />

                {errors.estado && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.estado.message}
                  </p>
                )}
              </div>
            }

            {
              user.rol?.nombreRol === "Administrador" &&
              <div>
                <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                  <FaUser className="text-blue-900" /> Asesor / Cobrador
                </label>

                <div>
                  <Controller
                    name="cobrador_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={asesores.map((a: any) => ({
                          value: a.idUsuario,
                          label: `${a.nombre ?? ""} ${a.apellido ?? ""}`.trim(),
                        }))}
                        placeholder="Selecciona el asesor"
                        value={asesores
                          .map((a: any) => ({
                            value: a.idUsuario,
                            label: `${a.nombre ?? ""} ${a.apellido ?? ""}`.trim(),
                          }))
                          .find((o) => o.value === field.value)}
                        onChange={(selected) => field.onChange(selected?.value)}
                        isClearable
                        isSearchable // 🔍 Permite buscar
                      />
                    )}
                  />
                  {errors.cobrador_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.cobrador_id.message}
                    </p>
                  )}
                </div>
              </div>
            }
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={!isDirty || isSaving}
              className="w-sm bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSaving ? "Guardando..." : pago ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioPagos;
