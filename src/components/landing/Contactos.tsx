import { BsTelephoneFill } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import FormSolicitudes from "./FormSolicitudes";
import { useEffect, useState } from "react";
import { getContacto } from "../../services/contactos";

const Contactos: React.FC = () => {
  const [contacto, setContacto] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const res = await getContacto();
      setContacto(res.data);
    };
    loadData();
  }, []);
  return (
    <>
      <section
        id="contactos"
        className="py-10 px-8 bg-white"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-4 text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            Contactos
          </h2>
          <p className="text-gray-600">No pierdas más tiempo y contáctanos</p>
        </div>

        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div
            className="flex flex-col items-center text-center bg-gray-100 p-6 rounded-2xl shadow-md"
            data-aos="fade-up"
          >
            <div className="text-blue-600 mb-4">
              <FaMapMarkerAlt className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              Nuestra ubicación
            </h4>
            {contacto.length > 0 && (
              <p className="text-gray-600">{contacto[0].ubicacion}</p>
            )}
          </div>

          <div
            className="flex flex-col items-center text-center bg-gray-100 p-6 rounded-2xl shadow-md"
            data-aos="fade-up"
          >
            <div className="text-blue-600 mb-4">
              <BsTelephoneFill className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              Números telefónicos
            </h4>
            {contacto.length > 0 && (
              <>
                <p className="text-gray-600">{contacto[0].telefonouno}</p>
                <p className="text-gray-600">{contacto[0].telefonodos}</p>
              </>
            )}
          </div>

          <div
            className="flex flex-col items-center text-center bg-gray-100 p-6 rounded-2xl shadow-md"
            data-aos="fade-up"
          >
            <div className="text-blue-600 mb-4">
              <MdEmail className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              Correos electrónicos
            </h4>
            {contacto.length > 0 && (
              <>
                <p className="text-gray-600">{contacto[0].emailuno}</p>
                <p className="text-gray-600">{contacto[0].emaildos}</p>
              </>
            )}
          </div>
        </div>
        <div className="mt-8">
          <FormSolicitudes />
        </div>
      </section>
    </>
  );
};

export default Contactos;
