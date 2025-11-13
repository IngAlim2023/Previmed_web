import React, { useEffect } from "react";
import "@n8n/chat/style.css";
import { createChat } from "@n8n/chat";

const PreviBot: React.FC = () => {
  const URL = import.meta.env.VITE_WEBHOOKURL;

  useEffect(() => {
    createChat({
      webhookUrl: URL,
      mode: "window",
      defaultLanguage: "en",
      showWelcomeScreen: true,
      initialMessages: [
        "¡Hola! Soy **Previbot**, tu asistente virtual de Previmed 👋",
      ],
      i18n: {
        en: {
          title: "🏥 Previmed",
          subtitle: "Agenda tu visita médica domiciliaria",
          footer: "",
          getStarted: "Iniciar chat",
          inputPlaceholder: "Escribe tu número de documento...",
          closeButtonTooltip: "Cerrar chat",
        },
      },
    });

    return () => {
      const chatContainer = document.querySelector("#n8n-chat");
      if (chatContainer) {
        chatContainer.innerHTML = "";
      }
    };
  }, [URL]);

  return <div></div>;
};

export default PreviBot;
