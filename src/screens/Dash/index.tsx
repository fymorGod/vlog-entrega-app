import {
  CardInfo,
  Container,
  TextSpan,
  TextInfo,
  ToggleCamera,
} from "./styles";
import { Button } from "../../components/Button";
import { useEffect, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { Alert, FlatList, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";

import { launchImageLibrary } from 'react-native-image-picker'


const options={
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

      if (!result.canceled && result.assets[0].uri) {
        const newImageUris = result.assets.map(asset => asset.uri);
        await MediaLibrary.createAssetAsync(result.assets[0].uri);
        setImageUris([...imageUris, ...newImageUris]);

      }
      if ( imageUris.length >= 1) {
        setCameraStats(true)
      }
    } catch (error) {
      console.error('Erro ao abrir a câmera:', error);
    }
  };

  const openGallery = async () => {
    let formData = new FormData()
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: true, 
      });
      console.log(result)
      if (!result.canceled && result.assets[0].uri) {
      formData.append("images", {
        uri: result.assets[0].uri,
        name: "photo.png",
        type: "image/jpg"
      })
      const response = await axios.post('http://192.168.102.14:3031/upload', formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(data => {
        console.log(data.data)
      })
    }
      // if (!result.canceled && result.assets[0].uri) {
      //   const newImageUris = result.assets.map(asset => asset.uri);
      //   setImageUris([...imageUris, ...newImageUris]);
      //   console.log(imageUris)
      // }
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
      // const formData = new FormData();
      // if (imageUris.length > 1) {
      //   formData.append('images', {
      //     image: imageUris
      //   });

        const response = await axios.post('http://192.168.102.14:3031/upload', {
          "images": imageUris
        }, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then(({data})=> console.log(data));;
  
        console.log('Imagens enviadas:', response);
        Alert.alert('Fotos salvas!');
        setCameraStats(false);
    } catch (error) {
      console.error('Erro ao enviar as imagens:', error);
      Alert.alert('Erro ao enviar as imagens.');
    }
  };

  return (
    <Container>
      {nfeData ? (
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
      <>
      <FlatList
        horizontal
        data={imageUris}
        renderItem={({ item, index }) => (
            <Image source={{ uri: item }} style={styles.image} />
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.imagesContainer}
        showsHorizontalScrollIndicator={false}
      />
       {
        cameraStats ?  
        <ToggleCamera>
          <Button title="Selecionar fotos" onPress={openGallery} />
        </ToggleCamera> 
        : <ToggleCamera>
        <Button title="Câmera" onPress={openCamera} />
      </ToggleCamera>
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
  imagesContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 20,
  },
  camera: {
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginRight: 10
  },
});
