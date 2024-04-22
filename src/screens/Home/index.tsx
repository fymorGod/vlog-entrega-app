import React, { useState } from 'react';
import { Keyboard, Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { BarCodeScannerResult } from 'expo-barcode-scanner';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import axios from 'axios';

export function Home() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const { storeData } = useAuth()
  const [modalVisible, setModalVisible] = useState(false);
  const [manualEntryValue, setManualEntryValue] = useState("");

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  
  async function getValidateDataWithClient() {
    const result = await axios.get(`localhost:3000/consulta?${scannedBarcode}&${storeData}`);
    console.log(result)
  }


  function handleScan({ type, data }: BarCodeScannerResult) {
    setScannedBarcode(data);
    console.log(`Scanned barcode of type ${type} with data: ${data}`)
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  function sendNFEManualmente() {
    const textValid = manualEntryValue.replace(/\s/g, '');

    if (textValid.length == 44) {
      setScannedBarcode(manualEntryValue)
      getValidateDataWithClient()
      setModalVisible(false);
    } else {
      setModalVisible(false)
    }
  }

  return (
    <View style={styles.container}>
      <Camera
        onBarCodeScanned={handleScan}
        style={styles.camera}
        type={type}
      />
      <View style={styles.barcodeDataContainer}>
        <Text style={styles.barcodeText}>{scannedBarcode}</Text>
        <View style={styles.buttonContainer}>
          <View style={{ width: '50%' }}>
            <Button
              title="Scan Again"
              onPress={() => setScannedBarcode(null)}
            />
          </View>
          <View style={{ width: '50%' }}>

            <Button
              title="Manual Entry"
              onPress={() => {
                setModalVisible(true)
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
                onChangeText={text => setManualEntryValue(text)}
                value={manualEntryValue}
                placeholder="Preencha com a NF-E"
              />
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '50%' }}>
                  <Button
                    title="Enviar"
                    onPress={() => {
                      sendNFEManualmente()

                    }}
                  />
                </View>
                <View style={{ width: '50%' }}>
                  <Button
                    title="Fechar"
                    onPress={() => {
                      setModalVisible(false)

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
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '100%'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  barcodeDataContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: -30
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  input: {
    height: 40,
    width: '100%',
    marginBottom: 20,
    borderColor: 'gray',
    borderWidth: 1
  }
});
