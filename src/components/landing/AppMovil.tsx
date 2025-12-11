

const phone_app = "https://res.cloudinary.com/dudqqzt1k/image/upload/v1761411208/phone_app_gcstuy.webp"
const AppMovil:React.FC = () => {
  return (
    <>
            <section
              id="app_movil"
              className="my-8 py-4 bg-gradient-to-t from-white via-blue-100 to-withe"
            >
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
                      <div className="flex items-center justify-end gap-4">
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
                    href="https://mega.nz/file/1B9XHahL#ci1hcr2lVNj5m9XVw8rtF3wRLUrxmBgHzEtAha7xIvo"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg font-semibold rounded-full transition"
                  >
                    Descargar
                  </a>
                </div>
              </div>
            </section>
    </>
  )
}

export default AppMovil
