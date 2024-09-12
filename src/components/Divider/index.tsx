import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface DividerProps {
  thickness?: number; // Espessura da linha
  color?: string; // Cor da linha
  marginVertical?: number; // Margem vertical ao redor da linha
  style?: ViewStyle; // Estilo adicional
}

const Divider: React.FC<DividerProps> = ({
  thickness = 1, 
  color = 'rgba(0, 0, 0, 0.2)', 
  marginVertical = 10, 
  style
}) => {
  return (
    <View
      style={[
        styles.divider,
        {
          height: thickness,
          backgroundColor: color,
          marginVertical: marginVertical,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});

export default Divider;
