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

  // useEffect(() => {
  //   const loadToken = async () => {
  //     const token = await SecureStore.getItemAsync(TOKEN_KEY);
  //     console.log("stored:", token);
  //     if (token) {
  //       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  //       setAuthState({
  //         token: token,
  //         authenticated: true,
  //         storeData: storeData,
  //       });
  //     }
  //   };
  //   loadToken();
  // }, []);

  // const loadData = async (s: string) => {
  //   if (!s) {
  //     console.error("O código de barras escaneado é vazio ou indefinido.");
  //     return false;
  //   } else {
  //     const response = await axios.get(
  //       URL_VALIDATE_DATA_SCANNER + `chaveAcesso=${s}&unidadeIE=${storeData}`,
  //     );
  //     const data = await response.data;
  //     setNfeData(data[0]);
  //     return data[0]
  //   }
  // };

  // if (!nfeData?.romaneio && !nfeData?.status) {
  //   navigation.navigate("Dash");
  // } else {
  //   Alert.alert("NFe já cadastrada!")
  // }



  // const validatePerfil = (validateAuth: any, result: any) => {
  //   if (
  //     (result.data.data && validateAuth.admin === 1) ||
  //     validateAuth.exp === 1 ||
  //     validateAuth.expl === 1
  //   ) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  // const login = async (mode: string, username: string, password: string) => {
  //   try {
  //     const result = await axios.post(`${API_URL}`, {
  //       mode,
  //       username,
  //       password,
  //     });

  //     if (validatePerfil(result.data.data.permissions, result)) {
  //       setAuthState({
  //         token: result.data.data.token,
  //         authenticated: true,
  //         storeData: result.data.data.store_code
  //       });

  //       setStoreData(result.data.data.store_code);
  //       setLojaInfo(result.data.data.store_name);
  //       setUsername(result.data.data.username)

  //       axios.defaults.headers.common["Authorization"] =
  //         `Bearer ${result.data.data.token}`;

  //       await SecureStore.setItemAsync(TOKEN_KEY, result.data.data.token);

  //       return result;
  //     } else {
  //       return {
  //         error: true,
  //         msg: "Erro ao autenticar. Token não recebido na resposta.",
  //       };
  //     }
  //   } catch (e: any) {
  //     return {
  //       error: true,
  //       msg:
  //         e.response &&
  //           e.response.data &&
  //           e.response.data.data &&
  //           e.response.data.data.flag
  //           ? e.response.data.data.flag
  //           : "Usuário e senha incorreta",
  //     };
  //   }
  // };

  // const logout = async () => {
  //   await SecureStore.deleteItemAsync(TOKEN_KEY);

  //   axios.defaults.headers.common["Authorization"] = "";

  //   setAuthState({
  //     token: null,
  //     authenticated: false,
  //     storeData: null,
  //   });
  // };

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
