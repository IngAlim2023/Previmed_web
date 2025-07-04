import { MdAccessTime, MdMedicalServices, MdOutlineHome, MdOutlineSupportAgent } from "react-icons/md";

const Servicios: React.FC = () => {
  return (
    <>
      <section id="servicios" className="py-18 px-8 bg-sky-50">
        <div className="container mx-auto mb-12 text-center" data-aos="fade-up">
          <h2 className="text-3xl font-semibold text-gray-800">Servicios</h2>
          <p className="mt-2 text-gray-600">
            En Previmed ofrecemos una gran variedad de servicios y nos adaptamos
            a tus necesidades.
          </p>
        </div>

        <div
          className="container mx-auto"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full" data-aos="fade-up" data-aos-delay="100">
              <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl">
                  <MdOutlineHome className="w-18 h-18 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Visita médica a domicilio
                  </h3>
                  <p className="text-gray-600">
                    El paciente en su estado evita la incomodidad de salir de
                    casa, conservando su entorno familiar y resivir el servicio
                    de manera más personalizada.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full" data-aos="fade-up" data-aos-delay="200">
              <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl">
                  <MdMedicalServices className="w-18 h-18 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Sin límites de visitas
                  </h3>
                  <p className="text-gray-600">
                    Hemos dispuesto un amplio número de funcionarios que velaran
                    por su salud cuantas veces lo requiera.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full" data-aos="fade-up" data-aos-delay="300">
              <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl">
                  <MdAccessTime className="w-18 h-18 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Servicio 24/7
                  </h3>
                  <p className="text-gray-600">
                    El usuario y/o beneficiario las 24 horas del día y los 7
                    días de la semana, podrá solicitar el servicio de medicina
                    general domiciliaria.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full" data-aos="fade-up" data-aos-delay="400">
              <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl">
                  <MdOutlineSupportAgent className="w-18 h-18 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Servicios médicos profesionales
                  </h3>
                  <p className="text-gray-600">
                    Servicios médicos profesionales en la comodidad de su hogar
                    las 24 horas del día durante los 365 días del año.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Servicios;
