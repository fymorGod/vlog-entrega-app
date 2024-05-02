import { useState } from "react";
import { TextInputProps } from "react-native";
import { Feather } from '@expo/vector-icons';
import { Container, IconContainer, InputText } from "./styles";

export type InputProps = TextInputProps & {
    icon: React.ComponentProps<typeof Feather>['name'];
    value?: string;
  }
  
  export function Input({ icon, value, ...rest }: InputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
  
    const handleInputFocus = () => {
      setIsFocused(true);
    }
    const handleInputBlur = () => {
      setIsFocused(false);
      setIsFilled(!!value)
    }
  
    return (
      <Container >
        <IconContainer isFocused={isFocused}>
          <Feather
            name={icon}
            size={24}
            color={(isFocused || isFilled) ? '#170E49' : '#AEAEB3'}
          />
        </IconContainer>
  
        <InputText
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          isFocused={isFocused}
          value={value}
          {...rest}
        />
      </Container>
    )
}