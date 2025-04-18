import React, { useCallback, useEffect, useState } from "react";
import { Text, ScrollView, SafeAreaView, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useFonts } from "../../hooks/UsarFontes";
import { doc, getDoc } from "firebase/firestore";
import { getCoresDoTema } from "@/frontend/utils/temaStyles";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/frontend/routes";

import { styles } from "./styles";
import { globalStyles } from "@/frontend/globalStyles";

import TarefaIcon from "../../../assets/images/tarefa.svg";
import ParteCima from "@/frontend/components/ParteCima";
import { Navbar } from "@/frontend/components/Navbar";
import CardTarefa from "@/frontend/components/CardTarefa";
import { formatarFrequenciaTexto } from "@/frontend/utils/formatarFrequencia";

import { obterTarefas } from "../../../backend/services/tarefas/obterTarefas";
import { auth, db } from "../../../backend/services/shared/firebaseConfig";

const PaginaTarefas = () => {
  const fontLoaded = useFonts();
  const { navigate } = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [tarefas, setTarefas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarTarefas = async () => {
    setLoading(true);
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.warn("Usuário não autenticado");
        return;
      }
  
      const tarefasFirestore = await obterTarefas();
      const tarefasDoGrupo = tarefasFirestore.filter((t: any) => t.grupoId === uid);
  
      // Aqui enriquecemos os dados com nome e cores de cada integrante
      const tarefasComIntegrantesCompletos = await Promise.all(
        tarefasDoGrupo.map(async (t: any) => {
          const integrantesCompletos = await Promise.all(
            (t.integrantes || []).map(async (userId: string) => {
              const userRef = doc(db, "Usuarios", userId);
              const userSnap = await getDoc(userRef);
              const userData = userSnap.exists() ? userSnap.data() : { apelido: "Desconhecido", tema: "azul" };
              const { cor_primaria, cor_secundaria } = getCoresDoTema(userData.tema);
  
              return {
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

  if (!fontLoaded) return <Text>Carregando fontes...</Text>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ParteCima />
      {loading ? (
        <ActivityIndicator size="large" color="#5A189A" style={{ marginTop: 20 }} />
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
            style={styles.botao_adicionar}
            onPress={() => navigate('CriarTarefa', {})}>
            <TarefaIcon width={20} height={20} color={"#5A189A"} />
            <Text style={styles.botao_adicionar_texto}>
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
                  descricao={tarefa.descricao || "Não há descrição para esta tarefa."}
                  horario={tarefa.horario}
                  exibirBotao={false}
                  alarme={tarefa.alarme}
                  freq_texto={formatarFrequenciaTexto(tarefa.frequencia)}
                  integrantes={tarefa.integrantes || []}
                  dataInstancia={tarefa.dataCriacao}
                  onTaskDeleted={carregarTarefas}
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
                  descricao={tarefa.descricao || "Não há descrição para esta tarefa."}
                  horario={tarefa.horario}
                  exibirBotao={false}
                  freq_texto={formatarFrequenciaTexto(tarefa.frequencia)}
                  integrantes={tarefa.integrantes || []}
                  dataInstancia={tarefa.dataCriacao}
                  onTaskDeleted={carregarTarefas}
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
                  descricao={tarefa.descricao || "Não há descrição para esta tarefa."}
                  horario={tarefa.horario}
                  exibirBotao={false}
                  alarme={tarefa.alarme}
                  freq_texto={formatarFrequenciaTexto(tarefa.frequencia)}
                  integrantes={tarefa.integrantes || []}
                  dataInstancia={tarefa.dataCriacao}
                  onTaskDeleted={carregarTarefas}
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
                  descricao={tarefa.descricao || "Não há descrição para esta tarefa."}
                  horario={tarefa.horario}
                  exibirBotao={false}
                  freq_texto={formatarFrequenciaTexto(tarefa.frequencia)}
                  alarme={tarefa.alarme}
                  integrantes={tarefa.integrantes || []}
                  dataInstancia={tarefa.dataCriacao}
                  onTaskDeleted={carregarTarefas} 
                />
              ))
            ) : (
              <Text style={styles.nenhuma_tarefa}>Nenhuma tarefa anual</Text>
            )}
          </View>
        </ScrollView>
      )}
      <Navbar />
    </SafeAreaView>
  );
};

export default PaginaTarefas;