import { CardInfo, Container, TextSpan, TextInfo, ToggleCamera } from "./styles";
import { Button } from "../../components/Button";
import { useEffect, useRef, useState } from "react";
import { AutoFocus, Camera, CameraType } from "expo-camera";
import * as MediaLibrary from 'expo-media-library';
import { Image, StyleSheet, Text, View } from "react-native";
import { ButtonCamera } from "../../components/ButtonCamera";

export function Dash() {
    const [cameraStats, setCameraStats] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    
    const cameraRef = useRef<Camera>(null); 

    useEffect(() => {
        (async () => {
            await MediaLibrary.requestPermissionsAsync();
        })();
    }, []);

    function switchModeCamera() {
        setCameraStats(true);
    }

    async function takePicture() {
        if (cameraRef.current) {
            try {
                const { uri } = await cameraRef.current.takePictureAsync();
                setImage(uri);
            } catch (e) {
                console.log(e);
            }
        }
    }

    async function saveImage() {
        if (image) {
            try {
                await MediaLibrary.createAssetAsync(image);
                alert('Foto salva!');
                setImage(null);
            } catch (e) {
                console.log(e);
            }
        }
    }

    return (
        <>
            {cameraStats ? (
                <View style={styles.cameraContainer}>
                    {
                        !image ?
                            <Camera
                                style={styles.camera}
                                type={CameraType.back}
                                autoFocus={AutoFocus.on}
                                ref={cameraRef}
                                ratio={'1:1'}
                            />
                            :
                            <Image source={{ uri: image }} style={styles.camera} />
                    }
                    <View>
                        {image ? (
                            <View style={{
                                width: '100%',
                                flexDirection: "row",
                                justifyContent: 'space-around',
                                paddingHorizontal: 10
                            }}>
                                <ButtonCamera title="Salvar" icon="check" onPress={saveImage} />
                                <ButtonCamera title="Tirar novamente" icon="retweet" onPress={() => setImage(null)} />
                            </View>
                        ) : (
                            <ButtonCamera title="Capturar foto" icon="camera" onPress={takePicture} />
                        )}
                    </View>

                </View>
            ) : (
                <Container>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.camera} />
                    ) : (
                        <>
                            <CardInfo>
                                <TextSpan>
                                    <TextInfo>Nome:</TextInfo>
                                </TextSpan>
                            </CardInfo>

                            <ToggleCamera>
                                <Button
                                    title="Câmera"
                                    onPress={switchModeCamera}
                                />
                            </ToggleCamera>
                        </>
                    )}
                </Container>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        paddingBottom: 20,
        backgroundColor: 'black'
    },
    camera: {
        flex: 1,
    }
});
