import React from "react";
import { Container, ContainerForm, Text, ContainerLogo, TextSpan, ContainerVersion, TextSpanVersion } from "./styles";
import { useForm } from "react-hook-form";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export function Login() {
    const { control, handleSubmit } = useForm();
    const navigation = useNavigation();

    function handleUserLogin() {
        navigation.navigate('home');
    }

    return (     
        <Container>
            <ContainerLogo>
                <Image style={styles.tineLogo} source={require('../../../assets/logo.png')}/>
            </ContainerLogo>
            <ContainerForm>
                <Text>Login</Text>
                <TextSpan>Bem vindo ao sistema de entregas - Vlog</TextSpan>
                <Input
                    icon="mail"
                    placeholder="E-mail" 
                    keyboardType="email-address"
                    autoCapitalize='none'  
                />
                <Input 
                    icon="lock"
                    placeholder="Senha"
                    secureTextEntry
                />
                <Button 
                    title="Entrar"
                    onPress={handleUserLogin} 
                />
            </ContainerForm>
            <ContainerVersion>
                <TextSpanVersion>v.1.0.2</TextSpanVersion>
            </ContainerVersion>
        </Container>
    )
}

const styles = StyleSheet.create({
    tineLogo: {
        resizeMode: 'contain',
    }
});
