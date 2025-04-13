import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";

import { styles } from "./styles";
import { globalStyles } from "../../globalStyles";

import ConcluirIcon from "../../../assets/images/concluir.svg";
import AlarmeIcon from "../../../assets/images/alarme.svg";
import RelogioIcon from "../../../assets/images/relogio.svg";
import FecharIcon from "../../../assets/images/fechar.svg";
import EditarIcon from "../../../assets/images/editar.svg";
import ExcluirIcon from "../../../assets/images/excluir.svg";

import Badge from "../Badge";
import { excluirTarefa } from "../../../backend/services/tarefas/excluirTarefa";
import { useNavigation, NavigationProp } from '@react-navigation/native';

interface Integrante {
  nome: string;
  cor_primaria: string;
  cor_secundaria: string;
}

interface CardTarefaProps {
  id: string;
  nome: string;
  descricao?: string;
  horario?: string;
  alarme?: boolean;
  exibirBotao?: boolean;
  freq_texto?: string;
  menor?: boolean;
  integrantes?: Integrante[];
  dataInstancia?: string;
  concluido?: boolean;
  onUpdateConcluido?: (dataInstancia: string, novoValor: boolean) => void;
  onTaskDeleted?: () => void;
}

type RootStackParamList = {
  CriarTarefa: {
    task: {
      id: string;
      nome: string;
      descricao?: string;
      horario?: string;
      alarme: boolean;
      freq_texto?: string;
      integrantes: Integrante[];
      dataInstancia?: string;
      concluido?: boolean;
    };
    dataReferencia: string;
  };
};

const converterDias = (dias: number[]): string => {
  const mapDias: Record<number, string> = {
    0: "DOM",
    1: "SEG",
    2: "TER",
    3: "QUA",
    4: "QUI",
    5: "SEX",
    6: "SAB"
  };
  return dias.map((dia: number) => mapDias[dia]).join(", ");
};

export const FrequenciaModalTexto = (frequencia: any) => {
  if (!frequencia) return "Diariamente";
  switch (frequencia.tipo) {
    case "semanal": {
      const dias = frequencia.diasSemana ? converterDias(frequencia.diasSemana) : "";
      return `Semanalmente: ${dias}`;
    }
    case "intervalo": {
      return `Intervalo: A cada ${frequencia.intervaloDias} dias`;
    }
    case "anualmente": {
      const datas = frequencia.datasEspecificas ? frequencia.datasEspecificas.join("  ·  ") : "";
      return `Anualmente: ${datas}`;
    }
    default:
      return "Diariamente";
  }
};

