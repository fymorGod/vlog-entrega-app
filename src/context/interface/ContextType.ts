import { Audititem } from "../../interfaces/AuditoriaItem";
import { Nfe } from "../../interfaces/Nfe";
import { User } from "../../interfaces/User";

export interface AuthContextType {
    token: string | null;
    romaneio: string | null;
    setRomaneio: (newRomaneio: string | null) => void;
    authenticated: string | null;
    setToken: (newToken: string | null) => void;
    user: User | null;
    auditItem: Audititem[];
    setAuditItem: (data: Audititem[] | null) => void;
    nfe: Nfe | null;
    setNfe: (newNfe: Nfe | null) => void;
    setUser: (newUser: User | null) => void;
    setAuthenticated: (newAuthenticated: string | null) => void;
    logout: () => void; 
  }