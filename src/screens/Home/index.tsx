import React, { useRef, useState } from 'react';
import { Keyboard, Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { BarCodeScannerResult } from 'expo-barcode-scanner';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
// import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export function Home() {
  const [ permission, requestPermission ] = Camera.useCameraPermissions();
  const [ scannedBarcode, setScannedBarcode ] = useState<string>('');

  const [ modalVisible, setModalVisible ] = useState(false);

  const [ cameraVisible, setCameraVisible ] = useState(false);

  const [ manualEntryValue, setManualEntryValue ] = useState("");

  const cameraRef = useRef<Camera>(null);

  const navigation = useNavigation();

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

  const loadData = async (s:string) => {
    console.log(s)
    if (!s) {
      console.error('O código de barras escaneado é vazio ou indefinido.');
      return;
    } else {
      const response = await fetch(`http://192.168.4.59:3000/consulta?chaveAcesso=${s}&unidadeIE=102`);
      console.log(response.status)
      const data = await response.json();
      console.log(data)
      navigation.navigate("Dash");
    }
  }

  function handleScan({ data }: BarCodeScannerResult) {
    if (data) {
      setScannedBarcode(data);
      setManualEntryValue(data);

      loadData(data); 
    } else {
      console.error('O código de barras escaneado é vazio ou indefinido.');
    }
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  function sendNFEManualmente() {
    const textValid = manualEntryValue.replace(/\s/g, '');

    if (textValid.length == 44) {
      setScannedBarcode(manualEntryValue);
      // getValidateDataWithClient()
    } else {
      setModalVisible(false);
    }
  }

  return (
    <View style={styles.container}>
      <Camera
        onBarCodeScanned={handleScan}
        style={styles.camera}
        type={CameraType.back}
        pictureSize={'1920x1080'}
        ref={cameraRef}
        ratio={'1:1'}
      />
      <View style={styles.barcodeDataContainer}>
        <View style={styles.buttonContainer}>
          <View style={{ width: '60%', marginLeft: 15 }}>
            <Button
              title="Scanear Novamente"
              onPress={() => setScannedBarcode('')}
            />
          </View>
          <View style={{ width: '50%', marginRight: 5, marginLeft: -10 }}>

            <Button
              title="Digitar Nota"
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
                    onPress={sendNFEManualmente}
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
    width: '100%',
    marginTop: 20,
    justifyContent: 'space-evenly'
  },
  barcodeDataContainer: {
    alignItems: 'center',
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
