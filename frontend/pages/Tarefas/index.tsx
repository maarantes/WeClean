import React, { useCallback, useEffect, useState } from "react";
import { Text, ScrollView, SafeAreaView, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { getCoresDoTema } from "@/frontend/utils/temaStyles";
import { useFocusEffect } from "@react-navigation/native";

import { styles } from "./styles";
import { globalStyles } from "@/frontend/globalStyles";

import TarefaIcon from "../../../assets/images/tarefa.svg";
import ParteCima from "@/frontend/components/ParteCima";
import { Navbar } from "@/frontend/components/Navbar";
import CardTarefa from "@/frontend/components/CardTarefa";
import { formatarFrequenciaTexto } from "@/frontend/utils/formatarFrequencia";

import { obterTarefas } from "../../../backend/services/tarefas/obterTarefas";
import { auth, db } from "../../../backend/services/shared/firebaseConfigApp";
import { useTema } from "@/frontend/hooks/useTema";
import PerguntaTarefaModal from "@/frontend/components/ModalPerguntaTarefa";
import PaginaWrapper from "@/frontend/components/PaginaWrapper";

const PaginaTarefas = () => {

  const [tarefas, setTarefas] = useState<any[]>([]);
  const [modalPerguntaTarefaVisivel, setModalPerguntaTarefaVisivel] = useState(false);

  const [loading, setLoading] = useState(true);
  
  const { temaUsuario, getTemaStyle } = useTema();
  const { bgClass, colorClass } = getTemaStyle(temaUsuario);

  const carregarTarefas = async () => {
    setLoading(true);
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.warn("Usuário não autenticado");
        return;
      }
  
      // Buscar o GrupoID do usuário
      const userRef = doc(db, "Usuarios", uid);
      const userSnap = await getDoc(userRef);
  
      if (!userSnap.exists()) {
        console.warn("Usuário não encontrado");
        return;
      }
  
      const userData = userSnap.data();
      const grupoId = userData.grupoId || uid;
  
      // Buscar todas as tarefas
      const tarefasFirestore = await obterTarefas();
  
      // Agora filtrar somente pelas tarefas que são do mesmo grupo
      const tarefasDoGrupo = tarefasFirestore.filter((t: any) => t.grupoId === grupoId);
  
      const tarefasComIntegrantesCompletos = await Promise.all(
        tarefasDoGrupo.map(async (t: any) => {
          const integrantesCompletos = await Promise.all(
            (t.integrantes || []).map(async (userId: string) => {
              const userRef = doc(db, "Usuarios", userId);
              const userSnap = await getDoc(userRef);
              const userData = userSnap.exists() ? userSnap.data() : { apelido: "Desconhecido", tema: "azul" };
              const { cor_primaria, cor_secundaria } = getCoresDoTema(userData.tema);
  
              return {
                uid: userId,
                nome: userData.apelido,
                cor_primaria,
                cor_secundaria,
              };
            })
          );
  
          return {
            ...t,
            integrantes: integrantesCompletos,
          };
        })
      );
  
      setTarefas(tarefasComIntegrantesCompletos);
      console.log("Tarefas carregadas:", tarefasComIntegrantesCompletos);
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
  

  // Agrupa as tarefas conforme o tipo de frequência
  const tarefasDiarias = tarefas.filter(
    (t) => t.frequencia?.tipo === "diariamente"
  );
  const tarefasSemanais = tarefas.filter(
    (t) => t.frequencia?.tipo === "semanal"
  );
  const tarefasIntervalo = tarefas.filter(
    (t) => t.frequencia?.tipo === "intervalo"
  );
  const tarefasAnuais = tarefas.filter(
    (t) => t.frequencia?.tipo === "anualmente"
  );

  return (
  <PaginaWrapper>
      {loading ? (
        <View style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}>
          <ActivityIndicator size="large" color="#808080" />
        </View>
      ) : (
        <ScrollView
          style={globalStyles.containerPagina}
          contentContainerStyle={{
            paddingBottom: 140,
            paddingTop: 80,
            flexGrow: 1,
          }}
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

          {/* Seção Diariamente */}
          <Text style={[globalStyles.textoNormal, globalStyles.mbottom16]}>
            Diariamente
          </Text>
          <View style={styles.container_cards}>
            {tarefasDiarias.length > 0 ? (
              tarefasDiarias.map((tarefa, index) => (
                <CardTarefa
                  key={index}
                  id={tarefa.id}
                  nome={tarefa.nome}
                  descricao={tarefa.descricao}
                  horario={tarefa.horario}
                  exibirBotao={false}
                  alarme={tarefa.alarme}
                  freq_texto={formatarFrequenciaTexto(tarefa.frequencia)}
                  integrantes={tarefa.integrantes || []}
                  dataInstancia={tarefa.dataCriacao}
                  onTaskDeleted={carregarTarefas}
                  semComentarios={true}
                  instanceId={""}
                />
              ))
            ) : (
              <Text style={styles.nenhuma_tarefa}>Nenhuma tarefa diária</Text>
            )}
          </View>

          {/* Seção Semanalmente */}
          <Text style={[globalStyles.textoNormal, globalStyles.mbottom16]}>
            Semanalmente
          </Text>
          <View style={styles.container_cards}>
            {tarefasSemanais.length > 0 ? (
              tarefasSemanais.map((tarefa, index) => (
                <CardTarefa
                  key={index}
                  id={tarefa.id}
                  nome={tarefa.nome}
                  descricao={tarefa.descricao}
                  horario={tarefa.horario}
                  exibirBotao={false}
                  freq_texto={formatarFrequenciaTexto(tarefa.frequencia)}
                  integrantes={tarefa.integrantes || []}
                  dataInstancia={tarefa.dataCriacao}
                  onTaskDeleted={carregarTarefas}
                  semComentarios={true}
                  instanceId={""}
                />
              ))
            ) : (
              <Text style={styles.nenhuma_tarefa}>Nenhuma tarefa semanal</Text>
            )}
          </View>

          {/* Seção Intervalo */}
          <Text style={[globalStyles.textoNormal, globalStyles.mbottom16]}>
            A cada intervalo de tempo
          </Text>
          <View style={styles.container_cards}>
            {tarefasIntervalo.length > 0 ? (
              tarefasIntervalo.map((tarefa, index) => (
                <CardTarefa
                  key={index}
                  id={tarefa.id}
                  nome={tarefa.nome}
                  descricao={tarefa.descricao}
                  horario={tarefa.horario}
                  exibirBotao={false}
                  alarme={tarefa.alarme}
                  freq_texto={formatarFrequenciaTexto(tarefa.frequencia)}
                  integrantes={tarefa.integrantes || []}
                  dataInstancia={tarefa.dataCriacao}
                  onTaskDeleted={carregarTarefas}
                  semComentarios={true}
                  instanceId={""}
                />
              ))
            ) : (
              <Text style={styles.nenhuma_tarefa}>Nenhuma tarefa de intervalo</Text>
            )}
          </View>

          {/* Seção Anual */}
          <Text style={[globalStyles.textoNormal, globalStyles.mbottom16]}>
            Anualmente
          </Text>
          <View style={styles.container_cards}>
            {tarefasAnuais.length > 0 ? (
              tarefasAnuais.map((tarefa, index) => (
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
              <Text style={styles.nenhuma_tarefa}>Nenhuma tarefa anual</Text>
            )}
          </View>

          <PerguntaTarefaModal
          visible={modalPerguntaTarefaVisivel}
          setVisible={setModalPerguntaTarefaVisivel}
        />

        </ScrollView>
      )}
    </PaginaWrapper>
  );
};

export default PaginaTarefas;