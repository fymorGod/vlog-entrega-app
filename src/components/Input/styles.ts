import { TextInput } from 'react-native';
import styled, { css } from 'styled-components/native';

interface Props {
  isFocused: boolean;
}

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const IconContainer = styled.View<Props>`
  height: 56px;
  width: 55px;
  justify-content: center;
  align-items: center;
  margin-right: 2px;
  background-color: #FFFFFF; 
  margin-bottom: 20px;

`;


export const InputText = styled(TextInput) <Props>`
  width: 65%;
  height: 56px;
  background-color: #FFFFFF;
  color: #7A7A80;
  padding: 10px 23px; 
  margin-bottom: 20px;
`;