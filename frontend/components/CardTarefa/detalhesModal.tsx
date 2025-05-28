import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import Modal from "react-native-modal";
import { globalStyles } from "../../globalStyles";
import { styles } from "./styles";
import RelogioIcon from "../../../assets/images/relogio.svg";
import FecharIcon from "../../../assets/images/fechar.svg";
import EditarIcon from "../../../assets/images/editar.svg";
import ExcluirIcon from "../../../assets/images/excluir.svg";
import ComentarIcon from "../../../assets/images/comentar.svg";
import Badge from "../Badge";
import CaixaComentario from "../Comentario";
import { useTema } from "@/frontend/hooks/useTema";
import { Timestamp } from "firebase/firestore";

interface DetalhesModalProps {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onOpenComment: () => void;
  aba: "detalhes" | "comentarios";
  setAba: (aba: "detalhes" | "comentarios") => void;
  tarefa: {
    nome: string;
    descricao?: string;
    horario?: string;
    alarme?: boolean;
    freq_texto?: string;
    integrantesOrdenados: Array<{ nome: string; cor_primaria: string; cor_secundaria: string }>;
  };
  comentarios: Array<{ id: string; nomeUsuario: string; cor_primaria: string; 
  cor_secundaria: string; dataCriacao: Timestamp; content: string }>;
  semComentarios?: boolean;
}

export function DetalhesModal({
  visible,
  onClose,
  onDelete,
  onEdit,
  onOpenComment,
  aba,
  setAba,
  tarefa,
  comentarios,
  semComentarios
}: DetalhesModalProps) {
  const { nome, descricao, horario, alarme, freq_texto, integrantesOrdenados } = tarefa;
  const { temaUsuario, getTemaStyle } = useTema();
  const { bgClass, colorClass } = getTemaStyle(temaUsuario);

  return (
    <Modal
      isVisible={visible}
      statusBarTranslucent={true}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      style={{ margin: 0, justifyContent: "flex-end" }}
      customBackdrop={<View style={{ backgroundColor: "#404040", ...Dimensions.get("screen") }} />}
    >
      <View style={styles.modal_container_descricao}>
        {/* Cabeçalho */}
        <View style={styles.detalhe_cima}>
          <Text style={[globalStyles.titulo, styles.titulo_menor]}>
            Detalhes da Tarefa
          </Text>
          <TouchableOpacity onPress={onClose}>
            <FecharIcon width={32} height={32} color="#404040" />
          </TouchableOpacity>
        </View>

        {/* Botões de Ações */}
        <View style={styles.detalhe_botoes}>
            {aba === "detalhes" ? (
                <>  
                <TouchableOpacity style={styles.detalhe_botao_excluir} onPress={onDelete}>
                    <ExcluirIcon width={24} height={24} color="#C22E63" />
                    <Text style={styles.detalhe_botao_excluir_texto}>Excluir</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.detalhe_botao_editar} onPress={onEdit}>
                    <EditarIcon width={24} height={24} color="white" />
                    <Text style={styles.detalhe_botao_editar_texto}>Editar</Text>
                </TouchableOpacity>
                </>
            ) : (
                <TouchableOpacity style={[styles.detalhe_botao_comentar, bgClass]} onPress={onOpenComment}>
                    <ComentarIcon width={24} height={24} color={colorClass.color} />
                    <Text style={[styles.detalhe_botao_comentar_texto, { color: colorClass.color }]}>Escrever Comentário</Text>
                </TouchableOpacity>
            )}
        </View>

        {/* Abas */}
        {!semComentarios && (
        <View style={styles.parte_abas}>
            <TouchableOpacity
            style={[styles.aba_opcao, aba !== "detalhes" && styles.desativado]}
            onPress={() => setAba("detalhes")}
            >
            <Text
                style={[
                styles.aba_opcao_texto,
                aba !== "detalhes" && styles.desativado_texto,
                ]}
            >
                Detalhes
            </Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={[styles.aba_opcao, aba !== "comentarios" && styles.desativado]}
            onPress={() => setAba("comentarios")}
            >
            <Text
                style={[
                styles.aba_opcao_texto,
                aba !== "comentarios" && styles.desativado_texto,
                ]}
            >
                Comentários{comentarios.length > 0 && ` (${comentarios.length.toString().padStart(2,'0')})`}
            </Text>
            </TouchableOpacity>
        </View>
        )}

        {/* Conteúdo das Abas */}
        {aba === "detalhes" ? (
          <ScrollView contentContainerStyle={styles.modal_scroll}>
            {/* Nome */}
            <View style={styles.detalhe_secao}>
              <Text style={styles.detalhe_campo_titulo}>NOME</Text>
              <Text style={styles.detalhe_campo_texto}>{nome}</Text>
            </View>
            {/* Descrição */}
            <View style={styles.detalhe_secao}>
              <Text style={styles.detalhe_campo_titulo}>DESCRIÇÃO</Text>
              <Text
                style={
                  descricao
                    ? styles.detalhe_campo_texto_descricao
                    : styles.detalhe_campo_texto_cinza
                }
              >
                {descricao ?? "Não há descrição para esta tarefa."}
              </Text>
            </View>
            {/* Horário e Alarme */}
            <View style={styles.detalhe_secao}>
              <Text style={styles.detalhe_campo_titulo}>HORÁRIO E ALARME</Text>
              <View style={styles.flex_row_between}>
                <View style={styles.flex_row}>
                  <RelogioIcon width={16} height={16} color="#808080" strokeWidth={1.5} />
                  <Text style={styles.detalhe_campo_texto_horario}>{horario}</Text>
                </View>
                <Text
                  style={[
                    styles.detalhe_campo_texto_cinza,
                    alarme && styles.alarme_ativado,
                  ]}
                >
                  {alarme ? "Alarme ativado" : "Sem alarme"}
                </Text>
              </View>
            </View>
            {/* Integrantes */}
            <View style={styles.detalhe_secao}>
              <Text style={styles.detalhe_campo_titulo}>INTEGRANTES</Text>
              <View style={styles.flex_wrap}>
                {integrantesOrdenados.map((i, idx) => (
                  <Badge
                    key={idx}
                    backgroundColor={i.cor_primaria}
                    iconColor={i.cor_secundaria}
                    text={i.nome}
                    isSelected
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
        ) : (
          <ScrollView>
            {/* Comentários */}
            {comentarios.length > 0 ? (
              comentarios.map(c => (
                <CaixaComentario
                  key={c.id}
                  nome_usuario={c.nomeUsuario}
                  cor_primaria={c.cor_primaria}
                  cor_secundaria={c.cor_secundaria}
                  data_criacao={c.dataCriacao}
                  conteudo={c.content}
                />
              ))
            ) : (
              <Text style={styles.sem_comentarios_texto}>Ainda não há comentários.</Text>
            )}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}