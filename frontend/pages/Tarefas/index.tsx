import React, { useEffect, useState } from "react";
import { Text, ScrollView, SafeAreaView, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useFonts } from "../../hooks/UsarFontes";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/frontend/routes";

import { styles } from "./styles";
import { globalStyles } from "@/frontend/globalStyles";

import TarefaIcon from "../../../assets/images/tarefa.svg";
import ParteCima from "@/frontend/components/ParteCima";
import { Navbar } from "@/frontend/components/Navbar";
import CardTarefa from "@/frontend/components/CardTarefa";

// Importa a função que busca as tarefas da coleção "Tarefas"
import { obterTarefas } from "@/backend/services/tarefaService";

const PaginaTarefas = () => {
  const fontLoaded = useFonts();
  const { navigate } = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [tarefas, setTarefas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Função auxiliar para converter um array de números (0 a 6) em siglas
  const convertDiasSemana = (dias: number[]): string => {
    const mapDias: { [key: number]: string } = {
      0: "DOM",
      1: "SEG",
      2: "TER",
      3: "QUA",
      4: "QUI",
      5: "SEX",
      6: "SAB",
    };
    return dias.map((dia) => mapDias[dia]).join(", ");
  };

  useEffect(() => {
    const carregarTarefas = async () => {
      setLoading(true);
      try {
        // Obtém as tarefas da coleção "Tarefas"
        const tarefasFirestore = await obterTarefas();
        console.log("Tarefas carregadas:", tarefasFirestore);
        setTarefas(tarefasFirestore);
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarTarefas();
  }, []);

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
            onPress={() => navigate("CriarTarefa")}
          >
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
              tarefasDiarias.map((tarefa) => (
                <CardTarefa
                  key={tarefa.id}
                  nome={tarefa.nome}
                  horario={tarefa.horario}
                  exibirBotao={false}
                  alarme={tarefa.alarme}
                  integrantes={tarefa.integrantes?.map((nome: string) => ({
                    nome,
                    cor_primaria: "#CAEAFB",
                    cor_secundaria: "#144F70"
                  })) || []}
                  
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
              tarefasSemanais.map((tarefa) => (
                <CardTarefa
                  key={tarefa.id}
                  nome={tarefa.nome}
                  horario={tarefa.horario}
                  exibirBotao={false}
                  freq_semanal={
                    tarefa.frequencia?.diasSemana
                      ? convertDiasSemana(tarefa.frequencia.diasSemana)
                      : ""
                  }
                  integrantes={tarefa.integrantes?.map((nome: string) => ({
                    nome,
                    cor_primaria: "#CAEAFB",
                    cor_secundaria: "#144F70"
                  })) || []}
                  
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
              tarefasIntervalo.map((tarefa) => (
                <CardTarefa
                  key={tarefa.id}
                  nome={tarefa.nome}
                  horario={tarefa.horario}
                  exibirBotao={false}
                  freq_intervalo={
                    tarefa.frequencia?.intervaloDias
                      ? `${tarefa.frequencia.intervaloDias}`
                      : ""
                  }
                  alarme={tarefa.alarme}
                  integrantes={tarefa.integrantes?.map((nome: string) => ({
                    nome,
                    cor_primaria: "#CAEAFB",
                    cor_secundaria: "#144F70"
                  })) || []}
                  
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
              tarefasAnuais.map((tarefa) => (
                <CardTarefa
                  key={tarefa.id}
                  nome={tarefa.nome}
                  horario={tarefa.horario}
                  exibirBotao={false}
                  freq_anual={
                    tarefa.frequencia?.datasEspecificas
                      ? tarefa.frequencia.datasEspecificas.join("  ·  ")
                      : ""
                  }
                  integrantes={tarefa.integrantes?.map((nome: string) => ({
                    nome,
                    cor_primaria: "#CAEAFB",
                    cor_secundaria: "#144F70"
                  })) || []}                  
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