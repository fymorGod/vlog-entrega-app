import React from "react";
import { Entypo } from "@expo/vector-icons";
import { TouchableOpacityProps } from "react-native";
import { Container, Title } from "./styles";

interface Props extends TouchableOpacityProps {
    title: string;
    icon: React.ComponentProps<typeof Entypo>['name'];
}

export function ButtonCamera({ title, icon, ...rest }: Props) {
    return (
        <Container {...rest}>
            <Entypo name={icon} size={28} color='#170E49' />
            <Title>{title}</Title>
        </Container>
    )
}
