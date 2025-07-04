import { BsCheckCircleFill, BsTelephoneFill } from "react-icons/bs";
import doctor from "../../assets/doctor.png";
import medico_domicilio from "../../assets/medico_domicilio.jpg";

const Nosotros:React.FC = () => {
  return (
    <>
            <section id="sobre_nosotros" className="py-2 bg-white mt-8">
        <div
          className="max-w-7xl mx-auto px-4"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="flex flex-col xl:flex-row items-center justify-between gap-12">
            <div
              className="w-full xl:w-5/12"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <span className="text-sm font-medium uppercase text-blue-600">
                Más sobre nosotros
              </span>
              <h2 className="text-3xl font-semibold text-gray-800 mt-2">
                Conoce más sobre Previmed
              </h2>
              <p className="text-gray-800">
                Somos una compañia que busca el mayor reconocimiento a nivel
                nacional en medicina general domiciliaria, por integralidad en
                la prestacion del servicio.
              </p>

              {/* Lista de características */}
              <ul className="mt-6 space-y-4 text-gray-800">
                {[
                  "Nuestro servicio de médico en casa le garantiza óptima respuesta.",
                  "Llevamos profesionales altamente capacitados a la puerta de su casa para atender sus necesidades en salud.",
                  "Hemos dispuesto un amplio número de funcionarios que velarán por su salud.",
                  "Nuestros servicios son especiales para usted y le evitarán molestas esperas.",
                  "Cambiamos el concepto de salud para enfocarlo en el bienestar de los pacientes!",
                  "Cubrimos con nuestros servicios a toda la familia",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <BsCheckCircleFill className="text-blue-600 w-5 h-5 mt-1 flex-shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Info: CEO y Teléfono */}
              <div className="mt-8 flex flex-col gap-6 md:flex-row items-start md:items-center">
                <div className="flex items-center gap-4">
                  <img
                    src={doctor}
                    alt="CEO Profile"
                    className="w-18 h-18 rounded-full object-cover bg-gray-200"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      Alberto Lasso
                    </h4>
                    <p className="text-gray-800 text-sm">CEO & Fundador</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BsTelephoneFill className="text-blue-600 w-6 h-6 ml-6" />
                  <div>
                    <p className="text-md text-gray-800">
                      Llama en cualquier momento
                    </p>
                    <p className="text-gray-800 font-medium">+57 123 456 789</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Imagen */}
            <div
              className="w-full xl:w-6/12 relative p-12"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <img
                src={medico_domicilio}
                alt="Business Meeting"
                className="rounded-xl shadow-md w-full"
              />
              <div className="absolute top-16 left-0 bg-blue-600 text-white px-4 py-2 rounded-xl shadow-lg">
                <h3 className="text-4xl font-bold leading-none">
                  10+ <span className="text-lg font-light">Años</span>
                </h3>
                <p className="text-lg">de experiencia a tu servicio.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Nosotros
