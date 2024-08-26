import { CameraView, useCameraPermissions } from "expo-camera";
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    Modal,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { Button } from "../../components/Button";
import { useEffect, useState } from "react";
import { BarCodeScannerResult } from "expo-barcode-scanner";
import { Input } from "../../components/Input";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

interface Audititem {
    id: number;
    romaneio: string;
    codProduto: string;
    descricao: string;
    emb: string | null;
    eanProduto: string | null;
    qtdItens: number;
    qtdConferida: number;
    conferida: string;
    qtdAuditada: number;
    auditado: string;
    codBarrasIu: string;
    createdAt: string;
    updatedAt: string;
}

export const ProdutoScan = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingFlatlist, setLoadingFlatlist] = useState<boolean>(false);
    const [cameraStats, setCameraStats] = useState<boolean>(true);
    const [modalInfo, setModalInfo] = useState<boolean>(false);
    const [modalConfirmacao, setModalConfirmacao] = useState<boolean>(false); // Novo modal para inserção de quantidade
    const [manualProduto, setManualProduto] = useState<string>("");
    const [filteredItems, setFilteredItems] = useState<Audititem[]>([]);
    const navigation = useNavigation();
    const [auditItem, setAuditItem] = useState<Audititem[]>([]);

    useEffect(() => {
        const getDataAuditoriaItem = async () => {
            try {
                const response = await axios.get("http://192.168.102.14:8080/api/v1/auditoria/get");
                setAuditItem(response.data);
                filterItems(response.data); // Inicialmente filtra os itens quando os dados são carregados
            } catch (error) {
                console.error('Erro ao fazer a requisição:', error.message);
            }
        };
        getDataAuditoriaItem();
    }, []);

    const filterItems = (items: Audititem[]) => {
        const filtered = items.filter(item => item.qtdItens !== item.qtdConferida);
        setFilteredItems(filtered);
    };

    const finalizarConferencia = async () => {
        filterItems(auditItem); // Atualiza a lista filtrada
        const erros: string[] = [];
        filteredItems.forEach((item) => {
            if (item.qtdItens !== item.qtdConferida) {
                erros.push(item.descricao);
            }
        });
        if (erros.length === 0) {
            console.log("Sucesso", "Todos os itens foram conferidos!");
            navigation.navigate('Auditoria');
        } else {
            setCameraStats(false)
            setLoadingFlatlist(true);
            setModalConfirmacao(true); // Exibe o modal de confirmação se houver erros
            console.log("Erro", `Os seguintes itens não foram conferidos corretamente: ${erros.join(", ")}`);
        }
    };

    const renderItem = ({ item }: { item: Audititem }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Romaneio: {item.romaneio}</Text>
            <Text style={styles.itemText}>Código do Produto: {item.codProduto}</Text>
            <Text style={styles.itemText}>Descrição: {item.descricao}</Text>
            <Text style={styles.itemText}>Quantidade Itens: {item.qtdItens}</Text>
            <Text style={styles.itemText}>Quantidade Conferida: {item.qtdConferida}</Text>
            {/* Adicione mais campos conforme necessário */}
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
                setLoadingFlatlist(false); // Opcional: Resetar o estado ao fechar o modal
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
                        title="Fechar"
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

    const renderModalQTDProduto = () => (
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
                        <Input
                            icon="search"
                            onChangeText={(text) => setManualProduto(text)}
                            value={manualProduto}
                            placeholder="Quantidade do produto"
                        />
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ width: "50%" }}>
                                <Button title="Enviar" onPress={() => { /* Lógica de envio */ }} />
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
            console.log(data);
            setLoading(true);
            setCameraStats(false);
            setModalInfo(true); // Exibe o modal para inserir a quantidade
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
                                onPress={finalizarConferencia}
                            />
                        </View>
                    </View>
                </View>
            )}
            {renderModalQTDProduto()}
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
