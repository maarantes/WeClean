import React, { useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, ImageBackground } from "react-native";
import SetaBackIcon from "../../../assets/images/setaBack.svg";
import { styles } from "./styles";
import { useNavigation } from "@react-navigation/native";
import MaisAdicaoIcon from "../../../assets/images/mais_adicao.svg";
import fundoCard from "../../../assets/images/fundoCardSugestao.png";
import LivroIcon from "../../../assets/images/livro.svg";
import { useTema } from "@/frontend/hooks/useTema";
import CardSugestao from "@/frontend/components/CardSugestao";
import sugestoesJson from "./sugestoes.json";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/frontend/routes";

type Tarefa = {
  titulo: string;
  frequencia: string;
};

type Area = "pet" | "limpeza" | "segurança";

type Sugestoes = {
  [key in "diariamente" | "semanalmente" | "intervalo" | "anualmente"]: {
    [key in Area]: Tarefa[];
  };
};

const sugestoes: Sugestoes = sugestoesJson;

const frequencias = [
  { key: "diariamente", label: "Diariamente", cor: "#2274A5" },
  { key: "semanalmente", label: "Semanalmente", cor: "#E83F6F" },
  { key: "intervalo", label: "A cada intervalo de tempo", cor: "#FFBF00" },
  { key: "anualmente", label: "Anualmente", cor: "#22A559" },
];

const PaginaSugestoes = () => {
  
  const [ativo, setAtivo] = useState<string>("diariamente");
  const [frequenciaAtiva, setFrequenciaAtiva] = useState<"diariamente" | "semanalmente" | "intervalo" | "anualmente">("diariamente");

const [cardSelecionado, setCardSelecionado] = useState<{
  titulo: string;
  tipo: string;
  frequencia: string;
} | null>(null);


  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleEditarPress = () => {
    if (!cardSelecionado) return;

    console.log(cardSelecionado)

    navigation.navigate("CriarTarefa", {
      task: {
        nome: cardSelecionado.titulo,
        frequencia: {
          tipo: cardSelecionado.tipo,
          texto: cardSelecionado.frequencia,
        },
      },
      tipo: "sugestao",
    });
  };

  const getCorPorTipo = (tipo: string) => {
    switch (tipo) {
      case "diariamente":
        return "#2274A5";
      case "semanalmente":
        return "#E83F6F";
      case "intervalo":
        return "#FFBF00";
      case "anualmente":
        return "#22A559";
      default:
        return "#ccc";
    }
  };

  const BotaoTipoTarefa = ({
    tipo,
    label,
    cor,
    ativoBotao,
    ultimo = false,
    onPress,
  }: {
    tipo: string;
    label: string;
    cor: string;
    ativoBotao: string;
    ultimo?: boolean;
    onPress: (tipo: string) => void;
  }) => {
    const estaAtivo = ativoBotao === tipo;

    return (
      <TouchableOpacity
        onPress={() => {
          onPress(tipo);
          setFrequenciaAtiva(tipo as "diariamente" | "semanalmente" | "intervalo" | "anualmente");
        }}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 20,
          borderRadius: 4,
          marginLeft: 12,
          backgroundColor: estaAtivo ? cor : "transparent",
          borderWidth: estaAtivo ? 0 : 1.25,
          borderColor: estaAtivo ? "transparent" : cor,
          marginRight: ultimo ? 28 : 0
        }}
      >
        <Text
          style={{
            color: estaAtivo ? "#fff" : cor,
            fontSize: 14,
            fontFamily: "Inter-SemiBold"
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container_cima}>
        <TouchableOpacity
          style={styles.botao_voltar}
          onPress={() => navigation.goBack()}
        >
          <SetaBackIcon width={40} height={16} color={"#808080"} />
        </TouchableOpacity>
        <Text style={styles.titulo_cima}>Sugestões de Tarefa</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80, paddingTop: 80 }}>
        <ImageBackground
          source={fundoCard}
          style={styles.card_cima}
          imageStyle={styles.card_fundo}
        >
          <LivroIcon width={"20%"} height={64} color={"#FFFFFF"} />
          <View style={styles.card_texto}>
            <Text style={styles.card_titulo}>Seja Bem-vindo</Text>
            <Text style={styles.card_subtitulo}>
              Veja abaixo sugestões de tarefas domésticas para promover a higiene,
              segurança e qualidade de vida no seu lar.
            </Text>
          </View>
        </ImageBackground>

        <Text style={styles.titulo_tipo_tarefa}>Frequências</Text>

        <ScrollView
          style={styles.wrapper_tipo_tarefa}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {frequencias.map((frequencia, index) => (
            <BotaoTipoTarefa
              key={frequencia.key}
              tipo={frequencia.key}
              label={frequencia.label}
              cor={frequencia.cor}
              ativoBotao={frequenciaAtiva}
              onPress={setAtivo}
              ultimo={index === frequencias.length - 1}
            />
          ))}
        </ScrollView>

        {["limpeza", "pet", "segurança"].map((area, index) => (
          <View key={area}>
            <Text style={styles.lista_cards_titulo}>{area.charAt(0).toUpperCase() + area.slice(1)}</Text>
            <View style={styles.lista_cards}>
              {sugestoes[frequenciaAtiva][area as Area].map((task, idx) => (
                <CardSugestao
                  key={idx}
                  tipo={frequenciaAtiva}
                  area={area}
                  titulo={task.titulo}
                  frequencia={task.frequencia}
                  selecionado={cardSelecionado?.titulo === task.titulo}
                  onSelecionar={() => {
                    if (cardSelecionado?.titulo === task.titulo) {
                      setCardSelecionado(null);
                    } else {
                      setCardSelecionado({ titulo: task.titulo, tipo: frequenciaAtiva, frequencia: task.frequencia, });
                    }
                  }}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.nav_bottom}>
        <TouchableOpacity style={styles.botao} onPress={handleEditarPress}>
          <MaisAdicaoIcon width={16} height={16} color={"white"} strokeWidth={2.5} />
          <Text style={styles.botao_texto}>
            Editar
          </Text>
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: cardSelecionado ? getCorPorTipo(cardSelecionado.tipo) : "#F5F5F5",
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 4,
            alignSelf: "center",
            width: "68%",
          }}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              color: cardSelecionado ? "white" : "#808080",
              fontFamily: "Inter-SemiBold",
              fontSize: 14,
            }}
          >
            {cardSelecionado?.titulo || "Selecione uma sugestão"}
          </Text>
        </View>
      </View>

    </SafeAreaView>
  );
};

export default PaginaSugestoes;