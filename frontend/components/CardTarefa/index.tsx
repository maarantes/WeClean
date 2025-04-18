import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { auth } from "@/backend/services/shared/firebaseConfig";

import { styles } from "./styles";
import { globalStyles } from "../../globalStyles";
import Badge from "../Badge";

import ConcluirIcon from "../../../assets/images/concluir.svg";
import AlarmeIcon from "../../../assets/images/alarme.svg";
import RelogioIcon from "../../../assets/images/relogio.svg";
import FecharIcon from "../../../assets/images/fechar.svg";
import EditarIcon from "../../../assets/images/editar.svg";
import ExcluirIcon from "../../../assets/images/excluir.svg";

import { excluirTarefa } from "../../../backend/services/tarefas/excluirTarefa";

interface Integrante {
  uid: string; // ADICIONADO aqui
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
    task: any;
    dataReferencia: string;
  };
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
  onTaskDeleted,
}) => {
  const [isCardModalVisible, setCardModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dataKey = dataInstancia;

  const uidAtual = auth.currentUser?.uid;

  // Ordenar integrantes: primeiro o usuário logado, depois ordem alfabética
  let integrantesOrdenados = [...(integrantes || [])];

  if (uidAtual) {
    const indexUsuarioAtual = integrantesOrdenados.findIndex((i) => i.uid === uidAtual);
    if (indexUsuarioAtual > -1) {
      const [usuarioAtual] = integrantesOrdenados.splice(indexUsuarioAtual, 1);
      integrantesOrdenados = [usuarioAtual, ...integrantesOrdenados];
    }
  }

  const handleConcluirPress = () => {
    if (!dataInstancia) return;
    if (onUpdateConcluido) {
      onUpdateConcluido(dataInstancia, !concluido);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, menor && styles.menor]}
        onPress={() => setCardModalVisible(true)}
        activeOpacity={0.5}
      >
        {/* Cima */}
        <View style={styles.container_cima}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={[globalStyles.textoNormal, menor && styles.texto_menor]}>
            {nome}
          </Text>
          {alarme && !menor && (
            <AlarmeIcon width={16} height={16} color="#606060" />
          )}
        </View>

        {/* Baixo */}
        <View style={styles.container_baixo}>
          <View style={styles.container_info}>
            {integrantesOrdenados.length > 0 && (
              <>
                <Badge
                  backgroundColor={integrantesOrdenados[0].cor_primaria}
                  iconColor={integrantesOrdenados[0].cor_secundaria}
                  text={integrantesOrdenados[0].nome}
                  isSelected={true}
                />
                {integrantesOrdenados.length > 1 && (
                  <Text style={styles.texto_integrantes_extras}>+{integrantesOrdenados.length - 1}</Text>
                )}
              </>
            )}
          </View>

          <View style={styles.container_info_dir}>
            {!menor && (
              <View style={styles.container_info_relogio}>
                <RelogioIcon width={16} height={16} color="#606060" />
                <Text style={styles.cor_80_normal}>{horario}</Text>
              </View>
            )}

            {exibirBotao && (
              <TouchableOpacity
                style={[styles.botao_concluir, concluido ? styles.botao_concluido : null]}
                onPress={handleConcluirPress}
              >
                <ConcluirIcon width={12} height={12} color={concluido ? "#FFFFFF" : "#606060"} />
                <Text style={[styles.cor_80, concluido && styles.cor_white]}>
                  {concluido ? "Concluído" : "Concluir"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Modal de detalhes */}
        <Modal
          isVisible={isCardModalVisible}
          onBackdropPress={() => setCardModalVisible(false)}
          onBackButtonPress={() => setCardModalVisible(false)}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          backdropColor="#404040"
          backdropOpacity={0.5}
          style={{ margin: 0, justifyContent: "flex-end" }}
        >
          <View style={styles.modal_container_descricao}>
            <View style={styles.detalhe_cima}>
              <Text style={[globalStyles.titulo, styles.titulo_menor]}>Detalhes da Tarefa</Text>
              <TouchableOpacity onPress={() => setCardModalVisible(false)}>
                <FecharIcon width={32} height={32} color={"#404040"} />
              </TouchableOpacity>
            </View>

            {/* Botões */}
            <View style={styles.detalhe_botoes}>
              <TouchableOpacity
                style={styles.detalhe_botao_excluir}
                onPress={() => {
                  setConfirmModalVisible(true);
                  setCardModalVisible(false);
                }}
              >
                <ExcluirIcon width={24} height={24} />
                <Text style={styles.detalhe_botao_excluir_texto}>Excluir</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.detalhe_botao_editar}
                onPress={() => {
                  if (dataKey) {
                    navigation.navigate("CriarTarefa", { task: { id, nome, descricao, horario, alarme, freq_texto, integrantes }, dataReferencia: dataKey });
                    setCardModalVisible(false);
                  }
                }}
              >
                <EditarIcon width={24} height={24} color="#5A189A" />
                <Text style={styles.detalhe_botao_editar_texto}>Editar</Text>
              </TouchableOpacity>
            </View>

            {/* Conteúdo do Modal */}
            <ScrollView contentContainerStyle={styles.modal_scroll}>
              {/* Nome */}
              <View style={styles.detalhe_secao}>
                <Text style={styles.detalhe_campo_titulo}>NOME</Text>
                <Text style={styles.detalhe_campo_texto}>{nome}</Text>
              </View>

              {/* Descrição */}
              <View style={styles.detalhe_secao}>
                <Text style={styles.detalhe_campo_titulo}>DESCRIÇÃO</Text>
                <Text style={descricao ? styles.detalhe_campo_texto_descricao : styles.detalhe_campo_texto_cinza}>
                  {descricao || "Não há descrição para esta tarefa."}
                </Text>
              </View>

              {/* Horário */}
              <View style={styles.detalhe_secao}>
                <Text style={styles.detalhe_campo_titulo}>HORÁRIO E ALARME</Text>
                <View style={styles.flex_row_between}>
                  <View style={styles.flex_row}>
                    <RelogioIcon width={16} height={16} color="#808080" />
                    <Text style={styles.detalhe_campo_texto_horario}>{horario}</Text>
                  </View>
                  <Text style={[styles.detalhe_campo_texto_cinza, alarme && styles.alarme_ativado]}>
                    {alarme ? "Alarme ativado" : "Sem alarme"}
                  </Text>
                </View>
              </View>

              {/* Integrantes */}
              <View style={styles.detalhe_secao}>
                <Text style={styles.detalhe_campo_titulo}>INTEGRANTES</Text>
                <View style={styles.flex_wrap}>
                  {integrantesOrdenados
                    .slice()
                    .sort((a, b) => a.nome.localeCompare(b.nome))
                    .map((i, idx) => (
                      <Badge
                        key={idx}
                        backgroundColor={i.cor_primaria}
                        iconColor={i.cor_secundaria}
                        text={i.nome}
                        isSelected={true}
                      />
                  ))}
                </View>
              </View>

              {/* Frequência */}
              {freq_texto && (
                <View style={styles.detalhe_secao}>
                  <Text style={styles.detalhe_campo_titulo}>FREQUÊNCIA</Text>
                  <Text style={styles.detalhe_campo_texto_cinza}>{freq_texto}</Text>
                </View>
              )}
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
          animationOut="slideOutDown"
        >
          <View style={styles.modal_exclusao_container}>
            <Text style={styles.modal_exclusao_titulo}>Confirmação de Exclusão</Text>
            <Text style={styles.modal_exclusao_texto}>Tem certeza que deseja excluir esta tarefa?</Text>

            <View style={styles.modal_exclusao_botoes}>
              <TouchableOpacity
                style={styles.modal_excluir_botao_excluir}
                onPress={async () => {
                  setIsDeleting(true);
                  await excluirTarefa(id);
                  setConfirmModalVisible(false);
                  setCardModalVisible(false);
                  onTaskDeleted?.();
                }}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#E7516E" />
                ) : (
                  <Text style={styles.modal_botao_excluir_texto}>Excluir</Text>
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