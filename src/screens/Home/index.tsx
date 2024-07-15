import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { BarCodeScannerResult } from "expo-barcode-scanner";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";

export function Home() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedBarcode, setScannedBarcode] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [manualEntryValue, setManualEntryValue] = useState("");
  const cameraRef = useRef<CameraView>(null);
  const { onNfeData, nfeData } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(false);
 
  const [cameraStats, setCameraStats] = useState(true);

  // useEffect(() => {
  //   const getImage = async () => {
  //     const response = await axios.get('https://github.com/fymorGod.png')
  //     console.log(response)
  //   }
  //   getImage()
  // }, [])

  useEffect(() => {
    return () => {
      if (permission && permission.granted && cameraRef.current) {
        cameraRef.current._cameraRef.current?.stopRecording;
      }
    };
  }, [permission]);
  
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Permitir de acesso a câmera." />
      </View>
    );
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  function handleScan({ data }: BarCodeScannerResult) {
    if (data) {
      setScannedBarcode(data);
      setManualEntryValue(data);
      setLoading(true)
      onNfeData!(data);
      if (!nfeData?.romaneio && !nfeData.status) {
        navigation.navigate("Dash");
      } else {
        Alert.alert("NFe já cadastrada!")
      }
    } else {
      console.error("O código de barras escaneado é vazio ou indefinido.");
    }
  }


  function sendNFEManualmente() {
    const textValid = manualEntryValue.replace(/\s/g, "");

    if (textValid.length == 44) {
      setLoading(true)
      setScannedBarcode(manualEntryValue);
      onNfeData!(scannedBarcode);
      setModalVisible(false);
      setCameraStats(false)
      if (!nfeData?.romaneio) {
        setLoading(false)
        navigation.navigate("Dash");
      } else {
        setLoading(false)
        Alert.alert("NFe já cadastrada!")
      }
    } else {
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
      ref={cameraRef}
    />
    : null
    }
      <View style={styles.barcodeDataContainer}>
        <View style={styles.buttonContainer}>
          <View style={{ width: "60%", marginLeft: 15 }}>
            <Button
              title="Scanear Novamente"
              onPress={() => setScannedBarcode("")}
            />
          </View>
          <View style={{ width: "50%", marginRight: 5, marginLeft: -10 }}>
            <Button
              title="Digitar Nota"
              onPress={() => {
                setModalVisible(true);
              }}
            />
          </View>
        </View>
      </View>
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
              <Input
                icon="search"
                onChangeText={(text) => setManualEntryValue(text)}
                value={manualEntryValue}
                placeholder="Preencha com a NF-E"
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
