import { CameraView, useCameraPermissions } from "expo-camera";
import {
    ActivityIndicator,
    Keyboard,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { Button } from "../../components/Button";
import { useCallback, useContext, useState } from "react";
import { BarCodeScannerResult } from "expo-barcode-scanner";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import { Audititem } from "../../interfaces/AuditoriaItem";

import axios from "axios";
import Toast from "react-native-toast-message";
import { Alert } from "react-native";
import { URL_GET_DATA_BY_ROMANEIO } from "../../lib/constants";

export const HomeAuditoria = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [loading, setLoading] = useState<boolean>(false);
    const [cameraStats, setCameraStats] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [manualEntryValue, setManualEntryValue] = useState<string>("");
    const { setAuditItem, setRomaneio } = useContext(AuthContext);

    useFocusEffect(
        useCallback(() => {
            setCameraStats(true);

            return () => {
                setCameraStats(false);
            };
        }, [])
    );
    const navigation = useNavigation();

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: "center" }}>
                    É necessário sua permissão para acessar o scanner
                </Text>
                <Button onPress={requestPermission} title="Permitir de acesso a câmera." />
            </View>
        );
    }

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const getDataAuditoriaItem = async (romaneio: string) => {
        try {
            const response = await axios.get<Audititem[]>(URL_GET_DATA_BY_ROMANEIO + romaneio);
            if (response.status == 200) {
                if (response.data.length > 0) {
                    setRomaneio(response.data[0].romaneio)
                    setAuditItem(response.data);
                    setLoading(false);
                    navigation.navigate("ProdutoAuditoria")
                }
            } else {
                setLoading(false);
                Alert.alert("Error", "Error: Romaneio não cadastrado")
            }
        } catch (err) {
            Alert.alert("Error", "Romaneio fora do sistema")
        }
    };

    async function handleScan({ data }: BarCodeScannerResult) {
        if (data) {
            getDataAuditoriaItem(data)
            setLoading(true);
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
        getDataAuditoriaItem(manualEntryValue)
        setLoading(true);
        setCameraStats(false)
    }

    return (
        <View style={styles.container}>
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2294ff" />
                    <Text style={{ color: '#fff' }}>Carregando dados...</Text>
                </View>
            )}
            {
                cameraStats ?
                    <CameraView
                        onBarcodeScanned={handleScan}
                        style={styles.camera}
                        pictureSize={"1920x1080"}
                    >
                        <Text style={{
                            backgroundColor: 'transparent',
                            textAlign: 'center',
                            fontSize: 24,
                            position: 'absolute',
                            top: 40,
                            borderWidth: 2,
                            padding: 10,
                            borderColor: '#fff',
                            fontWeight: '600',
                            color: '#ffffff'
                        }}>
                            Scanear o Romaneio
                        </Text>
                    </CameraView>
                    : null
            }
            {
                loading == false ? <View style={styles.barcodeDataContainer}>
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
                    : null
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

                                onChangeText={(text) => setManualEntryValue(text)}
                                value={manualEntryValue}
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
