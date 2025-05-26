import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { notificacaoConfig } from "./config";
import { useTema } from "@/frontend/hooks/useTema";

interface CardNotificacaoProps {
  tipo: "add_comentario" | "add_tarefa" | "removido_tarefa" |"editado_tarefa" | "removido_grupo" | "excluido_grupo"
  nomeTarefa?: string;
  data?: string;
  nomeGrupo?: string;
}

export const CardNotificacao: React.FC<CardNotificacaoProps> = ({ tipo }) => {
  const config = notificacaoConfig[tipo];
  const Icone = config?.Icone;

  const { temaUsuario, aplicarTemaApp, getTemaStyle } = useTema();
  const { bgClass, colorClass } = getTemaStyle(temaUsuario);

  if (!config) return null;

  return (
    <View style={styles.card_container}>
      <View style={styles.card_cima}>
        <View style={[styles.card_icon, { backgroundColor: bgClass.backgroundColor }]}>

          <Icone width={18} height={18} strokeWidth={2} color={"white"} />
        </View>
        <Text style={styles.card_titulo}>{config.titulo}</Text>
      </View>
      <Text style={styles.card_descricao}>{config.descricao}</Text>
    </View>
  );
};
