import { createContext, useContext, useEffect, useState } from "react";

import axios from 'axios';
import * as SecureStore from 'expo-secure-store'

interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null };
    onLogin?: (mode: string, username: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
    storeData?: string | null;
}


export const API_URL = 'https://api.apotiguar.com.br:64462'

const TOKEN_KEY = 'my-jwt'

const AuthContext = createContext<AuthProps>({})

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }: any) => {

    const [ authState, setAuthState ] = useState<{
        token: string | null;
        authenticated: boolean | null;
    }>({
        token: null,
        authenticated: null
    });

    const [ storeData, setStoreData ] = useState<string>('');

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            console.log("stored:", token)
            if( token ) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                setAuthState({
                    token: token,
                    authenticated: true
                })
            }
        }
        loadToken()
    }, [])

    const login = async (mode: string, username: string, password: string) => {
        try {
            const result =  await axios.post(`${API_URL}`, { mode, username, password });

            if (result && result.data && result.data.data && result.data.data.token) { // Verifica se o token foi recebido na resposta
                setAuthState({
                    token: result.data.data.token,
                    authenticated: true
                });
                setStoreData(result.data.data.store_code)

                axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.data.token}`;

                await SecureStore.setItemAsync(TOKEN_KEY, result.data.data.token);

                return result;
            } else {
                return { error: true, msg: "Erro ao autenticar. Token não recebido na resposta." };
            }
        } catch (e:any) {
            return { error: true, msg: (e.response && e.response.data && e.response.data.data && e.response.data.data.flag) ? e.response.data.data.flag : "Erro desconhecido ao autenticar." };
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY)

        axios.defaults.headers.common['Authorization'] = ''

        setAuthState({
            token: null,
            authenticated: false
        })
    }

    const value = {
        onLogin: login,
        onLogout: logout,
        authState,
        storeData
    }

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>

}