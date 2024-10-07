import type { BarCodeScannerResult } from "expo-barcode-scanner";
import { CameraView } from "expo-camera"
import { Text } from "react-native"

interface CameraCodProdutoProps {
    handleScan: (data: BarCodeScannerResult) => void; 
    title: string
}

export const Camera = ({handleScan, title}: CameraCodProdutoProps) => {
    return (
        <CameraView
            onBarcodeScanned={handleScan}
            style={{ flex: 1, width: "100%", justifyContent: 'center', alignItems: 'center' }}
            pictureSize={"1920x1080"}>
            <Text style={{
                backgroundColor: 'transparent',
                textAlign: 'center',
                fontSize: 24,
                position: 'absolute',
                top: 40,
                borderWidth: 2,
                padding: 10,
                borderColor: '#fff',
                fontWeight: '600',
                color: '#ffffff'
            }}>
                {title}
            </Text>
        </CameraView>
    )
}