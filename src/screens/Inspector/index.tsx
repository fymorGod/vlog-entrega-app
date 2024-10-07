import { Alert, Keyboard, Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { Button } from "../../components/Button";
import { Camera } from "../../components/Camera";
import { Loading } from "../../components/Loading";
import { useCallback, useState } from "react";
import type { BarCodeScannerResult } from "expo-barcode-scanner";
import axios from "axios";
import { URL_GET_DATA_AUDITORIA } from "../../lib/constants";
import { useRomaneioStore } from "../../store/inpector/romaneio";
import Toast from "react-native-toast-message";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export const Inspector = () => {
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [cameraStats, setCameraStats] = useState(true)
    const [romaneio, setRomaneio] = useState("")

    const getAuditoria = useRomaneioStore(state => state.getAuditoria)

    const navigation = useNavigation()

    useFocusEffect(
        useCallback(() => {
            setCameraStats(true);

            return () => {
                setCameraStats(false);
            };
        }, [])
    );

    const getDataAuditoriaItem = async (romaneio: string) => {
            const response = await axios.get(URL_GET_DATA_AUDITORIA + romaneio);
            if (response.data.length > 0) {
                    getAuditoria(response.data);
                    setLoading(false);
                    navigation.navigate("Inspecao")
            } else {
                setLoading(false);
                Alert.alert("Error", "Error: Romaneio não cadastrado")
            } 
    };

    async function handleScan({ data }: BarCodeScannerResult) {
        if (data) {
            setLoading(true);
            getDataAuditoriaItem(data)
            setCameraStats(false)
        } else {
            setLoading(false)
            Toast.show({
                type: 'error',
                text1: 'O código de barras escaneado é vazio ou indefinido.',
                visibilityTime: 5000
            });
        }
    }

    async function sendRomaneioScanManual() {
        setLoading(true);
        getDataAuditoriaItem(romaneio)
        setCameraStats(false)
    }

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <View style={styles.container}>
        {loading && <Loading/>}
        {
            cameraStats && <Camera handleScan={handleScan} title="Scanear o Romaneio" />
        }
        {
            !loading && <View style={styles.barcodeDataContainer}>
                <View style={styles.buttonContainer}>
                    <View style={{ width: "100%", marginRight: 5, marginLeft: -10, marginTop: -50 }}>
                        <Button
                            title="Digitar Romaneio"
                            onPress={() => {
                                setModalVisible(true);
                            }}
                        />
                    </View>
                </View>
            </View>
        }
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}>
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{ fontWeight: '600', fontSize: 18, textAlign: 'center' }}>Informe o Romaneio</Text>
                        <TextInput
                            style={{
                                width: '80%',
                                padding: 20,
                                borderColor: '#222',
                                borderWidth: 1,
                                borderRadius: 10,
                                marginTop: 10,
                                marginBottom: -25
                            }}
                            placeholderTextColor={'#333'}

                            onChangeText={(text) => setRomaneio(text)}
                            value={romaneio}
                            placeholder="Digite o romaneio"
                            keyboardType="number-pad"
                        />
                        <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
                            <View style={{ width: "50%" }}>
                                <Button title="Enviar" onPress={sendRomaneioScanManual} />
                            </View>
                            <View style={{ width: "50%" }}>
                                <TouchableOpacity
                                    style={{
                                        width: '80%',
                                        backgroundColor: '#cd0914',
                                        padding: 20,
                                        alignSelf: 'center',
                                        borderRadius: 4,
                                        marginTop: 50
                                    }}
                                    onPress={() => setModalVisible(false)}>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontSize: 14,
                                            color: '#fff'
                                        }}>
                                        Fechar
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    camera: {
        flex: 1,
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        width: "100%",
        marginTop: 20,
        justifyContent: "space-evenly",
    },
    barcodeDataContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    barcodeText: {
        fontSize: 18,
        marginBottom: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 60,
        backgroundColor: 'black'
    },
    modalView: {
        backgroundColor: "white",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        height: 240,
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    input: {
        height: 40,
        width: "100%",
        marginBottom: 20,
        borderColor: "gray",
        borderWidth: 1,
    },
});