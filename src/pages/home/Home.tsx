export const Home: React.FC = () => {
  return (
    <>
      <header id="header" className="fixed top-0 w-full bg-white shadow z-50">
        <div className="container mx-auto px-4 xl:px-8 flex items-center justify-between h-20">
          <a href="landing.html" className="flex items-center mr-auto xl:mr-0">
            <img
              src="/ruta/relativa/PREVIMED_Full_Color.png"
              alt="Imagen previmed"
              className="h-10"
            />
          </a>

          <nav
            id="navmenu"
            className="hidden xl:flex space-x-6 text-sm font-medium"
          >
            <a href="#hero" className="text-blue-600 hover:text-blue-800">
              Inicio
            </a>
            <a href="#about" className="hover:text-blue-800">
              Sobre nosotros
            </a>
            <a href="#features" className="hover:text-blue-800">
              Zonas de cobertura
            </a>
            <a href="#app-movil" className="hover:text-blue-800">
              App móvil
            </a>
            <a href="#services" className="hover:text-blue-800">
              Servicios
            </a>
            <a href="#pricing" className="hover:text-blue-800">
              Planes
            </a>
            <a href="#contact" className="hover:text-blue-800">
              Contactos
            </a>
          </nav>

          <button className="xl:hidden text-gray-700 text-2xl focus:outline-none">
            <i className="bi bi-list"></i>
          </button>

          <a
            href="login.html"
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Iniciar sesión
          </a>
        </div>
      </header>

      <section
        id="hero"
        className="bg-white py-20"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Contenido de texto */}
            <div className="lg:w-1/2">
              <div
                className="hero-content"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                  Previmed <br />
                  <span className="text-blue-600">Tu médico en casa</span>
                </h1>
                <p className="text-lg mb-4 md:mb-5">
                  Somos una empresa de servicios de medicina general
                  domiciliaria, que brinda a su familia la tranquilidad y la
                  comodidad de tener "un médico en casa".
                  <br />
                  <br />
                  Contamos con profesionales altamente calificados y
                  comprometidos con un excelente servicio, porque sabemos que el
                  bienestar de sus seres queridos depende de su salud.
                </p>
              </div>
            </div>

            {/* Imagen del héroe */}
            <div className="lg:w-1/2 mt-8 lg:mt-0">
              <div
                className="hero-image"
                data-aos="zoom-out"
                data-aos-delay="300"
              >
                <img
                  src="assets/img/doctor.png"
                  alt="Hero Image"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-white">
        <div
          className="max-w-7xl mx-auto px-4"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="flex flex-col xl:flex-row items-center justify-between gap-12">
            {/* Texto */}
            <div
              className="w-full xl:w-5/12"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <span className="text-sm font-medium uppercase text-blue-600">
                Más sobre nosotros
              </span>
              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                Conoce más sobre Previmed
              </h2>
              <p className="text-gray-600 mt-4">
                Somos una compañia que busca el mayor reconocimiento a nivel
                nacional en medicina general domiciliaria, por integralidad en
                la prestacion del servicio.
              </p>

              {/* Lista de características */}
              <ul className="mt-6 space-y-3 text-gray-700">
                {[
                  "Nuestro servicio de médico en casa le garantiza optima respuesta.",
                  "Llevamos profesionales altamente capacitados a la puerta de su casa para atender sus necesidades en salud.",
                  "Hemos dispuesto un amplio número de funcionarios que velaran por su salud.",
                  "Nuestros servicios son especiales para usted y le evitaran molestas esperas.",
                  "Cambiamos el concepto de salud para enfocarlo en el bienestar de los pacientes!",
                  "Cubrimos con nuestros servicios a toda la familia, especialmente a niños y ancianos",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <i className="bi bi-check-circle-fill text-blue-600 mt-1"></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Info: CEO y Teléfono */}
              <div className="mt-8 flex flex-col gap-6 md:flex-row items-start md:items-center">
                <div className="flex items-center gap-4">
                  <img
                    src=""
                    alt="CEO Profile"
                    className="w-16 h-16 rounded-full object-cover bg-gray-200"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      Alberto Lasso
                    </h4>
                    <p className="text-gray-500 text-sm">CEO & Fundador</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="bi bi-telephone-fill text-blue-600 text-xl"></i>
                  <div>
                    <p className="text-sm text-gray-500">
                      Llama en cualquier momento
                    </p>
                    <p className="text-gray-800 font-medium">+57 123 456 789</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Imagen */}
            <div
              className="w-full xl:w-6/12 relative"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="relative">
                <img
                  src="assets/img/medico_casa.jpg"
                  alt="Business Meeting"
                  className="rounded-xl shadow-md"
                />
                <img
                  src="assets/img/servicio_24h.jpg"
                  alt="Team Discussion"
                  className="absolute bottom-[-40px] right-[-40px] w-48 rounded-xl shadow-md hidden md:block"
                />
              </div>
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold leading-none">
                  10+ <span className="text-sm font-light">Años</span>
                </h3>
                <p className="text-sm">de experiencia a tu servicio.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        {/* Título */}
        <div
          className="max-w-3xl mx-auto text-center mb-12 px-4"
          data-aos="fade-up"
        >
          <h2 className="text-3xl font-bold text-gray-800">
            Zonas de cobertura
          </h2>
          <p className="text-gray-600 mt-2">
            Zonas de cobertura en la que podrás adquirir el servicio de Previmed
          </p>
        </div>

        {/* Contenido */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
            {/* Mapa */}
            <div className="w-full lg:w-2/3 aspect-video">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d249.1337882594045!2d-76.58515796380323!3d2.4602716912055502!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sco!4v1733854798372!5m2!1ses!2sco"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full rounded-lg shadow-md border"
              ></iframe>
            </div>

            {/* Lista de zonas */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md overflow-y-auto max-h-[500px] border">
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

      <section id="app-movil" className="features-2 section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Aplicación movil</h2>
          <p>Descarga nuestra app movil desde la Play Store</p>
        </div>
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row align-items-center">
            <div className="col-lg-4">
              <div
                className="feature-item text-end mb-5"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <div className="d-flex align-items-center justify-content-end gap-4">
                  <div className="feature-content">
                    <h3>Comodidad</h3>
                    <p>
                      Solicita citas médicas desde cualquier lugar, a cualquier
                      hora.
                    </p>
                  </div>
                  <div className="feature-icon flex-shrink-0">
                    <i className="bi bi-display"></i>
                  </div>
                </div>
              </div>

              <div
                className="feature-item text-end mb-5"
                data-aos="fade-right"
                data-aos-delay="300"
              >
                <div className="d-flex align-items-center justify-content-end gap-4">
                  <div className="feature-content">
                    <h3>Ahorro de Tiempo</h3>
                    <p>
                      Reduce el tiempo invertido en agendar consultas médicas.
                    </p>
                  </div>
                  <div className="feature-icon flex-shrink-0">
                    <i className="bi bi-feather"></i>
                  </div>
                </div>
              </div>

              <div
                className="feature-item text-end"
                data-aos="fade-right"
                data-aos-delay="400"
              >
                <div className="d-flex align-items-center justify-content-end gap-4">
                  <div className="feature-content">
                    <h3>Personalización y Seguimiento</h3>
                    <p>
                      Historial de visitas y recordatorios automáticos para que
                      no olvides ninguna consulta.
                    </p>
                  </div>
                  <div className="feature-icon flex-shrink-0">
                    <i className="bi bi-eye"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4" data-aos="zoom-in" data-aos-delay="200">
              <div className="phone-mockup text-center">
                <img
                  src="assets/img/phone-app-screen.webp"
                  alt="Phone Mockup"
                  className="img-fluid"
                />
              </div>
            </div>

            <div className="col-lg-4">
              <div
                className="feature-item mb-5"
                data-aos="fade-left"
                data-aos-delay="200"
              >
                <div className="d-flex align-items-center gap-4">
                  <div className="feature-icon flex-shrink-0">
                    <i className="bi bi-code-square"></i>
                  </div>
                  <div className="feature-content">
                    <h3>Facilidad de Pago</h3>
                    <p>
                      Visualiza precios y paquetes médicos antes de solicitar
                      una consulta.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="feature-item mb-5"
                data-aos="fade-left"
                data-aos-delay="300"
              >
                <div className="d-flex align-items-center gap-4">
                  <div className="feature-icon flex-shrink-0">
                    <i className="bi bi-phone"></i>
                  </div>
                  <div className="feature-content">
                    <h3>Sin Largas Esperas</h3>
                    <p>
                      Reduce las filas en los centros médicos, programando todo
                      con anticipación.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="feature-item"
                data-aos="fade-left"
                data-aos-delay="400"
              >
                <div className="d-flex align-items-center gap-4">
                  <div className="feature-icon flex-shrink-0">
                    <i className="bi bi-browser-chrome"></i>
                  </div>
                  <div className="feature-content">
                    <h3>Acceso Rápido</h3>
                    <p>
                      Accede a una red de médicos disponibles sin necesidad de
                      llamadas o largas esperas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center align-items-center ">
            <a
              href="https://play.google.com/store/apps/details?id=com.prevemed.app&hl=es_419"
              className="btn btn-primary btn-lg"
            >
              Descargar
            </a>
          </div>
        </div>
      </section>

      <section id="services" className="services section light-background">
        <div className="container section-title" data-aos="fade-up">
          <h2>Servicios</h2>
          <p>
            En Previmed ofrecemos una gran variedad de servicios y nos adaptamos
            a tus necesidades.
          </p>
        </div>

        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row g-4">
            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
              <div className="service-card d-flex">
                <div className="icon flex-shrink-0">
                  <i className="bi bi-activity"></i>
                </div>
                <div>
                  <h3>Visita médica a domicilio</h3>
                  <p>
                    El paciente en su estado evita la incomodidad de salir de
                    casa, conservando su entorno familiar y resivir el servicio
                    de manera más personalizada.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="200">
              <div className="service-card d-flex">
                <div className="icon flex-shrink-0">
                  <i className="bi bi-diagram-3"></i>
                </div>
                <div>
                  <h3>Sin limites de visitas</h3>
                  <p>
                    Hemos dispuesto un amplio número de funcionarios que velaran
                    por su salud cuantas veces lo requiera.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="300">
              <div className="service-card d-flex">
                <div className="icon flex-shrink-0">
                  <i className="bi bi-easel"></i>
                </div>
                <div>
                  <h3>Servicio 24/7</h3>
                  <p>
                    El usuario y/o beneficiario las 24 horas del día y los 7
                    días de la semana, podrá solicitar el servicio de medicina
                    general domiciliaria.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="400">
              <div className="service-card d-flex">
                <div className="icon flex-shrink-0">
                  <i className="bi bi-clipboard-data"></i>
                </div>
                <div>
                  <h3>Servicios medicos profesionales </h3>
                  <p>
                    Servicios medicos profesionales en la comodidad de su hogar
                    las 24 horas del día durante los 365 días del año.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="pricing section light-background">
        <div className="container section-title" data-aos="fade-up">
          <h2>Planes</h2>
          <p>Escoge el plan que más te guste y cubra tus necesidades.</p>
        </div>

        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row g-4 justify-content-center">
            <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
              <div className="pricing-card">
                <h3>Individual</h3>
                <div className="price">
                  <span className="currency">$</span>
                  <span className="amount">29.999</span>
                  <span className="period">/ mensual</span>
                </div>
                <p className="description">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium totam.
                </p>

                <h4>Featured Included:</h4>
                <ul className="features-list">
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    Duis aute irure dolor
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    Excepteur sint occaecat
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    Nemo enim ipsam voluptatem
                  </li>
                </ul>

                <a href="#contact" className="btn btn-primary">
                  Contactanos ahora
                  <i className="bi bi-arrow-right"></i>
                </a>
              </div>
            </div>

            <div className="col-lg-4" data-aos="fade-up" data-aos-delay="200">
              <div className="pricing-card popular">
                <div className="popular-badge">Más Popular</div>
                <h3>Familiar</h3>
                <div className="price">
                  <span className="currency">$</span>
                  <span className="amount">39.999</span>
                  <span className="period">/ mensual</span>
                </div>
                <p className="description">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui
                  blanditiis praesentium voluptatum.
                </p>

                <h4>Featured Included:</h4>
                <ul className="features-list">
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    Lorem ipsum dolor sit amet
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    Consectetur adipiscing elit
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    Sed do eiusmod tempor
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    Ut labore et dolore magna
                  </li>
                </ul>

                <a href="#contact" className="btn btn-light">
                  Contactanos ahora
                  <i className="bi bi-arrow-right"></i>
                </a>
              </div>
            </div>

            <div className="col-lg-4" data-aos="fade-up" data-aos-delay="300">
              <div className="pricing-card">
                <h3>Premium</h3>
                <div className="price">
                  <span className="currency">$</span>
                  <span className="amount">79.999</span>
                  <span className="period">/ mensual</span>
                </div>
                <p className="description">
                  Quis autem vel eum iure reprehenderit qui in ea voluptate
                  velit esse quam nihil molestiae.
                </p>

                <h4>Featured Included:</h4>
                <ul className="features-list">
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    Temporibus autem quibusdam
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    Saepe eveniet ut et voluptates
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    Nam libero tempore soluta
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    Cumque nihil impedit quo
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    Maxime placeat facere possimus
                  </li>
                </ul>

                <a href="#contact" className="btn btn-primary">
                  Contactanos ahora
                  <i className="bi bi-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact container">
        <div className="container section-title" data-aos="fade-up">
          <h2>Contactos</h2>
          <p>No pierdas más tiempo y contactanos</p>
        </div>

        <div className="container info-box row">
          <div className="info-item col-lg-4" data-aos="fade-up">
            <div className="icon-box">
              <i className="bi bi-geo-alt"></i>
            </div>
            <div className="content">
              <h4>Nuestra ubicación</h4>
              <p>Cra 6 No. 15N-03 B/ El Recuerdo Popayán Cauca 52 Colombia</p>
              <p>Popayán, NY 535022</p>
            </div>
          </div>

          <div className="info-item col-lg-4" data-aos="fade-up">
            <div className="icon-box">
              <i className="bi bi-telephone"></i>
            </div>
            <div className="content">
              <h4>Números telefonicos</h4>
              <p>+1 5589 55488 55</p>
              <p>+1 6678 254445 41</p>
            </div>
          </div>

          <div className="info-item col-lg-4" data-aos="fade-up">
            <div className="icon-box">
              <i className="bi bi-envelope"></i>
            </div>
            <div className="content">
              <h4>Correos electronicos</h4>
              <p>info@example.com</p>
              <p>contact@example.com</p>
            </div>
          </div>
        </div>
      </section>

      <footer id="footer" className="bg-gray-100 text-gray-800 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sección izquierda */}
            <div className="lg:w-1/2">
              <a href="landing.html" className="flex items-center mb-4">
                <span className="text-xl font-bold">
                  Previmed, Tu médico en casa!
                </span>
              </a>
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
                <a href="" className="text-blue-600 hover:text-blue-800">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="" className="text-pink-500 hover:text-pink-700">
                  <i className="bi bi-instagram"></i>
                </a>
              </div>
            </div>

            {/* Sección derecha */}
            <div className="lg:w-1/2">
              <h3 className="text-xl font-bold mb-2">Testimonios</h3>
              <p>
                <strong>Fredy Gómez</strong>
              </p>
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
              Diseñada por{" "}
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
    </>
  );
};