const CardTarefa: React.FC<CardTarefaProps> = ({
  id,
  nome,
  descricao,
  horario,
  alarme = false,
  exibirBotao = true,
  freq_texto,
  menor = false,
  integrantes = [],
  dataInstancia,
  concluido,
  onUpdateConcluido,
  onTaskDeleted
}) => {

  const [isCardModalVisible, setCardModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [lastAction, setLastAction] = useState<"concluido" | "desmarcado" | null>(null);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dataKey = dataInstancia;
  const tarefa = { id, nome, descricao, horario, alarme, freq_texto, integrantes, dataInstancia, concluido };

  const handlePress = () => {

    if (!dataInstancia) return;

    // Se não concluída, marca como concluída e exibe o alerta; se já estiver concluída, desmarca.
    if (!concluido) {
      onUpdateConcluido?.(dataInstancia, true);
      setAlertMessage("Você concluiu a tarefa");
      setLastAction("concluido");
      setShowAlert(true);
    } else {
      onUpdateConcluido?.(dataInstancia, false);
      setAlertMessage("A tarefa foi desmarcada como concluída");
      setLastAction("desmarcado");
      setShowAlert(true);
    }
  };
  
  return (
    <>
      <TouchableOpacity 
        style={[styles.container, menor && styles.menor]} 
        onPress={() => setCardModalVisible(true)}
        activeOpacity={0.5}>
        <View style={styles.container_cima}>
          <Text  
            numberOfLines={1} 
            ellipsizeMode="tail"
            style={[globalStyles.textoNormal, menor && styles.texto_menor]}>
          {nome}
          </Text>
          <AlarmeIcon 
            width={16} 
            height={16} 
            color="#606060" 
            style={(!alarme || menor) && styles.none} 
          />
        </View>

        <View style={styles.container_baixo}>
          <View style={styles.container_info}>
            {integrantes.length > 0 && (
              <>
                <Badge
                  backgroundColor={integrantes[0].cor_primaria}
                  iconColor={integrantes[0].cor_secundaria}
                  text={integrantes[0].nome}
                  isSelected={true}
                />
                {integrantes.length > 1 && (
                  <Text style={styles.texto_integrantes_extras}>
                    +{integrantes.length - 1}
                  </Text>
                )}
              </>
            )}
          </View>

          <View style={styles.container_info_dir}>
            <View style={[styles.container_info_relogio, menor && styles.none]}>
              <RelogioIcon width={16} height={16} color="#606060" />
              <Text style={styles.cor_80_normal}>{horario}</Text>
            </View>

            {exibirBotao && (
              <TouchableOpacity
              style={[styles.botao_concluir, concluido ? styles.botao_concluido : null]}
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
          isVisible={isCardModalVisible}
          onBackButtonPress={() => setCardModalVisible(false)}
          onBackdropPress={() => setCardModalVisible(false)}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          backdropColor="#404040"
          backdropOpacity={0.5}
          style={{ margin: 0, justifyContent: "flex-end" }}> 
          <View style={styles.modal_container_descricao}>
            <View>
              <View style={styles.detalhe_cima_topo}>
                <TouchableOpacity onPress={() => setCardModalVisible(false)} style={styles.modal_notch}>
                </TouchableOpacity>
              </View>
              <View style={styles.detalhe_cima}>
              <Text style={[globalStyles.titulo, styles.titulo_menor]}>
                Detalhes da Tarefa
              </Text>
              <TouchableOpacity onPress={() => setCardModalVisible(false)}>
                <FecharIcon width={32} height={32} color={"#404040"}/>
              </TouchableOpacity>
              </View>
            </View>

            <View style={styles.detalhe_botoes}>
              <TouchableOpacity style={styles.detalhe_botao_excluir} onPress={() => {setConfirmModalVisible(true); setCardModalVisible(false);}}>
                <ExcluirIcon width={24} height={24} />
                <Text style={styles.detalhe_botao_excluir_texto}>Excluir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.detalhe_botao_editar} onPress={() => {
              if (dataKey) {
              navigation.navigate("CriarTarefa", { task: tarefa, dataReferencia: dataKey });
              setCardModalVisible(false)
              } else {
                console.error("DataKey não foi importado.");
              }}}>
                <EditarIcon width={24} height={24} color={"#5A189A"}/>
                <Text style={styles.detalhe_botao_editar_texto}>Editar</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modal_scroll}>
              <View style={styles.detalhe_secao}>
                <Text style={styles.detalhe_campo_titulo}>NOME</Text>
                <Text style={styles.detalhe_campo_texto}>{nome}</Text>
              </View>

              <View style={styles.detalhe_secao}>
                <Text style={styles.detalhe_campo_titulo}>DESCRIÇÃO</Text>
                <Text style={descricao === "Não há descrição para esta tarefa." ? styles.detalhe_campo_texto_cinza : styles.detalhe_campo_texto_descricao}>
                {descricao}
                </Text>

              </View>

              <View style={styles.detalhe_secao}>
                <Text style={styles.detalhe_campo_titulo}>HORÁRIO E ALARME</Text>
                <View style={styles.flex_row_between}>
                  <View style={styles.flex_row}>
                    <RelogioIcon width={16} height={16} strokeWidth={1.5} color="#808080" />
                    <Text style={styles.detalhe_campo_texto_horario}>{horario}</Text>
                  </View>
                  <Text style={[styles.detalhe_campo_texto_cinza, alarme && styles.alarme_ativado]}>
                    {alarme ? "Alarme ativado" : "Sem Alarme"}
                  </Text>
                </View>
              </View>

              <View style={styles.detalhe_secao}>
                <Text style={styles.detalhe_campo_titulo}>INTEGRANTES</Text>
                <View style={styles.flex_wrap}>
                  {integrantes.map((integrante, index) => (
                    <Badge
                      key={index}
                      backgroundColor={integrante.cor_primaria}
                      iconColor={integrante.cor_secundaria}
                      text={integrante.nome}
                      isSelected={true}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.detalhe_secao}>
                <Text style={styles.detalhe_campo_titulo}>FREQUÊNCIA</Text>
                <Text style={styles.detalhe_campo_texto_cinza}>{freq_texto}</Text>
              </View>
            </ScrollView>
          </View>
        </Modal>

        {/* Modal de confirmação de exclusão */}
        <Modal
          isVisible={confirmModalVisible}
          onBackdropPress={() => setConfirmModalVisible(false)}
          backdropColor="#404040"
          backdropOpacity={0.5}
          animationIn="slideInUp"
          animationOut="slideOutDown" >
        <View style={styles.modal_exclusao_container}>
          <Text style={styles.modal_exclusao_titulo}>
            Confirmação de Exclusão
          </Text>
          <Text style={styles.modal_exclusao_texto}>
            Você tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
          </Text>
          <View style={styles.modal_exclusao_botoes}>

            <TouchableOpacity
              style={styles.modal_excluir_botao_excluir}
              onPress={async () => {
                setIsDeleting(true);
                await excluirTarefa(id);
                setConfirmModalVisible(false);
                setCardModalVisible(false);
                if (onTaskDeleted) {
                  onTaskDeleted(); // Recarrega a página
                }
              }}>
              {isDeleting ? (
              <ActivityIndicator size="small" color="#E7516E" /> ) : (
              <Text style={styles.modal_botao_excluir_texto}>Excluir Tarefa</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modal_excluir_botao_cancelar}
              onPress={() => setConfirmModalVisible(false)}
            >
              <Text style={styles.modal_botao_cancelar_texto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      </TouchableOpacity>
    </>
  );
};

export default CardTarefa;