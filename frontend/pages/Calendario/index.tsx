import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, FlatList, Dimensions } from "react-native";
import { styles } from "./styles";
import { globalStyles } from "@/frontend/globalStyles";
import Svg, { Defs, LinearGradient, Stop, Rect, Circle } from "react-native-svg";

import ParteCima from "../../components/ParteCima/index";
import { Navbar } from "@/frontend/components/Navbar";
import CardTarefa from "@/frontend/components/CardTarefa";

import SetaDiaIcon from "../../../assets/images/setaDia.svg";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/backend/services/shared/firebaseConfigApp";
import { getCoresDoTema } from "@/frontend/utils/temaStyles";
import { formatarFrequenciaTexto } from "@/frontend/utils/formatarFrequencia";
import { useTema } from "@/frontend/hooks/useTema";
import PaginaWrapper from "@/frontend/components/PaginaWrapper";
import SkeletonLoaderCard from "@/frontend/components/SkeletonLoaderCard";
import AlertaSimples from "@/frontend/components/AlertaSimples";
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/frontend/routes";
import { useLastActionListener } from "@/frontend/hooks/useLastActionListener";

const nomesDosMeses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

type Semana = {
  semana: string;
  inicio: string;
  fim: string;
};

type SemanaItemProps = {
  semana: string;
  inicio: string;
  fim: string;
  ativa: boolean;
  onPress: () => void;
};

