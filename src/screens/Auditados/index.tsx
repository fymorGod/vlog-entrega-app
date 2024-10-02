import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Audititem } from "../../interfaces/AuditoriaItem";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export const Auditados = () => {
    const [adtItens, setAdtItens] = useState<Audititem[]>([])
    const { romaneio } = useContext(AuthContext);
    const [loading, setLoading] = useState<boolean>(false);

    const getDataAuditoriaItem = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`https://staging-potiguar-mcs-logistica-auditoria-api.apotiguar.com.br/api/v1/auditoria/romaneio?romaneio=${romaneio}`);
            filterItems(response.data);
        } catch (error) {
            console.error('Erro ao fazer a requisição:', error.message);
        }
    };

    useEffect(() => {
        getDataAuditoriaItem()
    }, [])

    const filterItems = (items: Audititem[]) => {
        const filtered = items.filter(item => item.qtdAuditada > 0);
        setAdtItens(filtered)
        setLoading(false)
    };

    const renderItem = ({ item }: { item: Audititem }) => (
        <TouchableOpacity style={styles.itemContainer}>
            <Text style={styles.itemText}>Romaneio: {item.romaneio}</Text>
            <Text style={styles.itemText}>Código do Produto: {item.codProduto}</Text>
            <Text style={styles.itemText}>EAN: {item.eanProduto}</Text>
            <Text style={styles.itemText}>Descrição: {item.descricao}</Text>
            <Text style={styles.itemText}>Embalagem: {item.emb}</Text>
            <Text style={styles.itemTextWrong}>Quantidade Auditada: {item.qtdAuditada == null ? '0' : item.qtdAuditada}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {
                loading 
                ? <ActivityIndicator size="large" color="#2294ff"/>
                : <FlatList
                    data={adtItens}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />   
            }
        </View>
    );
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