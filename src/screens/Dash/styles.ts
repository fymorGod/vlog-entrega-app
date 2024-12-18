import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      gap: 10,
      alignItems: 'center',
      paddingVertical: 10,
    },
    cardInfoImages: {
      width: "100%",
      height: 200,
      justifyContent: "center",
      padding: 10,
    },
    mainContainer: {
      flex: 1,
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: '#fff',
      alignItems: 'center',
    },
    textInfoImage: {
      fontWeight: '500',
      fontSize: 18,
      textAlign:  'right',
      marginRight: 10,
      color: '#262626',
    },
    textVoltarCamera: {
      color: '#ffffff', 
      textAlign: 'center', 
      fontWeight: '500', 
      fontSize: 18
    },
    cameraStyle: {
      width: "100%",
      height: 200,
      position: 'absolute',
      bottom: 0,
      alignItems: 'center',
      backgroundColor: 'transparent',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 40
    },
    iconCamera: {
      borderWidth: 2,
      borderColor: "#04ff26", 
      backgroundColor: '#fff',
      height: 80, 
      width: 80, 
      borderRadius: 80, 
      alignItems: 'center', 
      justifyContent: 'center'
    },
    iconVoltarCamera: {
      borderWidth: 2, 
      borderColor: "#fff", 
      backgroundColor: '#5ea9ff', 
      height: 80, 
      width: 80, 
      borderRadius: 80, 
      alignItems: 'center', 
      justifyContent: 'center'
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
      backgroundColor: 'rgba(255,255,255,0.5)' 
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
    toggleCamera: {
      width: "80%",
      flexDirection: "row",
      marginBottom: 20
    }
  });