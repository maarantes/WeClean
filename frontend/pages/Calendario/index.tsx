import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";

import { styles } from "./styles";
import { globalStyles } from "@/frontend/globalStyles";

import ParteCima from "../../components/ParteCima/index";
import { Navbar } from "@/frontend/components/Navbar";
import CardTarefa from "@/frontend/components/CardTarefa";

import SetaDiaIcon from "../../../assets/images/setaDia.svg";

const nomesDosMeses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

type SemanaItemProps = {
  semana: string;
  inicio: string;
  fim: string;
  ativa: boolean;
  onPress: () => void;
};

const SemanaItem: React.FC<SemanaItemProps> = ({ semana, inicio, fim, ativa, onPress }) => (
  <View style={styles.linha_semana}>
    <TouchableOpacity
      style={[styles.botao_semana, ativa ? "" : styles.desativado]}
      onPress={onPress}
    >
      <Text style={[styles.botao_semana_texto, ativa ? "" : styles.desativado_texto]}>{`Sem. ${semana}`}</Text>
    </TouchableOpacity>
    <Text style={styles.dias_semana_texto}>{`Dias ${inicio} - ${fim}`}</Text>
  </View>
);

const PaginaCalendario = () => {
  
  const dataAtual = new Date();
  const mesAtual = dataAtual.getMonth();
  const anoAtual = dataAtual.getFullYear();
  const diaHoje = dataAtual.getDate();

  const semanas = useMemo(() => {
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
    

    return semanasFormatadas;
  }, [mesAtual, anoAtual]);

  const semanaHojeFormatada = semanas.find((s) => {
    let inicio = parseInt(s.inicio);
    let fim = parseInt(s.fim);
    return diaHoje >= inicio && diaHoje <= fim;
  });

  const [semanaAtiva, setSemanaAtiva] = useState(semanaHojeFormatada?.semana || "1-2");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ParteCima />
      <ScrollView
        style={globalStyles.containerPagina}
        contentContainerStyle={{ paddingBottom: 140, paddingTop: 80 }}>

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
                onPress={() => setSemanaAtiva(semana)}
              />
            ))}
          </View>
          <View style={styles.container_cima_dir}>
            <View>
              <Text style={styles.mes}>MÊS</Text>
              <Text style={globalStyles.titulo}>{nomesDosMeses[mesAtual]}</Text>
            </View>
            <View style={styles.container_baixo}>
              <View style={styles.semana_info}>
                <Text style={styles.semana_info_titulo}>Total de Tarefas</Text>
                <Text style={styles.semana_info_num}>32</Text>
              </View>
              <View style={styles.semana_info}>
                <Text style={styles.semana_info_titulo}>Desempenho</Text>
                <Text style={styles.semana_info_num}>96%</Text>
              </View>
            </View>
          </View>
        </View>
          
        <View style={styles.container_escolher}>
          <TouchableOpacity style={styles.dia_botao}>
            <SetaDiaIcon width={44} color="#FFFFFF" style={styles.rotate}/>
          </TouchableOpacity>

          <View style={styles.dia_atual}>
            <Text style={styles.dia_atual_esq}>Segunda-Feira</Text>
            <Text style={styles.dia_atual_dir}>10/03</Text>
          </View>

          <TouchableOpacity style={styles.dia_botao}>
            <SetaDiaIcon width={44} color="#FFFFFF"/>
          </TouchableOpacity>

        </View>

        <View style={styles.cards}>

        </View>

      </ScrollView>
      <Navbar />
    </SafeAreaView>
    
  );
};

export default PaginaCalendario;