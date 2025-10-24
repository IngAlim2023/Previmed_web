import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoHomeSharp, IoPeopleSharp, IoPhonePortraitOutline, IoMenu } from "react-icons/io5";
import { MdOutlineMedicalServices } from "react-icons/md";
import { FaMapLocationDot } from "react-icons/fa6"; 
import { IoIosDocument } from 'react-icons/io';
import { BsTelephoneFill } from "react-icons/bs"
import PREVIMED_Full_Color from "../../assets/PREVIMED_Full_Color.png";

const NavBarLanding: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed w-full rounded-b-3xl bg-white shadow-2xl z-1">
        <div className="container px-4 flex items-center justify-between h-18">
          {/* Logo */}
          <a href="/" className="flex items-center mr-auto xl:mr-0">
            <img src={PREVIMED_Full_Color} alt="Imagen previmed" className="h-14" />
          </a>

          {/* Normal nav */}
          <nav className="hidden xl:flex space-x-4 text-sm font-medium">
            <a href="#inicio" className="flex font-normal text-lg text-gray-600 hover:text-blue-600">Inicio</a>
            <a href="#sobre_nosotros" className="font-normal text-lg text-gray-600 hover:text-blue-600">Sobre nosotros</a>
            <a href="#barrios" className="font-normal text-lg text-gray-600 hover:text-blue-600">Zonas de cobertura</a>
            <a href="#app_movil" className="font-normal text-lg text-gray-600 hover:text-blue-600">App móvil</a>
            <a href="#servicios" className="font-normal text-lg text-gray-600 hover:text-blue-600">Servicios</a>
            <a href="#planes" className="font-normal text-lg text-gray-600 hover:text-blue-600">Planes</a>
            <a href="#contactos" className="font-normal text-lg text-gray-600 hover:text-blue-600">Contactos</a>
          </nav>

          <button
            className="hidden xl:inline-block ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-md"
            onClick={() => navigate("/login")}
          >
            Iniciar sesión
          </button>

          {/* Boton Hamburguesa */}
          <button
            className="xl:hidden text-gray-800 hover:text-blue-600"
            onClick={() => setIsOpen(!isOpen)}
            >
            <IoMenu className="absolute top-4 right-6 z-50 w-10 h-auto cursor-pointer"/>
          </button>
        </div>

        {/* Pequeña Nav */}
        <div
          className={`xl:hidden transition-all duration-300 bg-white shadow-xl rounded-b-3xl overflow-hidden ${
            isOpen ? "max-h-screen" : "max-h-0"
          }`}
        >
          <nav className="flex flex-col p-4 space-y-4 text-lg font-normal text-gray-600">
            <a href="#inicio" onClick={() => setIsOpen(false)} className="hover:text-blue-600 flex"><IoHomeSharp className="w-6 h-auto mx-1"/>Inicio</a>
            <a href="#sobre_nosotros" onClick={() => setIsOpen(false)} className="hover:text-blue-600 flex"><IoPeopleSharp className="w-6 h-auto mx-1"/>Sobre nosotros</a>
            <a href="#barrios" onClick={() => setIsOpen(false)} className="hover:text-blue-600 flex"><FaMapLocationDot className="w-6 h-auto mx-1"/>Zonas de cobertura</a>
            <a href="#app_movil" onClick={() => setIsOpen(false)} className="hover:text-blue-600 flex"><IoPhonePortraitOutline className="w-6 h-auto mx-1"/>App móvil</a>
            <a href="#servicios" onClick={() => setIsOpen(false)} className="hover:text-blue-600 flex"><MdOutlineMedicalServices className="w-6 h-auto mx-1"/>Servicios</a>
            <a href="#planes" onClick={() => setIsOpen(false)} className="hover:text-blue-600 flex"><IoIosDocument className="w-6 h-auto mx-1"/>Planes</a>
            <a href="#contactos" onClick={() => setIsOpen(false)} className="hover:text-blue-600 flex"><BsTelephoneFill className="w-6 h-auto mx-1"/>Contactos</a>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-md w-52"
              onClick={() => {
                setIsOpen(false);
                navigate("/login");
              }}
            >
              Iniciar sesión
            </button>
          </nav>
        </div>
      </header>
    </>
  );
};

export default NavBarLanding;
