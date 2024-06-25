import {
  CardInfo,
  Container,
  TextSpan,
  TextInfo,
  ToggleCamera,
  CardInfoImages,
  TextInfoImage,
} from "./styles";
import { useEffect, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { ActivityIndicator, Alert, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import { ButtonCamera } from "../../components/ButtonCameraNFE";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ButtonFinish } from "../../components/ButtonFinish";

export function Dash() {
  const [cameraStats, setCameraStats] = useState(false);

  const [imageUris, setImageUris] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { nfeData, username, storeData, authState } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      await MediaLibrary.requestPermissionsAsync();
    })();
  }, []);

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

  const finishOperation = async () => {
    try {
        setLoading(true);
        const formData = new FormData();
        const currentDate = new Date();

        imageUris.forEach((uri, index) => {
            const imageName = `photo_${currentDate.getTime()}_${index}.png`;
            const imageFile = {
                uri: uri,
                name: imageName,
                type: 'image/jpeg'
            };
            formData.append("file", imageFile);
        });

        formData.append('store', storeData);
        formData.append('cpf', nfeData.clienteE.cpfCliente);
        formData.append('client', nfeData.clienteE.nome);
        formData.append('key_nf', nfeData.nfe);
        formData.append('nf', nfeData.notaFiscal);
        formData.append('dav', nfeData.numeroDav);
        formData.append('pre_nota', nfeData.numeroPreNota);
        formData.append('status', '1'); 
        formData.append('user_log', username);

        const response = await axios.post('http://192.168.102.14:8080/api/v1/create-customer', formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        if (response.status === 201) {
            setImageUris([]);
            setLoading(false);
            Alert.alert('Fotos salvas!');
            navigation.navigate('ScannerNFe');
        } else {
            console.log("Error no envio de imagens");
            setLoading(false);
        }
    } catch (error) {
        console.error('Erro ao enviar as imagens:', error);
        Alert.alert('Erro ao enviar as imagens.');
    }
};


  return (
    <Container>
      <>
        {(nfeData && !loading) ? (
          <CardInfo>
            <TextSpan>
              <TextInfo>CPF: </TextInfo>
              <Text style={{ fontSize: 18}}>{nfeData?.clienteE.cpfCliente}</Text>
            </TextSpan>
            <TextSpan>
              <TextInfo>Nome: </TextInfo>
              <Text  style={{ fontSize: 18}}>{nfeData?.clienteE.nome}</Text>
            </TextSpan>
            <TextSpan>
              <TextInfo>NFE: </TextInfo>
              <Text  style={{ fontSize: 18}}>{nfeData?.nfe}</Text>
            </TextSpan>
            <TextSpan>
              <TextInfo>Nota Fiscal: </TextInfo>
              <Text  style={{ fontSize: 18}}>{nfeData?.notaFiscal}</Text>
            </TextSpan>
            <TextSpan>
              <TextInfo>Número DAV: </TextInfo>
              <Text  style={{ fontSize: 18}}>{nfeData.numeroDav}</Text>
            </TextSpan>
            <TextSpan>
              <TextInfo>Número Pré-Nota: </TextInfo>
              <Text  style={{ fontSize: 18}}>{nfeData?.numeroPreNota}</Text>
            </TextSpan>
          </CardInfo>
        ) : <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4c4c53" />
              <Text>Enviando as Imagens...</Text>
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
    gap:10,
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
