// src/frontend/pages/Tarefas/index.tsx

import React, { useCallback, useEffect, useState } from "react";
import { Text, ScrollView, TouchableOpacity, View } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { getCoresDoTema } from "@/frontend/utils/temaStyles";
import { useFocusEffect } from "@react-navigation/native";

import { styles } from "./styles";
import { globalStyles } from "@/frontend/globalStyles";

import TarefaIcon from "../../../assets/images/tarefa.svg";
import CardTarefa from "@/frontend/components/CardTarefa";
import { formatarFrequenciaTexto } from "@/frontend/utils/formatarFrequencia";
import { obterTarefas } from "../../../backend/services/tarefas/obterTarefas";
import { auth, db } from "../../../backend/services/shared/firebaseConfigApp";
import { useTema } from "@/frontend/hooks/useTema";
import PerguntaTarefaModal from "@/frontend/components/ModalPerguntaTarefa";
import PaginaWrapper from "@/frontend/components/PaginaWrapper";
import SkeletonLoaderCard from "@/frontend/components/SkeletonLoaderCard";
import AlertaSimples from "@/frontend/components/AlertaSimples";
import { useLastActionListener } from "@/frontend/hooks/useLastActionListener";

const PaginaTarefas = () => {
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [modalPerguntaTarefaVisivel, setModalPerguntaTarefaVisivel] = useState(false);
  const [loading, setLoading] = useState(true);

  const { temaUsuario, getTemaStyle } = useTema();
  const { bgClass, colorClass } = getTemaStyle(temaUsuario);

  const [alertaVisivel, setAlertaVisivel] = useState(false);
  const [mensagemAlerta, setMensagemAlerta] = useState("");

  const carregarTarefas = async () => {
    setLoading(true);
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const userRef = doc(db, "Usuarios", uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;

      const userData = userSnap.data();
      const grupoId = userData.grupoId || uid;

      const tarefasFirestore = await obterTarefas();
      const tarefasDoGrupo = tarefasFirestore.filter((t: any) => t.grupoId === grupoId);

      const tarefasComIntegrantesCompletos = await Promise.all(
        tarefasDoGrupo.map(async (t: any) => {
          const integrantesCompletos = await Promise.all(
            (t.integrantes || []).map(async (userId: string) => {
              const uRef = doc(db, "Usuarios", userId);
              const uSnap = await getDoc(uRef);
              const uData = uSnap.exists() ? uSnap.data() : { apelido: "Desconhecido", tema: "azul" };
              const { cor_primaria, cor_secundaria } = getCoresDoTema(uData.tema);
              return { uid: userId, nome: uData.apelido, cor_primaria, cor_secundaria };
            })
          );
          return { ...t, integrantes: integrantesCompletos };
        })
      );

      setTarefas(tarefasComIntegrantesCompletos);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTarefas();
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarTarefas();
    }, [])
  );

  const tarefasPorFrequencia = {
    diariamente: tarefas.filter((t) => t.frequencia?.tipo === "diariamente"),
    semanal:     tarefas.filter((t) => t.frequencia?.tipo === "semanal"),
    intervalo:   tarefas.filter((t) => t.frequencia?.tipo === "intervalo"),
    anualmente:  tarefas.filter((t) => t.frequencia?.tipo === "anualmente"),
  };

  useLastActionListener({
    create: () => {
      carregarTarefas();
      setMensagemAlerta("Tarefa criada com sucesso!");
      setAlertaVisivel(true);
    },

    edit: () => {
      carregarTarefas();
      setMensagemAlerta("Tarefa editada com sucesso!");
      setAlertaVisivel(true);
    },
    delete: () => {
      carregarTarefas();
      setMensagemAlerta("Tarefa excluída com sucesso!");
      setAlertaVisivel(true);
    },
  });

  const SecaoTarefa = ({
    titulo,
    lista,
    placeholder,
  }: {
    titulo: string;
    lista: any[];
    placeholder: string;
  }) => (
    <>
      <Text style={[globalStyles.textoNormal, globalStyles.mbottom16]}>{titulo}</Text>
      <View style={styles.container_cards}>
        {loading ? (
          <SkeletonLoaderCard />
        ) : lista.length > 0 ? (
          lista.map((tarefa, index) => (
            <CardTarefa
              key={index}
              id={tarefa.id}
              nome={tarefa.nome}
              descricao={tarefa.descricao}
              horario={tarefa.horario}
              exibirBotao={false}
              freq_texto={formatarFrequenciaTexto(tarefa.frequencia)}
              alarme={tarefa.alarme}
              integrantes={tarefa.integrantes || []}
              dataInstancia={tarefa.dataCriacao}
              onTaskDeleted={carregarTarefas}
              semComentarios={true}
              instanceId={""}
            />
          ))
        ) : (
          <Text style={styles.nenhuma_tarefa}>{placeholder}</Text>
        )}
      </View>
    </>
  );

  return (
    <PaginaWrapper>
      <ScrollView
        style={globalStyles.containerPagina}
        contentContainerStyle={{ paddingBottom: 140, paddingTop: 80, flexGrow: 1 }}
      >
        <Text style={[globalStyles.titulo, globalStyles.mbottom32]}>
          Tarefas do Grupo
        </Text>

        <TouchableOpacity
          style={[styles.botao_adicionar, { backgroundColor: bgClass.backgroundColor }]}
          onPress={() => setModalPerguntaTarefaVisivel(true)}
        >
          <TarefaIcon width={20} height={20} color={colorClass.color} />
          <Text style={[styles.botao_adicionar_texto, { color: colorClass.color }]}>
            Criar Nova Tarefa
          </Text>
        </TouchableOpacity>

        <SecaoTarefa
          titulo="Diariamente"
          lista={tarefasPorFrequencia.diariamente}
          placeholder="Nenhuma tarefa diária"
        />
        <SecaoTarefa
          titulo="Semanalmente"
          lista={tarefasPorFrequencia.semanal}
          placeholder="Nenhuma tarefa semanal"
        />
        <SecaoTarefa
          titulo="A cada intervalo de tempo"
          lista={tarefasPorFrequencia.intervalo}
          placeholder="Nenhuma tarefa de intervalo"
        />
        <SecaoTarefa
          titulo="Anualmente"
          lista={tarefasPorFrequencia.anualmente}
          placeholder="Nenhuma tarefa anual"
        />

        <PerguntaTarefaModal
          visible={modalPerguntaTarefaVisivel}
          setVisible={setModalPerguntaTarefaVisivel}
        />
      </ScrollView>

      <AlertaSimples
        visible={alertaVisivel}
        message={mensagemAlerta}
        onClose={() => setAlertaVisivel(false)}
      />
    </PaginaWrapper>
  );
};

export default PaginaTarefas;