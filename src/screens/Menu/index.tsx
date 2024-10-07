import React, { useContext } from "react";
import { Alert, StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../context/AuthContext";

export const Menu = () => {
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <View style={styles.blockMenu}>
                <LinearGradient colors={['#cd0914', '#871015']} style={styles.gradient}>
                    <TouchableOpacity style={styles.block} onPress={() => navigation.navigate('ScannerNFe')}>
                        <Text style={styles.blockText}>Cliente Retira</Text>
                    </TouchableOpacity>
                </LinearGradient>
                
                <LinearGradient colors={['#cd0914', '#871015']} style={styles.gradient}>
                    <TouchableOpacity style={styles.block} onPress={() => {
                            if(user.permission.admin === 1) {
                                navigation.navigate('Auditoria')
                            } else {
                                Alert.alert("Sem permissão de Acesso!")
                            }
                        }}>
                        <Text style={styles.blockText}>Auditoria</Text>
                    </TouchableOpacity>
                </LinearGradient>
                
                <LinearGradient colors={['#cd0914', '#871015']} style={styles.gradient}>
                    <TouchableOpacity style={styles.block} onPress={() => {
                            if (user.permission.admin === 1) {
                                navigation.navigate('Inspector')
                            } else {
                                Alert.alert("Sem permissão de Acesso!")
                            }
                        }}>
                        <Text style={styles.blockText}>Inspector</Text>
                    </TouchableOpacity>
                </LinearGradient>
                
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    blockMenu: {
        width: '100%',  
        flexDirection: 'row',
        flexWrap: 'wrap', 
        justifyContent: 'space-between' 
    },
    gradient: {
        width: '48%',  
        marginVertical: 10, 
        borderRadius: 10,
    },
    block: {
        width: '100%',
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    blockText: {
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 16,
        color: '#fff',
    }
});