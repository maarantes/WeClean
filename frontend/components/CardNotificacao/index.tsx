import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { notificacaoConfig } from "./config";
import { Timestamp } from "firebase/firestore";
import { formatarDataCriacao } from "@/frontend/utils/formatarDataCriacao";

interface CardNotificacaoProps {
  tipo: "add_comentario" | "add_tarefa" | "removido_tarefa" |"editado_tarefa" | "excluido_tarefa" | "removido_grupo" | "excluido_grupo"
  nomeTarefa?: string;
  data?: string;
  nomeGrupo?: string;
  dataCriacao: Timestamp;
}

export const CardNotificacao: React.FC<CardNotificacaoProps> = ({
  tipo,
  nomeTarefa,
  data,
  nomeGrupo,
  dataCriacao
}) => {
  const config = notificacaoConfig[tipo];
  const Icone = config?.Icone;

  if (!config) return null;

  const descricao =
    typeof config.descricao === "function"
      ? config.descricao({ nomeTarefa, dataCriacao, nomeGrupo })
      : config.descricao;

  return (
    <View style={styles.card_container}>
      <View style={styles.card_cima}>
        <View style={styles.card_esq}>
          <View style={styles.card_icon}>
            <Icone width={18} height={18} strokeWidth={1.75} color={"white"} />
          </View>
          <Text style={styles.card_titulo}>{config.titulo}</Text>
        </View>
        <Text style={styles.card_horario}>{formatarDataCriacao(dataCriacao)}</Text>
      </View>
      <Text style={styles.card_descricao}>{descricao}</Text>
    </View>
  );
};
