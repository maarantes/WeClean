import React from "react";
import { View, Text} from "react-native";
import { styles } from "./styles";

import PerfilIcon from "../../../assets/images/user.svg";

interface BadgeProps {
  backgroundColor: string;
  iconColor: string;
  text: string;
}

const Badge: React.FC<BadgeProps> = ({
  backgroundColor = "#F0F0F0",
  iconColor = "#606060",
  text = "Pessoa",
}) => {
  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <PerfilIcon width={20} height={20} color={iconColor} />
      <Text style={[styles.text, { color: iconColor }]}>{text}</Text>
    </View>
  );
};

export default Badge;
