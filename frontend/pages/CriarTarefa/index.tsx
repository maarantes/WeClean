import React, { useEffect, useRef } from "react";
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";

import { styles } from "./styles";
import { globalStyles } from "@/frontend/globalStyles";
import Badge from "@/frontend/components/Badge";
import SetaBackIcon from "../../../assets/images/setaBack.svg";
import RelogioIcon from "../../../assets/images/relogio.svg";
import TarefaIcon from "../../../assets/images/tarefa.svg";
import FecharIcon from "../../../assets/images/fechar.svg";
import CalendarioMiniIcon from "../../../assets/images/calendario_mini.svg";
import MaisAdicaoIcon from "../../../assets/images/mais_adicao.svg";

import { useCriarTarefa } from "./useCriarTarefa";
import { useTema } from "@/frontend/hooks/useTema";

const DiasDaSemana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
const Frequencias = [
  "Diariamente",
  "Semanalmente",
  "A cada intervalo de tempo",
  "Anualmente em datas específicas",
];

const PaginaCriarTarefa = () => {
  const {
    nome,
    setNome,
    descricao,
    setDescricao,
    horario,
    setHorario,
    alarmeAtivado,
    setAlarmeAtivado,
    integrantesSelecionados,
    toggleIntegrante,
    botaoFrequenciaAtivo,
    setBotaoFrequenciaAtivo,
    diasSelecionados,
    toggleDiaSemana,
    intervalo,
    setIntervalo,
    datasSelecionadas,
    escolherHorario,
    escolherData,
    adicionarNovaData,
    removerData,
    handleSalvar,
    loading,
    erros,
    isEditMode,
    isSuggestMode,
    integrantesGrupo
  } = useCriarTarefa();

  const { temaUsuario, getTemaStyle } = useTema();
  const { bgClass, colorClass } = getTemaStyle(temaUsuario);

  const navigation = useNavigation();

  const verticalScrollRef = useRef<ScrollView>(null);
  const horizontalScrollRef = useRef<ScrollView>(null);

   useEffect(() => {
    verticalScrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  useEffect(() => {
    if (
      horizontalScrollRef.current &&
      (isEditMode || isSuggestMode) &&
      botaoFrequenciaAtivo !== null
    ) {
      const buttonWidth = 150; 
      const scrollToX = Math.max(0, botaoFrequenciaAtivo * buttonWidth - 100);
      horizontalScrollRef.current.scrollTo({ x: scrollToX, animated: true });
    }
  }, [botaoFrequenciaAtivo]);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container_cima}>
        <TouchableOpacity style={styles.botao_voltar} onPress={() => navigation.goBack()}>
          <SetaBackIcon width={40} height={16} color={"#808080"} />
        </TouchableOpacity>
        <Text style={styles.titulo_cima}>
          {isEditMode ? "Editar Tarefa" : "Criar Nova Tarefa"}
        </Text>
      </View>

      <ScrollView style={globalStyles.containerPagina} contentContainerStyle={{ paddingBottom: 80, paddingTop: 80 }} ref={verticalScrollRef}>

        {/* Nome */}
        <Text style={styles.label}>NOME</Text>
        <TextInput
          style={[styles.input, { height: 40 }]}
          placeholder="Digite aqui..."
          value={nome}
          onChangeText={(text) => setNome(text)}
        />
        {erros.nome && <Text style={styles.erro_texto}>Este campo é obrigatório!</Text>}

        {/* Descrição */}
        <View style={[styles.cima, styles.dividir]}>
          <Text style={styles.label}>DESCRIÇÃO</Text>
          <Text style={styles.label}>Opcional</Text>
        </View>
        <TextInput
          style={[styles.input, { minHeight: 80, paddingTop: 10, textAlignVertical: "top" }]}
          placeholder="Até 250 caracteres"
          value={descricao}
          onChangeText={setDescricao}
          multiline
          maxLength={250}
        />

        {/* Horário */}
        <Text style={[styles.label, styles.cima]}>HORÁRIO</Text>
        <View style={styles.dividir}>
          <TouchableOpacity style={[styles.botao_horario, { backgroundColor: bgClass.backgroundColor }]} onPress={escolherHorario}>
            <RelogioIcon width={16} height={16} color={colorClass.color} strokeWidth={1.5} />
            <Text style={[styles.botao_horario_texto, {color: colorClass.color}]}>Escolher Horário</Text>
          </TouchableOpacity>
          <View style={styles.horario_primeiro}>
            <Text style={styles.horario_texto}>Atual:</Text>
            <Text style={styles.horario_texto}>{horario}</Text>
          </View>
        </View>
        {erros.horario && <Text style={styles.erro_texto}>Este campo é obrigatório!</Text>}

        {/* Alarme */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}>
          <Checkbox value={alarmeAtivado} onValueChange={setAlarmeAtivado} color={alarmeAtivado ? "#115614" : undefined} />
          <Text style={{ marginLeft: 10, fontFamily: "Inter-Medium", color: "#606060" }}>
            Ativar alarme para esta tarefa
          </Text>
        </View>

        {/* Integrantes */}
        <Text style={[styles.label, styles.cima]}>INTEGRANTES</Text>
        <View style={styles.lista_integrantes}>
          {integrantesGrupo.length === 0 ? (
            <ActivityIndicator size="large" color="#808080" />
          ) : (
            integrantesGrupo.map((integrante: any) => (
              <Badge
                key={integrante.nome}
                backgroundColor={integrante.cor_primaria}
                iconColor={integrante.cor_secundaria}
                text={integrante.nome}
                isSelected={integrantesSelecionados.includes(integrante.uid)}
                onPress={() => toggleIntegrante(integrante.uid)}
                clicavel
              />
            ))
          )}
        </View>
        {erros.integrantes && <Text style={styles.erro_texto}>Este campo é obrigatório!</Text>}

        {/* Frequência */}
        <View style={[styles.cima, styles.dividir]}>
          <Text style={styles.label}>FREQUÊNCIA</Text>
          <Text style={styles.label}>Apenas uma opção</Text>
        </View>
        <ScrollView style={styles.lista_botoes} horizontal showsHorizontalScrollIndicator={false} ref={horizontalScrollRef}>
          {Frequencias.map((texto, index) => (
            <TouchableOpacity
              key={index}
              style={[
                botaoFrequenciaAtivo === index
                  ? [styles.botao_frequencia, { backgroundColor: bgClass.backgroundColor }]
                  : styles.botao_frequencia_normal,
                index === Frequencias.length - 1 && styles.ultimo,
              ]}
              onPress={() => setBotaoFrequenciaAtivo(index)}
            >
            <Text
              style={[
                botaoFrequenciaAtivo === index ? styles.branco : styles.cor_cinza,
                botaoFrequenciaAtivo === index && { color: colorClass.color }
              ]}>
              {texto}
            </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Frequência - semanal */}
        {botaoFrequenciaAtivo === 1 && (
          <View style={styles.lista_semanal}>
            {DiasDaSemana.map((dia) => (
              <TouchableOpacity
                key={dia}
                style={[
                  diasSelecionados.includes(dia)
                    ? [styles.botao_frequencia_semanal, { backgroundColor: bgClass.backgroundColor }]
                    : styles.botao_frequencia_semanal_normal
                ]}
                onPress={() => toggleDiaSemana(dia)}>
                <Text
                style={[
                  diasSelecionados.includes(dia) 
                    ? [styles.branco, { color: colorClass.color }] : styles.cor_cinza]}>
                  {dia}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Frequência - intervalo */}
        {botaoFrequenciaAtivo === 2 && (
          <View style={styles.lista_intervalo}>
            <Text style={globalStyles.textoNormal}>A cada</Text>
            <TextInput
              style={styles.input_menor}
              keyboardType="numeric"
              value={`${intervalo}`}
              placeholder="0"
              onChangeText={(text) => setIntervalo(text.replace(/[^0-9]/g, ""))}
            />
            <Text style={globalStyles.textoNormal}>dias a partir de hoje</Text>
          </View>
        )}

        {/* Frequência - datas específicas */}
        {botaoFrequenciaAtivo === 3 && (
          <View>
            {datasSelecionadas.map((item, index) => (
              <View key={item.id} style={[styles.dividir, styles.cimaMetade]}>
                <TouchableOpacity style={[styles.botao_horario, { backgroundColor: bgClass.backgroundColor }]} onPress={() => escolherData(item.id)}>
                  <CalendarioMiniIcon width={16} height={16} color={colorClass.color} />
                  <Text style={[styles.botao_horario_texto, {color: colorClass.color}]}>Escolher Data</Text>
                </TouchableOpacity>
                <View style={index === 0 ? styles.horario_primeiro : styles.horario}>
                  <Text style={styles.horario_texto}>Atual:</Text>
                  <Text style={styles.horario_texto}>
                    {item.data
                      ? item.data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
                      : "N/A"}
                  </Text>
                </View>
                {index > 0 && (
                  <TouchableOpacity onPress={() => removerData(item.id)} style={styles.botao_remover_data}>
                    <FecharIcon width={16} height={16} color={"#404040"} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity style={styles.botao_add_data} onPress={adicionarNovaData}>
              <MaisAdicaoIcon width={18} height={18} color="#808080" />
              <Text style={styles.cor_cinza}>Adicionar Outra Data</Text>
            </TouchableOpacity>
          </View>
        )}
        {erros.frequencia && <Text style={styles.erro_texto}>{erros.frequencia}</Text>}
      </ScrollView>

      <View style={styles.nav_bottom}>
        {loading ? (
          <ActivityIndicator size="large" color="#808080" />
        ) : (
          <TouchableOpacity style={[styles.botao_horario, { backgroundColor: bgClass.backgroundColor }]} onPress={handleSalvar}>
            <TarefaIcon width={16} height={16} color={colorClass.color} />
            <Text style={[styles.botao_horario_texto, {color: colorClass.color}]}>
              {isEditMode ? "Salvar Alterações" : "Criar Tarefa"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PaginaCriarTarefa;