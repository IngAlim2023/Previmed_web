import React, { useState } from "react";
//import { MessageCircle } from "lucide-react";
import ChatPrevimed from "../usuarios/ChatPrevimed";

const FloatingChatButton: React.FC = () => {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      {abierto && (
        <div className="fixed bottom-20 right-6 z-50">
          <ChatPrevimed />
        </div>
      )}

      <button
        onClick={() => setAbierto(!abierto)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition z-50"
      >
        {/* <MessageCircle className="w-6 h-6" /> */}
      </button>
    </>
  );
};

export default FloatingChatButton;
