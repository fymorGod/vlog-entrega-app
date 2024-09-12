import { CameraView, useCameraPermissions } from "expo-camera";
import { 
    ActivityIndicator, 
    Keyboard,
    Modal, 
    StyleSheet,
    Text, 
    TouchableWithoutFeedback, 
    View } from "react-native";
import { Button } from "../../components/Button";
import { useContext, useState } from "react";
import { BarCodeScannerResult } from "expo-barcode-scanner";
import { Input } from "../../components/Input";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import { Audititem } from "../../interfaces/AuditoriaItem";

import axios from "axios";
import Toast from "react-native-toast-message";

export const HomeAuditoria = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [loading, setLoading] = useState<boolean>(false);
    const [cameraStats, setCameraStats] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [manualEntryValue, setManualEntryValue] = useState<string>("");
    const { setAuditItem, setRomaneio } = useContext(AuthContext);

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
            const response = await axios.get<Audititem[]>(`http://192.168.102.14:8080/api/v1/auditoria/details?romaneio=${romaneio}`);
            
            setRomaneio(response.data[0].romaneio)
            setAuditItem(response.data);
        } catch (error) {
            console.error('Erro ao fazer a requisição:', error.message);
        }
    };

    async function handleScan({ data }: BarCodeScannerResult) {
        if (data) {
            getDataAuditoriaItem(data)
            setLoading(true);
            setCameraStats(false)
            if (data) setLoading(false);
            navigation.navigate("ProdutoAuditoria")
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
        navigation.navigate("ProdutoScan")
        setLoading(false);   
    }

    return (
        <View style={styles.container}>
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2294ff" />
                    <Text style={{ color: '#fff'}}>Carregando dados...</Text>
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
                        <View style={{ width: "100%", marginRight: 5, marginLeft: -10, marginTop:-50 }}>
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
                placeholder="Preencha com o Romaneio"
                keyboardType="numeric"
              />
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "50%" }}>
                  <Button title="Enviar" onPress={sendRomaneioScanManual} />
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
