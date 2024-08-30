import { CameraView, useCameraPermissions } from "expo-camera";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Keyboard,
    Modal,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { Button } from "../../components/Button";
import { useContext, useEffect, useState } from "react";
import { BarCodeScannerResult } from "expo-barcode-scanner";
import { Input } from "../../components/Input";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Audititem } from "../../interfaces/AuditoriaItem";
import { AuthContext } from "../../context/AuthContext";

export const ProdutoScan = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingFlatlist, setLoadingFlatlist] = useState<boolean>(false);
    const [cameraStats, setCameraStats] = useState<boolean>(true);
    const [modalInfo, setModalInfo] = useState<boolean>(false);
    const [modalConfirmacao, setModalConfirmacao] = useState<boolean>(false);
    const [manualProduto, setManualProduto] = useState<string>("");
    const [codBarr, setCodBarr] = useState<Audititem>();
    const [filteredItems, setFilteredItems] = useState([]);
    const navigation = useNavigation();
    //const [auditItem, setAuditItem] = useState<Audititem[]>([]);
    
    const { auditItem, romaneio } = useContext(AuthContext);

    const filterItems = (items: Audititem[]) => {
        const filtered = items.filter(item => item.qtdItens !== item.qtdConferida);
       
        return filtered;
    };

    const updateAuditoria = async (id: number, qtdAudit: number, codBarraIu: string, qtdAuditAnt: number) => {
        setCameraStats(false);
        const response = await axios.put('http://192.168.102.14:8080/api/v1/auditoria/edit', {
            id: id,
            qtdAuditada: qtdAudit + qtdAuditAnt,
            eanProduto: codBarraIu
        });

        console.log(response.data);
        Alert.alert("Produto Auditados");
        setCameraStats(true);
        setModalInfo(false);
    }

    const getDataAuditoriaItem = async () => {
        try {
            const response = await axios.get(`http://192.168.102.14:8080/api/v1/auditoria/romaneio?romaneio=${romaneio}`);
            console.log(response.data)

            setFilteredItems(response.data)
            return filterItems(response.data);
        } catch (error) {
            console.error('Erro ao fazer a requisição:', error.message);
        }
    };

    const updateAuditado = async () => {
        try {
            const response = await axios.put(`http://192.168.102.14:8080/api/v1/auditoria/audited?romaneio=${romaneio}`);
            console.log(response.data)
            if(response.status == 200) {
                navigation.navigate('Auditoria');
            }
        } catch (error) {
            console.error('Erro ao fazer a requisição:', error.message);
        }
    }

    const finalizarAuditoria = async () => {
        const res = await getDataAuditoriaItem();
        console.log(filteredItems)
        const erros: string[] = [];
        res.forEach((item) => {
            if (item.qtdItens !== item.qtdAuditada) {
                erros.push(item.descricao);
            }
        });
        if (erros.length === 0) {
            console.log("Sucesso", "Todos os itens foram auditados!");
            //await updateAuditado();
        } else {
            setCameraStats(false)
            setLoadingFlatlist(true);
            setModalConfirmacao(true);
            console.log("Erro", `Os seguintes itens não foram auditados corretamente: ${erros.join(", ")}`);
        }
    };

    const renderItem = ({ item }: { item: Audititem }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Romaneio: {item.romaneio}</Text>
            <Text style={styles.itemText}>Código do Produto: {item.codProduto}</Text>
            <Text style={styles.itemText}>Descrição: {item.descricao}</Text>
            <Text style={styles.itemTextWrong}>Quantidade Conferida: {item.qtdAuditada == null ? '0' : item.qtdAuditada}</Text>
        </View>
    );

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const renderModalConfirmacao = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalConfirmacao}
            onRequestClose={() => {
                setModalConfirmacao(false);
                setLoadingFlatlist(false); 
            }}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    {!loadingFlatlist ? (
                        <ActivityIndicator size="large" color="#2294ff" />
                    ) : (
                        <FlatList
                            data={filteredItems}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    )}
                    <Button
                        title="Reconferir"
                        onPress={() => {
                            setModalConfirmacao(false);
                            setLoadingFlatlist(false); 
                            navigation.navigate('Auditoria');
                        }}
                    />
                </View>
            </View>
        </Modal>
    );

    const renderModalQTDProduto = (item: number, productName: string, codBarraIu: string, qtdAuditAnt: number) => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalInfo}
            onRequestClose={() => {
                setModalInfo(false);
            }}
        >
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text>{productName}</Text>
                        <Input
                            icon="search"
                            onChangeText={(text) => setManualProduto(text)}
                            value={manualProduto}
                            placeholder="Quantidade do produto"
                        />
                        <View style={{ flexDirection: "row", marginTop: -50}}>
                            <View style={{ width: "50%" }}>
                                <Button title="Enviar" onPress={() => {updateAuditoria(item, parseInt(manualProduto), codBarraIu, qtdAuditAnt)}} />
                            </View>
                            <View style={{ width: "50%" }}>
                                <Button
                                    title="Fechar"
                                    onPress={() => {
                                        setCameraStats(true);
                                        setModalInfo(false);
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );

    async function handleScan({ data }: BarCodeScannerResult) {
        if (data) {
            const foundItem = auditItem.find(item => item.codBarrasIu === data);
            setCodBarr(foundItem);

            setLoading(true);
            setCameraStats(false);
            setModalInfo(true); 
            setLoading(false);
        } else {
            setLoading(false);
            console.error("O código de barras escaneado é vazio ou indefinido.");
        }
    }

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

    return (
        <View style={styles.container}>
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2294ff" />
                    <Text style={{ color: '#fff' }}>Carregando dados...</Text>
                </View>
            )}
            {cameraStats && (
                <CameraView
                    onBarcodeScanned={handleScan}
                    style={styles.camera}
                    pictureSize={"1920x1080"}
                />
            )}
            {!loading && (
                <View style={styles.barcodeDataContainer}>
                    <View style={styles.buttonContainer}>
                        <View style={{ width: "100%", marginLeft: 15 }}>
                            <Button
                                title="Finalizar"
                                onPress={finalizarAuditoria}
                            />
                        </View>
                    </View>
                </View>
            )}
            {codBarr && renderModalQTDProduto(codBarr.id, codBarr.descricao, codBarr.codBarrasIu, codBarr.qtdAuditada)}
            {renderModalConfirmacao()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    itemContainer: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemText: {
        fontSize: 16,
        marginBottom: 4,
    },
    itemTextWrong: {
        fontSize: 16,
        marginBottom: 4,
        color: '#ff0000'
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
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
    },
    input: {
        height: 40,
        width: "100%",
        marginBottom: 20,
        borderColor: "gray",
        borderWidth: 1,
    },
});
