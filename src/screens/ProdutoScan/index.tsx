import { CameraView, useCameraPermissions } from "expo-camera";
import {
    ActivityIndicator,
    Keyboard,
    Modal,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { Button } from "../../components/Button";
import { useState } from "react";
import { BarCodeScannerResult } from "expo-barcode-scanner";
import { Input } from "../../components/Input";

export const ProdutoScan = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [loading, setLoading] = useState<boolean>(false);
    const [cameraStats, setCameraStats] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalInfo, setModalInfo] = useState<boolean>(false);
    const [manualEntryValue, setManualEntryValue] = useState<string>("");
    const [manualProduto, setManualProduto] = useState<string>("");

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

    const renderModalQTDProduto = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalInfo}
                onRequestClose={() => {
                    setModalInfo(false);
                }}>
                <TouchableWithoutFeedback onPress={dismissKeyboard}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Input
                                icon="search"
                                onChangeText={(text) => setManualProduto(text)}
                                value={manualProduto}
                                placeholder="Quantidade do produto"
                            />
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ width: "50%" }}>
                                    <Button title="Enviar" onPress={() => { }} />
                                </View>
                                <View style={{ width: "50%" }}>
                                    <Button
                                        title="Fechar"
                                        onPress={() => {
                                            setModalVisible(false);
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    async function handleScan({ data }: BarCodeScannerResult) {
        if (data) {
            console.log(data)
            setLoading(true);
            setCameraStats(false)
            if (data) setLoading(false);
            setModalInfo(true)
        } else {
            setLoading(false)
            console.error("O código de barras escaneado é vazio ou indefinido.");
        }
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

                    />
                    : null
            }
            {
                loading == false ? <View style={styles.barcodeDataContainer}>
                    <View style={styles.buttonContainer}>
                        <View style={{ width: "60%", marginLeft: 15 }}>
                            <Button
                                title="Scanear Novamente"
                                onPress={() => setCameraStats(true)}
                            />
                        </View>
                        <View style={{ width: "50%", marginRight: 5, marginLeft: -10 }}>
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
                            <Input
                                icon="search"
                                onChangeText={(text) => setManualEntryValue(text)}
                                value={manualEntryValue}
                                placeholder="Preencha com a NF-E"
                            />
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ width: "50%" }}>
                                    <Button title="Enviar" onPress={() => { }} />
                                </View>
                                <View style={{ width: "50%" }}>
                                    <Button
                                        title="Fechar"
                                        onPress={() => {
                                            setModalVisible(false);
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            {
                renderModalQTDProduto()
            }
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
        height: 300,
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