import { useState, useEffect, useRef, useContext } from "react";
import { enviarMensajeIA, MensajeChat, RespuestaIA } from "../../services/ChatService";
import { AuthContext } from "../../context/AuthContext";

export default function ChatPrevimed() {
  const auth = useContext(AuthContext);
  const documento = auth?.user?.documento || "15815557";

  const [mensajes, setMensajes] = useState<MensajeChat[]>(() => {
    const saved = localStorage.getItem("chatPrevimed");
    return saved ? JSON.parse(saved) : [];
  });
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [opciones, setOpciones] = useState<string[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("chatPrevimed", JSON.stringify(mensajes));
  }, [mensajes]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [mensajes]);

  const enviar = async (texto: string) => {
    if (!texto.trim()) return;
    const msg: MensajeChat = { role: "user", text: texto };
    const hist = [...mensajes, msg];
    setMensajes(hist);
    setNuevoMensaje("");
    setLoading(true);

    try {
      const data: RespuestaIA = await enviarMensajeIA(texto, documento, hist);

      // Agregar la respuesta de la IA
      setMensajes((prev) => [...prev, { role: "assistant", text: data.respuesta || "..." }]);

      // Mostrar botones si la IA los envía
      if (data.detalle?.medicos) setOpciones(data.detalle.medicos);
      else if (data.detalle?.barrios) setOpciones(data.detalle.barrios);
      else setOpciones([]);

      // Si la visita se completó, limpiar chat
      if (data.accion === "visita_creada") {
        setTimeout(() => {
          localStorage.removeItem("chatPrevimed");
          setMensajes([
            { role: "assistant", text: "✅ Visita registrada correctamente. ¡Gracias por confiar en Previmed!" },
          ]);
          setOpciones([]);
        }, 1500);
      }
    } catch (err) {
      console.error("❌ Error al enviar mensaje:", err);
      setMensajes((prev) => [
        ...prev,
        { role: "assistant", text: "Error al conectar con el asistente. Intenta nuevamente." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enviar(nuevoMensaje);
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white border rounded-2xl shadow-xl flex flex-col overflow-hidden">
      <div className="bg-[#004F4F] text-white p-3 font-semibold text-sm">
        Asistente Previmed
      </div>

      <div ref={chatRef} className="flex-1 p-3 overflow-y-auto space-y-2">
        {mensajes.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] p-2 rounded-xl text-sm ${
                m.role === "user"
                  ? "bg-[#E5F6F5] text-gray-800"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {opciones.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {opciones.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => enviar(opt)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {loading && <p className="text-gray-400 text-xs">Escribiendo...</p>}
      </div>

      <form onSubmit={handleSubmit} className="flex border-t p-2">
        <input
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 border rounded-lg p-2 text-sm"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="ml-2 bg-[#004F4F] text-white px-3 py-2 rounded-lg text-sm"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
