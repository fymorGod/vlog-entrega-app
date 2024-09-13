import React, { useContext, useEffect } from "react";
import { Container, ContainerForm, Text, ContainerLogo, TextSpan, ContainerVersion, TextSpanVersion } from "./styles";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Image, Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from 'react-hook-form';
import Toast from "react-native-toast-message";

type FormData = {
    username: string;
    password: string;
}

export function Login() {
    const mode = 'login';
    const { setToken, setUser, setAuthenticated } = useContext(AuthContext);
    const navigation = useNavigation();

    const { handleSubmit, control, formState: { errors } } = useForm<FormData>();

    const login = async (data: FormData) => {
            const res = await axios.post("https://api.apotiguar.com.br:64462", {
                mode: mode,
                username: data.username,
                password: data.password
            });
            if (res.data.flag) {
                setAuthenticated("authenticate");
                setToken(res.data.data.token);
                setUser({
                    lojaInfo: res.data.data.store_name,
                    storeCode: res.data.data.store_code,
                    username: res.data.data.username,
                    permission: res.data.data.permissions
                });
                navigation.navigate("Menu");
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Usuário ou senha incorretos',
                    visibilityTime: 5000
                });
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
                            <TextSpan>Bem-vindo ao sistema</TextSpan>
                            
                            <Controller
                                control={control}
                                name="username"
                                rules={{ required: "Username obrigatório" }}
                                render={({ field: { value, onChange } }) => (
                                    <View style={styles.inputContainer}>
                                        {errors.username && (
                                            <Text style={styles.errorText}>{errors.username.message}</Text>
                                        )}
                                        <Input
                                            icon="mail"
                                            placeholder="Username"
                                            autoCapitalize='none'
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    </View>
                                )}
                            />

                            <Controller
                                control={control}
                                name="password"
                                rules={{
                                    required: "Senha obrigatória",
                                    minLength: { value: 6, message: "Senha deve ter pelo menos 6 caracteres" }
                                }}
                                render={({ field: { value, onChange } }) => (
                                    <View style={styles.inputContainer}>
                                        {errors.password && (
                                            <Text style={styles.errorText}>{errors.password.message}</Text>
                                        )}
                                        <Input
                                            icon="lock"
                                            placeholder="Senha"
                                            secureTextEntry
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                        
                                    </View>
                                )}
                            />

                            <Button
                                title="Entrar"
                                onPress={handleSubmit(login)}
                            />
                        </ContainerForm>
                        <ContainerVersion>
                            <TextSpanVersion>v.2.3.1</TextSpanVersion>
                        </ContainerVersion>
                    </Container>
                </LinearGradient>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    tineLogo: {
        resizeMode: 'contain',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    inputContainer: {
        marginTop: 20,
        marginBottom: -20,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -10,
        marginBottom: 5
    },
});
