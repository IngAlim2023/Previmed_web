const Barrios: React.FC = () => {
  return (
    <>
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
    </>
  );
};

export default Barrios;
