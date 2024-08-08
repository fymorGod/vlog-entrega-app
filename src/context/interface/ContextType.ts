import { Nfe } from "../../interfaces/Nfe";
import { User } from "../../interfaces/User";

export interface AuthContextType {
    token: string | null;
    authenticated: string | null;
    setToken: (newToken: string | null) => void;
    user: User | null;
    nfe: Nfe | null;
    setNfe: (newNfe: Nfe | null) => void;
    setUser: (newUser: User | null) => void;
    setAuthenticated: (newAuthenticated: string | null) => void;
    logout: () => void; 
  }