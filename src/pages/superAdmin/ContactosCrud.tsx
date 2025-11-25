import React, { useEffect, useState } from 'react'
import { getContacto } from '../../services/contactos'

// Icons
import { FaClock, FaEnvelope, FaLocationDot, FaPhone } from 'react-icons/fa6'
import { FaRegEdit } from 'react-icons/fa'
import UpdateContactos from './UpdateContactos'

const ContactosCrud: React.FC = () => {
  const [contacto, setContacto] = useState<any[]>([])
  const [evento, setEvento] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    const loadData = async () => {
      const res = await getContacto()
      setContacto(res.data)
    }
    loadData()
  }, [evento])

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  
  return (
     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Gestión de Contacto
          </h1>
          <p className="text-slate-600 text-lg">Administra la información de contacto de tu organización</p>
        </div>

        {/* Cards Container */}
        <div className="grid gap-6">
          {contacto.map((val) => (
            <div 
              key={val.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                      <FaLocationDot className="text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{val.ubicacion}</h2>
                      <p className="text-blue-100 text-sm mt-1">Información de contacto</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOpen(true)}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-xl transition-all duration-200 transform hover:scale-105"
                      title="Editar"
                    >
                      <FaRegEdit className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Teléfonos */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                      Teléfonos
                    </h3>
                    
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                      <div className="bg-blue-100 p-2.5 rounded-lg">
                        <FaPhone className="text-blue-600 text-lg" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Principal</p>
                        <p className="text-slate-800 font-semibold">{val.telefonouno}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                      <div className="bg-blue-100 p-2.5 rounded-lg">
                        <FaPhone className="text-blue-600 text-lg" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Secundario</p>
                        <p className="text-slate-800 font-semibold">{val.telefonodos}</p>
                      </div>
                    </div>
                  </div>

                  {/* Emails */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                      Correos Electrónicos
                    </h3>
                    
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors">
                      <div className="bg-indigo-100 p-2.5 rounded-lg">
                        <FaEnvelope className="text-indigo-600 text-lg" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs text-slate-500 font-medium">Principal</p>
                        <p className="text-slate-800 font-semibold truncate">{val.emailuno}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors">
                      <div className="bg-indigo-100 p-2.5 rounded-lg">
                        <FaEnvelope className="text-indigo-600 text-lg" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs text-slate-500 font-medium">Secundario</p>
                        <p className="text-slate-800 font-semibold truncate">{val.emaildos}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer with Dates */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <FaClock className="text-slate-400" />
                      <span className="font-medium">Creado:</span>
                      <span>{formatDate(val.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <FaClock className="text-slate-400" />
                      <span className="font-medium">Actualizado:</span>
                      <span>{formatDate(val.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {contacto.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaLocationDot className="text-3xl text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No hay contactos</h3>
            <p className="text-slate-500">Agrega tu primer contacto para comenzar</p>
          </div>
        )}
      </div>
      {open && (
        <UpdateContactos setOpen={setOpen} setEvento={setEvento} evento={evento}/>
      )}
    </div>
  
  )
}

export default ContactosCrud
