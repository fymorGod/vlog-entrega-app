import { Alert, StyleSheet, TouchableOpacity } from "react-native"
import { Text, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"

export const Menu = () => {
    const navigation = useNavigation()
    const { user } = useContext(AuthContext);

    return (
        <View style={style.container}>
            <View style={style.blockMenu}>
                <LinearGradient colors={['#cd0914', '#871015']} style={{
                    borderRadius: 10,
                }}>
                    <TouchableOpacity style={style.block} onPress={() => navigation.navigate('ScannerNFe')}>
                        <Text style={style.blockText}>Cliente Retira</Text>
                    </TouchableOpacity>
                </LinearGradient>
                
                <LinearGradient colors={['#cd0914', '#871015']} style={{
                    borderRadius: 10,
                }}>
                    <TouchableOpacity style={style.block} onPress={() => {
                            if(user.permission.admin === 1) {
                                navigation.navigate('Auditoria')
                            } else {
                                Alert.alert("Sem permissão de Acesso!")
                            }
                        }}>
                        <Text style={style.blockText}>Auditoria</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </View>
    )
}


const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        justifyContent: 'center',
        alignItems: 'center'
    },
    blockMenu: {
        flexDirection: 'row',
        gap: 10
    },
    block: {
        width: 150,
        height: 150,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#ffffff'
    },
    blockText: {
        textAlign: 'center',
        fontWeight: '500',
        color: '#fff',
    }
})