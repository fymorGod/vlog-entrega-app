import React, { ReactNode, useEffect } from "react";
import { createContext, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Cliente {
  id: number;
  cpfCliente: string;
  nome: string;
}
interface Nfe {
  clienteE: Cliente;
  nfe: string;
  notaFiscal: number;
  numeroDav: string;
  numeroPreNota: string;
  romaneio: string;
  status: string;
}
interface User {
  username: string;
  lojaInfo: string;
  storeCode: string;
}

interface AuthContextType {
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

const initialUser: User | null = {
  lojaInfo: "",
  storeCode: "",
  username: ""
}

const initialNfe: Nfe | null = {
  clienteE: {
    cpfCliente: "",
    id: 0,
    nome: ""
  },
  nfe: "",
  notaFiscal: 0,
  numeroDav: "",
  numeroPreNota: "",
  romaneio: "",
  status: ""
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: initialUser,
  authenticated: null,
  nfe: initialNfe,
  setUser: () => {},
  setToken: () => {},
  setAuthenticated: ()=> {},
  setNfe: () => {},
  logout: () => {}
});

// const URL_VALIDATE_DATA_SCANNER = "https://staging-potiguar-mcs-eportal-retirada-cliente-api.apotiguar.com.br/api/v1/nfe/data-consumer?";

export const AuthProvider = ({ children }: AuthProviderProps) => {

  useEffect(() => {
    const fetchStoredData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        setToken(storedToken);

        const storedAuthenticated = await AsyncStorage.getItem('authenticated');
        setAuthenticated(storedAuthenticated);

        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

      } catch (error) {
        console.error('Erro ao carregar dados do AsyncStorage:', error);
      }
    };

    fetchStoredData();
  }, []);

  
  const [ token, setToken ] = useState<string | null>(null);

  const [ nfe, setNfe ] = useState<Nfe | null>(null);

  const [ authenticated, setAuthenticated ] = useState<string | null>(null);

  const [ user, setUser ] = useState<User | null>(null)


  const updateNfe = (newNfe: Nfe | null) => {
    setNfe(newNfe)
  } 

  const updateToken = async (newToken: string | null) => {
    setToken(newToken);
    if (newToken) {
      try {
        await AsyncStorage.setItem('token', newToken);
      } catch (error) {
        console.error('Erro ao salvar token no AsyncStorage:', error);
      }
    } else {
      try {
        await AsyncStorage.removeItem('token');
      } catch (error) {
        console.error('Erro ao remover token do AsyncStorage:', error);
      }
    }
  };

  const updateAuthenticated = async (newAuthenticated: string | null) => {
    setAuthenticated(newAuthenticated);
    if (newAuthenticated) {
      try {
        await AsyncStorage.setItem('authenticated', newAuthenticated);
      } catch (error) {
        console.error('Erro ao salvar authenticated no AsyncStorage:', error);
      }
    } else {
      try {
        await AsyncStorage.removeItem('authenticated');
      } catch (error) {
        console.error('Erro ao remover authenticated do AsyncStorage:', error);
      }
    }
  };

  const updateUser = async (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      try {
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
      } catch (error) {
        console.error('Erro ao salvar usuário no AsyncStorage:', error);
      }
    } else {
      try {
        await AsyncStorage.removeItem('user');
      } catch (error) {
        console.error('Erro ao remover usuário do AsyncStorage:', error);
      }
    }
  };
  const logout = () => {
    console.log("logout")
    updateToken(null)
    updateUser(null)
    updateUser(null)
    console.log(token)
  }

  return <AuthContext.Provider value={{
    logout,
    token,
    setToken: updateToken,
    user,
    setUser: updateUser,
    setAuthenticated: updateAuthenticated,
    authenticated,
    nfe,
    setNfe: updateNfe
  }}>{children}</AuthContext.Provider>;
};


