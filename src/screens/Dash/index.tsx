import {
  CardInfo,
  Container,
  TextSpan,
  TextInfo,
  ToggleCamera,
  CardInfoImages,
  TextInfoImage,
} from "./styles";
import { Button } from "../../components/Button";
import { useEffect, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { ActivityIndicator, Alert, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";

// import { launchImageLibrary } from 'react-native-image-picker'
import { ButtonCamera } from "../../components/ButtonCameraNFE";
import { Ionicons } from "@expo/vector-icons";


const options = {
  title: 'select image',
  type: 'library',
  options: {
    maxHeight: 200,
    maxWidth: 200,
    selectionLimit: 1,
    mediaType: 'photo',
    includeBase64: false
  }
}
export function Dash() {
  const [cameraStats, setCameraStats] = useState(false);

  const [imageUris, setImageUris] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { nfeData } = useAuth();

  useEffect(() => {
    (async () => {
      await MediaLibrary.requestPermissionsAsync();
    })();
  }, []);

  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
      });

      setLoading(true);
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

  const openGallery = async () => {
    let formData = new FormData();
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets[0].uri) {
        result.assets.forEach((asset, index) => {
          const imageName = `photo_${index}.png`;

          formData.append("images", {
            uri: asset.uri,
            name: imageName,
            type: "image/jpg"
          })

        })

        const response = await axios.post('http://192.168.102.14:3031/upload', formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }).then(data => {
          console.log(data.data)
          setImageUris([]);
        })
      }

    } catch (error) {
      console.error('Erro ao abrir a galeria:', error);
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
      console.log(imageUris)

      imageUris.forEach((uri, index) => {
        const imageName = `photo_${index}.png`;
        formData.append("images", {
          uri: uri,
          name: imageName,
          type: "image/jpg"
        });
      });

      const response = await axios.post('http://192.168.102.14:3031/upload', formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(data => {
        console.log(data.data)
        setImageUris([]);
        setLoading(false);

      })
      Alert.alert('Fotos salvas!');
    } catch (error) {
      console.error('Erro ao enviar as imagens:', error);
      Alert.alert('Erro ao enviar as imagens.');
    }
  };

  return (
    <Container>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <>

        {(nfeData && !loading) ? (
          <CardInfo>
            <TextSpan>
              <TextInfo>CPF: </TextInfo>
              <Text>{nfeData?.cpf}</Text>
            </TextSpan>
            <TextSpan>
              <TextInfo>Nome: </TextInfo>
              <Text>{nfeData?.nome_cliente}</Text>
            </TextSpan>
            <TextSpan>
              <TextInfo>NFE: </TextInfo>
              <Text>{nfeData?.nfe}</Text>
            </TextSpan>
            <TextSpan>
              <TextInfo>Nota Fiscal: </TextInfo>
              <Text>{nfeData?.nota_fiscal}</Text>
            </TextSpan>
            <TextSpan>
              <TextInfo>Número DAV: </TextInfo>
              <Text>{nfeData.numero_dav}</Text>
            </TextSpan>
            <TextSpan>
              <TextInfo>Número Pré-Nota: </TextInfo>
              <Text>{nfeData?.numero_pre_nota}</Text>
            </TextSpan>
          </CardInfo>
        ) : null}
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
                  data={imageUris}
                  renderItem={({ item, index }) => (
                    <View style={{ position: 'relative' }}>
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
                  keyExtractor={(item, index) => index.toString()}
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
                      <ButtonCamera icon="export" title="Selecione e Finalize" onPress={finishOperation} disabled={imageUris.length < 1} />
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
    width: '100%',
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
