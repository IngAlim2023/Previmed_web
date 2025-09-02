import { createContext, useState, type ReactNode, useContext, useEffect } from "react";
import Cookies from 'js-cookie'
type User = {
  id: string | null;
  documento: string | null;
};

interface Context {
  user: User;
  setUser: (user: User) => void;
  auth: boolean;
  setAuth: (auth: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated:(isAuthenticated: boolean) => void;
}

export const AuthContext = createContext<Context | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<boolean>(false);
  const [user, setUser] = useState<User>({ id: null, documento: null });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  useEffect(()=>{
    const cookies = Cookies.get();
    if(cookies.auth){
      setIsAuthenticated(true)
    }
  },[])
  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated
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
