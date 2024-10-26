import React, { useContext, useEffect, useRef } from "react";
import {
  Container,
  ToggleCamera,
  CardInfoImages,
  TextInfoImage,
} from "./styles";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import axios from "axios";
import { ButtonCamera } from "../../components/ButtonCameraNFE";
import { useNavigation } from "@react-navigation/native";
import { ButtonFinish } from "../../components/ButtonFinish";
import { AuthContext } from "../../context/AuthContext";
import Toast from 'react-native-toast-message';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { production, staging } from "../../lib/prefix";
import { CardInfoComponent } from "../../components/CardInfo";
import Ionicons from '@expo/vector-icons/Ionicons';

import { CameraView, type CameraType } from "expo-camera";
export function Dash() {

  const [cameraStats, setCameraStats] = useState(false);


  const { nfe, user } = useContext(AuthContext)

  const [awsImage, setAwsImage] = useState<string>("");
  const [customerId, setCustomerId] = useState<number>(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const awsImageRef = useRef(awsImage);
  const navigation = useNavigation();

  const [imageUris, setImageUris] = useState<string[]>([]);

  const openCamera = async () => {
    setCameraStats(true)
    // const result = await ImagePicker.launchCameraAsync({
    //   cameraType: ImagePicker.CameraType.back,
    //   aspect: [1, 1],
    //   quality: 0.4,
    // });
    // if (!result.canceled) {
    //   setImageUris(prevImage => [...prevImage, result.assets[0].uri]);
    // }
  }

  const cameraRef = useRef(null);
  const [facing, setFacing] = useState<CameraType>('back');

  const takePicture = async () => {
    if (cameraRef.current) {
        const options = { quality: 1, base64: true, skipProcessing: true };
        const data = await cameraRef.current.takePictureAsync(options);
        setImageUris(prevImage => [...prevImage, data.uri]);
        setCameraStats(false)
    }
  };
  const removeImage = (index: number) => {
    const newImageUris = [...imageUris];
    newImageUris.splice(index, 1);
    setImageUris(newImageUris);
  };

  useEffect(() => {
    setCount(count + 1)
    if (awsImageRef.current !== awsImage) {
      console.log("Chamando relacionamento");
      createImageCustomer();
      awsImageRef.current = awsImage;
    }
  }, [awsImage]);

  // Send images to AWS
  const handleImageSubmit = async () => {
    try {
      const currentDate = new Date();
      const promises = imageUris.map(async (uri, index) => {
        const imageName = `photo_${currentDate.getTime()}_${index}.jpg`;
        const compressedImage = await manipulateAsync(
          uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: SaveFormat.JPEG }
        );

        const imageFile = {
          uri: compressedImage.uri,
          name: imageName,
          type: 'image/jpeg'
        };

        return sendToAwsImages(imageFile);
      });

      await Promise.all(promises);
      //navigation.navigate('ScannerNFe');

    } catch (error) {
      console.error('Erro ao enviar imagens para AWS:', error);
      Toast.show({
        type: 'error',
        text1: `Erro ao enviar imagens para AWS: ${error}`,
        visibilityTime: 5000
      });
    }
  };
  const sendToAwsImages = async (image: any) => {
    try {
      const formData = new FormData();
      formData.append('file', image);
      const response = await axios.post(`https://${staging}-potiguar-mcs-eportal-retirada-cliente-api.apotiguar.com.br/api/v1/file/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status == 200) {
        setAwsImage((prevState) => response.data)

        Toast.show({
          type: 'success',
          text1: `Imagens enviadas com sucesso ${response.data}`,
          visibilityTime: 5000
        })
      }
    } catch (error) {
      console.log(error)
      Toast.show({
        type: 'error',
        text1: 'Erro ao enviar imagens para AWS: ' + error,
        visibilityTime: 5000
      })
    }
  }
  // Send customer to DB 
  const createCustomer = async () => {
    try {
      const response = await axios.post(`https://${staging}-potiguar-mcs-eportal-retirada-cliente-api.apotiguar.com.br/api/v1/create-customer`, {
        store: user.storeCode,
        cpf: nfe.clienteE.cpfCliente,
        client: nfe.clienteE.nome,
        keyNf: nfe.nfe,
        nf: nfe.notaFiscal,
        dav: nfe.numeroDav,
        preNota: nfe.numeroPreNota,
        status: '1',
        userLog: user.username,
        dataEmissao: nfe.dataEmissao
      });

      if (response.status == 201) {
        setCustomerId(response.data.customerId)

        Toast.show({
          type: 'success',
          text1: 'Customer criado com sucesso',
          visibilityTime: 5000
        })
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Erro ao criar o customer ' + error,
        visibilityTime: 5000
      });
    }
  }
  // Send to DB Images Relations with Customer
  const createImageCustomer = async () => {
    try {

      const response = await axios.post(`https://${staging}-potiguar-mcs-eportal-retirada-cliente-api.apotiguar.com.br/api/v1/customer-image`, {
        url: awsImage,
        customerPickupId: customerId
      })
      if (response.status == 200) {

        setLoading(false);
        Toast.show({
          type: 'success',
          text1: 'Processo concluído com sucesso',
          visibilityTime: 5000
        });
        console.log(count)

        if (count == imageUris.length) {
          Alert.alert('Processo', 'Finalizado')
          navigation.navigate('ScannerNFe')
        }
      }

    } catch (error) {
      console.log(error)
      Toast.show({
        type: 'error',
        text1: 'Erro ao enviar Processo para o Servidor: ' + error,
        visibilityTime: 5000
      })
    }
  };

  const finishOperation = async () => {
    setLoading(true);

    await createCustomer()
    await handleImageSubmit()

  }

  const renderImages = () => {
    return imageUris.map((uri, index) => (
      <View style={{ width: 100, position: 'relative' }} key={index}>
        <Image
          source={{ uri }}
          style={styles.image}
        />
        {index >= 2 && (
          <TouchableOpacity
            style={styles.deleteIcon}
            onPress={() => removeImage(index)}
          >
            <Ionicons name="trash" size={24} color="white" style={{ marginRight: 10 }} />
          </TouchableOpacity>
        )}
      </View>
    ));
  };

  return (
    <>
       {
        cameraStats ?  <CameraView style={{ flex: 1, width: '100%' }}  facing={facing} ref={cameraRef} pictureSize={"1920x1080"} >
        <View
              style={{
                  width: "100%",
                  height: 200,
                  position: 'absolute',
                  bottom: 0,
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 40
              }}> 
              <TouchableOpacity onPress={takePicture} style={{borderWidth: 2, borderColor: "#04ff26",backgroundColor: '#fff', height: 80, width: 80, borderRadius: 80, alignItems: 'center', justifyContent: 'center'}}>
                <Ionicons name="camera" size={35} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCameraStats(false)} style={{borderWidth: 2, borderColor: "#fff", backgroundColor: '#5ea9ff', height: 80, width: 80, borderRadius: 80, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: '#ffffff', textAlign: 'center', fontWeight: '500', fontSize: 18}}>Voltar</Text>
              </TouchableOpacity>
          </View>
        </CameraView>
        :  <Container>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Aguarde, carregando...</Text>
          </View>
        )}
       
        <>
          {nfe && <CardInfoComponent />}
          
                <CardInfoImages>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>Fotos capturadas</Text>
                    <TextInfoImage>{imageUris.length}/10</TextInfoImage>
                  </View>
  
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.container}
                  >
                    {renderImages()}
                  </ScrollView>
                </CardInfoImages>
               
                
                <View style={{ width: "100%", flexDirection: 'column', height: 170, alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
                  
                  <ToggleCamera>
                    <ButtonCamera icon="camera" title="Canhoto da NF-E" onPress={() => {
                      if (imageUris.length == 10) {
                        return Alert.alert("Alerta", "Limite de Imagens")
                      } 
                      openCamera()
                    }} disabled={imageUris.length >= 1}/>
                  </ToggleCamera>
                  <ToggleCamera>
                    <ButtonCamera icon="camera" title="Foto do Produto" onPress={() => {
                       if (imageUris.length == 10) {
                        return Alert.alert("Alerta", "Limite de Imagens")
                      } 
                      openCamera()
                    }} disabled={imageUris.length < 1} />
                  </ToggleCamera>
  
                  {imageUris.length >= 2 && (
                    <View style={{ width: "100%", flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <ToggleCamera>
                        <ButtonFinish icon="export" title="Finalize" onPress={finishOperation} disabled={imageUris.length < 1} />
                      </ToggleCamera>
                    </View>
                  )}
  
                </View>
             
        </>
      </Container>
      }
    </>
   
  );
}

const styles = StyleSheet.create({
   container: {
    gap: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  cameraContainer: {
    flex: 1,
    paddingBottom: 20,
    backgroundColor: "black",
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)'  // Fundo levemente branco para destaque
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  imagesContainer: {
    gap: 10,
    marginTop: 10,
  },
  camera: {
    flex: 1,
  },
  deleteIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    borderRadius: 50,
    padding: 5,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginRight: 10,
    borderRadius: 10
  },
});
