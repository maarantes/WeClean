import React, { useState } from "react";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput, ViewStyle, TextStyle } from "react-native";
import Modal from "react-native-modal";

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

const PaginaPerfil = () => {

  const [isCardModalVisible, setCardModalVisible] = useState(false);
  const [temaSelecionado, setTemaSelecionado] = useState<TemaCardProps | null>(null);
  const [LogoutModalActive, setLogoutModalActive] = useState(false);


    type TemaCor =
    | "azul"
    | "vinho"
    | "rosa"
    | "amarelo"
    | "laranja"
    | "verde"
    | "turquesa"
    | "coral"
    | "roxo"
    | "marrom";

    type TemaCardProps = {
        nome: string;
        cor: TemaCor;
        botao?: boolean;
        onPress?: () => void;
        ativo?: boolean; // <- novo!
      };
      

      const TemaCard = ({ nome, cor, botao = false, onPress, ativo = true }: TemaCardProps) => {
        // Aplica as cores normais ou as "apagadas"
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
      
        if (botao) {
          return (
            <TouchableOpacity
              style={styles.retangulo_container}
              onPress={onPress}
            >
              <Conteudo />
            </TouchableOpacity>
          );
        }
      
        return (
          <View style={styles.retangulo_container}>
            <Conteudo />
          </View>
        );
      };
      

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ paddingTop: 35, paddingBottom: 140 }}>
        <View style={styles.cima_logout}>
        <TouchableOpacity style={styles.botao_logout} onPress={() => setLogoutModalActive(true)}>
          <SairIcon width={20} height={20} />
          <Text style={styles.botao_logout_texto}>Logout</Text>
        </TouchableOpacity>
        </View>

        <View style={[styles.capa, globalStyles.tema_bg_azul_primario]}>
          <View style={[styles.moldura_perfil, globalStyles.tema_bg_azul_secundario]}>
            <PerfilIcon width={64} height={64} color={"#144F70"} strokeWidth={0.75} />
          </View>
        </View>

        <View style={styles.informacoes}>
          <View style={styles.parte_input}>
            <Text style={styles.input_label}>Apelido</Text>
            <View style={styles.alinhar_editar}>
              <TextInput
                placeholder="Até 8 caracteres"
                style={styles.input}
                placeholderTextColor="#999"
              />
              <EditarIcon width={24} height={24} color={"#808080"} />
            </View>
          </View>

          <View style={styles.parte_input}>
            <Text style={styles.input_label}>E-mail</Text>
            <View style={styles.alinhar_editar}>
              <TextInput
                placeholder="Digite aqui..."
                style={styles.input}
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <EditarIcon width={24} height={24} color={"#808080"} />
            </View>
          </View>

          <View style={styles.parte_input}>
            <Text style={styles.input_label}>Tema da Conta</Text>
            <View style={styles.tema_wrapper}>
              <TemaCard nome="Azul" cor="azul" />
              <TouchableOpacity style={styles.botao_editar} onPress={() => setCardModalVisible(true)}>
                <Text style={styles.botao_editar_texto}>Editar</Text>
                <EditarIcon width={24} height={24} color={"#808080"} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.parte_input}>
            <Text style={styles.input_label}>Seu Grupo</Text>
            <View style={styles.tema_wrapper}>
              <Text style={styles.grupo_texto}>Família Arantes</Text>
              <TouchableOpacity style={styles.botao_editar}>
                <Text style={styles.botao_editar_texto}>Gerenciar</Text>
                <EncaminharIcon width={18} height={18} color={"#808080"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        isVisible={isCardModalVisible}
        onBackButtonPress={() => {
          setCardModalVisible(false);
          setTemaSelecionado(null);
        }}
        onBackdropPress={() => {
          setCardModalVisible(false);
          setTemaSelecionado(null);
        }}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropColor="#404040"
        backdropOpacity={0.5}
        style={{ margin: 0, justifyContent: "flex-end" }}>

        <View style={styles.modal_container_descricao}>
          <View>
            <View style={styles.detalhe_cima_topo}>
              <TouchableOpacity onPress={() => setCardModalVisible(false)} style={styles.modal_notch} />
            </View>
            <View style={styles.detalhe_cima}>
              <Text style={[globalStyles.titulo, styles.titulo_menor]}>
                Cor Tema da Conta
              </Text>
              <TouchableOpacity onPress={() => setCardModalVisible(false)}>
                <FecharIcon width={32} height={32} />
              </TouchableOpacity>
            </View>
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
                    onPress={() => {
                        setTemaSelecionado(estaSelecionado ? null : tema);
                      }}
                      
                />
                );
            })}
            </View>

            <Text
              style={[
                styles.cor_selecionada,
                temaSelecionado
                  ? globalStyles[`tema_color_${temaSelecionado.cor}_primario`]
                  : { color: "#808080" }
              ]}
            >
              <Text style={{ color: "#404040" }}>Tema selecionado: </Text>
              {temaSelecionado?.nome ?? "Nenhum"}
            </Text>

            <View style={styles.parte_baixo}>
              <TouchableOpacity style={globalStyles.botao_primario}>
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