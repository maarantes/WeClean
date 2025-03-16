import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator } from "react-native";
import { obterTarefasCalendario } from "@/backend/services/tarefaService";
import { useFonts } from "../../hooks/UsarFontes";

import { styles } from "./styles";
import { globalStyles } from "@/frontend/globalStyles";
import { Navbar } from "@/frontend/components/Navbar";
import ParteCima from "../../components/ParteCima/index";
import CardTarefa from "../../components/CardTarefa/index";

// Definição dos dias da semana (para agrupamento)
const DiasDaSemana = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado"
];

const SemTarefa = () => (
  <View style={styles.container_sem_tarefa}>
    <Text style={styles.texto_sem_tarefa}>Nenhuma tarefa!</Text>
  </View>
);

const PaginaInicio = () => {
  const fontLoaded = useFonts();
  const [tarefasSemana, setTarefasSemana] = useState<{ [dia: string]: any[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarTarefasSemana = async () => {
      setLoading(true);

      try {
        // Busca as tarefas do Calendário para o período desejado
        const tarefasDoCalendario = await obterTarefasCalendario();
        console.log("Tarefas carregadas do Firebase:", tarefasDoCalendario);

        // Inicializa um objeto com os 7 dias da semana
        const tarefasPorDia: { [dia: string]: any[] } = {};
        DiasDaSemana.forEach((dia) => {
          tarefasPorDia[dia] = [];
        });

        // Agrupa as tarefas pelo dia da semana, convertendo a data (YYYY-MM-DD) em objeto Date
        Object.entries(tarefasDoCalendario).forEach(([dataStr, tarefas]) => {
          const [year, month, day] = dataStr.split("-").map(Number);
          const dataObj = new Date(year, month - 1, day);
          const nomeDia = DiasDaSemana[dataObj.getDay()];
          // Asseguramos que "tarefas" seja tratado como array
          tarefasPorDia[nomeDia] = [
            ...tarefasPorDia[nomeDia],
            ...(tarefas as any[])
          ];
        });

        console.log("Tarefas organizadas por dia da semana:", tarefasPorDia);
        setTarefasSemana(tarefasPorDia);
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarTarefasSemana();
  }, []);

  if (!fontLoaded) return <Text>Carregando fontes...</Text>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ParteCima />
      {loading ? (
        <ActivityIndicator size="large" color="#5A189A" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={globalStyles.containerPagina} contentContainerStyle={{ paddingBottom: 140, paddingTop: 80 }}>
          <Text style={[globalStyles.titulo, globalStyles.mbottom32]}>Tarefas da Semana</Text>
          {DiasDaSemana.map((dia) => (
            <View key={dia}>
              <Text style={[globalStyles.textoNormal, globalStyles.mbottom16]}>{dia}</Text>
              <View style={styles.container_dia_semana}>
                {tarefasSemana[dia] && tarefasSemana[dia].length ? (
                  tarefasSemana[dia].map((tarefa, index) => (
                    <CardTarefa
                      key={index}
                      nome={tarefa.nome}
                      horario={tarefa.horario}
                      exibirBotao={true}
                      alarme={tarefa.alarme}
                      integrantes={
                        tarefa.integrantes?.map((integrante: string) => ({
                          nome: integrante,
                          cor_primaria: "#CAEAFB",
                          cor_secundaria: "#144F70"
                        })) || []
                      }
                    />
                  ))
                ) : (
                  <SemTarefa />
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      <Navbar />
    </SafeAreaView>
  );
};

export default PaginaInicio;