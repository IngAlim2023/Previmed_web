import { FaAddressCard, FaCalendarCheck, FaCalendarPlus, FaChild, FaCity, FaClock, FaEnvelope, FaHeart, FaHospital, FaIdCard, FaMapLocationDot, FaToggleOn, FaUserTag, FaVenusMars } from "react-icons/fa6";
import { MedicosInterface } from "../../interfaces/Medicos";
import { FaBirthdayCake, FaHome, FaPhone, FaUserMd } from "react-icons/fa";

type propsDetallesMedico = {
  medico: MedicosInterface;
  setDetalles: (value: boolean) => void;
};

const DetallesMedico: React.FC<propsDetallesMedico> = ({
  medico,
  setDetalles,
}) => {

  const items = [
            { label: "Nombre completo", value: `${medico.nombre} ${medico.segundo_nombre? medico.segundo_nombre:''} ${medico.apellido} ${medico.segundo_apellido? medico.segundo_apellido:''}`, icon: <FaUserMd /> },
            { label: "Correo electrónico", value: medico.email, icon: <FaEnvelope /> },
            { label: "Fecha de nacimiento", value: new Date(medico.fecha_nacimiento).toLocaleDateString(), icon: <FaBirthdayCake /> },
            { label: "Teléfono", value: medico.telefono, icon: <FaPhone /> },
            { label: "Dirección", value: medico.direccion, icon: <FaHome /> },
            { label: "N° Documento", value: medico.numero_documento, icon: <FaIdCard /> },
            { label: "N° Hijos", value: medico.numero_hijos, icon: <FaChild /> },
            { label: "Estrato", value: medico.estrato, icon: <FaCity /> },
            { label: "Barrio", value: medico.barrio, icon: <FaMapLocationDot/> },
            { label: "EPS", value: medico.eps, icon: <FaHospital /> },
            { label: "Rol", value: medico.rol, icon: <FaUserTag /> },
            { label: "Género", value: medico.genero, icon: <FaVenusMars /> },
            { label: "Tipo de documento", value: medico.tipo_documento, icon: <FaAddressCard /> },
            { label: "Estado civil", value: medico.estado_civil, icon: <FaHeart /> },
            { label: "Disponibilidad", value: medico.disponibilidad ? "Disponible" : "Ocupado", icon: <FaClock /> },
            { label: "Estado", value: medico.estado ? "Activo" : "Inactivo", icon: <FaToggleOn /> },
            { label: "Creado", value: new Date(medico.created).toLocaleDateString(), icon: <FaCalendarPlus /> },
            { label: "Actualizado", value: new Date(medico.updated).toLocaleDateString(), icon: <FaCalendarCheck /> },
          ]
  
  return (
    <>
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 md:px-8 py-6 animate-fade-in">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-2xl overflow-hidden p-8 border border-gray-200">
        <h2 className="text-2xl font-bold mb-12 flex items-center gap-2 text-blue-600">
          <FaUserMd className="text-4xl" />
          Detalles del Médico
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 text-gray-700">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <div className="text-blue-900 text-lg">{item.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="font-semibold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => setDetalles(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-6 py-2 rounded-lg shadow transition"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default DetallesMedico;
