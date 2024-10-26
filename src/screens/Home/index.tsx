import React, { useCallback, useContext, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { BarCodeScannerResult } from "expo-barcode-scanner";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Toast from "react-native-toast-message";
import { production, staging } from "../../lib/prefix";

export const URL_VALIDATE_DATA_SCANNER = `https://${staging}-potiguar-mcs-eportal-retirada-cliente-api.apotiguar.com.br/api/v1/nfe/data-consumer?`;

export function Home() {
  const [permission, requestPermission] = useCameraPermissions();
  const [modalVisible, setModalVisible] = useState(false);
  const [manualEntryValue, setManualEntryValue] = useState("");

  const { setNfe, user: { storeCode } } = useContext(AuthContext);

  const navigation = useNavigation();

  const [loading, setLoading] = useState<boolean>(false);

  const [cameraStats, setCameraStats] = useState(true);

  useFocusEffect(
    useCallback(() => {
      // Reativando a câmera ao retornar para a tela
      setCameraStats(true);

      return () => {
        // Opcional: desativando a câmera quando a tela perde o foco
        setCameraStats(false);
      };
    }, [])
  );

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

  const validateStatus = async (barCode: string) => {

    const response = await fetch(`https://${staging}-potiguar-mcs-eportal-retirada-cliente-api.apotiguar.com.br/api/v1/find-customer-by-key?keyNf=${barCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data
    } else {
      console.error('Erro ao buscar cliente por chave:', response.statusText)
    }
  }

  const sendNfe = async (scannerNotaFiscal: string) => {
    try {
      const status = await validateStatus(scannerNotaFiscal)
      console.log(status)
      if (status.length == 0) {
        const res = await axios.get(URL_VALIDATE_DATA_SCANNER + `chaveAcesso=${scannerNotaFiscal}&unidadeIE=${storeCode}`)
        if (res.status == 200 && res.data.length > 0) {
          setNfe(res.data[0]);
          setLoading(false);
          setCameraStats(true);
          Toast.show({
            type: 'success',
            text1: 'NFE pronta para cadastro',
            text1Style: {
              alignContent: "center"
            },
            visibilityTime: 5000
          });
          navigation.navigate("Dash")
        } else {
          setCameraStats(false)
          Toast.show({
            type: 'error',
            text1: 'Error na leitura!',
            visibilityTime: 5000
          });

          navigation.navigate("ScannerNFe")
        }
      } else {
        setCameraStats(false)
        Toast.show({
          type: 'error',
          text1: 'NFE já cadastrada no sistema.',
          visibilityTime: 5000
        });

        navigation.navigate("ScannerNFe")
      }

    } catch (error) {
      console.log(error)
    }
  }

  async function handleScan({ data }: BarCodeScannerResult) {
    if (data) {
      setLoading(true);
      setCameraStats(false)
      sendNfe(data)
    } else {
      setLoading(false)
      console.error("O código de barras escaneado é vazio ou indefinido.");
    }
  }

  function sendNFEManualmente() {
    const textValid = manualEntryValue.replace(/\s/g, "");

    if (textValid.length == 44) {
      setLoading(true)
      sendNfe(textValid);
      setModalVisible(false);
      setCameraStats(false);
    } else {
      setLoading(false)
      setModalVisible(false);
    }
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0a0a0a" />
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
                title="Digitar Nota"
                onPress={() => {
                  setModalVisible(true);
                  setCameraStats(false)
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
        }}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <Text style={{ fontWeight: '600', fontSize: 18, textAlign: 'center' }}>Informe a Nota fiscal</Text>
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
                placeholder="Preencha com a NF-E"
                keyboardType="number-pad"
              />
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "50%" }}>
                  <Button title="Enviar" onPress={sendNFEManualmente} />
                </View>
                <View style={{ width: "50%" }}>
                  <Button
                    title="Fechar"
                    onPress={() => {
                      setModalVisible(false);
                      setCameraStats(true)
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
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
    marginTop: 22,
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
