import React, { useContext, useEffect } from "react";
import {
  CardInfo,
  Container,
  TextSpan,
  TextInfo,
  ToggleCamera,
  CardInfoImages,
  TextInfoImage,
} from "./styles";
import { useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import { ButtonCamera } from "../../components/ButtonCameraNFE";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ButtonFinish } from "../../components/ButtonFinish";
import { AuthContext } from "../../context/AuthContext";
import Toast from 'react-native-toast-message';

export function Dash() {
  const [cameraStats, setCameraStats] = useState(false);

  const [imageUris, setImageUris] = useState<string[]>([]);

  const [awsImage, setAwsImage] = useState<string>();
  const [customerId, setCustomerId] = useState<string>();

  const [loading, setLoading] = useState<boolean>(false);
  const { nfe, user } = useContext(AuthContext)
  const navigation = useNavigation();

  // useEffect(() => {
  //   (async () => {
  //     await MediaLibrary.requestPermissionsAsync();
  //   })();
  // }, []);

  const openCamera = async () => {
    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        const newImageUris = result.assets.map(asset => asset.uri);

        setImageUris((prevImage) => [...prevImage, ...newImageUris]);
      }
      if (imageUris.length >= 1) {
        setCameraStats(true)
      }
      setLoading(false);
    } catch (error) {
      console.error('Erro ao abrir a câmera:', error);
    }
  };

  const removeImage = (index: number) => {
    const newImageUris = [...imageUris];
    newImageUris.splice(index, 1);
    setImageUris(newImageUris);
  };

  // Send images to AWS
  const handleImageSubmit = async () => {
    const currentDate = new Date();
    imageUris.forEach((uri, index) => {
      const imageName = `photo_${currentDate.getTime()}_${index}.png`;
      const imageFile = {
        uri: uri,
        name: imageName,
        type: 'image/jpeg'
      };
      sendToAwsImages(imageFile)
    });
  }

  const sendToAwsImages = async (image: any) => {
    try {
      const response = await axios.post('https://stating-potiguar-mcs-eportal-retirada-cliente-api.apotiguar.com.br/api/v1/file/upload', {
        file: image
      })
      if (response.status == 200) {
        console.log(response.data)
        setAwsImage(response.data)
        setImageUris([]);
        Toast.show({
          type: 'success',
          text1: 'Imagens enviadas com sucesso',
          visibilityTime: 5000
        })
      }
    } catch (error) {
      console.log(error)
      Toast.show({
        type: 'error',
        text1: 'Erro ao enviar imagenns para AWS: ' + error,
        visibilityTime: 5000
      })
    }
  }

  // Send customer to DB 
  const createCustomer = async () => {
    try {
      const response = await axios.post('https://staging-potiguar-mcs-eportal-retirada-cliente-api.apotiguar.com.br/api/v1/create-customer', {
        store: user?.storeCode,
        cpf: nfe?.clienteE?.cpfCliente,
        client: nfe?.clienteE?.nome,
        key_nf: nfe?.nfe,
        nf: nfe?.notaFiscal,
        dav: nfe?.numeroDav,
        pre_nota: nfe?.numeroPreNota,
        status: '1',
        user_log: user?.username
      });

      if (response.status === 201) {
        Toast.show({
          type: 'success',
          text1: 'Customer criado com sucesso',
          visibilityTime: 5000
        })
        setCustomerId(response.data)
        navigation.navigate('ScannerNFe');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error ao criar o customer',
          visibilityTime: 5000
        })
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao enviar as imagens:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao enviar as imagens: ' + error,
        visibilityTime: 5000
      });
    }
  }
  // Send to DB Images Relations with Customer
  const createImageCustomer = async () => {
    try {
      setLoading(true);
      const response = await axios.post('https://stating-potiguar-mcs-eportal-retirada-cliente-api.apotiguar.com.br/api/v1/file/customer-image', {
        url: awsImage,
        customerPickupId:customerId 
      })
      if (response.status == 200) {
       setLoading(false);
        Toast.show({
          type: 'success',
          text1: 'Processo concluído com sucesso',
          visibilityTime: 5000
        })
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

  // finishOperation
  // handleImageSubmit() envio de imagens para aws 
  // createCustomer()
  // createImageCustomer()
  return (
    <Container>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Aguarde, carregando...</Text>
        </View>
      )}
      <>
        {(nfe && !loading) ? (
          <CardInfo>
            <TextSpan>
              <TextInfo>CPF: </TextInfo>
              <Text style={{ fontSize: 18 }}>{nfe?.clienteE.cpfCliente}</Text>
            </TextSpan>
            <TextSpan>
              <TextInfo>Nome: </TextInfo>
              <Text style={{ fontSize: 18 }}>{nfe?.clienteE.nome}</Text>
            </TextSpan>
            <TextSpan>
              <TextInfo>NFE: </TextInfo>
              <Text style={{ fontSize: 18 }}>{nfe?.nfe}</Text>
            </TextSpan>
            <TextSpan>
              <TextInfo>Nota Fiscal: </TextInfo>
              <Text style={{ fontSize: 18 }}>{nfe?.notaFiscal}</Text>
            </TextSpan>
            <TextSpan>
              <TextInfo>Número DAV: </TextInfo>
              <Text style={{ fontSize: 18 }}>{nfe.numeroDav}</Text>
            </TextSpan>
            <TextSpan>
              <TextInfo>Número Pré-Nota: </TextInfo>
              <Text style={{ fontSize: 18 }}>{nfe?.numeroPreNota}</Text>
            </TextSpan>
          </CardInfo>
        ) : <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
        }
        {
          !loading && (
            <>
              <CardInfoImages>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text>Fotos capturadas</Text>
                  <TextInfoImage>{imageUris.length}/10</TextInfoImage>
                </View>

                <FlatList
                  horizontal
                  keyExtractor={(item, index) => index.toString()}
                  data={imageUris}
                  renderItem={({ item, index }) => (
                    <View style={{ width: 100, position: 'relative' }}>
                      <Image source={{ uri: item }} style={styles.image} />
                      {index >= 2 && (
                        <TouchableOpacity
                          style={styles.deleteIcon}
                          onPress={() => removeImage(index)}
                        >
                          <Ionicons name="trash" size={24} color="white" style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  contentContainerStyle={styles.imagesContainer}
                  showsHorizontalScrollIndicator={false}
                />

              </CardInfoImages>
              <View style={{ width: "100%", flexDirection: 'column', height: 170, alignItems: 'center', justifyContent: 'center' }}>
                <ToggleCamera>
                  <ButtonCamera icon="camera" title="Canhoto da NF-E" onPress={() => openCamera()} disabled={imageUris.length >= 1} />
                </ToggleCamera>
                <ToggleCamera>
                  <ButtonCamera icon="camera" title="Foto do Produto" onPress={() => openCamera()} disabled={imageUris.length < 1} />
                </ToggleCamera>

                {cameraStats && (
                  <View style={{ width: "100%", flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <ToggleCamera>
                      <ButtonFinish icon="export" title="Finalize" onPress={finishOperation} disabled={imageUris.length < 1} />
                    </ToggleCamera>
                  </View>
                )}

              </View>
            </>
          )
        }

      </>
    </Container>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    paddingBottom: 20,
    backgroundColor: "black",
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
