import { StyleSheet, View } from "react-native";
import React from "react";
import { ButtonCamera } from "../../components/ButtonCameraNFE";
import { useNavigation } from "@react-navigation/native";

export function InitScanner() {
    const navigation = useNavigation();
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <View style={styles.toggleCamera} >
                <ButtonCamera 
                icon="camera" 
                title="Iniciar Scanner" 
                onPress={() => navigation.navigate('Home')} 
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    toggleCamera: {
        width: "80%",
        flexDirection: "row",
        marginBottom: 20
      }
})