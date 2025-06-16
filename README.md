# 🚀 Bienvenido al proyecto: **Previmed** - React (Vite) + TypeScript

Este proyecto fue creado con dos objetivos principales:

1. ✅ Cumplir con el proyecto requerido por el **SENA**.
2. 🧠 Aplicar los conocimientos adquiridos en un proyecto real para la empresa **Previmed** (prestadora de servicios de salud).

---

## 🎯 Función principal

Gestionar de forma más **efectiva** y **dinámica** los distintos tipos de movimientos internos que se generan en la empresa **Previmed**.

---


## 🧱 Tecnologías utilizadas

- ⚛️ **React** (con Vite)
- 🟦 **TypeScript**
- 💅 **TailwindCSS**
- 📦 **npm** para gestión de dependencias

---
## 📦 Requisitos previos
Asegúrate de tener instaladas las siguientes herramientas:

- Node.js (versio: >= 22.14.0) // Para verificar que lo tienes en tu maquina ingresa al cmd y escribe node -v, de lo contrario instalalas rapido. 😡
- npm // Para verificar que lo tienes en tu maquina ingresa al cmd y escribe npm -v, de lo contrario instalalas rapido. 😡

## Proceso de instalación 💥💥💥

git clone https://github.com/IngAlim2023/Previmed_web.git

## Instalación de dependencias 🎒🎒🎒

en la terminal del proyecto npm i o en su defecto npm install

## Ejecución del proyecto 🏃🏃🏃
npm run dev


## 🚫🚫🚫 Convenios IMPORTANTES PARA MANEJO DEL PROYECTO CON EL OBJETIVO DE IMPEDIR CONFLICTOS EN EL REPOSITORIO 

1. 📦 Instalación de nuevas librerías:

 * Avisar al grupo antes de instalar nuevas dependencias.

 * Hacer git push inmediatamente después de instalar, para que el package.json y package-lock.json estén actualizados.

 * Los demás deben ejecutar npm install para mantener sincronizado el entorno.

2. 🧭 Modificaciones en App.tsx (ruteo):

 * Avisar al grupo antes de hacer cambios en las rutas.

 * Una vez realizados los cambios, hacer push y notificar al grupo para que todos actualicen el archivo común.

3. Ahora estamos trabajando con git Flow  🚫🚫🚫
 
 * Ahora tenemos dos ramas importantes: 

 ** master
 ** develop

 * Ubicate en la rama develop y crea tu feature de la siguiente mas
 ** git checkout develop

 //Creamos nuestra rama para la feature:
 
 ** git checkout -b feature/mi_feature

 //Lanzamos nuestra feature a github
 
 ** git push origin feacture/mi_feature

 // una ve terminada nuestra feature

 ** git push origin feature/mi_feature (no sin antes hacer el add . y el commit)

 // generamos nuestro pull request con nuestro cambios

 ** escribe el Whatsapp para que rebicen tus cambios

 // Ten paciencia esto demora un poco.


## 📣 Contacto
Para cualquier duda o problema técnico, comunícate por el grupo de WhatsApp del equipo 👥


# ¡Gracias por aportar al proyecto Previmed! 💚

🚧🚧🚧 Estructura del proyecto

```bash
src/
├── assets/
├── components/
│   ├── navegation/
│   ├── administrador/
│   ├── pacientes/
│   │   ├── titulares/
│   │   └── beneficiarios/
│   └── login/
├── pages/
│   ├── navegation/
│   ├── administrador/
│   ├── pacientes/
│   │   ├── titulares/
│   │   └── beneficiarios/
│   └── login/
├── App.tsx
└── main.tsx