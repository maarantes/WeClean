import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import Badge from "../Badge";
import { globalStyles } from "../../globalStyles";

import ConcluirIcon from "../../../assets/images/concluir.svg";
import AlarmeIcon from "../../../assets/images/alarme.svg";
import RelogioIcon from "../../../assets/images/relogio.svg";

interface CardTarefaProps {
  horario: string;
  exibirBotaoConcluir?: boolean;
}

const CardTarefa: React.FC<CardTarefaProps> = ({ horario, exibirBotaoConcluir = true }) => {
  const [concluido, setConcluido] = useState(false);

  const handlePress = () => {
    setConcluido(!concluido);
  };

  return (
    <View style={styles.container}>
      <View style={styles.container_cima}>
        <Text style={globalStyles.textoNormal}>Passar Aspirador</Text>
        <AlarmeIcon width={16} height={16} />
      </View>

      <View style={styles.container_baixo}>
        <View style={styles.container_info}>
          <Badge backgroundColor="#CAEAFB" iconColor="#144F70" text="Marco" />
        </View>

        <View style={styles.container_info_dir}>
          <View style={styles.container_info_relogio}>
            <RelogioIcon width={16} height={16} />
            <Text style={styles.cor_80_normal}>{horario}</Text> {/* Horário dinâmico */}
          </View>

          {/* Exibir ou não o botão "Concluir" */}
          {exibirBotaoConcluir && (
            <TouchableOpacity
              style={[
                styles.botao_concluir,
                concluido && styles.botao_concluido,
              ]}
              onPress={handlePress}
            >
              <ConcluirIcon width={12} height={12} color={concluido ? "#FFFFFF" : "#606060"} />
              <Text style={[styles.cor_80, concluido && styles.cor_white]}>
                {concluido ? "Concluído" : "Concluir"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default CardTarefa;