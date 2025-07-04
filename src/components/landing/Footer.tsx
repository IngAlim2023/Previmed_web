import { FaFacebookF, FaInstagram } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <>
      <footer
        id="footer"
        className="bg-gray-100 py-10 px-8 mt-8"
      >
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
    </>
  );
};

export default Footer;
