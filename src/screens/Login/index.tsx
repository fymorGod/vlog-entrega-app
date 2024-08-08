import React, { useContext, useEffect } from "react";
import { Container, ContainerForm, Text, ContainerLogo, TextSpan, ContainerVersion, TextSpanVersion } from "./styles";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Image, Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from 'react-hook-form';

type FormData = {
    username: string;
    password: string;
}

export function Login() {
    const mode = 'login'

    const { setToken, setUser, setAuthenticated } = useContext(AuthContext);
    const navigation = useNavigation()

    const { handleSubmit, control, formState: { errors } } = useForm<FormData>()

    useEffect(() => console.log('Username errors: ', errors?.username), [errors?.username]);
    useEffect(() => console.log('Password errors: ', errors?.password), [errors?.password]);

    const login = async (data: FormData) => {
        try {
            const res = await axios.post("https://api.apotiguar.com.br:64462", {
                mode: mode,
                username: data.username,
                password: data.password
            })
            if (res.status == 200 ) {
                setAuthenticated("authenticate")
                setToken(res.data.data.token)
                setUser({
                    lojaInfo: res.data.data.store_name,
                    storeCode: res.data.data.store_code,
                    username: res.data.data.username,
                    permission: res.data.data.permissions
                })
                navigation.navigate("Menu")
            }
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets={true}>
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <LinearGradient
                    colors={['#cd0914', '#871015']}
                    style={{ flex: 1 }}>
                    <Container>
                        <ContainerLogo>
                            <Image style={styles.tineLogo} source={require('../../../assets/logo.png')} />
                        </ContainerLogo>
                        <ContainerForm>
                            <Text>Vlog</Text>
                            <TextSpan>Bem vindo ao sistema</TextSpan>
                            <Controller
                                control={control}
                                name="username"
                                rules={{
                                    required: "Username obrigatório"
                                }}
                                render={({ field: { value, onChange } }) => (
                                    <Input
                                        icon="mail"
                                        placeholder="Username"
                                        autoCapitalize='none'
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="password"
                                rules={{
                                    required: "Senha obrigatória",
                                    minLength: 6
                                }}
                                render={({ field: { value, onChange } }) => (
                                    <Input
                                        icon="lock"
                                        placeholder="Senha"
                                        secureTextEntry
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />

                            <Button
                                title="Entrar"
                                onPress={handleSubmit(login)}
                            />
                        </ContainerForm>
                        <ContainerVersion>
                            <TextSpanVersion>v.1.1.2</TextSpanVersion>
                        </ContainerVersion>
                    </Container>
                </LinearGradient>
            </TouchableWithoutFeedback>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    tineLogo: {
        resizeMode: 'contain',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
});
