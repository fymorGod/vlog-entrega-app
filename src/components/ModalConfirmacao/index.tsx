// import { Alert, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
// import type { Audititem } from "../../interfaces/AuditoriaItem";
// import Divider from "../Divider";
// import axios from "axios";


// interface ModalConfirmacaoProps {
//     modalConfirmacao: boolean;
//     selectedItem: Audititem;
//     modalVisible: boolean;
//     setModalVisible: (value: boolean) => void;
//     setCameraStats: (value: boolean) => void;
// }

// export const renderModalConfirmacao = ({modalConfirmacao, selectedItem, modalVisible}:ModalConfirmacaoProps) => {
//     const filterItems = (items: Audititem[]) => {
//         const filtered = items.filter(item => item.qtdItens !== item.qtdAuditada);
//         setDadosFiltrados(filtered)
//         return filtered;
//     };
//     const getDataAuditoriaItem = async () => {
//         try {
//             const response = await axios.get(`https://staging-potiguar-mcs-logistica-auditoria-api.apotiguar.com.br/api/v1/auditoria/romaneio?romaneio=${romaneio}`);
//             return filterItems(response.data);
//         } catch (error) {
//             console.error('Erro ao fazer a requisição:', error.message);
//         }
//     };

//     const updateReconferir = async (id: number, qtdAudit: number, codBarraIu: string) => {
//         setCameraStats(false);
//         await axios.put('https://staging-potiguar-mcs-logistica-auditoria-api.apotiguar.com.br/api/v1/auditoria/edit',
//             {
//                 id: id,
//                 qtdAuditada: qtdAudit,
//                 eanProduto: codBarraIu,
//                 userLog: user.username
//             });

//         setManualProduto("")
//         await getDataAuditoriaItem();
//         setModalVisible(false)
//         Toast.show({
//             type: 'success',
//             text1: 'Produto auditado com sucesso',
//             visibilityTime: 5000
//         });
//         setModalInfo(false);
//     }

//     return (
//         <Modal
//             animationType="slide"
//             transparent={true}
//             visible={modalConfirmacao}
//             // onRequestClose={() => {
//             //     setModalConfirmacao(false);
//             //     setLoadingFlatlist(false);
//             // }}
//         >
//             <View style={styles.modalBackground}>
//                 <View style={styles.modalContainer}>
//                     {selectedItem && (
//                         <Modal
//                             transparent={true}
//                             animationType="slide"
//                             visible={modalVisible}
//                             // onRequestClose={() => setModalVisible(false)}
//                         >
//                             <View style={{
//                                 flex: 1,
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                                 backgroundColor: 'rgba(0,0,0,0.5)'
//                             }}>
//                                 <View style={{
//                                     width: 300,
//                                     padding: 20,
//                                     backgroundColor: 'white',
//                                     borderRadius: 10
//                                 }}>
//                                     <Text style={{
//                                         textAlign: 'center',
//                                         fontSize: 16,
//                                         marginBottom: 10,
//                                         padding:10,
//                                         backgroundColor: '#222',
//                                         borderRadius: 10,
//                                         color: '#fff'
//                                     }}>
//                                         Quantidade de tentativas: {selectedItem.qtdTentativa}
//                                     </Text> 
//                                     <Text style={{
//                                         textAlign: 'center',
//                                         fontSize: 16,
//                                         marginTop:5,
//                                         marginBottom: 10
//                                     }}>
//                                         Código do produto: {selectedItem.codProduto}
//                                     </Text>
//                                     <Divider />
//                                     <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 10, marginTop: 10 }}>Item: {selectedItem.descricao}</Text>
//                                     <TextInput
//                                         style={{
//                                             padding: 20,
//                                             borderColor: '#000',
//                                             borderWidth: 1,
//                                             borderRadius: 10,
//                                             marginTop: 10,
//                                             marginBottom: -25,
//                                         }}
//                                         onChangeText={(text) => setManualProduto(text)}
//                                         value={manualProduto}
//                                         placeholder="Quantidade do produto"
//                                         keyboardType="number-pad"
//                                         placeholderTextColor={'#333'}
//                                     />
//                                    <View style={{alignItems: 'center',flexDirection: 'row', width: '100%', justifyContent: 'space-between', gap: 10, marginTop: 50}}>
//                                     <TouchableOpacity
//                                          onPress={() =>
//                                             selectedItem.qtdTentativa < 4 ? updateReconferir(selectedItem.id, parseInt(manualProduto), selectedItem.codBarrasIu)
//                                                 : Alert.alert("Error", "Quantidade Excedida")
//                                         }
//                                         style={{
//                                             backgroundColor: '#D7DF23',
//                                             padding: 20,
//                                             alignSelf: 'center',
//                                             borderRadius: 4,
//                                             width: '45%'
//                                         }}>
//                                         <Text
//                                             style={{
//                                                 textAlign: 'center',
//                                                 fontSize: 14,
//                                                 color: '#202020'
//                                             }}>
//                                             Enviar
//                                         </Text>
//                                     </TouchableOpacity>
//                                     <TouchableOpacity
//                                         onPress={() => setModalVisible(false)}
//                                         style={{
//                                             backgroundColor: '#cd0914',
//                                             padding: 20,
//                                             alignSelf: 'center',
//                                             borderRadius: 4,
//                                             width: '45%'
//                                         }}>
//                                         <Text
//                                             style={{
//                                                 textAlign: 'center',
//                                                 fontSize: 14,
//                                                 color: '#fff'
//                                             }}>
//                                             Fechar
//                                         </Text>
//                                     </TouchableOpacity>
//                                    </View>
//                                 </View>
//                             </View>
//                         </Modal>
//                     )}
//                     <Text
//                         style={{
//                             textAlign: 'center',
//                             fontSize: 18,
//                             color: '#000000',
//                             fontWeight: '500'
//                         }}>
//                         <MaterialCommunityIcons
//                             name="alert-circle"
//                             size={22}
//                             color="red"
//                         />
//                         Itens Incorretos
//                     </Text>
//                     <Divider />
//                     {!loadingFlatlist ? (
//                         <ActivityIndicator size="large" color="#2294ff" />
//                     ) : renderList()}  
//                 </View>
//             </View>
//         </Modal>
//     );
// } 
