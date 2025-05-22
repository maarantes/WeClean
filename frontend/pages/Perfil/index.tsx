import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ViewStyle, TextStyle, ActivityIndicator, Dimensions, TouchableWithoutFeedback } from "react-native";
import { StatusBar } from "expo-status-bar";
import Checkbox from "expo-checkbox";
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
import LogoutModal from "@/frontend/components/ModalLogout";
import EditarInfoModal from "@/frontend/components/ModalEditarInfo";


import { auth, db } from "@/backend/services/shared/firebaseConfigApp";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getTemaBgStyle, getTemaTextStyle } from "../../utils/temaStyles";

import AsyncStorage from "@react-native-async-storage/async-storage";

type TemaCor = "azul" | "vinho" | "rosa" | "amarelo" | "laranja" | "verde" | "turquesa" | "coral" | "roxo" | "marrom";

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
  const [grupoNome, setGrupoNome] = useState("Carregando...");
  const [loading, setLoading] = useState(true);
  const [loadingModal, setLoadingModal] = useState(false);
  const [apelido, setApelido] = useState("Carregando...");
  const [email, setEmail] = useState("Carregando...");

  const [editarModalVisible, setEditarModalVisible] = useState(false);
  const [tipoEdicao, setTipoEdicao] = useState<"apelido" | "email">("apelido");
  const [aplicarTemaApp, setAplicarTemaApp] = useState(false);


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
      try {
        const temaCache = await AsyncStorage.getItem("@userTema");
        const nomeCache = await AsyncStorage.getItem("@userNome");
        const emailCache = await AsyncStorage.getItem("@userEmail");
        if (temaCache) setTemaAtual(temaCache as TemaCor);
        if (nomeCache) setApelido(nomeCache);
        if (emailCache) setEmail(emailCache);

        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const userRef = doc(db, "Usuarios", uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return;

        const userData = userSnap.data();
        const grupoId = userData.grupoId || uid;
        const grupoSnap = await getDoc(doc(db, "Grupos", grupoId));

        if (grupoSnap.exists()) {
          const grupoData = grupoSnap.data();
          setGrupoNome(grupoData.nome || "Grupo");
        }
      } catch (err) {
        console.error("Erro ao carregar informações:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarInfoUsuario();
  }, []);

  const salvarTema = async () => {
    if (!temaSelecionado || !auth.currentUser) return;

    const uid = auth.currentUser.uid;
    setLoadingModal(true);
    await updateDoc(doc(db, "Usuarios", uid), {
      tema: temaSelecionado.cor,
    });

    await AsyncStorage.setItem("@userTema", temaSelecionado.cor);
    await AsyncStorage.setItem("@aplicarTemaApp", aplicarTemaApp.toString());

    setTemaAtual(temaSelecionado.cor);
    setCardModalVisible(false);
    setTemaSelecionado(null);
    setLoadingModal(false);
    navigation.reset({ index: 0, routes: [{ name: "Perfil" }] });
  };

  const capitalizar = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <>
    <StatusBar style="light" translucent={true} />
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
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
        <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
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
            
            {/* Apelido */}
            <View style={styles.parte_input}>
              <Text style={styles.input_label}>Apelido</Text>
              <TouchableOpacity style={styles.alinhar_editar} onPress={() => {
                setTipoEdicao("apelido");
                setEditarModalVisible(true);
              }}>
                <Text style={styles.input}>{apelido}</Text>
                <EditarIcon width={24} height={24} color={"#808080"} />
              </TouchableOpacity>
            </View>

            {/* E-mail */}
            <View style={styles.parte_input}>
              <Text style={styles.input_label}>E-mail</Text>
              <View style={styles.alinhar_editar}>
                <Text style={styles.input}>{email}</Text>
              </View>
            </View>

            {/* Tema Conta */}
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

            {/* Grupo */}
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
      )}

      {/* Modal para mudar o tema */}
      <Modal
        isVisible={isCardModalVisible}
        statusBarTranslucent={true}
        onBackdropPress={() => {
          setCardModalVisible(false);
          setTemaSelecionado(null);
        }}
        backdropOpacity={0.5}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => {
          setCardModalVisible(false);
          setTemaSelecionado(null);
        }}>
            <View style={{ backgroundColor: "#404040", ...Dimensions.get("screen") }} />
          </TouchableWithoutFeedback>
        }
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
                  onPress={() => setTemaSelecionado(estaSelecionado ? null : tema)}
                />
              );
            })}
          </View>

          <Text style={[
            styles.cor_selecionada,
            temaSelecionado
              ? getTemaTextStyle(temaSelecionado.cor, "primario")
              : { color: "#808080" }
          ]}>
            <Text style={{ color: "#404040" }}>Tema selecionado: </Text>
            {temaSelecionado?.nome ?? "Nenhum"}
          </Text>

          <TouchableOpacity style={styles.parte_checkbox} onPress={() => setAplicarTemaApp(prev => !prev)}>
            <Checkbox
              value={aplicarTemaApp}
              onValueChange={setAplicarTemaApp}
              color={aplicarTemaApp ? "#115614" : undefined}
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: "#606060", fontSize: 14, fontFamily: "Inter-Medium" }}>
              Aplicar tema em todo o aplicativo
            </Text>
          </TouchableOpacity>
          
          <View style={styles.parte_baixo}>
            <TouchableOpacity style={[globalStyles.botao_primario, styles.mesma_largura]} onPress={salvarTema}>
              {loadingModal ? (
              <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                <>
                  <MaisAdicaoIcon width={18} height={18} color="#ffffff" />
                  <Text style={globalStyles.botao_primario_texto}>Salvar Alterações</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <EditarInfoModal
        visible={editarModalVisible}
        setVisible={setEditarModalVisible}
        valorAtual={apelido}
        onSalvar={(novoValor) => {
          setApelido(novoValor);
        }}
      />

      <LogoutModal
        LogoutModalActive={LogoutModalActive}
        setLogoutModalActive={setLogoutModalActive}
      />

      <Navbar />
    </SafeAreaView>
    </>
  );
}

export default PaginaPerfil;