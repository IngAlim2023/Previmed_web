import { createContext, useState, type ReactNode, useContext, useEffect } from "react";
import Cookies from "js-cookie";

// ✅ Tipo de rol
type Rol = {
  idRol?: number;
  nombreRol: string;
};

// ✅ Tipo de usuario
type User = {
  id: string | null;
  documento: string | null;
  rol: Rol | null;
  nombre: string | null;
};

interface Context {
  user: User;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  isLoading: boolean;
}

export const AuthContext = createContext<Context | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
    id: null,
    documento: null,
    rol: null,
    nombre: null,
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ✅ Leer cookies al montar la app
  useEffect(() => {
    console.log("🧠 [AuthContext] Revisando sesión...");
    const savedAuth = Cookies.get("auth");
    const savedUser = Cookies.get("user");

    if (savedAuth === "true" && savedUser) {
      try {
        const parsedUser: User = JSON.parse(savedUser);
        if (parsedUser?.id && parsedUser?.rol?.nombreRol) {
          console.log("✅ [AuthContext] Sesión encontrada:", parsedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          console.warn("⚠️ [AuthContext] Cookie inválida. Se limpia.");
          Cookies.remove("auth");
          Cookies.remove("user");
        }
      } catch (err) {
        console.error("❌ [AuthContext] Error al parsear cookie:", err);
        Cookies.remove("auth");
        Cookies.remove("user");
      }
    } else {
      console.log("🚫 [AuthContext] No hay sesión activa.");
    }

    setIsLoading(false);
  }, []);

  // ✅ Actualizar cookies al cambiar usuario
  useEffect(() => {
    if (isAuthenticated && user.id) {
      Cookies.set("user", JSON.stringify(user));
      Cookies.set("auth", "true");
    }
  }, [user, isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Debes utilizar el contexto dentro del provider");
  return context;
};