const PaginaCalendario = () => {
  const dataAtual = new Date();
  const mesAtual = dataAtual.getMonth();
  const anoAtual = dataAtual.getFullYear();
  const diaHoje = dataAtual.getDate();

  const [totalMes, setTotalMes] = useState(0);
  const [desempenho, setDesempenho] = useState(0);
  const [loadingMetrica, setLoadingMetrica] = useState(true);

  const [semanas, setSemanas] = useState<Semana[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState(dataAtual);
  const [tarefasDoDia, setTarefasDoDia] = useState<any[]>([]);
  const [loadingSemanas, setLoadingSemanas] = useState(true);
  const [loadingTarefas, setLoadingTarefas] = useState(true);
  const [semanaAtiva, setSemanaAtiva] = useState<string>("1");

  const { temaUsuario, aplicarTemaApp,  getTemaStyle, loadingTema } = useTema();
  const { bgClass, colorClass } = getTemaStyle(temaUsuario);

  useEffect(() => {
    const calcularSemanas = () => {
      const primeiroDiaDoMes = new Date(anoAtual, mesAtual, 1).getDay();
      const ultimoDiaDoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();

      let semanasTemp: { semana: number; inicio: number; fim: number }[] = [];
      let inicioSemana = 1;
      let semanaAtual = 1;

      while (inicioSemana <= ultimoDiaDoMes) {
        let dataInicio = new Date(anoAtual, mesAtual, inicioSemana);
        let fimSemana = inicioSemana + (6 - dataInicio.getDay());

        if (fimSemana > ultimoDiaDoMes) {
          fimSemana = ultimoDiaDoMes;
        }

        semanasTemp.push({ semana: semanaAtual, inicio: inicioSemana, fim: fimSemana });
        inicioSemana = fimSemana + 1;
        semanaAtual++;
      }

      const temSemana06 = semanasTemp.length === 6;

      let semanasFormatadas: { semana: string; inicio: string; fim: string }[] = [];

      if (semanasTemp.length >= 2) {
        // Semana 1
        semanasFormatadas.push({
          semana: "1",
          inicio: semanasTemp[0].inicio.toString().padStart(2, "0"),
          fim: semanasTemp[1].fim.toString().padStart(2, "0"),
        });

        // Semanas intermediárias (Sem. 2 e Sem. 3)
        let numeroSemana = 2;
        for (let i = 2; i < semanasTemp.length - (temSemana06 ? 2 : 1); i++, numeroSemana++) {
          semanasFormatadas.push({
            semana: numeroSemana.toString(),
            inicio: semanasTemp[i].inicio.toString().padStart(2, "0"),
            fim: semanasTemp[i].fim.toString().padStart(2, "0"),
          });
        }

        // Semana 4
        if (temSemana06) {
          semanasFormatadas.push({
            semana: "4",
            inicio: semanasTemp[4].inicio.toString().padStart(2, "0"),
            fim: semanasTemp[5].fim.toString().padStart(2, "0"),
          });
        } else {
          semanasFormatadas.push({
            semana: "4",
            inicio: semanasTemp[4].inicio.toString().padStart(2, "0"),
            fim: semanasTemp[4].fim.toString().padStart(2, "0"),
          });
        }
      }

      setSemanas(semanasFormatadas);
      setLoadingSemanas(false);
    };

    calcularSemanas();
  }, [mesAtual, anoAtual]);
  

  const semanaHojeFormatada = semanas.find((s) => {
    let inicio = parseInt(s.inicio);
    let fim = parseInt(s.fim);
    return diaHoje >= inicio && diaHoje <= fim;
  });

  useEffect(() => {
    setSemanaAtiva(semanaHojeFormatada?.semana || "1");
  }, [semanas]);

  // Buscar as tarefas do dia selecionado
  const obterTarefasPorDia = useCallback(async (data: Date) => {
    setLoadingTarefas(true);
  
    // Obter o grupoId do usuário autenticado
    const uid = auth.currentUser?.uid;
    if (!uid) {
      console.error("Usuário não autenticado");
      setLoadingTarefas(false);
      return;
    }
  
    const userRef = doc(db, "Usuarios", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      console.error("Usuário não encontrado");
      setLoadingTarefas(false);
      return;
    }
  
    const userData = userSnap.data();
    const grupoId = userData.grupoId;
  
    // Formatar a data para "yyyy-mm-dd"
    const diaFormatado = `${data.getFullYear()}-${(data.getMonth() + 1).toString().padStart(2, "0")}-${data.getDate().toString().padStart(2, "0")}`;
    console.log("Consultando tarefas para o dia:", diaFormatado);
  
    // Obter as tarefas do dia específico
    const calendarioDocRef = doc(db, "Calendário", diaFormatado);
    const docSnapshot = await getDoc(calendarioDocRef);
  
    if (docSnapshot.exists()) {
      let tarefas = docSnapshot.data()?.tarefas || [];
  
      // Filtrar as tarefas para incluir apenas as do grupo atual
      tarefas = tarefas.filter((tarefa: any) => tarefa.grupoId === grupoId);
  
      // Para cada tarefa, buscar os detalhes dos integrantes
      const tarefasComIntegrantesDetalhados = await Promise.all(
        tarefas.map(async (tarefa: any) => {
          if (tarefa.integrantes && tarefa.integrantes.length > 0) {
            const integrantesDetalhados = await Promise.all(
              tarefa.integrantes.map(async (userId: string) => {
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
            return { ...tarefa, integrantes: integrantesDetalhados };
          }
          return tarefa;
        })
      );
      setTarefasDoDia(tarefasComIntegrantesDetalhados);
    } else {
      setTarefasDoDia([]); // Caso não haja tarefa para o dia, limpa a lista
    }
  
    setLoadingTarefas(false);
  }, [getCoresDoTema]);
  
  useEffect(() => {
    obterTarefasPorDia(dataSelecionada); // Carrega as tarefas ao iniciar
  }, [dataSelecionada, obterTarefasPorDia]);
  

  const handleDataAnterior = () => {
    const novaData = new Date(dataSelecionada);
    novaData.setDate(novaData.getDate() - 1); // Vai para o dia anterior

    if (novaData.getMonth() === mesAtual) {
      setDataSelecionada(novaData);
    }
  };

  const handleDataProximo = () => {
    const novaData = new Date(dataSelecionada);
    novaData.setDate(novaData.getDate() + 1); // Vai para o próximo dia

    if (novaData.getMonth() === mesAtual) {
      setDataSelecionada(novaData);
    }
  };

  const scrollParaDataSelecionada = () => {
    const index = diasDoMes.indexOf(dataSelecionada.getDate());
      if (index !== -1 && flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5, // centraliza
        });
      }
    };

  const handleSemanaChange = (semanaSelecionada: string) => {

    setSemanaAtiva(semanaSelecionada);
    const semanaEscolhida = semanas.find(s => s.semana === semanaSelecionada);
    if (semanaEscolhida) {
      if (semanaSelecionada === "1") {
        // Força a data para o primeiro dia do mês atual, se for a semana 1
        setDataSelecionada(new Date(anoAtual, mesAtual, 1)); // Vai para o dia 1 do mês atual
      } else {
        // Para as outras semanas, vai para o domingo da semana selecionada
        const dataInicioSemana = new Date(anoAtual, mesAtual, parseInt(semanaEscolhida.inicio));
        dataInicioSemana.setDate(dataInicioSemana.getDate() - dataInicioSemana.getDay());
        setDataSelecionada(dataInicioSemana);
      }
    }
  };

  const SemanaItem: React.FC<SemanaItemProps> = ({ semana, inicio, fim, ativa, onPress }) => (
    <View style={styles.linha_semana}>
      <TouchableOpacity
        style={[
          styles.botao_semana,
          {
            backgroundColor: aplicarTemaApp
            ? colorClass.color
            : bgClass.backgroundColor,
          },
          !ativa && styles.desativado
        ]}
        onPress={onPress}
      >
        <Text
          style={[
            { color: "white", fontFamily: "Inter-Medium" },
            !ativa && styles.desativado_texto
          ]}
        >
          {`Sem. ${semana}`}
        </Text>
      </TouchableOpacity>
      <Text style={styles.dias_semana_texto}>{`Dias ${inicio} - ${fim}`}</Text>
    </View>
  );

  const diasDaSemana = [
    "Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"
  ];

  const nomeDiaDaSemana = diasDaSemana[dataSelecionada.getDay()];
  const flatListRef = useRef<FlatList>(null);

  const formatarData = (data: Date) => {
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    return `${dia}/${mes}`;
  };

  // Atualizar a semana ativa ao voltar ou avançar dias
  useEffect(() => {
    const semanaAtual = semanas.find(s => {
      let inicio = parseInt(s.inicio);
      let fim = parseInt(s.fim);
      return dataSelecionada.getDate() >= inicio && dataSelecionada.getDate() <= fim;
    });
    setSemanaAtiva(semanaAtual?.semana || "1");

    scrollParaDataSelecionada();

  }, [dataSelecionada, semanas]);

  const carregarTarefasDoMes = useCallback(async () => {
    setLoadingMetrica(true);

    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const userRef = doc(db, "Usuarios", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const grupoId = userSnap.data().grupoId;

    const primeiroDiaMes = new Date(anoAtual, mesAtual, 1);
    const ultimoDiaMes = new Date(anoAtual, mesAtual + 1, 0);

    let total = 0;
    let concluidas = 0;

    for (let dia = 1; dia <= ultimoDiaMes.getDate(); dia++) {
      const data = new Date(anoAtual, mesAtual, dia);
      const diaFormatado = `${data.getFullYear()}-${(data.getMonth() + 1).toString().padStart(2, "0")}-${data.getDate().toString().padStart(2, "0")}`;

      const docRef = doc(db, "Calendário", diaFormatado);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const tarefas = docSnap.data()?.tarefas || [];
        const tarefasGrupo = tarefas.filter((t: any) => t.grupoId === grupoId);
        total += tarefasGrupo.length;
        concluidas += tarefasGrupo.filter((t: any) => t.concluido).length;
      }
    }

    setTotalMes(total);
    setDesempenho(total > 0 ? Math.round((concluidas / total) * 100) : 0);
    setLoadingMetrica(false);
  }, [anoAtual, mesAtual]);

  useEffect(() => {
    carregarTarefasDoMes();
  }, [carregarTarefasDoMes]);

  const [alertaVisivel, setAlertaVisivel] = useState(false);
  const [mensagemAlerta, setMensagemAlerta] = useState("");

  const recarregarDados = () => {
    obterTarefasPorDia(dataSelecionada);
    carregarTarefasDoMes();
  };

    useLastActionListener({
    edit: () => {
      recarregarDados();
      setMensagemAlerta("Tarefa editada com sucesso!");
      setAlertaVisivel(true);
    },
    delete: () => {
      recarregarDados();
      setMensagemAlerta("Tarefa excluída com sucesso!");
      setAlertaVisivel(true);
    },
  });


  const diasDoMes = Array.from({ length: new Date(anoAtual, mesAtual + 1, 0).getDate() }, (_, i) => i + 1);

  const [isFlatListReady, setIsFlatListReady] = useState(false);

  useEffect(() => {
    if (isFlatListReady && flatListRef.current && diasDoMes.length > 0) {
      const initialIndex = diasDoMes.indexOf(diaHoje);
      if (initialIndex !== -1) {
        flatListRef.current.scrollToIndex({
          index: initialIndex,
          animated: true,
          viewPosition: 0.5,
        });
      }
    }
  }, [isFlatListReady, flatListRef.current, diasDoMes.length, mesAtual, anoAtual, diaHoje]);

  const screenWidth = Dimensions.get("window").width;
  const lateralPadding = screenWidth / 2 - 40;


  return (
    <PaginaWrapper>
      <ScrollView style={globalStyles.containerPagina} contentContainerStyle={{ paddingBottom: 140, paddingTop: 80 }}>
        <Text style={[globalStyles.titulo, globalStyles.mbottom32]}>Calendário</Text>

        <View style={styles.container_cima}>
          <View style={styles.container_cima_esq}>
            {semanas.map(({ semana, inicio, fim }) => (
              <SemanaItem
                key={semana}
                semana={semana}
                inicio={inicio}
                fim={fim}
                ativa={semana === semanaAtiva}
                onPress={() => handleSemanaChange(semana)}
              />
            ))}
          </View>

          <View style={styles.container_cima_dir}>
            <View>
              <Text style={styles.mes}>MÊS</Text>
              <Text style={[globalStyles.titulo, {
                color: aplicarTemaApp
                  ? colorClass.color
                  : bgClass.backgroundColor,
              },]}>
                {nomesDosMeses[mesAtual]}
              </Text>
            </View>
            <View style={[styles.container_baixo, loadingMetrica && styles.align_start]}>
              {loadingMetrica ? (
                <ActivityIndicator size="large" color="#808080" />
              ) : (
                <>
                  <View style={styles.semana_info}>
                    <Text style={styles.semana_info_titulo}>Total de Tarefas</Text>
                    <Text style={styles.semana_info_num}>{totalMes}</Text>
                  </View>
                  <View style={styles.semana_info}>
                    <Text style={styles.semana_info_titulo}>Desempenho</Text>
                    <Text style={styles.semana_info_num}>{desempenho}%</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>

          {/* Container de dias roláveis */}
        <View style={{ position: "relative", width: "100%"}}>
          <FlatList 
            ListHeaderComponent={<View style={{ width: lateralPadding }} />}
            ListFooterComponent={<View style={{ width: lateralPadding }} />}
            ref={flatListRef}
            data={diasDoMes}
            onLayout={() => setIsFlatListReady(true)}
            renderItem={({ item: dia, index }) => (
              <TouchableOpacity
                key={dia}
                style={styles.diaItem}
                onPress={() => {
                  const novaData = new Date(anoAtual, mesAtual, dia);
                  setDataSelecionada(novaData);
                  flatListRef.current?.scrollToIndex({
                    index: index,
                    animated: true,
                    viewPosition: 0.5,
                  });
                }}
              >
                <Text
                  style={[
                    styles.diaTexto,
                    dataSelecionada.getDate() === dia && { color: colorClass.color },
                  ]}
                >
                  {dia}
                </Text>

                {/* Círculo abaixo do dia escolhido */}
                {dataSelecionada.getDate() === dia && (
                  <Svg
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                    style={styles.circuloIcon}
                  >
                    <Circle cx="22" cy="22" r="18" fill={bgClass.backgroundColor} />
                  </Svg>
                )}
              </TouchableOpacity>
            )}
            keyExtractor={(dia) => dia.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollContainerDias}
            onScrollToIndexFailed={({ index }) => {
              setTimeout(() => {
              flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
              
              }, 250)}}
          />

          <View style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            <Svg width="100%" height="100%">
              <Defs>
                <LinearGradient id="gradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="white" stopOpacity="1" />
                  <Stop offset="40%" stopColor="white" stopOpacity="0" />
                </LinearGradient>
                <LinearGradient id="gradRight" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="60%" stopColor="white" stopOpacity="0" />
                  <Stop offset="100%" stopColor="white" stopOpacity="1" />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" fill="url(#gradLeft)" />
              <Rect x="0" y="0" width="100%" height="100%" fill="url(#gradRight)" />
            </Svg>
          </View>
        </View>

        <View style={styles.container_escolher}>
          <TouchableOpacity
            style={[
              styles.dia_botao,
              {
                backgroundColor: aplicarTemaApp
                  ? colorClass.color
                  : bgClass.backgroundColor,
              },
            ]}
            onPress={handleDataAnterior}
          >
          <SetaDiaIcon width={44} color={"white"} style={styles.rotate} />
          </TouchableOpacity>

          <View style={styles.dia_atual}>
            <Text style={styles.dia_atual_esq}>{nomeDiaDaSemana}</Text>
            <Text style={styles.dia_atual_dir}>{formatarData(dataSelecionada)}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.dia_botao,
              {
                backgroundColor: aplicarTemaApp
                  ? colorClass.color
                  : bgClass.backgroundColor,
              },
            ]}
            onPress={handleDataProximo}
          >
            <SetaDiaIcon width={44} color={"white"} />
          </TouchableOpacity>
        </View>

        <View style={styles.cards}>
        {loadingTarefas ? (
          <SkeletonLoaderCard />
        ) : tarefasDoDia.length > 0 ? (
            tarefasDoDia.map((tarefa, index) => {
              return (
                <CardTarefa
                  key={index}
                  id={tarefa.originalId}
                  nome={tarefa.nome}
                  descricao={tarefa.descricao}
                  horario={tarefa.horario}
                  alarme={tarefa.alarme}
                  concluido={tarefa.concluido}
                  freq_texto={formatarFrequenciaTexto(tarefa.frequencia)}
                  integrantes={tarefa.integrantes || []}
                  menor={true}
                  instanceId={tarefa.instanceId}
                  dataInstancia={`${dataSelecionada.getFullYear()}-${(dataSelecionada.getMonth() + 1).toString().padStart(2, "0")}-${dataSelecionada.getDate().toString().padStart(2, "0")}`}
                  onTaskDeleted={recarregarDados}
                />
              );
            })
          ) : (
            <Text style={styles.nenhuma_tarefa}>Nenhuma tarefa para este dia</Text>
          )}
        </View>
      </ScrollView>

      <AlertaSimples
        visible={alertaVisivel}
        message={mensagemAlerta}
        onClose={() => setAlertaVisivel(false)}
      />

    </PaginaWrapper>
  );
};

export default PaginaCalendario;