import { useNavigate } from "react-router-dom";

// importaciones de imagenes
import PREVIMED_Full_Color from "../../assets/PREVIMED_Full_Color.png";
import doctor from "../../assets/doctor.png";
import medico_domicilio from "../../assets/medico_domicilio.jpg";
import phone_app from "../../assets/phone_app.webp";

// importaciones de react-icons
import { BsCheckCircleFill, BsTelephoneFill } from "react-icons/bs";
import {
  MdMedicalServices,
  MdAccessTime,
  MdOutlineHome,
  MdOutlineSupportAgent,
  MdEmail,
} from "react-icons/md";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <header
        className="fixed w-full rounded-full bg-white shadow-2xl z-50"
      >
        <div className="container mx-auto px-4 xl:px-8 flex items-center justify-between h-20">
          <a href="/" className="flex items-center mr-auto xl:mr-0">
            <img
              src={PREVIMED_Full_Color}
              alt="Imagen previmed"
              className="h-16"
            />
          </a>

          <nav
            className="hidden xl:flex space-x-6 text-sm font-medium"
          >
            <a
              href="#inicio"
              className="font-normal text-lg text-gray-600 hover:text-blue-600"
            >
              Inicio
            </a>
            <a
              href="#sobre_nosotros"
              className="font-normal text-lg text-gray-600 hover:text-blue-600"
            >
              Sobre nosotros
            </a>
            <a
              href="#barrios"
              className="font-normal text-lg text-gray-600 hover:text-blue-600"
            >
              Zonas de cobertura
            </a>
            <a
              href="#app_movil"
              className="font-normal text-lg text-gray-600 hover:text-blue-600"
            >
              App móvil
            </a>
            <a
              href="#servicios"
              className="font-normal text-lg text-gray-600 hover:text-blue-600"
            >
              Servicios
            </a>
            <a
              href="#planes"
              className="font-normal text-lg text-gray-600 hover:text-blue-600"
            >
              Planes
            </a>
            <a
              href="#contactos"
              className="font-normal text-lg text-gray-600 hover:text-blue-600"
            >
              Contactos
            </a>
          </nav>

          <a
            href=""
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-md"
            onClick={() => navigate("/login")}
          >
            Iniciar sesión
          </a>
        </div>
      </header>

      <section id="inicio" className="bg-gradient-to-br from-blue-100 via-blue-50 to-withe py-20"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Contenido de texto */}
            <div
              className="lg:w-1/2 items-center"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <h1 className="text-6xl mb-4 text-gray-800">
                Previmed <br />
                <span className="text-blue-600">Tu médico en casa</span>
              </h1>
              <p className="text-lg text-gray-800">
                Somos una empresa de servicios de medicina general domiciliaria,
                que brinda a su familia la tranquilidad y la comodidad de tener
                "un médico en casa".
                <br />
                <br />
                Contamos con profesionales altamente calificados y comprometidos
                con un excelente servicio, porque sabemos que el bienestar de
                sus seres queridos depende de su salud.
              </p>
            </div>

            {/* Imagen del médico */}
            <div className="lg:w-1/2 mt-0">
              <img
                src={doctor}
                alt="Hero Image"
                className="w-xl h-auto pl-16"
              />
            </div>
          </div>
        </div>
      </section>

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

      <section id="barrios" className="py-20 bg-white">
        <div
          className="max-w-3xl mx-auto text-center mb-12 px-4"
          data-aos="fade-up"
        >
          <h2 className="text-3xl font-semibold text-gray-800 mt-2">
            Zonas de cobertura
          </h2>
          <p className="text-gray-800 mt-2">
            Zonas de cobertura en la que podrás adquirir el servicio de Previmed
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
            {/* Mapa */}
            <div className="w-full lg:w-2/3 aspect-video">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d249.1337882594045!2d-76.58515796380323!3d2.4602716912055502!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sco!4v1733854798372!5m2!1ses!2sco"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full rounded-lg shadow-xl border"
              ></iframe>
            </div>

            {/* Lista de barrios */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md overflow-y-auto max-h-[460px] border">
                <ul className="divide-y divide-gray-200 text-gray-800">
                  {[
                    "El Cadillal",
                    "La Esmeralda",
                    "Pomona",
                    "Santa Inés",
                    "Los Hoyos",
                    "Yanaconas",
                    "Pandiguando",
                    "Villa Occidente",
                    "Caldas",
                    "Villa Colombia",
                    "El Recuerdo",
                    "Santa Clara",
                    "Valle del Ortigal",
                    "Bosques de Pomona",
                    "Alto de Cauca",
                    "Ciudad Jardín",
                    "La Paz",
                    "La Ladera",
                    "Lomas de Granada",
                    "Bellavista",
                  ].map((zona, idx) => (
                    <li key={idx} className="px-4 py-2 hover:bg-gray-100">
                      {zona}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="app_movil" className="my-8 py-4 bg-gradient-to-t from-white via-blue-100 to-withe">
        <div className="max-w-6xl mx-auto px-4 text-center" data-aos="fade-up">
          <h2 className="text-3xl font-semibold text-gray-800 mt-2">
            Aplicación movil
          </h2>
          <p className="text-gray-600">Descarga nuestra app movil</p>
        </div>

        <div
          className="max-w-6xl mx-auto px-4 mt-12"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            {/* Columna izquierda */}
            <div className="w-full lg:w-1/3">
              <div
                className="mb-8 text-end"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <div className="flex items-center  gap-4">
                  <div>
                    <h3 className="text-3xl font-semibold text-gray-800">
                      Comodidad
                    </h3>
                    <p className="text-gray-600">
                      Solicita citas médicas desde cualquier lugar, a cualquier
                      hora.
                    </p>
                  </div>
                  <div className="text-blue-600 text-2xl">
                    <i className="bi bi-display"></i>
                  </div>
                </div>
              </div>

              <div
                className="mb-8 text-end"
                data-aos="fade-right"
                data-aos-delay="300"
              >
                <div className="flex items-center justify-end gap-4">
                  <div>
                    <h3 className="text-3xl font-semibold text-gray-800">
                      Ahorro de Tiempo
                    </h3>
                    <p className="text-gray-600">
                      Reduce el tiempo invertido en agendar consultas médicas.
                    </p>
                  </div>
                  <div className="text-blue-600 text-2xl">
                    <i className="bi bi-feather"></i>
                  </div>
                </div>
              </div>

              <div
                className="text-end"
                data-aos="fade-right"
                data-aos-delay="400"
              >
                <div className="flex items-center justify-end gap-4">
                  <div>
                    <h3 className="text-3xl font-semibold text-gray-800">
                      Personalización y Seguimiento
                    </h3>
                    <p className="text-gray-600">
                      Historial de visitas y recordatorios automáticos para que
                      no olvides ninguna consulta.
                    </p>
                  </div>
                  <div className="text-blue-600 text-2xl">
                    <i className="bi bi-eye"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna central */}
            <div
              className="w-full lg:w-1/3 flex justify-center items-center"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <div className="text-center">
                <img
                  src={phone_app}
                  alt="Phone Mockup"
                  className="w-64 mx-auto rounded-xl shadow-md"
                />
              </div>
            </div>

            {/* Columna derecha */}
            <div className="w-full lg:w-1/3">
              <div className="mb-8" data-aos="fade-left" data-aos-delay="200">
                <div className="flex items-center gap-4">
                  <div className="text-blue-600 text-2xl">
                    <i className="bi bi-code-square"></i>
                  </div>
                  <div>
                    <h3 className="text-3xl font-semibold text-gray-800">
                      Facilidad de Pago
                    </h3>
                    <p className="text-gray-600">
                      Visualiza precios y paquetes médicos antes de solicitar
                      una consulta.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8" data-aos="fade-left" data-aos-delay="300">
                <div className="flex items-center gap-4">
                  <div className="text-blue-600 text-2xl">
                    <i className="bi bi-phone"></i>
                  </div>
                  <div>
                    <h3 className="text-3xl font-semibold text-gray-800">
                      Sin Largas Esperas
                    </h3>
                    <p className="text-gray-600">
                      Reduce las filas en los centros médicos, programando todo
                      con anticipación.
                    </p>
                  </div>
                </div>
              </div>

              <div data-aos="fade-left" data-aos-delay="400">
                <div className="flex items-center gap-4">
                  <div className="text-blue-600 text-2xl">
                    <i className="bi bi-browser-chrome"></i>
                  </div>
                  <div>
                    <h3 className="text-3xl font-semibold text-gray-800">
                      Acceso Rápido
                    </h3>
                    <p className="text-gray-600">
                      Accede a una red de médicos disponibles sin necesidad de
                      llamadas o largas esperas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botón */}
          <div className="flex justify-center mt-12">
            <a
              href="https://play.google.com/store/apps/details?id=com.prevemed.app&hl=es_419"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg font-semibold rounded-full transition"
            >
              Descargar
            </a>
          </div>
        </div>
      </section>

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

      <section id="planes" className="section bg-white py-16 px-8">
        <div className="container mx-auto text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl font-semibold text-gray-800">Planes</h2>
          <p className="text-gray-600 mt-2">
            Escoge el plan que más te guste y cubra tus necesidades.
          </p>
        </div>

        <div
          className="container mx-auto"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center">
            {/* Plan Individual */}
            <div
              className="bg-white p-6 rounded-xl shadow-xl border-1 border-gray-300"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <h3 className="text-2xl font-semibold text-gray-700">
                Individual
              </h3>
              <div className="price my-4 text-blue-600 text-4xl font-bold">
                <span className="currency">$</span>
                <span className="amount">29.999</span>
                <span className="period text-base text-gray-500">
                  / mensual
                </span>
              </div>
              <p className="description text-gray-600 mb-4">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium totam.
              </p>

              <h4 className="text-gray-700 font-medium mb-2">Incluye:</h4>
              <ul className="features-list text-gray-600 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" /> Duis aute irure
                  dolor
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" /> Excepteur sint
                  occaecat
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" /> Nemo enim ipsam
                  voluptatem
                </li>
              </ul>
            </div>

            {/* Plan Familiar */}
            <div
              className="bg-white p-6 rounded-xl shadow border-1 border-blue-600 relative shadow-xl"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-2 rounded-tr-lg rounded-bl-lg">
                Más Popular
              </div>
              <h3 className="text-2xl font-semibold text-gray-700">Familiar</h3>
              <div className="price my-4 text-blue-600 text-4xl font-bold">
                <span className="currency">$</span>
                <span className="amount">39.999</span>
                <span className="period text-base text-gray-500">
                  / mensual
                </span>
              </div>
              <p className="description text-gray-600 mb-4">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesentium voluptatum.
              </p>

              <h4 className="text-gray-700 font-medium mb-2">Incluye:</h4>
              <ul className="features-list text-gray-600 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" /> Lorem ipsum dolor
                  sit amet
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" /> Consectetur
                  adipiscing elit
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" /> Sed do eiusmod
                  tempor
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" /> Ut labore et
                  dolore magna
                </li>
              </ul>
            </div>

            {/* Plan Premium */}
            <div
              className="bg-white p-6 rounded-xl shadow-xl border-1 border-gray-300"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <h3 className="text-2xl font-semibold text-gray-700">Premium</h3>
              <div className="price my-4 text-blue-600 text-4xl font-bold">
                <span className="currency">$</span>
                <span className="amount">79.999</span>
                <span className="period text-base text-gray-500">
                  / mensual
                </span>
              </div>
              <p className="description text-gray-600 mb-4">
                Quis autem vel eum iure reprehenderit qui in ea voluptate velit
                esse quam nihil molestiae.
              </p>

              <h4 className="text-gray-700 font-medium mb-2">Incluye:</h4>
              <ul className="features-list text-gray-600 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" /> Temporibus autem
                  quibusdam
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" /> Saepe eveniet ut
                  et voluptates
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" /> Nam libero
                  tempore soluta
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" /> Cumque nihil
                  impedit quo
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" /> Maxime placeat
                  facere possimus
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="contactos" className="py-16 px-8 bg-white" data-aos="fade-up">
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
            <p className="text-gray-600">
              Cra 6 No. 15N-03 B/ El Recuerdo Popayán Cauca 52 Colombia
            </p>
            <p className="text-gray-600">Popayán, 535022</p>
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
            <p className="text-gray-600">+57 358 554 8855</p>
            <p className="text-gray-600">+57 367 254 4441</p>
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
            <p className="text-gray-600">info@example.com</p>
            <p className="text-gray-600">contact@example.com</p>
          </div>
        </div>
      </section>

      <footer
        id="footer"
        className="bg-gradient-to-t from-blue-100 to-withe text-gray-800 py-10 px-8 mt-8"
      >
      <hr className="my-6 border-t-1 border-gray-300" />
        <div className="mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sección izquierda */}
            <div className="lg:w-1/2">
              <p className="flex items-center mb-4">
                <span className="text-2xl font-semibold">
                  Previmed, Tu médico en casa!
                </span>
              </p>
              <div className="pt-3 space-y-2">
                <p>
                  Contamos con la experiencia y el personal para ofrecer salud
                  de calidad en su casa.
                </p>
                <p>Popayán, 535022</p>
                <p className="mt-3 font-semibold">
                  Proteja a su familia y reciba atención médica oportuna en la
                  comodidad de su hogar las 24 horas del día.
                </p>
              </div>
              <div className="flex space-x-4 mt-4 text-2xl">
                <a href="" className="text-gray-600 hover:text-blue-600">
                  <div className="rounded-full shadow-xl border-1 border-gray-600 p-2 hover:border-blue-600">
                    <FaFacebookF />
                  </div>
                </a>
                <a href="" className="text-gray-600 hover:text-blue-600">
                  <div className="rounded-full shadow-xl border-1 border-gray-600 p-2 hover:border-blue-600">
                    <FaInstagram />
                  </div>
                </a>
              </div>
            </div>

            {/* Sección derecha */}
            <div className="lg:w-1/2">
              <h3 className="text-2xl font-semibold mb-2">Testimonios</h3>
              <p className="font-semibold">Fredy Gómez</p>
              <p>
                Prestan un excelente servicio, son oportunos y ágiles. Estamos
                muy a gusto con la relación calidad precio.
              </p>
            </div>
          </div>

          {/* Créditos */}
          <div className="text-center mt-10 text-sm text-gray-600">
            <p>
              © <span>Copyright</span>{" "}
              <strong className="px-1 font-semibold">Previmed</strong>{" "}
              <span>Todos los derechos reservados</span>
            </p>
            <div className="mt-2">
              Diseñada por
              <a
                href="https://www.sena.edu.co/es-co/Paginas/default.aspx"
                className="text-blue-500 hover:underline"
              >
                Profesionales del SENA 😉
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
