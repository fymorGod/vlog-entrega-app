import { Text } from "react-native"
import { TextSpan } from "../../screens/Login/styles"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { CardInfo, TextInfo } from "./styles"

export const CardInfoComponent = () => {
    const { nfe } = useContext(AuthContext)
    
    return (
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
    )
}