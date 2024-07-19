import React, { ReactNode } from "react";
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
  
  const [ token, setToken ] = useState<string | null>(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken ? storedToken : null
  });

  const [ nfe, setNfe ] = useState<Nfe | null>();

  const [ authenticated, setAuthenticated ] = useState<string | null>(() => {
    const storedAuthenticated = localStorage.getItem("authenticated");
    return storedAuthenticated ? storedAuthenticated : null
  });

  const [ user, setUser ] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  })

  const updateToken = (newToken: string | null) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
  };
  const updateNfe = (newNfe: Nfe | null) => {
    setNfe(newNfe)
  } 

  const updateAuthenticated = (newAuthenticated: string | null) => {
    setAuthenticated(newAuthenticated);
    if (newAuthenticated) {
      localStorage.setItem("authenticated", newAuthenticated);
    } else {
      localStorage.removeItem("authenticated");
    }
  };

  const updateUser = (newUser: User | null) => {
    setUser(newUser)
    if(newUser) {
      localStorage.setItem("user", JSON.stringify(newUser))
    } else {
      localStorage.removeItem("user")
    }
  }

  const logout = () => {
    updateToken(null)
    updateUser(null)
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
