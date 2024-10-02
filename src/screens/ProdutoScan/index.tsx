import { CameraView } from "expo-camera";
import {
    ActivityIndicator,
    Alert,
    FlatList,
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
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Audititem } from "../../interfaces/AuditoriaItem";
import { AuthContext } from "../../context/AuthContext";
import Toast from "react-native-toast-message";
import Divider from "../../components/Divider";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { CameraCodProduto } from "../../components/CameraCodProd";
import { URL_GET_DATA_AUDITORIA, URL_UPDATE_AUDITADO, URL_UPDATE_AUDITORIA, URL_UPDATE_RECONFERIR, URL_VERIFY_QTD_AUDITORIA } from "../../lib/constants";

export const ProdutoScan = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingFlatlist, setLoadingFlatlist] = useState<boolean>(false);
    const [cameraStats, setCameraStats] = useState<boolean>(true);
    const [modalInfo, setModalInfo] = useState<boolean>(false);
    const [modalConfirmacao, setModalConfirmacao] = useState<boolean>(false);
    const [manualProduto, setManualProduto] = useState<string>("");
    const [codBarr, setCodBarr] = useState<Audititem>();
    const [dadosFiltrados, setDadosFiltrados] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Audititem>(null);
    const [modalVisibleManual, setModalVisibleManual] = useState<boolean>(false);
    
    const handlePress = (item: Audititem) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    useFocusEffect(
        useCallback(() => {
            setCameraStats(true);

            return () => {
                setCameraStats(false);
            };
        }, [])
    );
    
    const navigation = useNavigation();

    const { auditItem, romaneio, user } = useContext(AuthContext);

    const filterItems = (items: Audititem[]) => {
        const filtered = items.filter(item => item.qtdItens !== item.qtdAuditada);
        setDadosFiltrados(filtered)
        return filtered;
    };

    const updateAuditoria = async (
        id: number,
        qtdAudit: number,
        codBarraIu: string,
        qtdAuditAnt: number) => {
        setCameraStats(false);
        await axios.put(URL_UPDATE_AUDITORIA,
            {
                id: id,
                qtdAuditada: qtdAudit + qtdAuditAnt,
                eanProduto: codBarraIu,
                userLog: user.username
            });
        setManualProduto("")
        Toast.show({
            type: 'success',
            text1: 'Produto auditado com sucesso',
            visibilityTime: 5000
        });
        setCameraStats(true);
        setModalInfo(false);
    }

    const updateReconferir = async (id: number, qtdAudit: number, codBarraIu: string) => {
        setCameraStats(false);
        await axios.put(URL_UPDATE_RECONFERIR,
            {
                id: id,
                qtdAuditada: qtdAudit,
                eanProduto: codBarraIu,
                userLog: user.username
            });

        setManualProduto("")
        await getDataAuditoriaItem();
        setModalVisible(false)
        Toast.show({
            type: 'success',
            text1: 'Produto auditado com sucesso',
            visibilityTime: 5000
        });
        setModalInfo(false);
    }

    const getDataAuditoriaItem = async () => {
        try {
            const response = await axios.get(URL_GET_DATA_AUDITORIA + romaneio);
            return filterItems(response.data);
        } catch (error) {
            console.error('Erro ao fazer a requisição:', error.message);
        }
    };

    const updateAuditado = async () => {
        try {
            const response = await axios.put(URL_UPDATE_AUDITADO + romaneio);
            if (response.status == 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Processo concluído com sucesso',
                    visibilityTime: 5000
                });
                navigation.navigate('Auditoria');
            }
        } catch (error) {
            console.error('Erro ao fazer a requisição:', error.message);
        }
    }

    // rota para adicionar a quantidade tentativa
    const verifyQtd = async () => {
        try {
            const response = await axios.put(URL_VERIFY_QTD_AUDITORIA + romaneio);
            if (response.status == 200) {
               return response.data
            }
        } catch (error) {
            console.error('Erro ao fazer a requisição:', error.message);
        }
    }

    const finalizarAuditoria = async () => {
        const res = await getDataAuditoriaItem();
        const erros: string[] = [];

        res.forEach((item) => {
            if (item.qtdItens !== item.qtdAuditada) {
                erros.push(item.descricao);
            }
        });

        if (erros.length === 0) {
            await updateAuditado();
        } else {
            // Chamada da funcao para adicionar a quantidade de tentativas
            setLoading(true)
            const res = await verifyQtd()
            if (res) {
                setCameraStats(false)
                setLoadingFlatlist(true);
                setModalConfirmacao(true);
            }
    
            Toast.show({
                type: 'error',
                text1: 'Erro ao finalizar auditoria',
                visibilityTime: 5000
            });
        }
    };
    // Itens do Flatlist
    const renderItem = ({ item }: { item: Audititem }) => (
        <TouchableOpacity style={styles.itemContainer} onPress={() => handlePress(item)}>
            <Text style={styles.itemText}>Romaneio: {item.romaneio}</Text>
            <Text style={styles.itemText}>Código do Produto: {item.codProduto}</Text>
            <Text style={styles.itemText}>Descrição: {item.descricao}</Text>
            <Text style={styles.itemText}>Embalagem: {item.emb}</Text>
            <Text style={styles.itemTextWrong}>Quantidade Auditada: {item.qtdAuditada == null ? '0' : item.qtdAuditada}</Text>
        </TouchableOpacity>
    );

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };
    // Modal dentro do Flatlist
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
                    {selectedItem && (
                        <Modal
                            transparent={true}
                            animationType="slide"
                            visible={modalVisible}
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0,0,0,0.5)'
                            }}>
                                <View style={{
                                    width: 300,
                                    padding: 20,
                                    backgroundColor: 'white',
                                    borderRadius: 10
                                }}>
                                    <Text style={{
                                        textAlign: 'center',
                                        fontSize: 16,
                                        marginBottom: 10,
                                        padding:10,
                                        backgroundColor: '#222',
                                        borderRadius: 10,
                                        color: '#fff'
                                    }}>
                                        Quantidade de tentativas: {selectedItem.qtdTentativa}
                                    </Text> 
                                    <Text style={{
                                        textAlign: 'center',
                                        fontSize: 16,
                                        marginTop:5,
                                        marginBottom: 10
                                    }}>
                                        Código do produto: {selectedItem.codProduto}
                                    </Text>
                                    <Divider />
                                    <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 10, marginTop: 10 }}>Item: {selectedItem.descricao}</Text>
                                    <TextInput
                                        style={{
                                            padding: 20,
                                            borderColor: '#000',
                                            borderWidth: 1,
                                            borderRadius: 10,
                                            marginTop: 10,
                                            marginBottom: -25,
                                        }}
                                        onChangeText={(text) => setManualProduto(text)}
                                        value={manualProduto}
                                        placeholder="Quantidade do produto"
                                        keyboardType="number-pad"
                                        placeholderTextColor={'#333'}
                                    />
                                   <View style={{alignItems: 'center',flexDirection: 'row', width: '100%', justifyContent: 'space-between', gap: 10, marginTop: 50}}>
                                    <TouchableOpacity
                                         onPress={() =>
                                            selectedItem.qtdTentativa < 4 ? updateReconferir(selectedItem.id, parseInt(manualProduto), selectedItem.codBarrasIu)
                                                : Alert.alert("Error", "Quantidade Excedida")
                                        }
                                        style={{
                                            backgroundColor: '#D7DF23',
                                            padding: 20,
                                            alignSelf: 'center',
                                            borderRadius: 4,
                                            width: '45%'
                                        }}>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 14,
                                                color: '#202020'
                                            }}>
                                            Enviar
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(false)}
                                        style={{
                                            backgroundColor: '#cd0914',
                                            padding: 20,
                                            alignSelf: 'center',
                                            borderRadius: 4,
                                            width: '45%'
                                        }}>
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
                        </Modal>
                    )}
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 18,
                            color: '#000000',
                            fontWeight: '500'
                        }}>
                        <MaterialCommunityIcons
                            name="alert-circle"
                            size={22}
                            color="red"
                        />
                        Itens Incorretos
                    </Text>
                    <Divider />
                    {!loadingFlatlist ? (
                        <ActivityIndicator size="large" color="#2294ff" />
                    ) : renderList()}
                    
                </View>
            </View>
        </Modal>
    );

    const renderList = () => {
        if(dadosFiltrados.length > 0) {
            return (<FlatList
                data={dadosFiltrados}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />)
        } else {
            Alert.alert("Processe", "Auditoria finalizada")
            setModalConfirmacao(false)
            navigation.navigate('HomeAuditoria')
        }
    }

    const renderModalQTDProduto = (
        item: number,
        productName: string,
        codBarraIu: string,
        qtdAuditAnt: number,
        codProduto: string) => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalInfo}
            onRequestClose={() => {
                setModalInfo(false);
            }}>
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={{ textAlign: 'center', fontWeight: '500' }}>{productName}</Text>
                        <Text style={{ textAlign: 'center' }}>Cod:{codProduto}</Text>
                        <TextInput
                            style={{
                                padding: 20,
                                borderColor: '#222',
                                borderWidth: 1,
                                borderRadius: 10,
                                marginTop: 10,
                                marginBottom: -25
                            }}
                            onChangeText={(text) => setManualProduto(text)}
                            value={manualProduto}
                            placeholder="Quantidade do produto"
                            keyboardType="number-pad"
                        />
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ width: "50%" }}>
                                <Button
                                    title="Enviar"
                                    onPress={() => {
                                        updateAuditoria(item, parseInt(manualProduto), codBarraIu, qtdAuditAnt)
                                    }} />
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
                                    onPress={() => {
                                        setCameraStats(true);
                                        setModalInfo(false);
                                    }}
                                >
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
    );

    async function sendProdutoScanManual() {
        setCameraStats(false)
        const foundItem = auditItem.find(item => item.codBarrasIu === manualProduto || item.codProduto === manualProduto);
        
        if (foundItem && foundItem.qtdTentativa < 4) {
            setManualProduto("")
            setCodBarr(foundItem);

            // variáveis de controle de fluxo
            setModalVisibleManual(false)
            setLoading(true);
            setModalInfo(true);
            setLoading(false);
        } else {
            Alert.alert("Error", "Quantidade Excedida")
            navigation.navigate("ProdutoAuditoria")
        }
    }

    async function handleScan({ data }: BarCodeScannerResult) {
        if (data) {
            const foundItem = auditItem.find(item => item.codBarrasIu === data);
            if (foundItem.qtdTentativa < 4) {
                setCodBarr(foundItem);
                // variáveis de controle de fluxo
                setLoading(true);
                setCameraStats(false);
                setModalInfo(true);
                setLoading(false);
            } else {
                Alert.alert("Error", "Quantidade Excedida")
                navigation.navigate("ProdutoAuditoria")
            }
        } else {
            setLoading(false);
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
            {cameraStats && (
               <CameraCodProduto handleScan={handleScan}/>
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleManual}
                onRequestClose={() => {
                    setModalVisible(false);
                }}>
                <TouchableWithoutFeedback onPress={dismissKeyboard}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={{fontWeight: '600', fontSize: 18, textAlign: 'center'}}>Informe o Código do Produto</Text>
                            <TextInput
                                style={{
                                    width: '70%',
                                    padding: 20,
                                    borderColor: '#222',
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    marginTop: 10,
                                    marginBottom: -25
                                }}
                                placeholderTextColor={'#333'}

                                onChangeText={(text) => setManualProduto(text)}
                                value={manualProduto}
                                placeholder="Digite o código do Produto"
                                keyboardType="number-pad"
                            />
                            <View style={{ flexDirection: "row", width: '80%'}}>
                            <View style={{ width: "50%" }}>
                                    <Button
                                        title="Enviar"
                                        onPress={sendProdutoScanManual}
                                    />
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
                                    onPress={() => setModalVisibleManual(false)}>
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
            {!loading && (
                <View style={styles.barcodeDataContainer}>
                    <View style={styles.buttonContainer}>
                        <View style={{ width: "100%", marginLeft: 15 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisibleManual(true);
                                }}
                                style={{
                                    width: '80%',
                                    backgroundColor: '#0957cd',
                                    padding: 20,
                                    alignSelf: 'center',
                                    borderRadius: 4,
                                    marginBottom: -25
                                }}>
                                <Text style={{
                                    textAlign: 'center',
                                    fontSize: 14,
                                    color: '#fff',
                                    fontWeight: '600'
                                }}>
                                    Digitar Código do Produto
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Auditados')
                        }}
                        style={{
                            width: '80%',
                            backgroundColor: '#08e92d',
                            padding: 20,
                            alignSelf: 'center',
                            borderRadius: 4,
                            marginBottom: -35,
                            marginTop: 40
                        }}>
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 14,
                            color: '#fff',
                            fontWeight: '600'
                        }}>
                            Ver últimos auditados
                        </Text>
                    </TouchableOpacity>
                            <Button
                                title="Finalizar"
                                onPress={finalizarAuditoria}
                            />
                        </View>
                    </View>
                </View>
            )}
            {codBarr && renderModalQTDProduto(codBarr.id, codBarr.descricao, codBarr.codBarrasIu, codBarr.qtdAuditada, codBarr.codProduto)}
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
    modalView: {
        backgroundColor: "white",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        height: 250,
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.87)',
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
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.87)',
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