import React, { useCallback, useEffect, useState } from 'react';
import { Button, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { BarCodeScannerResult } from 'expo-barcode-scanner';
// import { useCameraDevice, Camera, useCodeScanner, Code } from 'react-native-vision-camera';

export function Home() {
//     const device = useCameraDevice('back')
//     const codeScanner = useCodeScanner({
//         codeTypes: ['ean-13'],
//         onCodeScanned: (codes: Code[]) => {
//             console.log(`Scanned ${codes[0].value} codes!`)
//         }
//     })

//     const requestCameraPermission = useCallback( async () => {
//         const permission = await Camera.requestCameraPermission();
//         if (permission === 'denied') await Linking.openSettings()
//     }, [])

//     useEffect(() => {
//         requestCameraPermission();
//     }, [])

//     function renderCamera() {
//         if(device == null) {
//             return (
//                 <View style={{ flex: 1}}/>
//             )
//         } else {
//             return (
//                 <View style={{ flex: 1}}>
//                     <Camera 
//                     style={{ flex: 1}}
//                     device={device}
//                     isActive={true}
//                     />
//                 </View>
//             )
//         }
//     }

//     return (
//       <View style={{ flex: 1}}>
//          {renderCamera()}
//       </View>
//     ) 
// }
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);

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

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }
  function handleScan({type, data}: BarCodeScannerResult) {
    setScannedBarcode(data);
    console.log(`Scanned barcode of type ${type} with data: ${data}`)
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
          <Button
            title="Scan Again"
            onPress={() => setScannedBarcode(null)}
          />
        </View>
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
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  barcodeDataContainer: {
    alignItems: 'center',
    marginBottom: 40
  },
  barcodeText: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
