const doctor = "https://res.cloudinary.com/dudqqzt1k/image/upload/v1761411223/doctor_gasphg.png"

const Inicio: React.FC = () => {
  return (
    <>
      <section
        id="inicio"
        className="bg-gradient-to-br from-blue-100 via-blue-50 to-withe py-20"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
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
    </>
  );
};

export default Inicio;
