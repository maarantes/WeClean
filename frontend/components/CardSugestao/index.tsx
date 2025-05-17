import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import InicioIcon from "../../../assets/images/inicio.svg";
import CalendarioIcon from "../../../assets/images/calendario.svg";
import PatinhaIcon from "../../../assets/images/patinha.svg";
import EscudoIcon from "../../../assets/images/escudo.svg";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/frontend/routes";


interface CardSugestaoProps {
  tipo: string;
  area: string;
  titulo: string;
  frequencia: string; 
}
type Navigation = NavigationProp<RootStackParamList>;

const CardSugestao: React.FC<CardSugestaoProps> = ({ tipo, area, titulo, frequencia }) => {

  let corFundo;
  switch (tipo) {
    case "diariamente":
      corFundo = "#2274A5";
      break;
    case "semanalmente":
      corFundo = "#E83F6F";
      break;
    case "intervalo":
      corFundo = "#FFBF00";
      break;
    case "anualmente":
      corFundo = "#22A559";
      break;
  }

  let AreaIcon = InicioIcon;
  switch (area) {
    case "pet":
      AreaIcon = PatinhaIcon;
      break;

    case "limpeza":
      AreaIcon = InicioIcon;
      break;

    case "segurança":
      AreaIcon = EscudoIcon;
      break;
  }

  const navigation = useNavigation<Navigation>();

  const handlePress = () => {
    navigation.navigate("CriarTarefa", {
      task: {
        nome: titulo,
        frequencia: {
          tipo: tipo,
          texto: frequencia,
        },
      },
      tipo: "sugestao",
    });
  };

  return (
    <TouchableOpacity style={styles.card_container} onPress={handlePress}>
      <View style={[styles.card_esq, { backgroundColor: corFundo }]}>
        <AreaIcon width={24} height={24} color={"white"} />
      </View>
      <View style={styles.card_dir}>
        <Text style={styles.card_tarefa_nome}>{titulo}</Text>
        <View style={styles.card_dir_baixo}>
          <CalendarioIcon width={20} height={20} color={"#808080"} />
          <Text style={styles.card_frequencia}>{frequencia}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CardSugestao;
