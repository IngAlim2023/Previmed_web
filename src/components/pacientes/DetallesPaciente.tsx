import { useEffect, useState } from 'react';
import { FiMail, FiMapPin, FiFileText, FiCalendar, FiX, FiUser, FiDollarSign, FiUsers, FiBriefcase, FiHome, FiHeart, FiShield, FiRefreshCw } from 'react-icons/fi';
import { getPacientesId } from '../../services/pacientes';
import { Membresia, Paciente } from '../../interfaces/interfaces';
import { getContratoByUserId } from '../../services/contratos';
import BtnDescargarPdf from '../botones/BtnDescargarPdf';
import ListPagosPaciente from '../pagos/ListPagosPaciente';
import { useNavigate } from 'react-router-dom';
import BtnBeneficiarios from '../botones/BtnBeneficiarios';
import { epsService } from '../../services/epsService';

interface Props {
  idPaciente?: string | null;
  setDetalles: (v: boolean) => void;
}

const DetallesPaciente: React.FC<Props> = ({ idPaciente, setDetalles }) => {
  const [pacienteActual, setPacienteActual] = useState<Paciente>();
  const [titular, setTitular] = useState<Paciente>();
  const [beneficiarios, setBeneficiarios] = useState<Paciente[]>([]);
  const [contrato, setContrato] = useState<Membresia>();
  const [loading, setLoading] = useState(true);
  const [pagos, setPagos] = useState<boolean>(false)
  const [epsPacienteActual, setEpsPacienteActual] = useState<string>('No especifica');
  const navigate = useNavigate()

  useEffect(() => {
    const getdata = async () => {
      try {
        const resPacientes = await getPacientesId(idPaciente ?? '');
        const resContrato = await getContratoByUserId(idPaciente ?? '');
        
        const actual = resPacientes.find((p: Paciente) => p.usuarioId === idPaciente);
        const titularEncontrado = resPacientes.find((p: Paciente) => !p.pacienteId || p.pacienteId === null);
        const beneficiariosEncontrados = resPacientes.filter((p: Paciente) => p.pacienteId != null);
        
        setPacienteActual(actual);
        setTitular(titularEncontrado);
        setBeneficiarios(beneficiariosEncontrados);
        setContrato(resContrato.membresia);
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    };
    getdata();
    getEpsPaciente();
  }, [idPaciente]);

  const formatearFecha = (fecha: string) => {
    if (!fecha) return 'No disponible';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calcularEdad = (fechaNacimiento: string) => {
    if (!fechaNacimiento) return 'N/A';
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return `${edad} años`;
  };

  const esTitular = !pacienteActual?.pacienteId || pacienteActual?.pacienteId === null;

  const getEpsPaciente = async() => {
    const id = pacienteActual?.usuario?.epsId;
    if(!id) return
    const res = await epsService.getById(id);
    setEpsPacienteActual(res.nombreEps);
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Cargando información...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between shadow-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <FiUser className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Detalles del Paciente
            </h3>
          </div>
          <button
            onClick={() => setDetalles(false)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <FiX className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Información Principal del Paciente */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <FiUser className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-2xl font-bold text-gray-800">
                    {pacienteActual?.usuario?.nombre} {pacienteActual?.usuario?.segundoNombre??''} {pacienteActual?.usuario?.apellido} {pacienteActual?.usuario?.segundoApellido??''}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    esTitular 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-purple-600 text-white'
                  }`}>
                    {esTitular ? 'Titular' : 'Beneficiario'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    pacienteActual?.activo 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {pacienteActual?.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <FiFileText className="text-blue-600 w-5 h-5" />
                    <div>
                      <p className="text-xs text-gray-500">Documento</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {pacienteActual?.usuario?.tipoDocumento} {pacienteActual?.usuario?.numeroDocumento}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <FiCalendar className="text-blue-600 w-5 h-5" />
                    <div>
                      <p className="text-xs text-gray-500">Edad</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {calcularEdad(pacienteActual?.usuario?.fechaNacimiento || '')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <FiUser className="text-blue-600 w-5 h-5" />
                    <div>
                      <p className="text-xs text-gray-500">Género</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {pacienteActual?.usuario?.genero || 'No especificado'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información de Contacto y Personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contacto */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h5 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiMail className="text-blue-600" />
                Información de Contacto
              </h5>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FiMail className="text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Correo Electrónico</p>
                    <p className="text-sm text-gray-800 break-words">{pacienteActual?.usuario?.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Dirección</p>
                    <p className="text-sm text-gray-800">{pacienteActual?.usuario?.direccion || 'No registrada'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Información Personal */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h5 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiUser className="text-blue-600" />
                Información Personal
              </h5>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiCalendar className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Fecha de Nacimiento</p>
                      <p className="text-sm text-gray-800">{formatearFecha(pacienteActual?.usuario?.fechaNacimiento || '')}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiHeart className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Estado Civil</p>
                      <p className="text-sm text-gray-800">{pacienteActual?.usuario?.estadoCivil || 'No especificado'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiUsers className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Número de Hijos</p>
                      <p className="text-sm text-gray-800">{pacienteActual?.usuario?.numeroHijos || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h5 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiBriefcase className="text-blue-600" />
              Información Adicional
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiBriefcase className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Ocupación</p>
                  <p className="text-sm text-gray-800">{pacienteActual?.ocupacion || 'No especificada'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiHome className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Estrato</p>
                  <p className="text-sm text-gray-800">{pacienteActual?.usuario?.estrato || 'No especificado'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiShield className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">EPS</p>
                  <p className="text-sm text-gray-800">{epsPacienteActual || 'No registrada'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Información del Contrato */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FiFileText className="text-blue-600" />
                Información del Contrato
              </h5>
                <button onClick={()=> navigate('/renovar/contrato', {state:{
                  contrato, usuario_id:titular?.usuarioId, titular_id:titular?.idPaciente
                }})}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all active:scale-95">
                  <FiRefreshCw className="text-lg" />
                  <span className="text-sm font-semibold">Renovar contrato</span>
                </button>            
                <BtnDescargarPdf idUsuario={idPaciente||''} verText={true}/>            
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Número de Contrato</p>
                <p className="text-lg font-bold text-blue-700">{contrato?.numeroContrato || 'N/A'}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Plan</p>
                <p className="text-lg font-bold text-purple-700">{contrato?.plan?.tipoPlan || 'N/A'}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Valor Mensual</p>
                <p className="text-lg font-bold text-green-700">
                  ${contrato?.plan?.precio}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Fecha de Inicio</p>
                <p className="text-sm font-semibold text-gray-800">{formatearFecha(String(contrato?.fechaInicio))}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Fecha de Vencimiento</p>
                <p className="text-sm font-semibold text-gray-800">{formatearFecha(String(contrato?.fechaFin))}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Forma de Pago</p>
                <p className="text-sm font-semibold text-gray-800">{contrato?.formaPago || 'N/A'}</p>
              </div>
            </div>
            <button
              onClick={()=> setPagos(!pagos)}
              className="flex items-center mt-6 gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm">
              <FiDollarSign />
              {pagos? 'Ocultar':'Ver'} historial de Pagos
            </button>
            {pagos? <ListPagosPaciente membresiaId={contrato?.idMembresia??0} /> : <></>}
          </div>

          {/* Beneficiarios o Titular */}
          {esTitular ? (
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className='flex justify-between items-center mb-4'>
              <h5 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FiUsers className="text-blue-600" /> Beneficiarios ({beneficiarios.length})
              </h5>
              <div onClick={()=> navigate('/beneficiarios', {state: pacienteActual})}>
                <BtnBeneficiarios verText={true}/>
              </div>
            </div>
              {beneficiarios.length > 0 ? (
                <div className="space-y-3">
                  {beneficiarios.map((b) => (
                    <div
                      key={b.idPaciente}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-gray-50"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <FiUser className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {b.usuario?.nombre} {b.usuario?.segundoNombre??''} {b.usuario?.apellido} {b.usuario?.segundoApellido??''}
                          </p>
                          <p className="text-xs text-gray-500">
                            {b.usuario?.tipoDocumento}: {b.usuario?.numeroDocumento}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Edad</p>
                          <p className="text-sm text-gray-800">{calcularEdad(b.usuario?.fechaNacimiento || '')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm text-gray-800 truncate">{b.usuario?.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <FiUsers className="w-16 h-16 mx-auto mb-3 opacity-50" />
                  <p className="text-lg">No hay beneficiarios registrados</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h5 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiUser className="text-blue-600" />
                Información del Titular
              </h5>
              <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <FiUser className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xl font-bold text-gray-800 mb-1">
                    {titular?.usuario?.nombre} {titular?.usuario?.apellido}
                  </p>
                  <p className="text-sm text-blue-600 font-medium mb-4">Titular del Contrato</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-gray-800">{titular?.usuario?.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Documento</p>
                      <p className="text-sm text-gray-800">
                        {titular?.usuario?.tipoDocumento}: {titular?.usuario?.numeroDocumento}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Edad</p>
                      <p className="text-sm text-gray-800">{calcularEdad(titular?.usuario?.fechaNacimiento || '')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Dirección</p>
                      <p className="text-sm text-gray-800">{titular?.usuario?.direccion || 'No registrada'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={() => setDetalles(false)}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetallesPaciente