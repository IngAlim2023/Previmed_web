import { FaCheckCircle } from "react-icons/fa";

const Planes: React.FC = () => {
  return (
    <>
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
              className="bg-white p-6 rounded-xl border-1 border-blue-600 relative shadow-xl"
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
    </>
  );
};

export default Planes;
