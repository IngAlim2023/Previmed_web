import NavBarLanding from "../../components/landing/NavBarLanding";
import Inicio from "../../components/landing/Inicio";
import Nosotros from "../../components/landing/Nosotros";
import Barrios from "../../components/landing/Barrios";
import AppMovil from "../../components/landing/AppMovil";
import Servicios from "../../components/landing/Servicios";
import Planes from "../../components/landing/Planes";
import Contactos from "../../components/landing/Contactos";
import Footer from "../../components/landing/Footer";
import FloatingChatButton from "../../components/botones/FloatingChatButton";

export const Home: React.FC = () => {
  return (
    <>
      <div>
        <NavBarLanding />
      </div>
      <div>
        <Inicio />
      </div>
      <div>
        <Nosotros/>
      </div>
      <div>
        <Barrios/>
      </div>
      <div>
        <AppMovil/>
      </div>
      <div>
        <Servicios/>
      </div>
      <div>
        <Planes/>
      </div>
      <div>
        <Contactos/>
      </div>
      <div>
        <Footer/>
      </div>
      <div>
        <FloatingChatButton/>
      </div>
    </>
  );
};
