import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ViewStyle,
  TextStyle,
} from "react-native";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/frontend/routes";

import { styles } from "./styles";
import { globalStyles } from "@/frontend/globalStyles";
import { Navbar } from "@/frontend/components/Navbar";

import PerfilIcon from "../../../assets/images/user.svg";
import EditarIcon from "../../../assets/images/editar.svg";
import FecharIcon from "../../../assets/images/fechar.svg";
import EncaminharIcon from "../../../assets/images/encaminhar.svg";
import MaisAdicaoIcon from "../../../assets/images/mais_adicao.svg";
import SairIcon from "../../../assets/images/sair.svg";
import LogoutModal from "@/frontend/components/LogoutModal";

import { auth } from "@/backend/services/shared/firebaseConfig";
import { db } from "@/backend/services/shared/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getTemaBgStyle, getTemaTextStyle } from "../../utils/temaStyles";

type TemaCor =
  | "azul" | "vinho" | "rosa" | "amarelo" | "laranja"
  | "verde" | "turquesa" | "coral" | "roxo" | "marrom";

type TemaCardProps = {
  nome: string;
  cor: TemaCor;
  botao?: boolean;
  onPress?: () => void;
  ativo?: boolean;
};

const PaginaPerfil = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Grupo">>();

  const [isCardModalVisible, setCardModalVisible] = useState(false);
  const [temaSelecionado, setTemaSelecionado] = useState<TemaCardProps | null>(null);
  const [LogoutModalActive, setLogoutModalActive] = useState(false);
  const [temaAtual, setTemaAtual] = useState<TemaCor>("azul");
  const [grupoNome, setGrupoNome] = useState("Grupo");

  const temas: TemaCardProps[] = [
    { nome: "Azul", cor: "azul" },
    { nome: "Vinho", cor: "vinho" },
    { nome: "Rosa", cor: "rosa" },
    { nome: "Amarelo", cor: "amarelo" },
    { nome: "Laranja", cor: "laranja" },
    { nome: "Verde", cor: "verde" },
    { nome: "Turquesa", cor: "turquesa" },
    { nome: "Coral", cor: "coral" },
    { nome: "Roxo", cor: "roxo" },
    { nome: "Marrom", cor: "marrom" },
  ];

  const TemaCard = ({ nome, cor, botao = false, onPress, ativo = true }: TemaCardProps) => {
    const textColor = ativo
      ? (globalStyles[`tema_color_${cor}_primario`] as TextStyle)
      : { color: "#606060" };

    const textBg = ativo
      ? (globalStyles[`tema_bg_${cor}_secundario`] as TextStyle)
      : { backgroundColor: "#F5F5F5" };

    const blockBg = ativo
      ? (globalStyles[`tema_bg_${cor}_primario`] as ViewStyle)
      : { backgroundColor: "#E8E8E8" };

    const Conteudo = () => (
      <>
        <Text style={[styles.retangulo_tema_escrito, textBg, textColor]}>
          {nome}
        </Text>
        <View style={[styles.retangulo_tema, blockBg]} />
      </>
    );

    return botao ? (
      <TouchableOpacity style={styles.retangulo_container} onPress={onPress}>
        <Conteudo />
      </TouchableOpacity>
    ) : (
      <View style={styles.retangulo_container}>
        <Conteudo />
      </View>
    );
  };

  useEffect(() => {
    const carregarInfoUsuario = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      try {
        // Buscar usuário
        const userRef = doc(db, "Usuarios", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data.tema) setTemaAtual(data.tema as TemaCor);
        }

        const grupoRef = doc(db, "Grupos", uid);
        const grupoSnap = await getDoc(grupoRef);
        if (grupoSnap.exists()) {
          const grupoData = grupoSnap.data();
          setGrupoNome(grupoData.nome || "Grupo");
        }
      } catch (err) {
        console.error("Erro ao carregar informações:", err);
      }
    };

    carregarInfoUsuario();
  }, []);

  const salvarTema = async () => {
    if (!temaSelecionado || !auth.currentUser) return;

    const uid = auth.currentUser.uid;
    await updateDoc(doc(db, "Usuarios", uid), {
      tema: temaSelecionado.cor,
    });

    setTemaAtual(temaSelecionado.cor);
    setCardModalVisible(false);
    setTemaSelecionado(null);
  };

  const capitalizar = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ paddingTop: 35, paddingBottom: 140 }}>
        <View style={styles.cima_logout}>
          <TouchableOpacity style={styles.botao_logout} onPress={() => setLogoutModalActive(true)}>
            <SairIcon width={20} height={20} color={"#808080"} />
            <Text style={styles.botao_logout_texto}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.capa, getTemaBgStyle(temaAtual, "primario")]}>
          <View style={[styles.moldura_perfil, getTemaBgStyle(temaAtual, "secundario")]}>
            <PerfilIcon width={64} height={64} strokeWidth={0.75}
              color={(globalStyles[`tema_color_${temaAtual}_primario`] as TextStyle)?.color}
            />
          </View>
        </View>

        <View style={styles.informacoes}>
          <View style={styles.parte_input}>
            <Text style={styles.input_label}>Apelido</Text>
            <View style={styles.alinhar_editar}>
              <TextInput placeholder="Até 8 caracteres" style={styles.input} />
              <EditarIcon width={24} height={24} color={"#808080"} />
            </View>
          </View>

          <View style={styles.parte_input}>
            <Text style={styles.input_label}>E-mail</Text>
            <View style={styles.alinhar_editar}>
              <TextInput placeholder="Digite aqui..." style={styles.input} />
              <EditarIcon width={24} height={24} color={"#808080"} />
            </View>
          </View>

          <View style={styles.parte_input}>
            <Text style={styles.input_label}>Tema da Conta</Text>
            <View style={styles.tema_wrapper}>
              <TemaCard nome={capitalizar(temaAtual)} cor={temaAtual} />
              <TouchableOpacity style={styles.botao_editar} onPress={() => setCardModalVisible(true)}>
                <Text style={styles.botao_editar_texto}>Editar</Text>
                <EditarIcon width={24} height={24} color={"#808080"} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.parte_input}>
            <Text style={styles.input_label}>Seu Grupo</Text>
            <View style={styles.tema_wrapper}>
              <Text style={styles.grupo_texto}>{grupoNome}</Text>
              <TouchableOpacity style={styles.botao_editar} onPress={() => navigation.navigate("Grupo")}>
                <Text style={styles.botao_editar_texto}>Gerenciar</Text>
                <EncaminharIcon width={18} height={18} color={"#808080"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        isVisible={isCardModalVisible}
        onBackdropPress={() => {
          setCardModalVisible(false);
          setTemaSelecionado(null);
        }}
        backdropColor="#404040"
        backdropOpacity={0.5}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={{ margin: 0, justifyContent: "flex-end" }}
      >
        <View style={styles.modal_container_descricao}>
          <View style={styles.detalhe_cima}>
            <Text style={[globalStyles.titulo, styles.titulo_menor]}>
              Cor Tema da Conta
            </Text>
            <TouchableOpacity onPress={() => setCardModalVisible(false)}>
              <FecharIcon width={32} height={32} color={"#404040"} />
            </TouchableOpacity>
          </View>

          <View style={styles.cor_opcoes_wrapper}>
            {temas.map((tema, index) => {
              const estaSelecionado = temaSelecionado?.nome === tema.nome;
              return (
                <TemaCard
                  key={index}
                  nome={tema.nome}
                  cor={tema.cor}
                  botao
                  ativo={estaSelecionado || temaSelecionado === null}
                  onPress={() =>
                    setTemaSelecionado(estaSelecionado ? null : tema)
                  }
                />
              );
            })}
          </View>

          <Text
            style={[
              styles.cor_selecionada,
              temaSelecionado
                ? getTemaTextStyle(temaSelecionado.cor, "primario")
                : { color: "#808080" },
            ]}
          >
            <Text style={{ color: "#404040" }}>Tema selecionado: </Text>
            {temaSelecionado?.nome ?? "Nenhum"}
          </Text>

          <View style={styles.parte_baixo}>
            <TouchableOpacity style={globalStyles.botao_primario} onPress={salvarTema}>
              <MaisAdicaoIcon width={18} height={18} color={"#ffffff"} />
              <Text style={globalStyles.botao_primario_texto}>Salvar Alterações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <LogoutModal
        LogoutModalActive={LogoutModalActive}
        setLogoutModalActive={setLogoutModalActive}
      />

      <Navbar />
    </SafeAreaView>
  );
};

export default PaginaPerfil;