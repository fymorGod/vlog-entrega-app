import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native"
import type { Audititem } from "../../interfaces/AuditoriaItem";

interface FlatlistProps {
    dadosFiltrados: Audititem[];
    handlePress: (item: Audititem) => void;
}

export const FlatlistComponent = ({ dadosFiltrados, handlePress }: FlatlistProps) => {

    const renderItem = ({ item }: { item: Audititem }) => (
        <TouchableOpacity style={styles.itemContainer} onPress={() => handlePress(item)}>
            <Text style={styles.itemText}>Romaneio: {item.romaneio}</Text>
            <Text style={styles.itemText}>Código do Produto: {item.codProduto}</Text>
            <Text style={styles.itemText}>EAN: {item.eanProduto}</Text>
            <Text style={styles.itemText}>Descrição: {item.descricao}</Text>
            <Text style={styles.itemText}>Embalagem: {item.emb}</Text>
            <Text style={styles.itemTextWrong}>Quantidade Auditada: {item.qtdAuditada == null ? '0' : item.qtdAuditada}</Text>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={dadosFiltrados}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#222",
        paddingBottom: 30
    },
    itemContainer: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        marginTop: 20,
        marginHorizontal: 10,
        borderRadius: 8,
        borderLeftWidth: 5,
        borderLeftColor: '#2de200',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemText: {
        fontSize: 16,
        marginBottom: 4,
    },
    itemTextWrong: {
        fontSize: 16,
        marginBottom: 4,
        color: '#000000'
    }
})