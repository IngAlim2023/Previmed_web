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
  auth: boolean;
  setAuth: (auth: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const AuthContext = createContext<Context | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const savedUser = localStorage.getItem("user");
  const initialUser: User = savedUser
    ? JSON.parse(savedUser)
    : { id: null, documento: null, rol: null, nombre: null };

  // 🚫 No asumimos autenticación solo por tener localStorage
  const [auth, setAuth] = useState<boolean>(false);
  const [user, setUser] = useState<User>(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // ✅ Leer cookies solo si son válidas
  useEffect(() => {
    console.log("🧠 [AuthContext] Montando contexto...");
    const savedAuth = Cookies.get("auth");
    const savedUserCookie = Cookies.get("user");
    console.log("🍪 [AuthContext] Cookies detectadas:", { savedAuth, savedUserCookie });

    if (savedAuth === "true" && savedUserCookie) {
      try {
        const parsedUser: User = JSON.parse(savedUserCookie);
        if (parsedUser?.id && parsedUser?.rol?.nombreRol) {
          console.log("✅ [AuthContext] Usuario válido desde cookie:", parsedUser);
          setAuth(true);
          setIsAuthenticated(true);
          setUser(parsedUser);
          localStorage.setItem("user", savedUserCookie);
        } else {
          console.warn("⚠️ [AuthContext] Cookie inválida. Limpiando...");
          Cookies.remove("auth");
          Cookies.remove("user");
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.error("❌ [AuthContext] Error al parsear cookie:", err);
        Cookies.remove("auth");
        Cookies.remove("user");
        localStorage.removeItem("user");
      }
    } else {
      console.log("🚫 [AuthContext] No hay sesión activa en cookies");
    }
  }, []);

  // ✅ Guardar cambios automáticos del usuario
  useEffect(() => {
    console.log("💾 [AuthContext] Guardando usuario:", user);
    if (user && user.id) {
      Cookies.set("user", JSON.stringify(user));
      Cookies.set("auth", "true");
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
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
