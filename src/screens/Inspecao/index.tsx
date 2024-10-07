import { Alert, FlatList, Keyboard, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { useRomaneioStore } from "../../store/inpector/romaneio"
import type { Audititem } from "../../interfaces/AuditoriaItem";
import { useContext, useState } from "react";
import Divider from "../../components/Divider";
import axios from "axios";
import { URL_GET_DATA_AUDITORIA, URL_UPDATE_AUDITORIA_INSPECTOR, URL_UPDATE_RECONFERIR } from "../../lib/constants";
import { AuthContext } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Loading } from "../../components/Loading";

export const Inspecao = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Audititem>(null);
    const [manualProduto, setManualProduto] = useState("");
    const [observation, setObservation] = useState("");
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation()

    const { user } = useContext(AuthContext);

    const auditoria = useRomaneioStore(state => state.auditoria)
    const getAuditoria = useRomaneioStore(state => state.getAuditoria)

    const filtered = auditoria.filter(item => item.qtdItens !== item.qtdAuditada && item.observation == null);

    const getDataAuditoriaItem = async (romaneio: string) => {
        const response = await axios.get(URL_GET_DATA_AUDITORIA + romaneio);
        if (response.data.length > 0) {
            getAuditoria(response.data);
            setLoading(false);
        } else {
            setLoading(false);
            Alert.alert("Error", "Error: Romaneio não cadastrado")
        }
    };

    const updateInspecao = async (id: number, qtdAudit: number, observ: string, romaneio: string) => {
        if (qtdAudit && observ != null){
            setLoading(true)
            setModalVisible(false)
            const res = await axios.put(URL_UPDATE_AUDITORIA_INSPECTOR,
                {
                    id: id,
                    qtdAuditada: qtdAudit,
                    observation: observ,
                    userLog: user.username
                });
            await getDataAuditoriaItem(romaneio)
            if (res.status == 200) {
                setLoading(false)
            }
        } else {
            Alert.alert("Attention","É necessário Preencher os campos")
        }
        
    }

    const handlePress = (item: Audititem) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.itemContainer} onPress={() => handlePress(item)}>
            <Text style={styles.itemText}>Romaneio: {item.romaneio}</Text>
            <Text style={styles.itemText}>Código do Produto: {item.codProduto}</Text>
            <Text style={styles.itemText}>EAN: {item.eanProduto}</Text>
            <Text style={styles.itemText}>QTD Itens: {item.qtdItens}</Text>
            <Text style={styles.itemText}>Descrição: {item.descricao}</Text>
            <Text style={styles.itemText}>Embalagem: {item.emb}</Text>
            <Text style={styles.itemTextWrong}>Quantidade Auditada: {item.qtdAuditada == null ? '0' : item.qtdAuditada}</Text>
        </TouchableOpacity>
    );
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };
    return (
        <View
            style={styles.container}
        >
            {loading && <Loading />}
            <FlatList
                data={filtered}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
            {selectedItem && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                     <ScrollView
                        contentContainerStyle={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)'
                        }}
                        keyboardShouldPersistTaps="handled"
                        onTouchStart={() => Keyboard.dismiss()}
                    >
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        
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
                                padding: 10,
                                backgroundColor: '#222',
                                borderRadius: 10,
                                color: '#fff'
                            }}>
                                Quantidade de tentativas: {selectedItem.qtdTentativa}
                            </Text>
                            <Text style={{
                                textAlign: 'center',
                                fontSize: 16,
                                marginTop: 5,
                                marginBottom: 10
                            }}>
                                Código do produto: {selectedItem.codProduto}
                            </Text>
                            <Text style={{
                                textAlign: 'center',
                                fontSize: 16,
                                marginTop: 5,
                                marginBottom: 10
                            }}>
                                EAN: {selectedItem.eanProduto}
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
                            

                            <TextInput
                                style={styles.textArea}
                                onChangeText={(text) => setObservation(text)}
                                value={observation}
                                placeholder="Observação"
                                placeholderTextColor={'#333'}
                                numberOfLines={4}
                            />
                            <View style={{ alignItems: 'center', flexDirection: 'row', width: '100%', justifyContent: 'space-between', gap: 10, marginTop: 50 }}>
                                <TouchableOpacity
                                    onPress={() => updateInspecao(selectedItem.id, parseInt(manualProduto), observation, selectedItem.romaneio)}
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
                    </ScrollView>
                    
                </Modal>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 20
    },
    textArea: {
        padding: 20,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 10,
        height: 100, 
        textAlignVertical: 'top', 
        marginTop: 40,
        marginBottom: -30
    },
    itemContainer: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        borderLeftWidth: 5,
        borderLeftColor: '#fa6813',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3
    },
    itemText: {
        fontSize: 16,
        marginBottom: 10,
    },
    itemTextWrong: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 4,
        color: '#ffffff',
        backgroundColor: '#ff0000',
        padding: 10
    },
})