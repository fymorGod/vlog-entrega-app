import { View } from "react-native";
import React from "react";
import { ToggleCamera } from "../Dash/styles";
import { ButtonCamera } from "../../components/ButtonCameraNFE";
import { useNavigation } from "@react-navigation/native";

export const ProdutoScreen = () => {
    const navigation = useNavigation()

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ToggleCamera>
            <ButtonCamera 
            icon="camera" 
            title="Scanear Produto" 
            onPress={() => navigation.navigate('ProdutoScan')} 
            />
        </ToggleCamera>
    </View>
    )
}