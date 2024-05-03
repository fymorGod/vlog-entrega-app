import styled from 'styled-components/native';
interface ContainerProps {
  disabled?: boolean; 
}
export const Container = styled.TouchableOpacity<ContainerProps>`
  width: 80%;
  height: 60px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  border-radius: 10px;
  margin: 0 auto;
  border: 2px dashed  #170E49;
  opacity: ${(props:any) => (props.disabled ? 0.6 : 1)};
`;

export const Title = styled.Text`
  font-size: 16px;
  color: #170E49;
  font-weight: bold;
  margin-left: 10px;
`;