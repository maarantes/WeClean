import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/backend/services/shared/firebaseConfigApp";

import { styles } from "./styles";
import { globalStyles } from "../../globalStyles";
import Badge from "../Badge";

import RelogioIcon from "../../../assets/images/relogio.svg";
import AlarmeIcon from "../../../assets/images/alarme.svg";
import ConcluirIcon from "../../../assets/images/concluir.svg";

import { excluirTarefa } from "../../../backend/services/tarefas/excluirTarefa";
import { useComentarios } from "./useCardTarefa";
import { DetalhesModal } from "./detalhesModal";
import ComentarioModal from "../ModalComentar";
import { DeleteConfirmationModal } from "./excluirTarefaModal";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/frontend/routes";

export interface Integrante {
  uid: string;
  nome: string;
  cor_primaria: string;
  cor_secundaria: string;
}

export interface CardTarefaProps {
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
  semComentarios?: boolean;
  instanceId: string;
}

export const CardTarefa: React.FC<CardTarefaProps> = ({
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
  concluido = false,
  onUpdateConcluido,
  onTaskDeleted,
  semComentarios,
  instanceId,
}) => {
  const [openDetalhes, setOpenDetalhes] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [aba, setAba] = useState<"detalhes" | "comentarios">("detalhes");
  const [openCommentModal, setOpenCommentModal] = useState(false);

  type CriarTarefaNav = StackNavigationProp<RootStackParamList, "CriarTarefa">;
  const navigation = useNavigation<CriarTarefaNav>();
  const dataKey = dataInstancia!;

  const { comentarios, fetchComentarios } = useComentarios(instanceId, openDetalhes);

  useEffect(() => {
  if (openDetalhes) {
    setAba("detalhes");
  }
}, [openDetalhes]);

  const uidAtual = auth.currentUser?.uid;
  let integrantesOrdenados = [...integrantes];
  if (uidAtual) {
    const idx = integrantesOrdenados.findIndex(i => i.uid === uidAtual);
    if (idx > -1) {
      const [me] = integrantesOrdenados.splice(idx, 1);
      integrantesOrdenados = [me, ...integrantesOrdenados];
    }
  }

  const handleConcluirPress = () => {
    if (dataInstancia && onUpdateConcluido) {
      onUpdateConcluido(dataInstancia, !concluido);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, menor && styles.menor]}
        onPress={() => setOpenDetalhes(true)}
        activeOpacity={0.5}
      >
        <View style={styles.container_cima}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[globalStyles.textoNormal, menor && styles.texto_menor]}
          >
            {nome}
          </Text>
          {alarme && !menor && <AlarmeIcon width={16} height={16} color="#606060" />}
        </View>

        <View style={styles.container_baixo}>
          <View style={styles.container_info}>
            {integrantesOrdenados.length > 0 ? (
              <>
                <Badge
                  backgroundColor={integrantesOrdenados[0].cor_primaria}
                  iconColor={integrantesOrdenados[0].cor_secundaria}
                  text={integrantesOrdenados[0].nome}
                  isSelected
                />
                {integrantesOrdenados.length > 1 && (
                  <Text style={styles.texto_integrantes_extras}>
                    +{integrantesOrdenados.length - 1}
                  </Text>
                )}
              </>
            ) : (
              <Text style={styles.badge_ninguem}>Ninguém</Text>
            )}
          </View>

          <View style={styles.container_info_dir}>
            <View style={styles.container_info_relogio}>
              <RelogioIcon width={16} height={16} color="#606060" />
              <Text style={styles.cor_80_normal}>{horario}</Text>
            </View>

            {exibirBotao && (
              <TouchableOpacity
                style={[
                  styles.botao_concluir,
                  concluido ? styles.botao_concluido : null,
                ]}
                onPress={handleConcluirPress}
              >
                <ConcluirIcon
                  width={12}
                  height={12}
                  color={concluido ? "#FFFFFF" : "#606060"}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <DetalhesModal
          visible={openDetalhes}
          onClose={() => setOpenDetalhes(false)}
          onDelete={() => {
            setOpenDetalhes(false);
            setOpenDelete(true);
          }}
          onEdit={async () => {
            const ref = doc(db, "Tarefas", id);
            const snap = await getDoc(ref);
            if (snap.exists()) {
              navigation.navigate("CriarTarefa", {
                task: snap.data(),
                dataReferencia: dataKey,
              });
            }
            setOpenDetalhes(false);
          }}
          onOpenComment={() => setOpenCommentModal(true)}
          aba={aba}
          setAba={setAba}
          tarefa={{
            nome,
            descricao,
            horario,
            alarme,
            freq_texto,
            integrantesOrdenados,
          }}
          comentarios={comentarios}
          semComentarios={semComentarios}
          
        />

        <ComentarioModal
          visible={openCommentModal}
          setVisible={setOpenCommentModal}
          instanceId={instanceId}
          onCommentAdded={() => {
            fetchComentarios();
            }
          }
        />

        <DeleteConfirmationModal
          visible={openDelete}
          loading={deleting}
          onConfirm={async () => {
            setDeleting(true);
            await excluirTarefa(id);
            setDeleting(false);
            setOpenDelete(false);
            onTaskDeleted?.();
          }}
          onCancel={() => setOpenDelete(false)}
        />
      </TouchableOpacity>
    </>
  );
};

export default CardTarefa;