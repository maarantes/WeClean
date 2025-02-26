import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";

import PerfilIcon from "../../../assets/images/user.svg";

interface BadgeProps {
  backgroundColor: string;
  iconColor: string;
  text: string;
  isSelected?: boolean;
  onPress?: () => void;
  clicavel?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  backgroundColor = "#F0F0F0",
  iconColor = "#606060",
  text,
  isSelected = false,
  onPress,
  clicavel = false,
}) => {
  const Component = clicavel ? TouchableOpacity : View;

  return (
    <Component
      onPress={clicavel ? onPress : undefined}
      style={[
        styles.badge,
        {
          backgroundColor: clicavel ? (isSelected ? backgroundColor : "#F5F5F5") : backgroundColor,
        },
      ]}
    >
      <PerfilIcon width={20} height={20} color={isSelected ? iconColor : "#808080"} />
      <Text
        style={[
          styles.text,
          { color: clicavel ? (isSelected ? iconColor : "#808080") : iconColor },
        ]}
      >
        {text}
      </Text>
    </Component>
  );
};

export default Badge;