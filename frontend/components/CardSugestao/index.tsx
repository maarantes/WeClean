import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import InicioIcon from "../../../assets/images/inicio.svg";
import CalendarioIcon from "../../../assets/images/calendario.svg";
import PatinhaIcon from "../../../assets/images/patinha.svg";
import EscudoIcon from "../../../assets/images/escudo.svg";
import { StyleSheet } from "react-native";

interface CardSugestaoProps {
  tipo: string;
  area: string;
  titulo: string;
  frequencia: string;
  selecionado: boolean;
  onSelecionar: () => void;
}


const CardSugestao: React.FC<CardSugestaoProps> = ({
  tipo,
  area,
  titulo,
  frequencia,
  selecionado,
  onSelecionar
}) => {

  let corFundo: string;
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
    default:
      corFundo = "#C4C4C4"
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

  return (
<TouchableOpacity onPress={onSelecionar}>
  <View style={[styles.card_container]}>
    {selecionado && (
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            borderWidth: 2,
            borderColor: corFundo,
            borderRadius: 8,
          },
        ]}
        pointerEvents="none"
      />
    )}

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
  </View>
</TouchableOpacity>

  );
};

export default CardSugestao;