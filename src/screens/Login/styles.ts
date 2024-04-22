
import { TextInput } from "react-native";
import styled from "styled-components/native";

interface Props {
    isFocused: boolean;
  }

export const Container = styled.View`
    flex: 1;
    overflow: hidden;
    position: relative;
`
export const ContainerLogo = styled.View`
    width: 100%;
    height: 35%;
    display: flex;
    justify-content: center;
    align-items: center;
`
export const ContainerForm = styled.View`
    width: 100%;
    height: 65%;
    position: absolute;
    bottom: 0%;
    display: flex;
    border-top-left-radius: 80px;
    background-color: #f2f2f2;
`;

export const TextSpan = styled.Text`
    font-size: 12px;
    margin-left: 40px;
    margin-top: -10px;
    margin-bottom: 20px;
    font-weight: 300;
    font-style: italic;
    color: #170E49;
`

export const Text = styled.Text`
    font-size: 30px;
    margin-top: 40px;
    margin-bottom: 20px;
    margin-left: 40px;
    color: #170E49;
`

export const ContainerVersion = styled.View`
    height: 60px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0;
    margin: 0 auto;
   
`

export const TextSpanVersion = styled.Text`
    font-size: 12px;
    margin-top: -10px;
    margin-bottom: 20px;
    font-weight: 300;
    font-style: italic;
    color: #170E49;

`