import { useState } from "react";
import { Container, ContainerForm, Text, ContainerLogo, TextSpan, ContainerVersion, TextSpanVersion } from "./styles";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Alert, Image, Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

export function Login() {
    const mode = 'login'
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const { onLogin } = useAuth()

    const login = async () => {
        if (!username || !password) {
            Alert.alert('Campos inválidos, Por favor preencha os campos!')
            return;
        }

        const result = await onLogin!(mode, username, password);
        if (result && result.error) {
            alert(result.msg)
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
                    style={{ flex: 1 }} >
                    <Container>
                        <ContainerLogo>
                            <Image style={styles.tineLogo} source={require('../../../assets/logo.png')} />
                        </ContainerLogo>
                        <ContainerForm>
                            <Text>Vlog</Text>
                            <TextSpan>Bem vindo ao sistema</TextSpan>
                            <Input
                                icon="mail"
                                placeholder="Username"
                                autoCapitalize='none'
                                onChangeText={(text: string) => setUsername(text)}
                                value={username}
                            />
                            <Input
                                icon="lock"
                                placeholder="Senha"
                                secureTextEntry
                                onChangeText={(text: string) => setPassword(text)}
                                value={password}
                            />
                            <Button
                                title="Entrar"
                                onPress={login}
                            />
                        </ContainerForm>
                        <ContainerVersion>
                            <TextSpanVersion>v.1.0.2</TextSpanVersion>
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
