import { ActivityIndicator, StyleSheet, Text, View } from "react-native"


export const Loading = () => {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2294ff" />
            <Text style={{ color: '#fff' }}>Carregando dados...</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
})