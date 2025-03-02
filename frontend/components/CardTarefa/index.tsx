import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

import { styles } from "./styles";
import { globalStyles } from "../../globalStyles";

import ConcluirIcon from "../../../assets/images/concluir.svg";
import AlarmeIcon from "../../../assets/images/alarme.svg";
import RelogioIcon from "../../../assets/images/relogio.svg";
import CalendarioIcon from "../../../assets/images/calendario_mini.svg";

import Badge from "../Badge";

interface CardTarefaProps {
  horario: string;
  exibirBotao?: boolean;
  freq_semanal?: string;
  freq_intervalo?: string;
  freq_anual?: string;
}

const CardTarefa: React.FC<CardTarefaProps> = ({ horario, exibirBotao = true, freq_semanal, freq_anual, freq_intervalo }) => {
  const [concluido, setConcluido] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    setConcluido(!concluido);
  };

  return (
    <View style={styles.container}>
      <View style={styles.container_cima}>
        <Text style={globalStyles.textoNormal}>Passar Aspirador</Text>
        <AlarmeIcon width={16} height={16} color="#606060" />
      </View>

      <View style={styles.container_baixo}>
        <View style={styles.container_info}>
          <Badge backgroundColor="#CAEAFB" iconColor="#144F70" text="Marco" />
        </View>

        <View style={styles.container_info_dir}>
          
          <View style={styles.container_info_relogio}>
            <RelogioIcon width={16} height={16} color="#606060" />
            <Text style={styles.cor_80_normal}>{horario}</Text>
          </View>

          {freq_semanal && (
            <TouchableOpacity style={styles.container_info_relogio} onPress={() => setModalVisible(true)}>
              <CalendarioIcon width={16} height={16} color="#5A189A" />
              <Text style={[styles.cor_80_normal, styles.roxo]}>Ver dias</Text>
            </TouchableOpacity>
          )}

          {freq_intervalo && (
            <View style={styles.container_info_relogio}>
              <CalendarioIcon width={16} height={16} color="#606060" />
              <Text style={styles.cor_80_normal}>A cada {freq_intervalo} dias</Text>
            </View>
          )}

          {freq_anual && (
            <TouchableOpacity style={styles.container_info_relogio} onPress={() => setModalVisible(true)}>
              <CalendarioIcon width={16} height={16} color="#5A189A" />
              <Text style={[styles.cor_80_normal, styles.roxo]}>Ver datas</Text>
            </TouchableOpacity>
          )}

          {/* Botão de Concluir */}
          {exibirBotao && (
            <TouchableOpacity
              style={[
                styles.botao_concluir,
                concluido ? styles.botao_concluido : null,
              ]}
              onPress={handlePress}
            >
              <ConcluirIcon width={12} height={12} color={concluido ? "#FFFFFF" : "#606060"} />
              <Text style={[styles.cor_80, concluido ? styles.cor_white : null]}>
                {concluido ? "Concluído" : "Concluir"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropColor="#404040"
        backdropOpacity={0.5}
        style={styles.modal_container}>

        <View style={styles.modal_content}>
          <Text style={[globalStyles.titulo, styles.titulo_menor]}>{freq_anual ? "Datas Selecionadas" : "Dias Selecionados"}</Text>

          {freq_semanal &&
          <Text style={styles.texto_modal}>{freq_semanal}</Text>
          }

          {freq_anual &&
          <Text style={styles.texto_modal_anual}>{freq_anual}</Text>
          }

          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.botao_fechar}>
            <Text style={styles.botao_fechar_texto}>Fechar</Text>
          </TouchableOpacity>
        </View>

      </Modal>
    </View>
  );
};

export default CardTarefa;