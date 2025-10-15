import { createContext, useState, type ReactNode, useContext, useEffect } from "react";
import Cookies from "js-cookie";

type User = {
  id: string | null;
  documento: string | null;
  rol?: any | null;
  nombre?: string | null;
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
  // ✅ Inicializamos desde localStorage
  const savedUser = localStorage.getItem("user");
  const initialUser: User = savedUser ? JSON.parse(savedUser) : { id: null, documento: null, rol: null };
  const initialAuth = !!savedUser;

  const [auth, setAuth] = useState<boolean>(initialAuth);
  const [user, setUser] = useState<User>(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAuth);

  // Extra: sincronizar con cookies si las usas
  useEffect(() => {
    const savedAuth = Cookies.get("auth");
    const savedUserCookie = Cookies.get("user");

    if (savedAuth === "true" && savedUserCookie) {
      const parsedUser: User = JSON.parse(savedUserCookie);
      setAuth(true);
      setIsAuthenticated(true);
      setUser(parsedUser);
      // guardar también en localStorage
      localStorage.setItem("user", savedUserCookie);
    }
  }, []);

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
  if (!context) {
    throw new Error("Debes utilizar el contexto dentro del provider");
  }
  return context;
};
